import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Highlighter,
  Search,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { BACKBONE_TOPICS } from '../data/part1And2';
import { ALL_220_SITUATIONS } from '../data/curriculumIndex';
import { getQuestionsForSituation } from '../data/practiceBank';
import type { SituationItem, UserStoreState } from '../types/toeic';
import { AudioPlayerBar } from './AudioPlayerBar';

interface SituationsViewProps {
  part: 'part3' | 'part4' | 'part6' | 'part7';
  store: UserStoreState;
  initialSituationId?: string;
  onSaveProgress: (situationId: string, step: number, completed: boolean) => void;
  onSpeedChange: (speed: number) => void;
  onOpenVocabWord: (word: string) => void;
  onAskAi: (situationId: string, prompt: string) => void;
}

const PART_HEADERS: Record<
  'part3' | 'part4' | 'part6' | 'part7',
  { title: string; subtitle: string; steps: string[] }
> = {
  part3: {
    title: 'Part 3 — Conversations (55 Tình Huống)',
    subtitle: 'Hội thoại 2–3 người · Trọng tâm người nói, vấn đề, paraphrase và hành động tiếp theo.',
    steps: [
      '1. Bối cảnh',
      '2. Từ khóa',
      '3. Diễn đạt tương đương',
      '4. Nghe hội thoại',
      '5. Trả lời câu hỏi',
      '6. Giải thích & Bẫy',
      '7. Hoàn thành & Ôn từ',
    ],
  },
  part4: {
    title: 'Part 4 — Short Talks (55 Tình Huống)',
    subtitle: 'Bài nói ngắn · Thông báo, quảng cáo, hướng dẫn, phát biểu, thông tin dịch vụ.',
    steps: [
      '1. Bối cảnh',
      '2. Từ khóa',
      '3. Tín hiệu diễn ngôn',
      '4. Nghe bài nói',
      '5. Trả lời câu hỏi',
      '6. Giải thích & Bẫy',
      '7. Hoàn thành & Ôn từ',
    ],
  },
  part6: {
    title: 'Part 6 — Text Completion (55 Tình Huống)',
    subtitle: 'Điền từ vựng, ngữ pháp và câu vào đoạn văn · Đọc mạch văn trước và sau chỗ trống.',
    steps: [
      '1. Ngữ cảnh văn bản',
      '2. Từ khóa trọng tâm',
      '3. Ngữ pháp & Liên kết',
      '4. Đọc toàn đoạn',
      '5. Điền chỗ trống',
      '6. Phân tích đáp án',
      '7. Hoàn thành & Ôn từ',
    ],
  },
  part7: {
    title: 'Part 7 — Reading Comprehension (55 Tình Huống)',
    subtitle: 'Đọc hiểu đơn, kép, ba · Đánh dấu bằng chứng trực tiếp trong văn bản và đối chiếu chéo.',
    steps: [
      '1. Loại văn bản',
      '2. Từ khóa & Synonyms',
      '3. Kỹ năng đọc',
      '4. Đọc & Đánh dấu bằng chứng',
      '5. Trả lời câu hỏi',
      '6. Đối chiếu bằng chứng',
      '7. Hoàn thành & Ôn từ',
    ],
  },
};

