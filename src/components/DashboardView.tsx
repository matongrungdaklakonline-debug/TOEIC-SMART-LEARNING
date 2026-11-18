import { ArrowRight, BookOpen, CheckCircle2, Flame, Layers, RotateCw, Target } from 'lucide-react';
import { SIX_WEEK_ROADMAP } from '../data/part1And2';
import { ALL_220_SITUATIONS, CURRICULUM_STATS, SITUATION_BY_ID } from '../data/curriculumIndex';
import { VOCABULARY_BANK } from '../data/vocabulary';
import type { ToeicPart, UserStoreState } from '../types/toeic';
import { isDueForReview } from '../utils/sm2';

interface DashboardViewProps {
  store: UserStoreState;
  onNavigate: (tab: string, partFilter?: ToeicPart, situationId?: string) => void;
  onSelectRoadmapWeek: (week: number) => void;
}

export function DashboardView({ store, onNavigate, onSelectRoadmapWeek }: DashboardViewProps) {
  const allSituations = [...ALL_220_SITUATIONS, ...store.customSituations];
  const totalSituations = allSituations.length;
  const completedSituations = Object.values(store.situationProgress).filter(
    (p) => p.status === 'completed'
  ).length;
  const inProgressSituations = Object.values(store.situationProgress).filter(
    (p) => p.status === 'in_progress'
  ).length;
  const unlearnedSituations = Math.max(0, totalSituations - completedSituations);

  const allVocab = [...VOCABULARY_BANK, ...store.customVocab];
  const masteredVocab = Object.values(store.reviewCards).filter(
    (c) => c.targetType === 'vocab' && c.status === 'mastered'
  ).length;
  const dueTodayCount = allVocab.filter((v) => isDueForReview(store.reviewCards[v.id])).length;
  const needsReviewSituations = Object.values(store.reviewCards).filter(
    (c) => c.targetType === 'situation' && isDueForReview(c)
  ).length;

  const totalQuizQ = store.quizAttempts.reduce((acc, a) => acc + a.totalQuestions, 0);
  const totalQuizCorrect = store.quizAttempts.reduce((acc, a) => acc + a.correctCount, 0);
  const accuracyRate = totalQuizQ > 0 ? Math.round((totalQuizCorrect / totalQuizQ) * 100) : 0;

  const resumeId = store.user.lastSituationId || 'P3-01';
  const resumeSit = SITUATION_BY_ID[resumeId] || ALL_220_SITUATIONS[0];

  // Smart recommendation based on weakest part or first unlearned situation
  const unresolvedMistakes = store.mistakes.filter((m) => !m.resolved);
  const nextUnlearned =
    allSituations.find((s) => store.situationProgress[s.id]?.status !== 'completed') ||
    ALL_220_SITUATIONS[0];

  const recentProgressList = Object.values(store.situationProgress)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const partSummary: { part: ToeicPart; label: string; total: number; desc: string }[] = [
    { part: 'part1', label: 'Part 1 · Photographs', total: CURRICULUM_STATS.part1SceneGroups, desc: '5 nhóm cảnh & giới từ vị trí' },
    { part: 'part2', label: 'Part 2 · Question-Response', total: CURRICULUM_STATS.part2QuestionTypes, desc: '5 dạng câu hỏi & đáp án gián tiếp' },
    { part: 'part3', label: 'Part 3 · Conversations', total: 55, desc: '55 tình huống hội thoại công việc' },
    { part: 'part4', label: 'Part 4 · Short Talks', total: 55, desc: '55 tình huống bài nói ngắn' },
    { part: 'part6', label: 'Part 6 · Text Completion', total: 55, desc: '55 dạng văn bản điền từ & câu' },
    { part: 'part7', label: 'Part 7 · Reading Comprehension', total: 55, desc: '55 dạng tài liệu đọc đơn/kép/ba' },
  ];

  const completedToday = Object.values(store.situationProgress).filter(
    (p) => p.status === 'completed' && p.updatedAt.slice(0, 10) === new Date().toISOString().slice(0, 10)
  ).length;

  return (
    <div className="space-y-8">
      {/* Hero / Continue Learning Anchor */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span>6 học phần giáo trình (Part 1, 2, 3, 4, 6, 7)</span>
              <span aria-hidden="true">·</span>
              <span>220 tình huống trọng tâm</span>
              <span aria-hidden="true">·</span>
              <span>{allVocab.length} từ vựng ngữ cảnh</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Xin chào {store.user.name}, tiếp tục hành trình làm chủ ngữ cảnh TOEIC
            </h1>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Bài gần nhất:{' '}
              <span className="font-semibold text-slate-900">
                {resumeSit.part.toUpperCase()} #{resumeSit.order} — {resumeSit.title}
              </span>
              . Lưu ý: Giáo trình đầu vào không bao gồm Part 5 nên hệ thống chỉ tập trung vào 6 học phần chuẩn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate(resumeSit.part, resumeSit.part, resumeSit.id)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0"
            >
              <span>Tiếp tục học</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('quiz')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              <span>Kiểm tra nhanh</span>
            </button>
          </div>
        </div>
      </section>

      {/* Primary KPI Grid (Tabular Numerals) */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <p className="text-xs font-medium text-slate-500">Part đang học</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums font-mono-num">6</p>
          <p className="text-xs text-slate-500">Part 1, 2, 3, 4, 6, 7</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <p className="text-xs font-medium text-slate-500">Tổng tình huống</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums font-mono-num">{totalSituations}</p>
          <p className="text-xs text-slate-500">+10 nhóm Part 1 & 2</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <p className="text-xs font-medium text-slate-500">Đã hoàn thành</p>
          <p className="text-2xl font-bold text-emerald-700 tabular-nums font-mono-num">{completedSituations}</p>
          <p className="text-xs text-slate-500">
            Còn {unlearnedSituations} chưa xong ({inProgressSituations} đang học)
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <p className="text-xs font-medium text-slate-500">Từ vựng ghi nhớ</p>
          <p className="text-2xl font-bold text-blue-700 tabular-nums font-mono-num">
            {masteredVocab}/{allVocab.length}
          </p>
          <p className="text-xs text-slate-500">{dueTodayCount} từ cần ôn hôm nay</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <p className="text-xs font-medium text-slate-500">Tỷ lệ trả lời đúng</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums font-mono-num">
            {totalQuizQ > 0 ? `${accuracyRate}%` : '—'}
          </p>
          <p className="text-xs text-slate-500">
            {store.quizAttempts.length} lượt kiểm tra
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Chuỗi ngày học</p>
            <Flame className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums font-mono-num">
            {store.user.streakDays} ngày
          </p>
          <p className="text-xs text-slate-500">{store.user.dailyStudyMinutes} phút tích lũy</p>
        </div>
      </section>

      {/* Progress by Part + Smart Tasks & Next Recommendations */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Tiến độ theo từng Part</h2>
              <p className="text-sm text-slate-500">Nhấn vào từng học phần để mở bản đồ tình huống</p>
            </div>
            <span className="text-xs font-medium text-slate-500 tabular-nums">
              Tổng hoàn thành: {Math.round((completedSituations / Math.max(1, totalSituations)) * 100)}%
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {partSummary.map((item) => {
              const partDone =
                item.part === 'part1' || item.part === 'part2'
                  ? Object.values(store.situationProgress).filter(
                      (p) =>
                        p.situationId.startsWith(item.part === 'part1' ? 'P1-' : 'P2-') &&
                        p.status === 'completed'
                    ).length
                  : allSituations.filter(
                      (s) => s.part === item.part && store.situationProgress[s.id]?.status === 'completed'
                    ).length;

              const pct = Math.round((partDone / item.total) * 100);
              return (
                <button
                  key={item.part}
                  type="button"
                  onClick={() => onNavigate(item.part, item.part)}
                  className="w-full py-3.5 text-left transition-colors hover:bg-slate-50/80 px-2 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 sm:w-64 shrink-0">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-700 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 tabular-nums font-mono-num w-14 text-right">
                      {partDone}/{item.total}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Today's Tasks & Smart Recommendation */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Nhiệm vụ & Gợi ý hôm nay</h2>
            <p className="text-sm text-slate-500">Đề xuất dựa trên tiến độ và lỗi thực tế</p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-blue-700" />
                  Mục tiêu tình huống ngày
                </span>
                <span className="font-mono-num tabular-nums">
                  {completedToday}/{store.settings.dailyGoalSituations}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900">
                Tiếp theo: {nextUnlearned.part.toUpperCase()} #{nextUnlearned.order} — {nextUnlearned.title}
              </p>
              <button
                type="button"
                onClick={() => onNavigate(nextUnlearned.part, nextUnlearned.part, nextUnlearned.id)}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <span>Mở tình huống này</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <RotateCw className="h-3.5 w-3.5 text-amber-600" />
                  Ôn tập SM-2 đến hạn
                </span>
                <span className="font-mono-num tabular-nums">
                  {dueTodayCount} từ · {needsReviewSituations} tình huống
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {dueTodayCount > 0
                  ? 'Ôn lại các từ đến hạn để giữ tỷ lệ ghi nhớ dài hạn.'
                  : 'Hãy học thêm từ vựng ở module Từ vựng để đưa vào lịch ôn SM-2.'}
              </p>
              <button
                type="button"
                onClick={() => onNavigate('review')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <span>Vào phòng ôn tập SM-2</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-rose-600" />
                  Lỗi cần khắc phục
                </span>
                <span className="font-mono-num tabular-nums">{unresolvedMistakes.length} câu</span>
              </div>
              <p className="text-xs text-slate-600">
                {unresolvedMistakes.length > 0
                  ? `Bạn có ${unresolvedMistakes.length} câu làm sai chưa ôn lại trong Sổ lỗi.`
                  : 'Chưa có lỗi tồn đọng. Làm bài kiểm tra để phát hiện điểm yếu.'}
              </p>
              <button
                type="button"
                onClick={() => onNavigate('progress')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <span>Xem phân tích & Sổ lỗi</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent History & 6-Week Roadmap */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Lịch sử học gần đây</h2>
            <Layers className="h-4 w-4 text-slate-400" />
          </div>
          {recentProgressList.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center space-y-2">
              <p className="text-sm font-medium text-slate-700">Chưa có lịch sử học tình huống nào</p>
              <p className="text-xs text-slate-500">
                Bắt đầu với tình huống đầu tiên hoặc làm bài luyện tập Part 1 / Part 2 để ghi nhận tiến độ thật.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('part3', 'part3', 'P3-01')}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800"
              >
                <span>Học tình huống P3-01 ngay</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentProgressList.map((entry) => {
                const sit = allSituations.find((s) => s.id === entry.situationId);
                return (
                  <div key={entry.situationId} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {sit ? `${sit.part.toUpperCase()} #${sit.order} · ${sit.title}` : entry.situationId}
                      </p>
                      <p className="text-xs text-slate-500">
                        {entry.status === 'completed' ? 'Đã hoàn thành' : `Đang học (Bước ${entry.lastStep}/7)`}
                        {' · '}
                        {new Date(entry.updatedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        entry.status === 'completed' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {entry.status === 'completed' ? 'Xong' : 'Dở dang'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 6-Week Curriculum Roadmap */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Lộ trình 6 tuần (theo giáo trình)</h2>
              <p className="text-xs text-slate-500">Chọn tuần mục tiêu để chuyển nhanh sang học phần tương ứng</p>
            </div>
          </div>
          <div className="space-y-2">
            {SIX_WEEK_ROADMAP.map((wk) => {
              const active = store.settings.activeRoadmapWeek === wk.week;
              return (
                <div
                  key={wk.week}
                  className={`rounded-lg border p-3 flex items-start justify-between gap-3 transition-colors ${
                    active ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-900">{wk.title}</p>
                    <p className="text-xs text-slate-600">{wk.detail}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectRoadmapWeek(wk.week)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                        active ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {active ? 'Đang theo' : 'Chọn tuần'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate(wk.focusPart, wk.focusPart)}
                      className="text-xs font-semibold text-blue-700 hover:underline whitespace-nowrap"
                    >
                      Mở Part
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
