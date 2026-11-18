import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Image as ImageIcon, Volume2, XCircle } from 'lucide-react';
import {
  PART1_ACTION_VERBS,
  PART1_CONFUSING_PREPOSITIONS,
  PART1_CORE_STRATEGY,
  PART1_PREPOSITIONS,
  PART1_SCENE_GROUPS,
} from '../data/part1And2';
import { PART1_PRACTICE_QUESTIONS } from '../data/practiceBank';
import type { UserStoreState } from '../types/toeic';
import { AudioPlayerBar } from './AudioPlayerBar';

interface Part1ViewProps {
  store: UserStoreState;
  onSaveProgress: (situationId: string, step: number, completed: boolean) => void;
  onSpeedChange: (speed: number) => void;
  onAskAi: (situationId: string, prompt: string) => void;
}

export function Part1View({ store, onSaveProgress, onSpeedChange, onAskAi }: Part1ViewProps) {
  const [selectedSceneId, setSelectedSceneId] = useState(PART1_SCENE_GROUPS[0].id);
  const [subTab, setSubTab] = useState<'lesson' | 'prepositions' | 'practice'>('lesson');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  const activeScene =
    PART1_SCENE_GROUPS.find((s) => s.id === selectedSceneId) || PART1_SCENE_GROUPS[0];
  const sceneQuestions = PART1_PRACTICE_QUESTIONS.filter((q) => q.situationId === activeScene.id);
  const isCompleted = store.situationProgress[activeScene.id]?.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Header & Strategy Summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">
              Module 2 · Tài liệu bổ sung Part 1 (Giáo trình gốc)
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Part 1 — Photographs (5 Nhóm Cảnh)</h1>
            <p className="text-sm text-slate-600">{PART1_CORE_STRATEGY.summary}</p>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 shrink-0">
            <button
              type="button"
              onClick={() => setSubTab('lesson')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                subTab === 'lesson' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5 Nhóm cảnh
            </button>
            <button
              type="button"
              onClick={() => setSubTab('prepositions')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                subTab === 'prepositions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              12 Giới từ & Bẫy
            </button>
            <button
              type="button"
              onClick={() => setSubTab('practice')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                subTab === 'practice' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Luyện nhìn hình
            </button>
          </div>
        </div>

        {/* Scene Group Selector */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {PART1_SCENE_GROUPS.map((scene) => {
            const done = store.situationProgress[scene.id]?.status === 'completed';
            const active = scene.id === activeScene.id;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => setSelectedSceneId(scene.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? 'border-blue-700 bg-blue-700 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="font-mono-num">0{scene.order}.</span>
                <span>{scene.title}</span>
                {done && <CheckCircle2 className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-emerald-600'}`} />}
              </button>
            );
          })}
        </div>
      </div>

      {subTab === 'lesson' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Scene Visual & Context */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
              {!imgError[activeScene.id] ? (
                <img
                  src={activeScene.imageUrl}
                  alt={activeScene.title}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError((prev) => ({ ...prev, [activeScene.id]: true }))}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-slate-500">
                  <ImageIcon className="h-10 w-10 text-slate-400" />
                  <p className="text-sm font-medium">{activeScene.title}</p>
                </div>
              )}
            </div>
            <div className="p-5 space-y-3">
              <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Lưu ý minh bạch: {activeScene.imageNotice}
              </p>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{activeScene.title}</h2>
                <p className="text-sm text-slate-600 mt-0.5">{activeScene.subtitle}</p>
              </div>
              <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 space-y-1.5">
                <p>
                  <strong className="text-slate-700">Mẹo quan sát:</strong> {activeScene.actionTips}
                </p>
                <p>
                  <strong className="text-slate-700">Nguồn:</strong> {activeScene.sourceReference}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onSaveProgress(activeScene.id, 7, !isCompleted)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-blue-700 text-white hover:bg-blue-800'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isCompleted ? 'Đã hoàn thành nhóm cảnh' : 'Đánh dấu đã học nhóm cảnh'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubTab('practice')}
                  className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Luyện câu hỏi cảnh này
                </button>
              </div>
            </div>
          </div>

          {/* Right: Keywords, Synonyms, Confusing Pairs, Traps */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Từ khóa trọng tâm & Diễn đạt tương đương
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    onAskAi(
                      activeScene.id,
                      `Giải thích sâu các động từ hành động và bẫy trong nhóm cảnh Part 1 "${activeScene.title}".`
                    )
                  }
                  className="text-xs font-semibold text-blue-700 hover:underline"
                >
                  Hỏi AI Tutor thêm
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {activeScene.keywords.map((kw) => (
                  <div key={kw.word} className="py-3 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900">
                        {kw.word}{' '}
                        <span className="font-normal text-slate-600">— {kw.meaning}</span>
                      </p>
                      {kw.antonyms && kw.antonyms.length > 0 && (
                        <span className="text-xs text-rose-700 font-medium">
                          Trái nghĩa: {kw.antonyms.join(', ')}
                        </span>
                      )}
                    </div>
                    {kw.synonyms && kw.synonyms.length > 0 && (
                      <p className="text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Đồng nghĩa:</span>{' '}
                        {kw.synonyms.join(', ')}
                      </p>
                    )}
                    {kw.example && (
                      <p className="text-xs text-slate-700 italic">Ví dụ: “{kw.example}”</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2.5">
                <h4 className="text-sm font-bold text-slate-900">Cặp từ dễ nhầm</h4>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {activeScene.confusingPairs.map((pair) => (
                    <li key={pair} className="font-mono-num text-xs bg-slate-50 rounded-md px-2.5 py-1.5">
                      {pair}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2.5">
                <h4 className="text-sm font-bold text-slate-900 inline-flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Bẫy thường gặp</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                  {activeScene.traps.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'prepositions' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">12 Giới từ vị trí quan trọng (Prepositions of Place)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                    <th className="py-2.5 pr-4">Giới từ</th>
                    <th className="py-2.5 pr-4">Nghĩa tiếng Việt</th>
                    <th className="py-2.5">Câu ví dụ trong giáo trình</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PART1_PREPOSITIONS.map((p) => (
                    <tr key={p.preposition} className="hover:bg-slate-50/60">
                      <td className="py-2.5 pr-4 font-semibold text-blue-800 whitespace-nowrap">
                        {p.preposition}
                      </td>
                      <td className="py-2.5 pr-4 text-slate-700">{p.meaning}</td>
                      <td className="py-2.5 text-slate-600 italic">{p.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-700">
              <span className="font-semibold">Cặp dễ nhầm vị trí: </span>
              {PART1_CONFUSING_PREPOSITIONS.join(' · ')}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Động từ hành động mở rộng sâu (Phần A giáo trình)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PART1_ACTION_VERBS.map((v) => (
                <div key={`${v.group}-${v.verb}`} className="rounded-lg border border-slate-200 p-3.5 space-y-1">
                  <p className="text-xs text-slate-500">{v.group}</p>
                  <p className="text-sm font-bold text-slate-900">
                    {v.verb} <span className="font-normal text-slate-600">({v.meaning})</span>
                  </p>
                  {v.synonyms.length > 0 && (
                    <p className="text-xs text-slate-600">Đồng nghĩa: {v.synonyms.join(', ')}</p>
                  )}
                  <p className="text-xs text-slate-700 italic">{v.example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subTab === 'practice' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-700">
              Đang luyện tập cảnh: <span className="font-bold text-slate-900">{activeScene.title}</span>
              {' · '}
              <span className="text-xs text-slate-500">Nội dung luyện tập mở rộng</span>
            </p>
            <span className="text-xs text-slate-500">
              Chiến lược: Quan sát Ai / Làm gì / Vị trí trước khi nhấn Phát Audio
            </span>
          </div>

          {sceneQuestions.map((q) => {
            const selected = answers[q.id];
            const answered = selected !== undefined;
            return (
              <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 space-y-2">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={q.imageUrl || activeScene.imageUrl}
                        alt={q.prompt}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Ảnh minh họa tình huống luyện tập (không phải ảnh đề thi ETS).
                    </p>
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    {q.audioScript && (
                      <AudioPlayerBar
                        lines={q.audioScript}
                        speed={store.settings.audioSpeed}
                        onSpeedChange={onSpeedChange}
                        title={`Nghe 4 câu mô tả (A, B, C, D) — ${q.questionType}`}
                      />
                    )}

                    <p className="text-sm font-semibold text-slate-900">{q.prompt}</p>

                    <div className="space-y-2">
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
                              if (idx === q.correctIndex) {
                                onSaveProgress(activeScene.id, 7, true);
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
                        <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <Volume2 className="h-4 w-4 text-blue-700" />
                          <span>Giải thích đáp án</span>
                        </p>
                        <p className="text-slate-700">{q.explanation}</p>
                        <p className="text-xs text-slate-600">
                          <strong className="text-slate-800">Phân tích bẫy:</strong> {q.trapAnalysis}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
