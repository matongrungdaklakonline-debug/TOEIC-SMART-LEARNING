import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FlipHorizontal,
  Search,
  Sparkles,
  Star,
  Volume2,
  XCircle,
} from 'lucide-react';
import { BACKBONE_TOPICS, PART1_CONFUSING_PREPOSITIONS, PRIORITY_COLLOCATIONS } from '../data/part1And2';
import { ALL_220_SITUATIONS } from '../data/curriculumIndex';
import { VOCABULARY_BANK } from '../data/vocabulary';
import type { ReviewStatus, ToeicPart, UserStoreState, VocabEntry } from '../types/toeic';
import type { Sm2Rating } from '../utils/sm2';
import { speakLines } from '../utils/speech';

interface VocabularyViewProps {
  store: UserStoreState;
  initialSearchWord?: string;
  onRateCard: (targetId: string, targetType: 'vocab' | 'situation', rating: Sm2Rating) => void;
  onToggleHard: (targetId: string, targetType: 'vocab' | 'situation') => void;
  onOpenSituation: (part: ToeicPart, situationId: string) => void;
  onAskAiVocab: (word: string) => void;
}

const STATUS_LABELS: Record<ReviewStatus, string> = {
  unlearned: 'Chưa học',
  learning: 'Đang học',
  needs_review: 'Cần ôn lại',
  mastered: 'Đã nhớ',
};

