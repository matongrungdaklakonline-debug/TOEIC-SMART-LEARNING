import { useMemo, useState } from 'react';
import { CalendarClock, CheckCircle2, RotateCw, Sparkles, Volume2 } from 'lucide-react';
import { ALL_220_SITUATIONS } from '../data/curriculumIndex';
import { VOCABULARY_BANK } from '../data/vocabulary';
import type { ReviewCardState, ToeicPart, UserStoreState } from '../types/toeic';
import { calculateSm2NextState, isDueForReview, type Sm2Rating } from '../utils/sm2';
import { speakLines } from '../utils/speech';

interface SmartReviewViewProps {
  store: UserStoreState;
  onRateCard: (targetId: string, targetType: 'vocab' | 'situation', rating: Sm2Rating) => void;
  onOpenSituation: (part: ToeicPart, situationId: string) => void;
  onOpenVocab: () => void;
}

export function SmartReviewView({
  store,
  onRateCard,
  onOpenSituation,
  onOpenVocab,
}: SmartReviewViewProps) {
  const [filterMode, setFilterMode] = useState<'due' | 'needs_review' | 'all_tracked'>('due');
  const [showBack, setShowBack] = useState(false);

  const allVocab = useMemo(() => [...store.customVocab, ...VOCABULARY_BANK], [store.customVocab]);
  const allSituations = useMemo(
    () => [...ALL_220_SITUATIONS, ...store.customSituations],
    [store.customSituations]
  );

  const stats = useMemo(() => {
    const cards = Object.values(store.reviewCards);
    const learning = cards.filter((c) => c.status === 'learning').length;
    const needsReview = cards.filter((c) => c.status === 'needs_review').length;
    const mastered = cards.filter((c) => c.status === 'mastered').length;
    const unlearned = Math.max(0, allVocab.length - cards.filter((c) => c.targetType === 'vocab').length);
    const dueNow = cards.filter((c) => isDueForReview(c)).length;
    const retention = cards.length > 0 ? Math.round(((mastered + learning) / cards.length) * 100) : 0;
    return { totalTracked: cards.length, learning, needsReview, mastered, unlearned, dueNow, retention };
  }, [store.reviewCards, allVocab.length]);

  // Queue of cards + starter suggestions if queue is empty
  const queueCards = useMemo(() => {
    const cards = Object.values(store.reviewCards);
    let filtered: ReviewCardState[];
    if (filterMode === 'due') {
      filtered = cards.filter((c) => isDueForReview(c));
    } else if (filterMode === 'needs_review') {
      filtered = cards.filter((c) => c.status === 'needs_review' || c.isHard);
    } else {
      filtered = cards;
    }
    return filtered.sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime());
  }, [store.reviewCards, filterMode]);

  // Starter deck if user hasn't added any SM-2 cards yet
  const starterVocab = useMemo(
    () => allVocab.filter((v) => !store.reviewCards[v.id]).slice(0, 10),
    [allVocab, store.reviewCards]
  );

  const currentCard = queueCards[0];
  const currentStarter = !currentCard && filterMode === 'due' ? starterVocab[0] : undefined;

  const resolveCardDetails = (card: ReviewCardState) => {
    if (card.targetType === 'vocab') {
      const v = allVocab.find((x) => x.id === card.targetId);
      return {
        title: v?.word ?? card.targetId,
        subtitle: v ? `${v.partOfSpeech} ${v.ipa}` : 'Từ vựng',
        meaning: v?.viMeaning ?? '',
        extra: v?.synonyms.length ? `Đồng nghĩa: ${v.synonyms.join(', ')}` : v?.examples[0] || v?.viExplanation || '',
        part: v?.relatedParts[0],
        situationId: v?.relatedSituationIds[0],
      };
    }
    const sit = allSituations.find((s) => s.id === card.targetId);
    return {
      title: sit ? `${sit.id} · ${sit.title}` : card.targetId,
      subtitle: sit ? `${sit.part.toUpperCase()} · ${sit.backboneTopic}` : 'Tình huống',
      meaning: sit?.description ?? '',
      extra: sit ? `Bẫy chính: ${sit.traps[0] || sit.learningStrategy}` : '',
      part: sit?.part,
      situationId: sit?.id,
    };
  };

  const previewIntervalText = (card: ReviewCardState | undefined, targetId: string, type: 'vocab' | 'situation', rating: Sm2Rating) => {
    const next = calculateSm2NextState(card, targetId, type, rating);
    if (next.intervalDays === 0) return 'Ôn ngay hôm nay';
    if (next.intervalDays === 1) return 'Sau 1 ngày';
    return `Sau ${next.intervalDays} ngày`;
  };

  const handleRate = (targetId: string, targetType: 'vocab' | 'situation', rating: Sm2Rating) => {
    setShowBack(false);
    onRateCard(targetId, targetType, rating);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">
              Module 9 · Lặp lại ngắt quãng khoa học (Spaced Repetition SM-2)
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              Smart Review — Ôn Tập Thông Minh SM-2
            </h1>
            <p className="text-sm text-slate-600">
              Hệ thống tính tự động chu kỳ lặp lại tối ưu dựa trên mức độ nhớ của bạn với từng từ vựng và tình huống.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 shrink-0">
            {[
              { id: 'due', label: `Đến hạn (${stats.dueNow})` },
              { id: 'needs_review', label: `Từ khó / Quên (${stats.needsReview})` },
              { id: 'all_tracked', label: `Đã đưa vào lịch (${stats.totalTracked})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFilterMode(tab.id as typeof filterMode);
                  setShowBack(false);
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  filterMode === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Chưa học</p>
            <p className="text-xl font-bold text-slate-900 font-mono-num">{stats.unlearned}</p>
          </div>
          <div className="rounded-lg bg-blue-50/70 p-3">
            <p className="text-xs text-blue-700">Đang học</p>
            <p className="text-xl font-bold text-blue-800 font-mono-num">{stats.learning}</p>
          </div>
          <div className="rounded-lg bg-rose-50/70 p-3">
            <p className="text-xs text-rose-700">Cần ôn lại</p>
            <p className="text-xl font-bold text-rose-800 font-mono-num">{stats.needsReview}</p>
          </div>
          <div className="rounded-lg bg-emerald-50/70 p-3">
            <p className="text-xs text-emerald-700">Đã ghi nhớ</p>
            <p className="text-xl font-bold text-emerald-800 font-mono-num">{stats.mastered}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Tỷ lệ lưu giữ</p>
            <p className="text-xl font-bold text-slate-900 font-mono-num">
              {stats.totalTracked > 0 ? `${stats.retention}%` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Active Review Workspace */}
      {currentCard ? (
        (() => {
          const info = resolveCardDetails(currentCard);
          return (
            <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <CalendarClock className="h-4 w-4 text-blue-700" />
                  Còn {queueCards.length} mục trong hàng đợi · Hệ số EF {currentCard.easinessFactor}
                </span>
                <button
                  type="button"
                  onClick={() => speakLines([info.title], store.settings.audioSpeed)}
                  className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Đọc</span>
                </button>
              </div>

              <div className="py-6 text-center space-y-3 border-y border-slate-100">
                <p className="text-xs font-medium text-slate-500">{info.subtitle}</p>
                <h2 className="text-3xl font-bold text-slate-900">{info.title}</h2>

                {!showBack ? (
                  <button
                    type="button"
                    onClick={() => setShowBack(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                  >
                    <span>Hiện đáp án & ngữ cảnh</span>
                  </button>
                ) : (
                  <div className="mt-4 space-y-2 text-left rounded-xl bg-slate-50 p-4">
                    <p className="text-base font-semibold text-blue-900">{info.meaning}</p>
                    {info.extra && <p className="text-sm text-slate-700">{info.extra}</p>}
                    {info.part && info.situationId && (
                      <button
                        type="button"
                        onClick={() => onOpenSituation(info.part!, info.situationId!)}
                        className="text-xs font-semibold text-blue-700 hover:underline pt-1"
                      >
                        Mở tình huống gốc ({info.situationId}) →
                      </button>
                    )}
                  </div>
                )}
              </div>

              {showBack && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 text-center">
                    Đánh giá mức độ ghi nhớ của bạn để SM-2 xếp lịch ôn tiếp theo:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(
                      [
                        { id: 'forgot', label: 'Quên hoàn toàn', cls: 'border-rose-200 bg-rose-50/70 text-rose-800 hover:bg-rose-100' },
                        { id: 'hard', label: 'Khó nhớ', cls: 'border-amber-200 bg-amber-50/70 text-amber-800 hover:bg-amber-100' },
                        { id: 'good', label: 'Nhớ được', cls: 'border-blue-200 bg-blue-50/70 text-blue-800 hover:bg-blue-100' },
                        { id: 'easy', label: 'Dễ dàng', cls: 'border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100' },
                      ] as const
                    ).map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleRate(currentCard.targetId, currentCard.targetType, r.id)}
                        className={`rounded-lg border p-3 text-center transition-colors ${r.cls}`}
                      >
                        <p className="text-xs font-bold">{r.label}</p>
                        <p className="text-[11px] opacity-80 mt-0.5">
                          {previewIntervalText(currentCard, currentCard.targetId, currentCard.targetType, r.id)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()
      ) : currentStarter ? (
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              Gợi ý nạp từ mới vào lịch SM-2 ({starterVocab.length} từ chưa học)
            </span>
            <button
              type="button"
              onClick={() => speakLines([currentStarter.word], store.settings.audioSpeed)}
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline"
            >
              <Volume2 className="h-4 w-4" />
              <span>Phát âm</span>
            </button>
          </div>

          <div className="py-4 text-center space-y-2 border-y border-slate-100">
            <p className="text-xs text-slate-500">{currentStarter.backboneTopic} · {currentStarter.partOfSpeech}</p>
            <h2 className="text-3xl font-bold text-slate-900">{currentStarter.word}</h2>
            {!showBack ? (
              <button
                type="button"
                onClick={() => setShowBack(true)}
                className="mt-3 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Xem nghĩa & đưa vào lịch ôn
              </button>
            ) : (
              <div className="mt-3 rounded-xl bg-slate-50 p-4 text-left space-y-1.5">
                <p className="text-base font-semibold text-blue-900">{currentStarter.viMeaning}</p>
                {currentStarter.synonyms.length > 0 && (
                  <p className="text-xs text-slate-700">Đồng nghĩa: {currentStarter.synonyms.join(', ')}</p>
                )}
                {currentStarter.examples[0] && (
                  <p className="text-xs text-slate-600 italic">“{currentStarter.examples[0]}”</p>
                )}
              </div>
            )}
          </div>

          {showBack && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  { id: 'forgot', label: 'Quên hoàn toàn', cls: 'border-rose-200 bg-rose-50/70 text-rose-800' },
                  { id: 'hard', label: 'Khó nhớ', cls: 'border-amber-200 bg-amber-50/70 text-amber-800' },
                  { id: 'good', label: 'Nhớ được', cls: 'border-blue-200 bg-blue-50/70 text-blue-800' },
                  { id: 'easy', label: 'Dễ dàng', cls: 'border-emerald-200 bg-emerald-50/70 text-emerald-800' },
                ] as const
              ).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRate(currentStarter.id, 'vocab', r.id)}
                  className={`rounded-lg border p-3 text-center ${r.cls}`}
                >
                  <p className="text-xs font-bold">{r.label}</p>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {previewIntervalText(undefined, currentStarter.id, 'vocab', r.id)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-3">
          <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-900">
            Tuyệt vời! Bạn đã hoàn thành hết thẻ trong mục này.
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Hãy học thêm từ vựng mới ở module Vocabulary Master hoặc hoàn thành thêm tình huống Part 3, 4, 6, 7.
          </p>
          <button
            type="button"
            onClick={onOpenVocab}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <RotateCw className="h-4 w-4" />
            <span>Mở kho từ vựng</span>
          </button>
        </div>
      )}
    </div>
  );
}