export function SituationsView({
  part,
  store,
  initialSituationId,
  onSaveProgress,
  onSpeedChange,
  onOpenVocabWord,
  onAskAi,
}: SituationsViewProps) {
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'not_started'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(initialSituationId || null);
  const [activeStep, setActiveStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [highlightedSentences, setHighlightedSentences] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialSituationId && initialSituationId.startsWith(`P${part.replace('part', '')}-`)) {
      setSelectedId(initialSituationId);
      setActiveStep(store.situationProgress[initialSituationId]?.lastStep || 1);
    } else {
      setSelectedId(null);
    }
  }, [part, initialSituationId]);

  const partSituations: SituationItem[] = useMemo(() => {
    return [...ALL_220_SITUATIONS, ...store.customSituations].filter((s) => s.part === part);
  }, [part, store.customSituations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return partSituations.filter((s) => {
      if (topicFilter !== 'all' && s.backboneTopic !== topicFilter) return false;
      const st = store.situationProgress[s.id]?.status || 'not_started';
      if (statusFilter !== 'all' && st !== statusFilter) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.backboneTopic.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.word.toLowerCase().includes(q) || k.meaning.toLowerCase().includes(q))
      );
    });
  }, [partSituations, search, topicFilter, statusFilter, store.situationProgress]);

  const activeSituation = selectedId
    ? partSituations.find((s) => s.id === selectedId) || null
    : null;

  const questionsForActive = useMemo(() => {
    if (!activeSituation) return [];
    const custom = store.customQuestions.filter((q) => q.situationId === activeSituation.id);
    return [...getQuestionsForSituation(activeSituation.id), ...custom];
  }, [activeSituation, store.customQuestions]);

  const completedCount = partSituations.filter(
    (s) => store.situationProgress[s.id]?.status === 'completed'
  ).length;

  const headerInfo = PART_HEADERS[part];

  if (activeSituation) {
    const prog = store.situationProgress[activeSituation.id];
    const isCompleted = prog?.status === 'completed';
    const relatedTopic = BACKBONE_TOPICS.find((t) => t.name === activeSituation.backboneTopic);

    const handleStepChange = (nextStep: number) => {
      setActiveStep(nextStep);
      onSaveProgress(activeSituation.id, nextStep, isCompleted);
    };

    const toggleHighlight = (key: string) => {
      setHighlightedSentences((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className="space-y-6">
        {/* Breadcrumb & Situation Header */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại danh sách {partSituations.length} tình huống</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onAskAi(
                    activeSituation.id,
                    `Phân tích từ khóa, bẫy và tạo thêm 1 bài luyện tập cho tình huống ${activeSituation.id}: "${activeSituation.title}".`
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-700" />
                <span>Hỏi AI Tutor về tình huống này</span>
              </button>
              <button
                type="button"
                onClick={() => onSaveProgress(activeSituation.id, 7, !isCompleted)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-blue-700 text-white hover:bg-blue-800'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isCompleted ? 'Đã hoàn thành' : 'Hoàn thành tình huống'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-mono-num font-semibold text-blue-700">{activeSituation.id}</span>
              <span aria-hidden="true">·</span>
              <span>{activeSituation.backboneTopic}</span>
              <span aria-hidden="true">·</span>
              <span>Mức độ: {activeSituation.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>{activeSituation.sourceReference}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeSituation.order}. {activeSituation.title}
            </h1>
          </div>

          {/* 7-Step Learning Flow Bar */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
            {headerInfo.steps.map((label, idx) => {
              const stepNum = idx + 1;
              const visited = prog?.completedSteps?.includes(stepNum);
              const active = activeStep === stepNum;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleStepChange(stepNum)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-blue-700 text-white'
                      : visited
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6">
          {activeStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Bước 1: Đọc bối cảnh & Dạng câu hỏi</h2>
              <p className="text-sm leading-relaxed text-slate-700">{activeSituation.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500">Ngữ cảnh xuất hiện</p>
                  <p className="text-sm font-medium text-slate-900">{activeSituation.context}</p>
                  {activeSituation.passageFormats && (
                    <p className="text-xs text-slate-600">
                      Định dạng: {activeSituation.passageFormats.join(' / ')}
                    </p>
                  )}
                </div>
                <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500">Dạng câu hỏi thường gặp</p>
                  <ul className="text-xs text-slate-700 list-disc pl-4 space-y-1">
                    {activeSituation.commonQuestionTypes.map((qt) => (
                      <li key={qt}>{qt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Bước 2: Từ vựng trọng tâm (Giáo trình gốc)</h2>
                <span className="text-xs text-slate-500">Nhấn vào từ để mở Flashcard & SM-2</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSituation.keywords.map((kw) => (
                  <div
                    key={kw.word}
                    className="rounded-lg border border-slate-200 p-4 flex flex-col justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-base font-bold text-slate-900">{kw.word}</p>
                        <span className="text-xs text-slate-500">Giáo trình gốc</span>
                      </div>
                      <p className="text-sm text-slate-700">{kw.meaning}</p>
                      {kw.synonyms && kw.synonyms.length > 0 && (
                        <p className="text-xs text-slate-600">Đồng nghĩa: {kw.synonyms.join(', ')}</p>
                      )}
                      {kw.example && (
                        <p className="text-xs italic text-slate-600">Ví dụ: “{kw.example}”</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenVocabWord(kw.word)}
                      className="self-start text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Mở trong Vocabulary Master</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                {part === 'part6'
                  ? 'Bước 3: Điểm ngữ pháp & Liên kết mạch văn'
                  : part === 'part7'
                  ? 'Bước 3: Kỹ năng đọc hiểu & Tương đương'
                  : 'Bước 3: Diễn đạt tương đương & Chủ đề xương sống'}
              </h2>

              {activeSituation.grammarFocus && (
                <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Điểm ngữ pháp cần rà soát</p>
                  <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                    {activeSituation.grammarFocus.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeSituation.readingSkills && (
                <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Kỹ năng đọc cần áp dụng</p>
                  <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                    {activeSituation.readingSkills.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-lg border border-slate-200 p-4 space-y-3">
                <p className="text-sm font-semibold text-slate-900">
                  Mở rộng theo chủ đề xương sống: {activeSituation.backboneTopic}
                </p>
                {activeSituation.synonyms.length > 0 && (
                  <p className="text-xs text-slate-700">
                    <strong>Từ đồng nghĩa trong giáo trình:</strong> {activeSituation.synonyms.join(', ')}
                  </p>
                )}
                {activeSituation.antonymsOrConfusing.length > 0 && (
                  <p className="text-xs text-rose-700">
                    <strong>Trái nghĩa / Cặp dễ nhầm:</strong> {activeSituation.antonymsOrConfusing.join(' · ')}
                  </p>
                )}
                {relatedTopic?.collocations && (
                  <p className="text-xs text-slate-700">
                    <strong>Collocations ưu tiên:</strong> {relatedTopic.collocations.join(' · ')}
                  </p>
                )}
                {relatedTopic?.paraphrases && (
                  <div className="text-xs text-blue-900 bg-blue-50 rounded-md p-3 space-y-1">
                    <p className="font-semibold">Paraphrase thường gặp trong giáo trình:</p>
                    {relatedTopic.paraphrases.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
                {!relatedTopic?.paraphrases && activeSituation.synonyms.length === 0 && (
                  <p className="text-xs text-slate-500">
                    Tình huống này trong PDF gốc chưa liệt kê danh sách synonym riêng — bạn có thể dùng AI Tutor để mở rộng thêm cách diễn đạt tương đương.
                  </p>
                )}
              </div>
            </div>
          )}

          {(activeStep === 4 || activeStep === 5) && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {activeStep === 4
                    ? part === 'part3' || part === 'part4'
                      ? 'Bước 4: Nghe tình huống & Theo dõi Transcript'
                      : 'Bước 4: Đọc văn bản & Đánh dấu bằng chứng'
                    : 'Bước 5: Trả lời câu hỏi luyện tập'}
                </h2>
                <span className="text-xs text-slate-500">
                  Nội dung luyện tập mở rộng theo ngữ cảnh giáo trình
                </span>
              </div>

              {questionsForActive.map((q) => {
                const selected = answers[q.id];
                const answered = selected !== undefined;
                return (
                  <div key={q.id} className="space-y-4 border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                    {(part === 'part3' || part === 'part4') && q.audioScript && (
                      <AudioPlayerBar
                        lines={q.audioScript}
                        speed={store.settings.audioSpeed}
                        onSpeedChange={onSpeedChange}
                        title={`${activeSituation.title} — Audio luyện tập`}
                        defaultShowTranscript={activeStep === 4}
                      />
                    )}

                    {(part === 'part6' || part === 'part7') && q.passages && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Highlighter className="h-3.5 w-3.5 text-amber-600" />
                          <span>Nhấp vào từng câu trong văn bản để đánh dấu (highlight) bằng chứng đọc hiểu.</span>
                        </div>
                        <div className={`grid gap-4 ${q.passages.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                          {q.passages.map((p, pIdx) => (
                            <div
                              key={pIdx}
                              className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 space-y-2"
                            >
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 border-b border-slate-200 pb-2">
                                <span>{p.label}</span>
                                <span className="text-slate-500">{p.docType}</span>
                              </div>
                              <div className="space-y-1.5 text-sm leading-relaxed text-slate-800">
                                {p.content.split('\n').map((line, lIdx) => {
                                  const key = `${q.id}-${pIdx}-${lIdx}`;
                                  const hl = highlightedSentences[key];
                                  return (
                                    <p
                                      key={key}
                                      onClick={() => line.trim() && toggleHighlight(key)}
                                      className={`rounded px-1.5 py-0.5 cursor-pointer transition-colors ${
                                        hl ? 'bg-amber-200/80 text-slate-950 font-medium' : 'hover:bg-slate-200/60'
                                      }`}
                                    >
                                      {line || '\u00A0'}
                                    </p>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-slate-900">{q.prompt}</p>
                      <div className="grid grid-cols-1 gap-2">
                        {q.options.map((opt, idx) => {
                          const isPicked = selected === idx;
                          const isCorrect = idx === q.correctIndex;
                          let style = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                          if (answered) {
                            if (isCorrect) style = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-medium';
                            else if (isPicked) style = 'border-rose-600 bg-rose-50 text-rose-950';
                          }
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setAnswers((prev) => ({ ...prev, [q.id]: idx }));
                                onSaveProgress(activeSituation.id, 5, isCompleted);
                              }}
                              className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between gap-3 ${style}`}
                            >
                              <span>
                                <strong className="font-mono-num mr-2">({String.fromCharCode(65 + idx)})</strong>
                                {opt}
                              </span>
                              {answered && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                              {answered && isPicked && !isCorrect && <XCircle className="h-4 w-4 text-rose-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {answered && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
                          <p className="font-semibold text-slate-900">Giải thích chi tiết</p>
                          {q.grammarRule && (
                            <p className="text-xs text-blue-800 font-medium">Ngữ pháp: {q.grammarRule}</p>
                          )}
                          <p className="text-slate-700">{q.explanation}</p>
                          <p className="text-xs text-slate-600">
                            <strong>Phân tích bẫy:</strong> {q.trapAnalysis}
                          </p>
                          {q.evidenceQuote && (
                            <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-2.5 py-1.5">
                              <strong>Bằng chứng trong bài:</strong> “{q.evidenceQuote}”
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeStep === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Bước 6: Phân tích bẫy & Chiến lược làm bài</h2>
              <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 inline-flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Bẫy cần tránh (Giáo trình gốc)</span>
                </h3>
                <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                  {activeSituation.traps.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Chiến lược xử lý</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{activeSituation.learningStrategy}</p>
              </div>

              {activeSituation.selfQuestions && (
                <div className="rounded-lg border border-slate-200 bg-blue-50/50 p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-blue-950">Tự hỏi khi nghe (Giáo trình gốc)</h3>
                  <ul className="text-xs text-blue-900 list-disc pl-5 space-y-1">
                    {activeSituation.selfQuestions.map((sq) => (
                      <li key={sq}>{sq}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeStep === 7 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Bước 7: Ôn lại từ vựng & Ghi nhận hoàn thành</h2>
              <p className="text-sm text-slate-600">
                Kiểm tra lại {activeSituation.keywords.length} từ khóa cốt lõi và đánh dấu hoàn thành tình huống để lưu vào tiến độ học tập.
              </p>
              <div className="flex flex-wrap gap-2">
                {activeSituation.keywords.map((k) => (
                  <button
                    key={k.word}
                    type="button"
                    onClick={() => onOpenVocabWord(k.word)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:border-blue-300"
                  >
                    {k.word} — {k.meaning}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSaveProgress(activeSituation.id, 7, true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isCompleted ? 'Đã hoàn thành tình huống này' : 'Xác nhận hoàn thành tình huống'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Step Footer Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={activeStep <= 1}
              onClick={() => handleStepChange(activeStep - 1)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Bước trước
            </button>
            <span className="text-xs text-slate-500 font-mono-num">
              Bước {activeStep} / 7
            </span>
            <button
              type="button"
              disabled={activeStep >= 7}
              onClick={() => handleStepChange(activeStep + 1)}
              className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-40"
            >
              Bước tiếp theo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Progress Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">
              Giáo trình 220 tình huống TOEIC · Bản đồ đầy đủ
            </p>
            <h1 className="text-2xl font-bold text-slate-900">{headerInfo.title}</h1>
            <p className="text-sm text-slate-600">{headerInfo.subtitle}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-slate-500">Tiến độ hoàn thành</p>
            <p className="text-2xl font-bold text-blue-700 font-mono-num tabular-nums">
              {completedCount}/{partSituations.length}
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          <div className="md:col-span-5 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên tình huống, mã số hoặc từ khóa..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              aria-label="Lọc theo chủ đề xương sống"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:outline-none"
            >
              <option value="all">Tất cả chủ đề xương sống</option>
              {BACKBONE_TOPICS.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              aria-label="Lọc theo trạng thái học"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="not_started">Chưa học</option>
              <option value="in_progress">Đang học</option>
              <option value="completed">Đã hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Situations Grid (All 55 items accessible) */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-800">Không tìm thấy tình huống phù hợp</p>
          <p className="text-xs text-slate-500">Hãy thử xóa bộ lọc hoặc tìm bằng từ khóa khác.</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setTopicFilter('all');
              setStatusFilter('all');
            }}
            className="mt-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((sit) => {
            const st = store.situationProgress[sit.id]?.status || 'not_started';
            return (
              <button
                key={sit.id}
                type="button"
                onClick={() => {
                  setSelectedId(sit.id);
                  setActiveStep(store.situationProgress[sit.id]?.lastStep || 1);
                }}
                className="rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-blue-400 hover:bg-slate-50/40 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="font-mono-num font-semibold text-slate-700">
                      #{String(sit.order).padStart(2, '0')} · {sit.id}
                    </span>
                    <span
                      className={`font-semibold ${
                        st === 'completed'
                          ? 'text-emerald-700'
                          : st === 'in_progress'
                          ? 'text-amber-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {st === 'completed' ? 'Hoàn thành' : st === 'in_progress' ? 'Đang học' : 'Chưa học'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{sit.title}</h3>
                  <p className="text-xs text-slate-500">
                    {sit.backboneTopic} · Ước lượng: {sit.difficulty}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Từ khóa: </span>
                  {sit.keywords.slice(0, 4).map((k) => k.word).join(', ')}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
