import { useEffect, useState } from 'react';
import { AlertCircle, Send, Sparkles } from 'lucide-react';
import { ALL_220_SITUATIONS } from '../data/curriculumIndex';
import { VOCABULARY_BANK } from '../data/vocabulary';
import { api } from '../services/api';
import type { UserStoreState } from '../types/toeic';

interface AiTutorViewProps {
  store: UserStoreState;
  initialSituationId?: string;
  initialVocabWord?: string;
  initialPrompt?: string;
}

interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
}

export function AiTutorView({
  store,
  initialSituationId,
  initialVocabWord,
  initialPrompt,
}: AiTutorViewProps) {
  const allSituations = [...ALL_220_SITUATIONS, ...store.customSituations];
  const allVocab = [...VOCABULARY_BANK, ...store.customVocab];

  const [selectedSituationId, setSelectedSituationId] = useState(
    initialSituationId || store.user.lastSituationId || 'P3-01'
  );
  const [selectedVocab, setSelectedVocab] = useState(initialVocabWord || '');
  const [promptInput, setPromptInput] = useState(initialPrompt || '');
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialSituationId) setSelectedSituationId(initialSituationId);
  }, [initialSituationId]);

  useEffect(() => {
    if (initialVocabWord) setSelectedVocab(initialVocabWord);
  }, [initialVocabWord]);

  useEffect(() => {
    if (initialPrompt) setPromptInput(initialPrompt);
  }, [initialPrompt]);

  const sendRequest = async (
    mode: 'explain_vocab' | 'analyze_trap' | 'generate_practice' | 'study_advice' | 'free_qa',
    customPrompt?: string
  ) => {
    if (loading) return;
    const textLabel =
      customPrompt ||
      (mode === 'explain_vocab'
        ? `Giải thích từ "${selectedVocab || 'reservation'}" trong ngữ cảnh TOEIC`
        : mode === 'analyze_trap'
        ? `Phân tích bẫy thường gặp của tình huống ${selectedSituationId}`
        : mode === 'generate_practice'
        ? `Tạo câu hỏi luyện tập mới cho tình huống ${selectedSituationId}`
        : 'Đề xuất lộ trình ôn tập hôm nay dựa trên tiến độ thực tế');

    setMessages((prev) => [...prev, { id: `U-${Date.now()}`, role: 'user', content: textLabel }]);
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.askAiTutor({
        mode,
        prompt: customPrompt,
        situationId: selectedSituationId || undefined,
        vocabWord: selectedVocab || undefined,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `A-${Date.now()}`,
          role: 'assistant',
          content: res.answer,
          model: res.model,
        },
      ]);
      if (customPrompt) setPromptInput('');
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể kết nối tới AI Tutor. Vui lòng kiểm tra GEMINI_API_KEY.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-blue-700">
          <Sparkles className="h-4 w-4" />
          <span>Module 12 · Gia sư AI phân tách rõ Giáo trình gốc vs Nội dung AI biên soạn</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">AI Tutor — Gia Sư TOEIC Thông Minh</h1>
        <p className="text-sm text-slate-600">
          Kết nối Gemini qua API máy chủ bảo mật. Mọi phần giải thích mở rộng và câu hỏi tạo mới đều được đánh dấu tách biệt với dữ liệu trích từ giáo trình.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4 h-fit">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Ngữ cảnh tình huống (220 tình huống)
            </label>
            <select
              value={selectedSituationId}
              onChange={(e) => setSelectedSituationId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            >
              {allSituations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} · {s.part.toUpperCase()} — {s.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Từ vựng trọng tâm (tùy chọn)
            </label>
            <select
              value={selectedVocab}
              onChange={(e) => setSelectedVocab(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            >
              <option value="">-- Không chọn từ cụ thể --</option>
              {allVocab.map((v) => (
                <option key={v.id} value={v.word}>
                  {v.word} ({v.viMeaning})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <p className="text-xs font-semibold text-slate-500">Tác vụ nhanh</p>
            <button
              type="button"
              disabled={loading}
              onClick={() => sendRequest('explain_vocab')}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-50"
            >
              1. Giải thích từ vựng theo ngữ cảnh
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => sendRequest('analyze_trap')}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-50"
            >
              2. Phân tích bẫy & tín hiệu paraphrase
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => sendRequest('generate_practice')}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-50"
            >
              3. Tạo câu hỏi luyện tập mới (AI)
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => sendRequest('study_advice')}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-50"
            >
              4. Đề xuất kế hoạch ôn từ tiến độ thật
            </button>
          </div>
        </div>

        {/* Chat / Output Area */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white flex flex-col min-h-[520px]">
          <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[540px]">
            {messages.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center space-y-2">
                <p className="text-sm font-medium text-slate-800">
                  Chọn một tác vụ nhanh ở cột trái hoặc nhập câu hỏi của bạn bên dưới.
                </p>
                <p className="text-xs text-slate-500">
                  Ví dụ: “Phân biệt deadline và milestone trong Part 3”, “Cho 2 câu bẫy về cancel vs postpone”.
                </p>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-xl p-4 text-sm leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-blue-700 text-white ml-8'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 mr-4'
                }`}
              >
                {m.role === 'assistant' && (
                  <p className="text-[11px] font-semibold text-blue-700 mb-1.5">
                    Gia sư AI · Nội dung mở rộng tham khảo (phân tách với giáo trình gốc)
                  </p>
                )}
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-500">
                Đang phân tích ngữ cảnh giáo trình và soạn câu trả lời...
              </div>
            )}

            {errorMsg && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-2.5 text-sm text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Không thể gọi AI Tutor</p>
                  <p className="text-xs mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!promptInput.trim()) return;
              sendRequest('free_qa', promptInput.trim());
            }}
            className="border-t border-slate-200 p-4 flex items-center gap-3"
          >
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Nhập câu hỏi TOEIC bất kỳ (ví dụ: Giải thích bẫy gián tiếp ở câu hỏi When)..."
              className="flex-1 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !promptInput.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 shrink-0"
            >
              <Send className="h-4 w-4" />
              <span>Gửi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
