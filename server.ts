import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { calculateSm2NextState, type Sm2Rating } from './src/utils/sm2.ts';
import { ALL_220_SITUATIONS } from './src/data/curriculumIndex.ts';
import { VOCABULARY_BANK } from './src/data/vocabulary.ts';
import { buildAllPracticeQuestions } from './src/data/practiceBank.ts';
import type {
  MistakeRecord,
  PracticeQuestion,
  QuizAttempt,
  SituationItem,
  UserStoreState,
  VocabEntry,
} from './src/types/toeic.ts';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'user-store.json');

function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function createInitialStore(): UserStoreState {
  const today = getTodayIsoDate();
  return {
    user: {
      id: 'USR-001',
      name: 'Học viên TOEIC',
      role: 'student',
      streakDays: 1,
      lastActiveDate: today,
      dailyStudyMinutes: 0,
      lastSituationId: 'P3-01',
      studyHistoryDates: [today],
    },
    situationProgress: {},
    reviewCards: {},
    quizAttempts: [],
    mistakes: [],
    customSituations: [],
    customQuestions: [],
    customVocab: [],
    settings: {
      audioSpeed: 1,
      dailyGoalSituations: 3,
      activeRoadmapWeek: 1,
    },
  };
}

function readStore(): UserStoreState {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    const initial = createInitialStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as UserStoreState;
    return {
      ...createInitialStore(),
      ...parsed,
      user: { ...createInitialStore().user, ...parsed.user },
      settings: { ...createInitialStore().settings, ...parsed.settings },
    };
  } catch {
    const fallback = createInitialStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
}

