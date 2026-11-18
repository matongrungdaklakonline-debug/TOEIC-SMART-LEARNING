import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Sparkles, XCircle } from 'lucide-react';
import {
  PART2_CORE_STRATEGY,
  PART2_GOLDEN_PHRASES,
  PART2_QUESTION_TYPES,
} from '../data/part1And2';
import { PART2_PRACTICE_QUESTIONS } from '../data/practiceBank';
import type { UserStoreState } from '../types/toeic';
import { AudioPlayerBar } from './AudioPlayerBar';

interface Part2ViewProps {
  store: UserStoreState;
  onSaveProgress: (situationId: string, step: number, completed: boolean) => void;
  onSpeedChange: (speed: number) => void;
  onAskAi: (situationId: string, prompt: string) => void;
}

export function Part2View({ store, onSaveProgress, onSpeedChange, onAskAi }: Part2ViewProps) {
  const [selectedTypeId, setSelectedTypeId] = useState(PART2_QUESTION_TYPES[0].id);
  const [subTab, setSubTab] = useState<'guide' | 'golden' | 'practice'>('guide');
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const activeType =
    PART2_QUESTION_TYPES.find((q) => q.id === selectedTypeId) || PART2_QUESTION_TYPES[0];
  const isCompleted = store.situationProgress[activeType.id]?.status === 'completed';

  const typeQuestions = PART2_PRACTICE_QUESTIONS.filter((q) => q.situationId === activeType.id);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">
              Module 3 · Tài liệu bổ sung Part 2 (Giáo trình gốc)
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              Part 2 — Question-Response (5 Dạng Câu Hỏi)
            </h1>
            <p className="text-sm text-slate-600">{PART2_CORE_STRATEGY.summary}</p>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 shrink-0">
            <button
              type="button"
              onClick={() => setSubTab('guide')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                subTab === 'guide' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5 Dạng câu hỏi
            </button>
            <button
              type="button"
              onClick={() => setSubTab('golden')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                subTab === 'golden' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cụm đáp án vàng
            </button>
            <button
              type="button"
              onClick={() => setSubTab('practice')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                subTab === 'practice' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Luyện nghe hỏi–đáp
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {PART2_QUESTION_TYPES.map((t) => {
            const done = store.situationProgress[t.id]?.status === 'completed';
            const active = t.id === activeType.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTypeId(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? 'border-blue-700 bg-blue-700 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="font-mono-num">0{t.order}.</span>
                <span>{t.title.split('(')[0].trim()}</span>
                {done && <CheckCircle2 className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-emerald-600'}`} />}
              </button>
            );
          })}
        </div>
      </div>

      {subTab === 'guide' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">{activeType.title}</h2>
              <p className="text-xs text-slate-500">{activeType.sourceReference}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-500">Từ mở đầu nhận diện</h3>
              <p className="text-sm font-mono-num text-blue-800 bg-blue-50/70 rounded-lg p-3">
                {activeType.starters.join(' · ')}
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-slate-500">Cách nhận diện & dự đoán</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{activeType.identificationGuide}</p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-slate-500">Dạng câu trả lời có thể xuất hiện</h3>
              <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4">
                {activeType.expectedAnswerForms.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>Bẫy thường gặp</span>
              </h3>
              <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
                {activeType.traps.map((trap) => (
                  <li key={trap}>{trap}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => onSaveProgress(activeType.id, 7, !isCompleted)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-blue-700 text-white hover:bg-blue-800'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isCompleted ? 'Đã hoàn thành dạng này' : 'Đánh dấu đã nắm vững'}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onAskAi(
                    activeType.id,
                    `Tạo thêm 2 ví dụ hỏi-đáp gián tiếp Part 2 thuộc dạng "${activeType.title}" và phân tích vì sao đáp án nhiễu sai.`
                  )
                }
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-700" />
                <span>Hỏi AI Tutor</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Ví dụ hỏi–đáp trực tiếp (Giáo trình gốc)
              </h3>
              <div className="divide-y divide-slate-100">
                {activeType.directExamples.map((ex) => (
                  <div key={ex.question} className="py-3 space-y-1">
                    <p className="text-sm font-semibold text-slate-900">Q: {ex.question}</p>
                    <p className="text-sm text-emerald-800">
                      A: {ex.answers.join(' / ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Ví dụ câu trả lời gián tiếp (Bẫy hay gặp trong đề thật)
              </h3>
              <div className="divide-y divide-slate-100">
                {activeType.indirectExamples.map((ex) => (
                  <div key={ex.question} className="py-3 space-y-1">
                    <p className="text-sm font-semibold text-slate-900">Q: {ex.question}</p>
                    <p className="text-sm text-blue-800 font-medium">A: {ex.answers.join(' / ')}</p>
                    {ex.note && <p className="text-xs text-slate-500">Ghi chú: {ex.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'golden' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Cụm đáp án “vàng” thường đúng trong Part 2</h2>
            <p className="text-sm text-slate-600">
              Trích nguyên bản từ Tài liệu bổ sung Part 2 — rất hay là đáp án đúng khi câu hỏi ở dạng gián tiếp.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PART2_GOLDEN_PHRASES.map((gp) => (
              <div key={gp.phrase} className="rounded-lg border border-slate-200 p-4 space-y-2">
                <p className="text-sm font-bold text-blue-800">{gp.phrase}</p>
                <p className="text-sm text-slate-800">{gp.meaning}</p>
                {gp.synonyms.length > 0 && (
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold">Tương đương:</span> {gp.synonyms.join(' · ')}
                  </p>
                )}
                <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">{gp.usageNote}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">3 câu tự hỏi khi nghe Part 2</h3>
            <ul className="text-xs text-slate-700 list-disc pl-4 space-y-1">
              {PART2_CORE_STRATEGY.selfQuestions.map((sq) => (
                <li key={sq}>{sq}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {subTab === 'practice' && (
        <div className="space-y-4">
          {typeQuestions.map((q) => {
            const selected = answers[q.id];
            const answered = selected !== undefined;
            return (
              <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-900">{q.questionType}</p>
                  <span className="text-xs text-slate-500">Bài luyện tập mở rộng</span>
                </div>

                {q.audioScript && (
                  <AudioPlayerBar
                    lines={q.audioScript}
                    speed={store.settings.audioSpeed}
                    onSpeedChange={onSpeedChange}
                    title="Nghe câu hỏi và 3 phản hồi (A, B, C)"
                  />
                )}

                <p className="text-sm font-medium text-slate-800">{q.prompt}</p>

                <div className="space-y-2">
                  {q.options.slice(0, 3).map((opt, idx) => {
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
                          if (idx === q.correctIndex) {
                            onSaveProgress(activeType.id, 7, true);
                          }
                        }}
                        className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors flex items-center justify-between gap-3 ${style}`}
                      >
                        <span>{opt}</span>
                        {answered && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                        {answered && isPicked && !isCorrect && <XCircle className="h-4 w-4 text-rose-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
                    <p className="font-semibold text-slate-900">Giải thích & Phân tích nhiễu</p>
                    <p className="text-slate-700">{q.explanation}</p>
                    <p className="text-xs text-slate-600">
                      <strong className="text-slate-800">Bẫy các đáp án sai:</strong> {q.trapAnalysis}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
