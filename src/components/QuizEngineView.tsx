import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Target,
  XCircle,
} from 'lucide-react';
import { BACKBONE_TOPICS } from '../data/part1And2';
import { ALL_220_SITUATIONS } from '../data/curriculumIndex';
import { buildAllPracticeQuestions } from '../data/practiceBank';
import type { PracticeQuestion, QuizAttempt, ToeicPart, UserStoreState } from '../types/toeic';
import { AudioPlayerBar } from './AudioPlayerBar';

interface QuizEngineViewProps {
  store: UserStoreState;
  onSubmitQuiz: (payload: {
    title: string;
    mode: string;
    partFilter: string;
    durationSeconds: number;
    answers: {
      questionId: string;
      part: PracticeQuestion['part'];
      situationId: string;
      questionType: string;
      selectedIndex: number;
      correctIndex: number;
    }[];
  }) => Promise<{ attempt: QuizAttempt } | void>;
  onSpeedChange: (speed: number) => void;
  onOpenSituation: (part: ToeicPart, situationId: string) => void;
  onOpenProgress: () => void;
}

export function QuizEngineView({
  store,
  onSubmitQuiz,
  onSpeedChange,
  onOpenSituation,
  onOpenProgress,
}: QuizEngineViewProps) {
  const [quizMode, setQuizMode] = useState<'by_part' | 'by_topic' | 'mixed' | 'weak_only'>('by_part');
  const [partFilter, setPartFilter] = useState<ToeicPart | 'all'>('part3');
  const [topicFilter, setTopicFilter] = useState<string>(BACKBONE_TOPICS[0].name);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timerMinutes, setTimerMinutes] = useState<number>(10);

  const [phase, setPhase] = useState<'setup' | 'running' | 'result'>('setup');
  const [activeQuestions, setActiveQuestions] = useState<PracticeQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  const allQuestions = useMemo(
    () => buildAllPracticeQuestions(store.customQuestions),
    [store.customQuestions]
  );
  const allSituations = useMemo(
    () => [...ALL_220_SITUATIONS, ...store.customSituations],
    [store.customSituations]
  );

  // Timer tick while quiz is running
  useEffect(() => {
    if (phase !== 'running') return;
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const startQuiz = () => {
    let pool: PracticeQuestion[] = [];
    if (quizMode === 'by_part') {
      pool = partFilter === 'all' ? allQuestions : allQuestions.filter((q) => q.part === partFilter);
    } else if (quizMode === 'by_topic') {
      const sitIds = new Set(allSituations.filter((s) => s.backboneTopic === topicFilter).map((s) => s.id));
      pool = allQuestions.filter((q) => sitIds.has(q.situationId));
    } else if (quizMode === 'weak_only') {
      const weakIds = new Set(store.mistakes.filter((m) => !m.resolved).map((m) => m.questionId));
      pool = allQuestions.filter((q) => weakIds.has(q.id));
    } else {
      // deterministic spread across all 6 parts
      pool = [...allQuestions].sort((a, b) => a.id.localeCompare(b.id));
    }

    if (pool.length === 0) pool = allQuestions.slice(0, questionCount);

    // Shuffle a copy using Fisher-Yates
    const copy = [...pool];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    setActiveQuestions(copy.slice(0, Math.min(questionCount, copy.length)));
    setSelectedAnswers({});
    setElapsedSeconds(0);
    setLastAttempt(null);
    setPhase('running');
  };

  const handleFinishQuiz = async () => {
    if (activeQuestions.length === 0 || submitting) return;
    setSubmitting(true);
    try {
      const title =
        quizMode === 'by_part'
          ? `Kiểm tra ${partFilter === 'all' ? 'Tổng hợp 6 Part' : partFilter.toUpperCase()}`
          : quizMode === 'by_topic'
          ? `Kiểm tra chủ đề: ${topicFilter}`
          : quizMode === 'weak_only'
          ? 'Ôn lại câu làm sai'
          : 'Bài kiểm tra tổng hợp ngẫu nhiên';

      const answersPayload = activeQuestions.map((q) => ({
        questionId: q.id,
        part: q.part,
        situationId: q.situationId,
        questionType: q.questionType,
        selectedIndex: selectedAnswers[q.id] ?? -1,
        correctIndex: q.correctIndex,
      }));

      const res = await onSubmitQuiz({
        title,
        mode: quizMode,
        partFilter: quizMode === 'by_part' ? partFilter : quizMode,
        durationSeconds: Math.max(1, elapsedSeconds),
        answers: answersPayload,
      });

      if (res?.attempt) setLastAttempt(res.attempt);
      setPhase('result');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const remainingSeconds = Math.max(0, timerMinutes * 60 - elapsedSeconds);
  const answeredCount = Object.keys(selectedAnswers).length;
  const unresolvedMistakeCount = store.mistakes.filter((m) => !m.resolved).length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
        <p className="text-xs font-medium text-slate-500">
          Module 10 · Ngân hàng {allQuestions.length} câu luyện tập mở rộng bám sát giáo trình
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Quiz Engine — Kiểm Tra & Luyện Tập</h1>
        <p className="text-sm text-slate-600">
          Tất cả câu hỏi trắc nghiệm thuộc nội dung luyện tập mở rộng (được gắn nhãn riêng với giáo trình gốc). Kết quả tự động cập nhật tiến độ và Sổ lỗi.
        </p>
      </div>

      {/* Phase 1: Setup */}
      {phase === 'setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">Cấu hình bài kiểm tra</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'by_part', title: 'Theo từng Part', desc: 'Chọn Part 1, 2, 3, 4, 6 hoặc 7 (không có Part 5)' },
                { id: 'by_topic', title: 'Theo chủ đề xương sống', desc: '15 nhóm chủ đề công sở, du lịch, nhân sự...' },
                { id: 'mixed', title: 'Tổng hợp đa Part', desc: 'Trộn ngẫu nhiên câu hỏi từ cả 6 Part giáo trình' },
                {
                  id: 'weak_only',
                  title: `Luyện lại câu hay sai (${unresolvedMistakeCount})`,
                  desc: 'Tập trung xử lý các câu trong Sổ lỗi chưa khắc phục',
                },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setQuizMode(m.id as typeof quizMode)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    quizMode === m.id
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{m.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              {quizMode === 'by_part' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Chọn Part</label>
                  <select
                    value={partFilter}
                    onChange={(e) => setPartFilter(e.target.value as ToeicPart | 'all')}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  >
                    <option value="part1">Part 1 — Photographs</option>
                    <option value="part2">Part 2 — Question-Response</option>
                    <option value="part3">Part 3 — Conversations</option>
                    <option value="part4">Part 4 — Short Talks</option>
                    <option value="part6">Part 6 — Text Completion</option>
                    <option value="part7">Part 7 — Reading Comprehension</option>
                    <option value="all">Tất cả 6 Part</option>
                  </select>
                </div>
              )}

              {quizMode === 'by_topic' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Chủ đề xương sống</label>
                  <select
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  >
                    {BACKBONE_TOPICS.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Số câu hỏi</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                >
                  <option value={5}>5 câu (Nhanh)</option>
                  <option value={10}>10 câu (Tiêu chuẩn)</option>
                  <option value={20}>20 câu (Chuyên sâu)</option>
                  <option value={30}>30 câu (Thi thử mini)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Thời gian đếm ngược</label>
                <select
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                >
                  <option value={5}>5 phút</option>
                  <option value={10}>10 phút</option>
                  <option value={20}>20 phút</option>
                  <option value={30}>30 phút</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={startQuiz}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Play className="h-4 w-4" />
              <span>Bắt đầu làm bài</span>
            </button>
          </div>

          {/* Recent Quiz Attempts */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Lịch sử làm bài gần đây</h2>
            {store.quizAttempts.length === 0 ? (
              <p className="text-sm text-slate-500">
                Chưa có lượt làm bài nào. Hãy hoàn thành bài đầu tiên để xem thống kê điểm số và Sổ lỗi.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {store.quizAttempts.slice(0, 6).map((a) => (
                  <div key={a.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                      <p className="text-xs text-slate-500">
                        {a.correctCount}/{a.totalQuestions} câu · {formatDuration(a.durationSeconds)} ·{' '}
                        {new Date(a.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold font-mono-num ${
                        a.scorePercent >= 70 ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {a.scorePercent}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phase 2: Running */}
      {phase === 'running' && (
        <div className="space-y-6">
          <div className="sticky top-2 z-10 rounded-xl border border-slate-200 bg-white/95 backdrop-blur px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-slate-900 font-mono-num">
                Đã trả lời: {answeredCount}/{activeQuestions.length}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 font-mono-num">
                <Clock className="h-4 w-4 text-blue-700" />
                Còn {formatDuration(remainingSeconds)} (đã làm {formatDuration(elapsedSeconds)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPhase('setup')}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy bài
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinishQuiz}
                className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {submitting ? 'Đang chấm...' : 'Nộp bài & Chấm điểm'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {activeQuestions.map((q, idx) => (
              <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">
                    Câu {idx + 1} · {q.part.toUpperCase()} · {q.situationId} · {q.questionType}
                  </span>
                  <span>Luyện tập mở rộng</span>
                </div>

                {q.imageUrl && (
                  <img
                    src={q.imageUrl}
                    alt={`Hình minh họa ${q.situationId}`}
                    className="w-full max-w-md rounded-lg border border-slate-200 object-cover aspect-[4/3]"
                  />
                )}

                {q.audioScript && q.audioScript.length > 0 && (
                  <AudioPlayerBar
                    lines={q.audioScript}
                    speed={store.settings.audioSpeed}
                    onSpeedChange={onSpeedChange}
                    title={`Audio luyện nghe câu ${idx + 1} (${q.part.toUpperCase()})`}
                    defaultShowTranscript={false}
                  />
                )}

                {q.passages && q.passages.length > 0 && (
                  <div className="space-y-3">
                    {q.passages.map((psg, pi) => (
                      <div key={pi} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-600">
                          {psg.label} · {psg.docType}
                        </p>
                        <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">{psg.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-base font-semibold text-slate-900">{q.prompt}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, oi) => {
                    const selected = selectedAnswers[q.id] === oi;
                    return (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                        className={`rounded-lg border p-3.5 text-left text-sm transition-colors ${
                          selected
                            ? 'border-blue-700 bg-blue-50 text-blue-950 font-semibold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 3: Results */}
      {phase === 'result' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kết quả bài kiểm tra</p>
              <h2 className="text-3xl font-bold text-slate-900 font-mono-num">
                {lastAttempt ? `${lastAttempt.correctCount}/${lastAttempt.totalQuestions} câu đúng (${lastAttempt.scorePercent}%)` : 'Đã hoàn thành'}
              </h2>
              <p className="text-sm text-slate-600">
                Thời gian làm bài: {formatDuration(elapsedSeconds)}. Các câu trả lời sai đã được tự động ghi vào Sổ lỗi để ôn tập.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setPhase('setup')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Làm bài khác</span>
              </button>
              <button
                type="button"
                onClick={onOpenProgress}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                <Target className="h-4 w-4" />
                <span>Xem biểu đồ & Sổ lỗi</span>
              </button>
            </div>
          </div>

          {/* Detailed breakdown */}
          <div className="space-y-4">
            {activeQuestions.map((q, idx) => {
              const chosen = selectedAnswers[q.id];
              const isCorrect = chosen === q.correctIndex;
              return (
                <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                      {isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-700" />
                      )}
                      Câu {idx + 1} · {q.part.toUpperCase()} ({q.situationId})
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenSituation(q.part, q.situationId)}
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Mở bài tình huống {q.situationId} →
                    </button>
                  </div>

                  <p className="text-sm font-medium text-slate-900">{q.prompt}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`rounded-lg border px-3 py-2 ${
                          oi === q.correctIndex
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                            : oi === chosen
                            ? 'border-rose-400 bg-rose-50 text-rose-900'
                            : 'border-slate-100 text-slate-500'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3.5 space-y-1.5 text-xs leading-relaxed">
                    <p className="text-slate-800">
                      <span className="font-semibold text-emerald-800">Giải thích:</span> {q.explanation}
                    </p>
                    <p className="text-amber-900 inline-flex items-start gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <span className="font-semibold">Phân tích bẫy:</span> {q.trapAnalysis}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