function writeStore(store: UserStoreState): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function recordDailyActivity(store: UserStoreState, addedMinutes = 0): void {
  const today = getTodayIsoDate();
  if (!store.user.studyHistoryDates.includes(today)) {
    const last = new Date(store.user.lastActiveDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      store.user.streakDays += 1;
    } else if (diffDays > 1) {
      store.user.streakDays = 1;
    }
    store.user.studyHistoryDates.push(today);
  }
  store.user.lastActiveDate = today;
  store.user.dailyStudyMinutes += addedMinutes;
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const store = readStore();
  if (store.user.role !== 'admin') {
    res.status(403).json({
      error: 'Bạn không có quyền Admin. Chỉ tài khoản Quản trị viên mới được phép thực hiện thao tác này.',
    });
    return;
  }
  next();
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'toeic-master' });
  });

  // Load user store
  app.get('/api/store', (_req, res) => {
    const store = readStore();
    res.json(store);
  });

  // Update role (Student vs Admin)
  app.post('/api/role', (req, res) => {
    const { role, name } = req.body as { role?: 'student' | 'admin'; name?: string };
    if (role !== 'student' && role !== 'admin') {
      res.status(400).json({ error: 'Vai trò không hợp lệ.' });
      return;
    }
    const store = readStore();
    store.user.role = role;
    if (name && name.trim()) {
      store.user.name = name.trim().slice(0, 60);
    }
    writeStore(store);
    res.json(store);
  });

  // Save situation learning progress
  app.post('/api/progress/situation', (req, res) => {
    const { situationId, step, completed, minutesSpent } = req.body as {
      situationId?: string;
      step?: number;
      completed?: boolean;
      minutesSpent?: number;
    };
    if (!situationId) {
      res.status(400).json({ error: 'Thiếu situationId.' });
      return;
    }
    const store = readStore();
    const prev = store.situationProgress[situationId];
    const completedSteps = new Set<number>(prev?.completedSteps ?? []);
    if (typeof step === 'number' && step >= 1 && step <= 7) {
      completedSteps.add(step);
    }
    const nextStatus = completed
      ? 'completed'
      : prev?.status === 'completed'
      ? 'completed'
      : 'in_progress';

    store.situationProgress[situationId] = {
      situationId,
      status: nextStatus,
      completedSteps: Array.from(completedSteps).sort((a, b) => a - b),
      lastStep: typeof step === 'number' ? step : prev?.lastStep ?? 1,
      updatedAt: new Date().toISOString(),
    };
    store.user.lastSituationId = situationId;
    recordDailyActivity(store, typeof minutesSpent === 'number' ? minutesSpent : 2);
    writeStore(store);
    res.json(store);
  });

  // SM-2 Review rating
  app.post('/api/review/rate', (req, res) => {
    const { targetId, targetType, rating } = req.body as {
      targetId?: string;
      targetType?: 'vocab' | 'situation';
      rating?: Sm2Rating;
    };
    if (!targetId || !targetType || !rating || !['forgot', 'hard', 'good', 'easy'].includes(rating)) {
      res.status(400).json({ error: 'Dữ liệu đánh giá SM-2 không hợp lệ.' });
      return;
    }
    const store = readStore();
    const existing = store.reviewCards[targetId];
    store.reviewCards[targetId] = calculateSm2NextState(existing, targetId, targetType, rating);
    recordDailyActivity(store, 1);
    writeStore(store);
    res.json(store);
  });

  // Toggle hard vocabulary flag
  app.post('/api/review/toggle-hard', (req, res) => {
    const { targetId, targetType } = req.body as { targetId?: string; targetType?: 'vocab' | 'situation' };
    if (!targetId || !targetType) {
      res.status(400).json({ error: 'Thiếu targetId hoặc targetType.' });
      return;
    }
    const store = readStore();
    const existing = store.reviewCards[targetId];
    if (existing) {
      existing.isHard = !existing.isHard;
    } else {
      store.reviewCards[targetId] = {
        targetId,
        targetType,
        status: 'learning',
        repetitions: 0,
        intervalDays: 0,
        easinessFactor: 2.5,
        nextReviewAt: new Date().toISOString(),
        isHard: true,
      };
    }
    writeStore(store);
    res.json(store);
  });

  // Submit quiz attempt & log mistakes
  app.post('/api/quiz/submit', (req, res) => {
    const {
      title,
      mode,
      partFilter,
      durationSeconds,
      answers,
    } = req.body as {
      title?: string;
      mode?: string;
      partFilter?: string;
      durationSeconds?: number;
      answers?: {
        questionId: string;
        part: PracticeQuestion['part'];
        situationId: string;
        questionType: string;
        selectedIndex: number;
        correctIndex: number;
      }[];
    };

    if (!Array.isArray(answers) || answers.length === 0) {
      res.status(400).json({ error: 'Bài làm không có câu trả lời nào.' });
      return;
    }

    const store = readStore();
    const breakdownByPart: Record<string, { total: number; correct: number }> = {};
    const weakSet = new Set<string>();
    let correctCount = 0;

    const newMistakes: MistakeRecord[] = [];
    for (const ans of answers) {
      if (!breakdownByPart[ans.part]) {
        breakdownByPart[ans.part] = { total: 0, correct: 0 };
      }
      breakdownByPart[ans.part].total += 1;
      if (ans.selectedIndex === ans.correctIndex) {
        correctCount += 1;
        breakdownByPart[ans.part].correct += 1;
      } else {
        weakSet.add(ans.situationId);
        newMistakes.push({
          id: `MST-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          questionId: ans.questionId,
          part: ans.part,
          situationId: ans.situationId,
          questionType: ans.questionType,
          selectedOptionIndex: ans.selectedIndex,
          correctIndex: ans.correctIndex,
          reasonCategory: ans.part === 'part6' ? 'Ngữ pháp / Từ loại' : 'Bẫy paraphrase / Nghe nhầm',
          createdAt: new Date().toISOString(),
          resolved: false,
        });
      }
    }

    const attempt: QuizAttempt = {
      id: `QZ-${Date.now()}`,
      title: title || 'Bài kiểm tra TOEIC',
      mode: mode || 'practice',
      partFilter: partFilter || 'all',
      totalQuestions: answers.length,
      correctCount,
      scorePercent: Math.round((correctCount / answers.length) * 100),
      durationSeconds: Math.max(1, durationSeconds || 60),
      createdAt: new Date().toISOString(),
      breakdownByPart,
      weakSituations: Array.from(weakSet),
    };

    store.quizAttempts.unshift(attempt);
    store.mistakes = [...newMistakes, ...store.mistakes].slice(0, 300);
    recordDailyActivity(store, Math.max(1, Math.round((durationSeconds || 60) / 60)));
    writeStore(store);
    res.json({ store, attempt, newMistakes });
  });

  // Resolve mistake
  app.post('/api/mistakes/resolve', (req, res) => {
    const { mistakeId } = req.body as { mistakeId?: string };
    const store = readStore();
    store.mistakes = store.mistakes.map((m) => (m.id === mistakeId ? { ...m, resolved: true } : m));
    writeStore(store);
    res.json(store);
  });

  // Update settings
  app.post('/api/settings', (req, res) => {
    const { audioSpeed, dailyGoalSituations, activeRoadmapWeek } = req.body as Partial<UserStoreState['settings']>;
    const store = readStore();
    if (typeof audioSpeed === 'number') store.settings.audioSpeed = audioSpeed;
    if (typeof dailyGoalSituations === 'number') store.settings.dailyGoalSituations = dailyGoalSituations;
    if (typeof activeRoadmapWeek === 'number') store.settings.activeRoadmapWeek = activeRoadmapWeek;
    writeStore(store);
    res.json(store);
  });

  // AI Tutor endpoint (Module 12) - server-side only @google/genai
  app.post('/api/ai/tutor', async (req, res) => {
    const { mode, prompt, situationId, vocabWord } = req.body as {
      mode?: 'explain_vocab' | 'analyze_trap' | 'generate_practice' | 'study_advice' | 'free_qa';
      prompt?: string;
      situationId?: string;
      vocabWord?: string;
    };

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng kiểm tra biến môi trường GEMINI_API_KEY trong Settings > Secrets.',
      });
      return;
    }

    const store = readStore();
    const allSituations = [...ALL_220_SITUATIONS, ...store.customSituations];
    const targetSituation = situationId ? allSituations.find((s) => s.id === situationId) : undefined;
    const targetVocab = vocabWord
      ? [...VOCABULARY_BANK, ...store.customVocab].find((v) => v.word.toLowerCase() === vocabWord.toLowerCase())
      : undefined;

    const curriculumContext = [
      targetSituation
        ? `Tình huống giáo trình đang chọn: [${targetSituation.id}] ${targetSituation.part.toUpperCase()} - "${targetSituation.title}". Mô tả: ${targetSituation.description}. Từ khóa giáo trình: ${targetSituation.keywords.map((k) => `${k.word} (${k.meaning})`).join(', ')}. Bẫy giáo trình: ${targetSituation.traps.join(' | ')}. Nguồn: ${targetSituation.sourceReference}.`
        : '',
      targetVocab
        ? `Từ vựng giáo trình đang chọn: "${targetVocab.word}" (${targetVocab.partOfSpeech}) = ${targetVocab.viMeaning}. Đồng nghĩa trong giáo trình: ${targetVocab.synonyms.join(', ') || 'Chưa có trong PDF gốc'}. Cặp dễ nhầm: ${targetVocab.confusingPairs.join(', ') || 'Không có'}.`
        : '',
      `Lưu ý quan trọng: Giáo trình đầu vào KHÔNG có Part 5 (Incomplete Sentences). Tổng giáo trình gồm 220 tình huống Part 3, 4, 6, 7 và bổ sung Part 1, 2.`,
    ]
      .filter(Boolean)
      .join('\n');

    const systemInstruction = `Bạn là Gia sư TOEIC thông minh của hệ thống TOEIC Master.
NGUYÊN TẮC BẮT BUỘC:
1. Trả lời bằng tiếng Việt rõ ràng, súc tích, giữ nguyên thuật ngữ/câu ví dụ tiếng Anh.
2. Phân tách RÕ RÀNG hai phần trong câu trả lời bằng tiêu đề:
   - **[Dữ liệu từ giáo trình gốc]**: Chỉ trích dẫn đúng thông tin có trong ngữ cảnh giáo trình được cung cấp bên dưới. Nếu giáo trình không có trường nào (ví dụ không có Part 5 hoặc chưa có IPA/ví dụ), nói rõ là chưa có trong tài liệu gốc.
   - **[Phân tích & Mở rộng do AI biên soạn]**: Giải thích sâu, phân tích bẫy, từ đồng nghĩa/dễ nhầm hoặc tạo câu hỏi luyện tập mới có đáp án và giải thích chi tiết.
3. Không bao giờ bịa đặt nguồn trích dẫn hoặc nhận nội dung AI tạo là trích từ tài liệu ETS/giáo trình gốc.
Ngữ cảnh giáo trình:
${curriculumContext}`;

    const userMessage =
      prompt?.trim() ||
      (mode === 'generate_practice'
        ? `Hãy tạo 1 câu hỏi trắc nghiệm TOEIC (4 lựa chọn A, B, C, D) bám sát tình huống "${targetSituation?.title || 'TOEIC'}" kèm đáp án đúng, giải thích ngữ cảnh và phân tích bẫy.`
        : mode === 'explain_vocab'
        ? `Hãy giải thích từ "${vocabWord || 'reservation'}" trong ngữ cảnh TOEIC, phân biệt với từ đồng nghĩa và cặp từ dễ nhầm.`
        : mode === 'analyze_trap'
        ? `Hãy phân tích các bẫy thường gặp nhất của tình huống này và cách nhận diện tín hiệu tránh bẫy.`
        : `Dựa trên tiến độ hiện tại (${Object.keys(store.situationProgress).length} tình huống đã chạm tới, ${store.mistakes.filter((m) => !m.resolved).length} lỗi chưa xử lý), hãy đề xuất kế hoạch ôn tập trọng tâm hôm nay.`);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: userMessage,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });
      res.json({
        answer: response.text || 'Không nhận được phản hồi từ AI Tutor.',
        model: 'gemini-4-hydrogen',
        origin: 'ai_generated',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối Gemini API.';
      res.status(502).json({ error: `Lỗi AI Tutor: ${msg}` });
    }
  });

  // Admin APIs (Module 13) - Strictly guarded by requireAdmin
  app.get('/api/admin/export', requireAdmin, (_req, res) => {
    const store = readStore();
    const allSituations = [...ALL_220_SITUATIONS, ...store.customSituations];
    const allVocab = [...VOCABULARY_BANK, ...store.customVocab];
    const allQuestions = buildAllPracticeQuestions(store.customQuestions);

    res.json({
      exportedAt: new Date().toISOString(),
      schemaCompatibleWith: 'Google Sheets 15-Table Relational Schema (docs/DATABASE.md)',
      counts: {
        situations: allSituations.length,
        vocabulary: allVocab.length,
        questions: allQuestions.length,
      },
      sheets: {
        Situations: allSituations,
        Vocabulary: allVocab,
        Questions: allQuestions,
        LearningProgress: Object.values(store.situationProgress),
        ReviewSchedule: Object.values(store.reviewCards),
        QuizAttempts: store.quizAttempts,
        UserMistakes: store.mistakes,
      },
    });
  });

  app.get('/api/admin/duplicates', requireAdmin, (_req, res) => {
    const store = readStore();
    const allSituations = [...ALL_220_SITUATIONS, ...store.customSituations];
    const titleCounts = new Map<string, string[]>();
    for (const s of allSituations) {
      const key = `${s.part}:${s.title.trim().toLowerCase()}`;
      const list = titleCounts.get(key) ?? [];
      list.push(s.id);
      titleCounts.set(key, list);
    }
    const duplicateSituations = Array.from(titleCounts.entries())
      .filter(([, ids]) => ids.length > 1)
      .map(([key, ids]) => ({ key, ids }));

    const vocabWords = new Map<string, string[]>();
    for (const v of [...VOCABULARY_BANK, ...store.customVocab]) {
      const key = v.word.trim().toLowerCase();
      const list = vocabWords.get(key) ?? [];
      list.push(v.id);
      vocabWords.set(key, list);
    }
    const duplicateVocab = Array.from(vocabWords.entries())
      .filter(([, ids]) => ids.length > 1)
      .map(([key, ids]) => ({ key, ids }));

    res.json({ duplicateSituations, duplicateVocab });
  });

  app.post('/api/admin/situations', requireAdmin, (req, res) => {
    const body = req.body as Partial<SituationItem>;
    if (!body.title?.trim() || !body.part || !body.description?.trim()) {
      res.status(400).json({ error: 'Vui lòng nhập đầy đủ Part, Tên tình huống và Mô tả.' });
      return;
    }
    const store = readStore();
    const item: SituationItem = {
      id: `EXT-${body.part.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      part: body.part,
      order: 55 + store.customSituations.filter((s) => s.part === body.part).length + 1,
      title: body.title.trim(),
      description: body.description.trim(),
      context: body.context?.trim() || 'Tình huống mở rộng do Admin thêm',
      backboneTopic: body.backboneTopic || 'Công sở & hành chính',
      difficulty: body.difficulty || 'Trung bình',
      keywords: Array.isArray(body.keywords) && body.keywords.length > 0
        ? body.keywords
        : [{ word: 'custom keyword', meaning: 'từ khóa mở rộng', origin: 'extended_practice' }],
      synonyms: body.synonyms ?? [],
      antonymsOrConfusing: body.antonymsOrConfusing ?? [],
      examples: body.examples ?? [],
      paraphrases: body.paraphrases ?? [],
      commonQuestionTypes: body.commonQuestionTypes ?? ['Detail', 'Main idea'],
      traps: body.traps ?? ['Bẫy suy luận ngoài nội dung'],
      learningStrategy: body.learningStrategy || 'Đọc kỹ ngữ cảnh và từ khóa.',
      sourceReference: 'Nội dung mở rộng do Quản trị viên thêm (không thuộc 220 tình huống gốc)',
    };
    store.customSituations.push(item);
    writeStore(store);
    res.json({ store, item });
  });

  app.delete('/api/admin/situations/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const store = readStore();
    store.customSituations = store.customSituations.filter((s) => s.id !== id);
    writeStore(store);
    res.json(store);
  });

  app.post('/api/admin/questions', requireAdmin, (req, res) => {
    const body = req.body as Partial<PracticeQuestion>;
    if (!body.prompt?.trim() || !body.part || !Array.isArray(body.options) || body.options.length !== 4) {
      res.status(400).json({ error: 'Câu hỏi cần có Part, nội dung và đủ 4 đáp án A/B/C/D.' });
      return;
    }
    const store = readStore();
    const q: PracticeQuestion = {
      id: `Q-EXT-${Date.now().toString().slice(-5)}`,
      part: body.part,
      situationId: body.situationId || 'P3-01',
      questionType: body.questionType || 'Custom Practice',
      origin: 'extended_practice',
      prompt: body.prompt.trim(),
      options: body.options as [string, string, string, string],
      correctIndex: typeof body.correctIndex === 'number' ? body.correctIndex : 0,
      explanation: body.explanation?.trim() || 'Đáp án đúng theo ngữ cảnh tình huống.',
      trapAnalysis: body.trapAnalysis?.trim() || 'Kiểm tra từ khóa gây nhiễu trong các phương án còn lại.',
    };
    store.customQuestions.unshift(q);
    writeStore(store);
    res.json({ store, question: q });
  });

  app.delete('/api/admin/questions/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const store = readStore();
    store.customQuestions = store.customQuestions.filter((q) => q.id !== id);
    writeStore(store);
    res.json(store);
  });

  app.post('/api/admin/vocab', requireAdmin, (req, res) => {
    const body = req.body as Partial<VocabEntry>;
    if (!body.word?.trim() || !body.viMeaning?.trim()) {
      res.status(400).json({ error: 'Vui lòng nhập từ tiếng Anh và nghĩa tiếng Việt.' });
      return;
    }
    const store = readStore();
    const v: VocabEntry = {
      id: `VOC-EXT-${Date.now().toString().slice(-4)}`,
      word: body.word.trim(),
      ipa: body.ipa?.trim() || '',
      partOfSpeech: body.partOfSpeech?.trim() || 'noun',
      viMeaning: body.viMeaning.trim(),
      synonyms: body.synonyms ?? [],
      antonyms: body.antonyms ?? [],
      confusingPairs: body.confusingPairs ?? [],
      collocations: body.collocations ?? [],
      examples: body.examples ?? [],
      viExplanation: body.viExplanation?.trim() || 'Từ vựng mở rộng do Admin thêm.',
      relatedParts: body.relatedParts ?? ['part3'],
      relatedSituationIds: body.relatedSituationIds ?? [],
      backboneTopic: body.backboneTopic || 'Công sở & hành chính',
      origin: 'extended_practice',
    };
    store.customVocab.unshift(v);
    writeStore(store);
    res.json({ store, vocab: v });
  });

  // Vite middleware in dev / static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TOEIC Master server listening on http://localhost:${PORT}`);
  });
}

startServer();