export function VocabularyView({
  store,
  initialSearchWord = '',
  onRateCard,
  onToggleHard,
  onOpenSituation,
  onAskAiVocab,
}: VocabularyViewProps) {
  const [subTab, setSubTab] = useState<'library' | 'flashcard' | 'pairs' | 'check'>('library');
  const [search, setSearch] = useState(initialSearchWord);
  const [partFilter, setPartFilter] = useState<ToeicPart | 'all'>('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'hard' | 'all'>('all');

  const [selectedVocabId, setSelectedVocabId] = useState<string>(VOCABULARY_BANK[0]?.id ?? '');
  const [cardDirection, setCardDirection] = useState<'en_vi' | 'vi_en'>('en_vi');
  const [flipped, setFlipped] = useState(false);

  // Mini vocab quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);

  const allVocab: VocabEntry[] = useMemo(
    () => [...store.customVocab, ...VOCABULARY_BANK],
    [store.customVocab]
  );

  const allSituations = useMemo(
    () => [...ALL_220_SITUATIONS, ...store.customSituations],
    [store.customSituations]
  );

  const getStatus = (id: string): ReviewStatus => {
    return store.reviewCards[id]?.status ?? 'unlearned';
  };

  const filteredVocab = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allVocab.filter((v) => {
      if (partFilter !== 'all' && !v.relatedParts.includes(partFilter)) return false;
      if (topicFilter !== 'all' && v.backboneTopic !== topicFilter) return false;
      const card = store.reviewCards[v.id];
      const st = card?.status ?? 'unlearned';
      if (statusFilter === 'hard' && !card?.isHard) return false;
      if (statusFilter !== 'all' && statusFilter !== 'hard' && st !== statusFilter) return false;
      if (!q) return true;
      return (
        v.word.toLowerCase().includes(q) ||
        v.viMeaning.toLowerCase().includes(q) ||
        v.synonyms.some((s) => s.toLowerCase().includes(q)) ||
        v.collocations.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [allVocab, search, partFilter, topicFilter, statusFilter, store.reviewCards]);

  const activeWord =
    allVocab.find((v) => v.id === selectedVocabId) || filteredVocab[0] || allVocab[0];

  const flashcardPool = filteredVocab.length > 0 ? filteredVocab : allVocab;
  const flashcardIdx = Math.max(
    0,
    flashcardPool.findIndex((v) => v.id === activeWord?.id)
  );

  const handleNextCard = (delta: number) => {
    if (flashcardPool.length === 0) return;
    const nextIdx = (flashcardIdx + delta + flashcardPool.length) % flashcardPool.length;
    setSelectedVocabId(flashcardPool[nextIdx].id);
    setFlipped(false);
  };

  const quizItems = useMemo(() => {
    const pool = filteredVocab.length >= 4 ? filteredVocab : allVocab;
    return pool.slice(0, 20).map((target, idx) => {
      const distractors = allVocab
        .filter((other) => other.id !== target.id)
        .slice((idx * 3) % Math.max(1, allVocab.length - 4), ((idx * 3) % Math.max(1, allVocab.length - 4)) + 3);
      const options = [target, ...distractors].sort((a, b) => a.word.localeCompare(b.word));
      return {
        target,
        options,
        correctIdx: options.findIndex((o) => o.id === target.id),
      };
    });
  }, [filteredVocab, allVocab]);

  const currentQuiz = quizItems[quizIndex % Math.max(1, quizItems.length)];

  const handleOpenLinkedSituation = (sitId: string) => {
    if (sitId.startsWith('P1-')) {
      onOpenSituation('part1', sitId);
    } else if (sitId.startsWith('P2-')) {
      onOpenSituation('part2', sitId);
    } else {
      const sit = allSituations.find((s) => s.id === sitId);
      if (sit) onOpenSituation(sit.part, sit.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">
              Module 8 · Học từ vựng theo ngữ cảnh giáo trình ({allVocab.length} mục từ vựng chuẩn)
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              Vocabulary Master — Từ Vựng Ngữ Cảnh TOEIC
            </h1>
            <p className="text-sm text-slate-600">
              Học từ theo tình huống thật, đồng nghĩa, cặp từ dễ nhầm, cụm collocation và đánh dấu vào lịch ôn SM-2.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 shrink-0">
            {[
              { id: 'library', label: 'Kho từ vựng' },
              { id: 'flashcard', label: 'Flashcard 2 chiều' },
              { id: 'pairs', label: 'Đồng nghĩa & Dễ nhầm' },
              { id: 'check', label: 'Kiểm tra từ vựng' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubTab(t.id as typeof subTab)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  subTab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm từ tiếng Anh, nghĩa Việt, đồng nghĩa..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <select
            value={partFilter}
            onChange={(e) => setPartFilter(e.target.value as ToeicPart | 'all')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:outline-none"
          >
            <option value="all">Tất cả Part (1, 2, 3, 4, 6, 7)</option>
            <option value="part1">Part 1 — Photographs</option>
            <option value="part2">Part 2 — Question-Response</option>
            <option value="part3">Part 3 — Conversations</option>
            <option value="part4">Part 4 — Short Talks</option>
            <option value="part6">Part 6 — Text Completion</option>
            <option value="part7">Part 7 — Reading Comprehension</option>
          </select>

          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:outline-none"
          >
            <option value="all">Tất cả chủ đề xương sống</option>
            <option value="Part 1 – Photographs">Part 1 – Photographs</option>
            <option value="Part 2 – Question-Response">Part 2 – Question-Response</option>
            {BACKBONE_TOPICS.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:outline-none"
          >
            <option value="all">Mọi trạng thái SM-2</option>
            <option value="unlearned">Chưa học</option>
            <option value="learning">Đang học</option>
            <option value="needs_review">Cần ôn lại</option>
            <option value="mastered">Đã ghi nhớ</option>
            <option value="hard">Đánh dấu Từ khó ★</option>
          </select>
        </div>
      </div>

      {/* Sub-tab 1: Library */}
      {subTab === 'library' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Danh sách từ ({filteredVocab.length}/{allVocab.length})
              </span>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-xs font-medium text-blue-700 hover:underline"
                >
                  Xóa lọc
                </button>
              )}
            </div>
            <div className="max-h-[620px] overflow-y-auto divide-y divide-slate-100">
              {filteredVocab.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  Không tìm thấy từ vựng phù hợp bộ lọc.
                </div>
              ) : (
                filteredVocab.map((item) => {
                  const st = getStatus(item.id);
                  const isHard = store.reviewCards[item.id]?.isHard;
                  const selected = activeWord?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedVocabId(item.id)}
                      className={`w-full px-4 py-3 text-left transition-colors flex items-start justify-between gap-3 ${
                        selected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900 truncate">
                            {item.word}
                          </span>
                          {isHard && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-600 truncate">{item.viMeaning}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.relatedParts.map((p) => p.toUpperCase()).join(' · ')}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-medium shrink-0 ${
                          st === 'mastered'
                            ? 'text-emerald-700'
                            : st === 'needs_review'
                            ? 'text-rose-700'
                            : st === 'learning'
                            ? 'text-blue-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {STATUS_LABELS[st]}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            {activeWord ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <span>{activeWord.origin === 'curriculum' ? 'Từ vựng giáo trình gốc' : 'Từ vựng mở rộng'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeWord.partOfSpeech}</span>
                      {activeWord.ipa && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num">{activeWord.ipa}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{activeWord.word}</h2>
                    <p className="text-base font-medium text-blue-800">{activeWord.viMeaning}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => speakLines([activeWord.word], store.settings.audioSpeed)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Volume2 className="h-4 w-4 text-blue-700" />
                      <span>Nghe phát âm</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleHard(activeWord.id, 'vocab')}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                        store.reviewCards[activeWord.id]?.isHard
                          ? 'border-amber-300 bg-amber-50 text-amber-800'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          store.reviewCards[activeWord.id]?.isHard
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-400'
                        }`}
                      />
                      <span>
                        {store.reviewCards[activeWord.id]?.isHard ? 'Đã đánh dấu từ khó' : 'Đánh dấu từ khó'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Đồng nghĩa / Diễn đạt lại
                    </p>
                    {activeWord.synonyms.length > 0 ? (
                      <p className="text-sm text-slate-800">{activeWord.synonyms.join(' · ')}</p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Chưa liệt kê từ đồng nghĩa trong mục giáo trình gốc
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Trái nghĩa / Cặp dễ nhầm
                    </p>
                    {activeWord.antonyms.length > 0 || activeWord.confusingPairs.length > 0 ? (
                      <p className="text-sm text-rose-800">
                        {[...activeWord.antonyms, ...activeWord.confusingPairs].join(' · ')}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Không có cặp dễ nhầm kèm theo</p>
                    )}
                  </div>
                </div>

                {activeWord.collocations.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Cụm từ cố định (Collocations)
                    </p>
                    <p className="text-sm text-slate-800">{activeWord.collocations.join('  ·  ')}</p>
                  </div>
                )}

                <div className="space-y-2 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Ví dụ ngữ cảnh & Ghi chú
                  </p>
                  {activeWord.examples.length > 0 ? (
                    <ul className="space-y-1.5 text-sm text-slate-800">
                      {activeWord.examples.map((ex, i) => (
                        <li key={i} className="flex items-start justify-between gap-2">
                          <span>“{ex}”</span>
                          <button
                            type="button"
                            onClick={() => speakLines([ex], store.settings.audioSpeed)}
                            className="text-xs text-blue-700 hover:underline shrink-0"
                          >
                            Đọc câu
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Từ khóa rút trực tiếp từ danh sách từ vựng tình huống giáo trình (chưa có câu ví dụ riêng trong PDF gốc).
                    </p>
                  )}
                  <p className="text-xs text-slate-500 pt-1">{activeWord.viExplanation}</p>
                </div>

                {/* Linked Situations */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Xuất hiện trong tình huống ({activeWord.relatedSituationIds.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeWord.relatedSituationIds.slice(0, 8).map((sid) => {
                      const sit = allSituations.find((s) => s.id === sid);
                      return (
                        <button
                          key={sid}
                          type="button"
                          onClick={() => handleOpenLinkedSituation(sid)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-600 hover:text-blue-700"
                        >
                          <span>{sit ? `${sid}: ${sit.title}` : sid}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SM-2 Quick Evaluation & AI Tutor */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 mr-1">Đánh dấu SM-2:</span>
                    {(
                      [
                        { id: 'forgot', label: 'Quên', cls: 'border-rose-200 text-rose-700 hover:bg-rose-50' },
                        { id: 'hard', label: 'Khó nhớ', cls: 'border-amber-200 text-amber-800 hover:bg-amber-50' },
                        { id: 'good', label: 'Nhớ được', cls: 'border-blue-200 text-blue-700 hover:bg-blue-50' },
                        { id: 'easy', label: 'Rất dễ', cls: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' },
                      ] as const
                    ).map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => onRateCard(activeWord.id, 'vocab', btn.id)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${btn.cls}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onAskAiVocab(activeWord.word)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Hỏi AI Tutor mở rộng từ này</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Two-way Flashcard */}
      {subTab === 'flashcard' && activeWord && (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium text-slate-500 font-mono-num">
              Thẻ {flashcardIdx + 1} / {flashcardPool.length} · Trạng thái: {STATUS_LABELS[getStatus(activeWord.id)]}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCardDirection((d) => (d === 'en_vi' ? 'vi_en' : 'en_vi'));
                  setFlipped(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <FlipHorizontal className="h-3.5 w-3.5" />
                <span>Chiều thẻ: {cardDirection === 'en_vi' ? 'Anh → Việt' : 'Việt → Anh'}</span>
              </button>
            </div>
          </div>

          <div
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setFlipped((f) => !f);
            }}
            className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-8 md:p-12 min-h-[280px] flex flex-col items-center justify-center text-center space-y-4 transition-colors hover:border-blue-400"
          >
            {!flipped ? (
              <>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  {cardDirection === 'en_vi' ? 'Mặt trước (Tiếng Anh)' : 'Mặt trước (Nghĩa tiếng Việt)'}
                </p>
                <h2 className="text-3xl font-bold text-slate-900">
                  {cardDirection === 'en_vi' ? activeWord.word : activeWord.viMeaning}
                </h2>
                {cardDirection === 'en_vi' && activeWord.ipa && (
                  <p className="text-sm text-slate-500 font-mono-num">{activeWord.ipa}</p>
                )}
                <p className="text-xs text-blue-700 font-medium pt-4">Nhấn vào thẻ để lật xem đáp án</p>
              </>
            ) : (
              <>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Mặt sau (Chi tiết ngữ cảnh)
                </p>
                <h2 className="text-2xl font-bold text-blue-800">
                  {cardDirection === 'en_vi' ? activeWord.viMeaning : activeWord.word}
                </h2>
                {activeWord.synonyms.length > 0 && (
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Đồng nghĩa:</span> {activeWord.synonyms.join(', ')}
                  </p>
                )}
                {activeWord.examples[0] && (
                  <p className="text-sm text-slate-600 italic">“{activeWord.examples[0]}”</p>
                )}
                <p className="text-xs text-slate-500">Chủ đề: {activeWord.backboneTopic}</p>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNextCard(-1)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Thẻ trước
              </button>
              <button
                type="button"
                onClick={() => speakLines([activeWord.word], store.settings.audioSpeed)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Volume2 className="h-4 w-4 text-blue-700" />
                <span>Phát âm</span>
              </button>
              <button
                type="button"
                onClick={() => handleNextCard(1)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Thẻ tiếp
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'forgot', label: 'Quên', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
                  { id: 'hard', label: 'Khó', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
                  { id: 'good', label: 'Nhớ', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
                  { id: 'easy', label: 'Dễ', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                ] as const
              ).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    onRateCard(activeWord.id, 'vocab', r.id);
                    handleNextCard(1);
                  }}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${r.cls}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Synonyms, Confusing Pairs & Priority Collocations */}
      {subTab === 'pairs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-700" />
              <h2 className="text-lg font-semibold text-slate-900">
                Cặp từ dễ nhầm & Paraphrase trọng tâm (Giáo trình)
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Giới từ vị trí dễ nhầm Part 1
                </p>
                <p className="text-sm text-slate-800">{PART1_CONFUSING_PREPOSITIONS.join('  ·  ')}</p>
              </div>

              {BACKBONE_TOPICS.filter((t) => t.confusingPairs || t.paraphrases).map((t) => (
                <div key={t.id} className="border-t border-slate-100 pt-3 space-y-1.5">
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  {t.confusingPairs && (
                    <p className="text-xs text-rose-800">
                      <span className="font-semibold">Dễ nhầm:</span> {t.confusingPairs.join(' · ')}
                    </p>
                  )}
                  {t.paraphrases && (
                    <ul className="text-xs text-slate-700 space-y-1">
                      {t.paraphrases.map((p, idx) => (
                        <li key={idx}>• {p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Cụm Collocation ưu tiên Part 6 & Part 7
            </h2>
            <p className="text-xs text-slate-500">
              Tổng hợp theo Tài liệu bổ sung TOEIC trang 13 — bấm biểu tượng loa để nghe cụm từ.
            </p>
            <div className="divide-y divide-slate-100">
              {PRIORITY_COLLOCATIONS.map((col, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-800">{col}</span>
                  <button
                    type="button"
                    onClick={() => speakLines([col], store.settings.audioSpeed)}
                    className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Nghe</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Vocab Quick Check */}
      {subTab === 'check' && currentQuiz && (
        <div className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              Kiểm tra nhanh từ vựng ngữ cảnh · Câu {(quizIndex % quizItems.length) + 1}/{quizItems.length}
            </p>
            <button
              type="button"
              onClick={() => speakLines([currentQuiz.target.word], store.settings.audioSpeed)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
            >
              <Volume2 className="h-3.5 w-3.5" />
              <span>Nghe từ</span>
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">{currentQuiz.target.word}</h2>
            <p className="text-xs text-slate-500">
              Chủ đề: {currentQuiz.target.backboneTopic} · {currentQuiz.target.partOfSpeech}
            </p>
          </div>

          <div className="space-y-2.5">
            {currentQuiz.options.map((opt, idx) => {
              const answered = quizChoice !== null;
              const isSelected = quizChoice === idx;
              const isCorrect = idx === currentQuiz.correctIdx;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={answered}
                  onClick={() => {
                    setQuizChoice(idx);
                    onRateCard(currentQuiz.target.id, 'vocab', isCorrect ? 'good' : 'forgot');
                  }}
                  className={`w-full rounded-lg border p-3.5 text-left text-sm flex items-center justify-between gap-3 transition-colors ${
                    answered
                      ? isCorrect
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                        : isSelected
                        ? 'border-rose-500 bg-rose-50 text-rose-950'
                        : 'border-slate-200 text-slate-500'
                      : 'border-slate-200 hover:border-blue-600 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span>{opt.viMeaning}</span>
                  {answered && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />}
                  {answered && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-rose-700 shrink-0" />}
                </button>
              );
            })}
          </div>

          {quizChoice !== null && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-600">
                {quizChoice === currentQuiz.correctIdx
                  ? 'Chính xác! Đã cập nhật lịch ôn SM-2.'
                  : `Đáp án đúng là: "${currentQuiz.target.viMeaning}". Đã đưa vào nhóm cần ôn lại.`}
              </span>
              <button
                type="button"
                onClick={() => {
                  setQuizChoice(null);
                  setQuizIndex((i) => i + 1);
                }}
                className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800"
              >
                Câu tiếp theo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
