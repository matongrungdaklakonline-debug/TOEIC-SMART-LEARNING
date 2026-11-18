import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { AlertTriangle, CheckCircle2, Flame, RotateCw } from 'lucide-react';
import { ALL_220_SITUATIONS } from '../data/curriculumIndex';
import type { ToeicPart, UserStoreState } from '../types/toeic';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

interface ProgressTrackerViewProps {
  store: UserStoreState;
  onResolveMistake: (mistakeId: string) => void;
  onOpenSituation: (part: ToeicPart, situationId: string) => void;
  onStartQuiz: () => void;
}

const PARTS_ORDER: ToeicPart[] = ['part1', 'part2', 'part3', 'part4', 'part6', 'part7'];

export function ProgressTrackerView({
  store,
  onResolveMistake,
  onOpenSituation,
  onStartQuiz,
}: ProgressTrackerViewProps) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const barCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const barChartRef = useRef<Chart | null>(null);
  const lineChartRef = useRef<Chart | null>(null);

  const allSituations = useMemo(
    () => [...ALL_220_SITUATIONS, ...store.customSituations],
    [store.customSituations]
  );

  // Compute accuracy per part from quizAttempts
  const partMetrics = useMemo(() => {
    const map: Record<ToeicPart, { total: number; correct: number }> = {
      part1: { total: 0, correct: 0 },
      part2: { total: 0, correct: 0 },
      part3: { total: 0, correct: 0 },
      part4: { total: 0, correct: 0 },
      part6: { total: 0, correct: 0 },
      part7: { total: 0, correct: 0 },
    };
    for (const att of store.quizAttempts) {
      for (const [p, v] of Object.entries(att.breakdownByPart)) {
        if (p in map) {
          map[p as ToeicPart].total += v.total;
          map[p as ToeicPart].correct += v.correct;
        }
      }
    }
    return PARTS_ORDER.map((p) => {
      const m = map[p];
      const acc = m.total > 0 ? Math.round((m.correct / m.total) * 100) : 0;
      return { part: p, total: m.total, correct: m.correct, acc };
    });
  }, [store.quizAttempts]);

  // Compute time-series score progress by Day / Week / Month
  const timelineSeries = useMemo(() => {
    if (store.quizAttempts.length === 0) {
      return { labels: ['Chưa có dữ liệu'], scores: [0] };
    }
    const grouped = new Map<string, { sum: number; count: number }>();
    const sorted = [...store.quizAttempts].reverse();
    for (const att of sorted) {
      const d = new Date(att.createdAt);
      let key = d.toLocaleDateString('vi-VN');
      if (period === 'week') {
        const start = new Date(d);
        start.setDate(d.getDate() - d.getDay());
        key = `Tuần ${start.toLocaleDateString('vi-VN')}`;
      } else if (period === 'month') {
        key = `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
      }
      const prev = grouped.get(key) ?? { sum: 0, count: 0 };
      prev.sum += att.scorePercent;
      prev.count += 1;
      grouped.set(key, prev);
    }
    return {
      labels: Array.from(grouped.keys()),
      scores: Array.from(grouped.values()).map((v) => Math.round(v.sum / v.count)),
    };
  }, [store.quizAttempts, period]);

  // Render Chart.js Bar Chart (Accuracy by Part)
  useEffect(() => {
    const canvas = barCanvasRef.current;
    if (!canvas) return;
    barChartRef.current?.destroy();
    barChartRef.current = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: partMetrics.map((m) => m.part.toUpperCase()),
        datasets: [
          {
            label: 'Tỷ lệ đúng (%)',
            data: partMetrics.map((m) => m.acc),
            backgroundColor: '#1d4ed8',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
    return () => {
      barChartRef.current?.destroy();
      barChartRef.current = null;
    };
  }, [partMetrics]);

  // Render Chart.js Line Chart (Performance over time)
  useEffect(() => {
    const canvas = lineCanvasRef.current;
    if (!canvas) return;
    lineChartRef.current?.destroy();
    lineChartRef.current = new Chart(canvas, {
      type: 'line',
      data: {
        labels: timelineSeries.labels,
        datasets: [
          {
            label: 'Điểm trung bình (%)',
            data: timelineSeries.scores,
            borderColor: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.12)',
            tension: 0.25,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
    return () => {
      lineChartRef.current?.destroy();
      lineChartRef.current = null;
    };
  }, [timelineSeries]);

  const completedSituationsCount = Object.values(store.situationProgress).filter(
    (p) => p.status === 'completed'
  ).length;
  const unresolvedMistakes = store.mistakes.filter((m) => !m.resolved);

  // Weak question types aggregated from mistakes
  const weakQuestionTypes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of unresolvedMistakes) {
      counts.set(m.questionType, (counts.get(m.questionType) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [unresolvedMistakes]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
        <p className="text-xs font-medium text-slate-500">
          Module 11 · Phân tích dữ liệu học tập thực tế & Sổ lỗi TOEIC
        </p>
        <h1 className="text-2xl font-bold text-slate-900">
          Progress Tracker — Tiến Độ & Điểm Yếu
        </h1>
        <p className="text-sm text-slate-600">
          Theo dõi độ chính xác theo 6 Part giáo trình (Part 1, 2, 3, 4, 6, 7), chuỗi ngày học và các câu làm sai cần khắc phục.
        </p>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <p className="text-xs text-slate-500">Số ngày đã học</p>
          <p className="text-2xl font-bold text-slate-900 font-mono-num">
            {store.user.studyHistoryDates.length} ngày
          </p>
          <p className="text-xs text-slate-500 inline-flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-600" />
            Streak {store.user.streakDays} ngày liên tục
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <p className="text-xs text-slate-500">Thời gian tích lũy</p>
          <p className="text-2xl font-bold text-slate-900 font-mono-num">
            {store.user.dailyStudyMinutes} phút
          </p>
          <p className="text-xs text-slate-500">Cập nhật tự động qua các phiên</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <p className="text-xs text-slate-500">Hoàn thành tình huống</p>
          <p className="text-2xl font-bold text-blue-700 font-mono-num">
            {completedSituationsCount}/{allSituations.length}
          </p>
          <p className="text-xs text-slate-500">
            {Math.round((completedSituationsCount / Math.max(1, allSituations.length)) * 100)}% lộ trình 220 tình huống
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <p className="text-xs text-slate-500">Câu lỗi chưa khắc phục</p>
          <p className="text-2xl font-bold text-rose-700 font-mono-num">{unresolvedMistakes.length}</p>
          <p className="text-xs text-slate-500">Từ {store.quizAttempts.length} bài kiểm tra</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Tỷ lệ trả lời đúng theo Part (%)</h2>
              <p className="text-xs text-slate-500">Dữ liệu tổng hợp từ các bài Quiz đã nộp</p>
            </div>
          </div>
          <div className="h-64">
            <canvas ref={barCanvasRef} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Biểu đồ điểm số theo thời gian</h2>
              <p className="text-xs text-slate-500">Theo dõi xu hướng cải thiện kết quả</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              {(
                [
                  { id: 'day', label: 'Ngày' },
                  { id: 'week', label: 'Tuần' },
                  { id: 'month', label: 'Tháng' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriod(p.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                    period === p.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <canvas ref={lineCanvasRef} />
          </div>
        </div>
      </div>

      {/* Weak Question Types & Mistake Notebook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Dạng câu hỏi cần cải thiện</h2>
          {weakQuestionTypes.length === 0 ? (
            <div className="space-y-3 text-sm text-slate-500">
              <p>Chưa ghi nhận dạng câu hỏi sai nào.</p>
              <button
                type="button"
                onClick={onStartQuiz}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Làm bài kiểm tra ngay</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {weakQuestionTypes.map(([qType, count]) => (
                <div key={qType} className="py-2.5 flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-800">{qType}</span>
                  <span className="text-xs font-bold text-rose-700 font-mono-num">{count} lỗi</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Sổ lỗi (Mistake Notebook · {unresolvedMistakes.length} câu chưa khắc phục)
            </h2>
          </div>

          {store.mistakes.length === 0 ? (
            <p className="text-sm text-slate-500">
              Chưa có lỗi sai nào được lưu. Khi làm bài ở Quiz Engine, mọi câu trả lời sai sẽ tự động xuất hiện tại đây kèm tình huống gốc.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
              {store.mistakes.map((m) => (
                <div key={m.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      {m.resolved ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                      )}
                      <span className="text-sm font-semibold text-slate-900">
                        {m.part.toUpperCase()} · {m.situationId} · {m.questionType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Nguyên nhân: {m.reasonCategory} · {new Date(m.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => onOpenSituation(m.part, m.situationId)}
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Xem lại bài
                    </button>
                    {!m.resolved && (
                      <button
                        type="button"
                        onClick={() => onResolveMistake(m.id)}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                      >
                        Đã khắc phục
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
