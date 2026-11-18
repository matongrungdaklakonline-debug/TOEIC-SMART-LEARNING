import { useState } from 'react';
import {
  CheckCircle2,
  Database,
  Download,
  Lock,
  Plus,
  SearchCheck,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { BACKBONE_TOPICS } from '../data/part1And2';
import { ALL_220_SITUATIONS } from '../data/curriculumIndex';
import { VOCABULARY_BANK } from '../data/vocabulary';
import { api } from '../services/api';
import type { PracticeQuestion, SituationItem, UserStoreState, VocabEntry } from '../types/toeic';

interface AdminPanelViewProps {
  store: UserStoreState;
  onStoreUpdate: (next: UserStoreState) => void;
  onSwitchToAdmin: () => void;
}

export function AdminPanelView({ store, onStoreUpdate, onSwitchToAdmin }: AdminPanelViewProps) {
  const [activeTab, setActiveTab] = useState<'situations' | 'questions' | 'vocab' | 'export'>('situations');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [duplicateReport, setDuplicateReport] = useState<{
    duplicateSituations: { key: string; ids: string[] }[];
    duplicateVocab: { key: string; ids: string[] }[];
  } | null>(null);

  // Add Situation form
  const [sitPart, setSitPart] = useState<'part3' | 'part4' | 'part6' | 'part7'>('part3');
  const [sitTitle, setSitTitle] = useState('');
  const [sitDesc, setSitDesc] = useState('');
  const [sitTopic, setSitTopic] = useState(BACKBONE_TOPICS[0].name);

  // Add Question form
  const [qPart, setQPart] = useState<PracticeQuestion['part']>('part3');
  const [qSitId, setQSitId] = useState('P3-01');
  const [qPrompt, setQPrompt] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrectIdx, setQCorrectIdx] = useState(0);

  // Add Vocab form
  const [vWord, setVWord] = useState('');
  const [vMeaning, setVMeaning] = useState('');
  const [vPos, setVPos] = useState('noun');
  const [vTopic, setVTopic] = useState(BACKBONE_TOPICS[0].name);

  // RBAC Enforcement in UI (server also enforces 403 on all /api/admin/*)
  if (store.user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto rounded-xl border border-slate-200 bg-white p-8 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
          <Lock className="h-6 w-6 text-slate-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">
          Khu vực Quản trị viên (Admin Panel) đang bị khóa
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Tài khoản hiện tại đang ở vai trò <strong>Học viên (Student)</strong>. Học viên chỉ được học tập, ôn luyện SM-2 và xem thống kê cá nhân; không có quyền chỉnh sửa giáo trình hoặc xuất dữ liệu hệ thống.
        </p>
        <button
          type="button"
          onClick={onSwitchToAdmin}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Chuyển sang quyền Admin để quản trị</span>
        </button>
      </div>
    );
  }

  const handleAddSituation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatusMessage(null);
    try {
      const res = await api.adminAddSituation({
        part: sitPart,
        title: sitTitle,
        description: sitDesc,
        backboneTopic: sitTopic,
      });
      onStoreUpdate(res.store);
      setSitTitle('');
      setSitDesc('');
      setStatusMessage(`Đã thêm tình huống mở rộng ${res.item.id} (${res.item.title}).`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Lỗi khi thêm tình huống.');
    }
  };

  const handleDeleteSituation = async (id: string) => {
    try {
      const next = await api.adminDeleteSituation(id);
      onStoreUpdate(next);
      setStatusMessage(`Đã xóa tình huống mở rộng ${id}.`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Lỗi khi xóa.');
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatusMessage(null);
    try {
      const res = await api.adminAddQuestion({
        part: qPart,
        situationId: qSitId,
        prompt: qPrompt,
        options: [qOptA, qOptB, qOptC, qOptD],
        correctIndex: qCorrectIdx,
      });
      onStoreUpdate(res.store);
      setQPrompt('');
      setQOptA('');
      setQOptB('');
      setQOptC('');
      setQOptD('');
      setStatusMessage(`Đã thêm câu hỏi mở rộng ${res.question.id}.`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Lỗi khi thêm câu hỏi.');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const next = await api.adminDeleteQuestion(id);
      onStoreUpdate(next);
      setStatusMessage(`Đã xóa câu hỏi ${id}.`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Lỗi khi xóa câu hỏi.');
    }
  };

  const handleAddVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatusMessage(null);
    try {
      const res = await api.adminAddVocab({
        word: vWord,
        viMeaning: vMeaning,
        partOfSpeech: vPos,
        backboneTopic: vTopic,
      });
      onStoreUpdate(res.store);
      setVWord('');
      setVMeaning('');
      setStatusMessage(`Đã thêm từ vựng mở rộng "${res.vocab.word}".`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Lỗi khi thêm từ vựng.');
    }
  };

  const handleCheckDuplicates = async () => {
    setErrorMsg(null);
    try {
      const report = await api.adminDuplicates();
      setDuplicateReport(report);
      setStatusMessage('Đã hoàn tất kiểm tra trùng lặp dữ liệu toàn hệ thống.');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Lỗi kiểm tra trùng lặp.');
    }
  };

  const downloadBlob = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = async () => {
    setErrorMsg(null);
    try {
      const data = await api.adminExport();
      downloadBlob(JSON.stringify(data, null, 2), 'toeic-master-export.json', 'application/json');
      setStatusMessage('Đã xuất toàn bộ dữ liệu tương thích Google Sheets 15 bảng (.json).');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Lỗi xuất JSON.');
    }
  };

  const handleExportSituationsCsv = () => {
    const rows = [
      ['Situation_ID', 'Part', 'Order', 'Title', 'Topic', 'Difficulty', 'Source_Reference'],
      ...[...ALL_220_SITUATIONS, ...store.customSituations].map((s: SituationItem) => [
        s.id,
        s.part,
        String(s.order),
        s.title,
        s.backboneTopic,
        s.difficulty,
        s.sourceReference,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    downloadBlob('\uFEFF' + csv, 'Situations_GoogleSheets.csv', 'text/csv;charset=utf-8;');
    setStatusMessage('Đã xuất bảng Situations chuẩn UTF-8 BOM cho Google Sheets (.csv).');
  };

  const handleExportVocabCsv = () => {
    const rows = [
      ['Vocab_ID', 'Word', 'IPA', 'Part_Of_Speech', 'Vietnamese_Meaning', 'Topic', 'Origin'],
      ...[...VOCABULARY_BANK, ...store.customVocab].map((v: VocabEntry) => [
        v.id,
        v.word,
        v.ipa,
        v.partOfSpeech,
        v.viMeaning,
        v.backboneTopic,
        v.origin,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    downloadBlob('\uFEFF' + csv, 'Vocabulary_GoogleSheets.csv', 'text/csv;charset=utf-8;');
    setStatusMessage('Đã xuất bảng Vocabulary chuẩn UTF-8 BOM cho Google Sheets (.csv).');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-blue-700">
              Module 13 · Quyền Quản trị viên (RBAC Admin Active)
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Admin Panel — Quản Trị Nội Dung</h1>
            <p className="text-sm text-slate-600">
              220 tình huống gốc được bảo vệ nguyên vẹn. Nội dung thêm mới từ Admin được lưu vào nhóm mở rộng và đánh dấu tách biệt.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 shrink-0">
            {[
              { id: 'situations', label: 'Tình huống mở rộng' },
              { id: 'questions', label: 'Ngân hàng câu hỏi' },
              { id: 'vocab', label: 'Từ vựng bổ sung' },
              { id: 'export', label: 'Kiểm tra & Xuất dữ liệu' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {statusMessage && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
        {errorMsg && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-800">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Tab 1: Extended Situations */}
      {activeTab === 'situations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleAddSituation} className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">Thêm tình huống mở rộng</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Part</label>
                <select
                  value={sitPart}
                  onChange={(e) => setSitPart(e.target.value as typeof sitPart)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="part3">Part 3</option>
                  <option value="part4">Part 4</option>
                  <option value="part6">Part 6</option>
                  <option value="part7">Part 7</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Chủ đề xương sống</label>
                <select
                  value={sitTopic}
                  onChange={(e) => setSitTopic(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {BACKBONE_TOPICS.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tên tình huống</label>
              <input
                type="text"
                required
                value={sitTitle}
                onChange={(e) => setSitTitle(e.target.value)}
                placeholder="Ví dụ: Xử lý khiếu nại giao hàng chậm"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Mô tả ngữ cảnh</label>
              <textarea
                required
                rows={3}
                value={sitDesc}
                onChange={(e) => setSitDesc(e.target.value)}
                placeholder="Mô tả nội dung tình huống, đối tượng tham gia và mục tiêu..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Plus className="h-4 w-4" />
              <span>Lưu tình huống mở rộng</span>
            </button>
          </form>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">
              Danh sách tình huống mở rộng ({store.customSituations.length})
            </h2>
            {store.customSituations.length === 0 ? (
              <p className="text-sm text-slate-500">
                Chưa có tình huống mở rộng nào. 220 tình huống giáo trình gốc đang được giữ nguyên vẹn.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {store.customSituations.map((s) => (
                  <div key={s.id} className="py-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {s.id} · {s.title}
                      </p>
                      <p className="text-xs text-slate-500">{s.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSituation(s.id)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                      aria-label="Xóa tình huống mở rộng"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Practice Questions */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleAddQuestion} className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">Thêm câu hỏi luyện tập mới</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Part</label>
                <select
                  value={qPart}
                  onChange={(e) => setQPart(e.target.value as PracticeQuestion['part'])}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="part1">Part 1</option>
                  <option value="part2">Part 2</option>
                  <option value="part3">Part 3</option>
                  <option value="part4">Part 4</option>
                  <option value="part6">Part 6</option>
                  <option value="part7">Part 7</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mã tình huống (Situation ID)</label>
                <input
                  type="text"
                  value={qSitId}
                  onChange={(e) => setQSitId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono-num"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nội dung câu hỏi</label>
              <input
                type="text"
                required
                value={qPrompt}
                onChange={(e) => setQPrompt(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input type="text" required placeholder="Đáp án A" value={qOptA} onChange={(e) => setQOptA(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <input type="text" required placeholder="Đáp án B" value={qOptB} onChange={(e) => setQOptB(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <input type="text" required placeholder="Đáp án C" value={qOptC} onChange={(e) => setQOptC(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <input type="text" required placeholder="Đáp án D" value={qOptD} onChange={(e) => setQOptD(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Đáp án đúng</label>
              <select
                value={qCorrectIdx}
                onChange={(e) => setQCorrectIdx(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value={0}>Đáp án A</option>
                <option value={1}>Đáp án B</option>
                <option value={2}>Đáp án C</option>
                <option value={3}>Đáp án D</option>
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm câu hỏi</span>
            </button>
          </form>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">
              Câu hỏi Admin thêm mới ({store.customQuestions.length})
            </h2>
            {store.customQuestions.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có câu hỏi tùy chỉnh nào được thêm.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {store.customQuestions.map((q) => (
                  <div key={q.id} className="py-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {q.id} · {q.part.toUpperCase()} ({q.situationId})
                      </p>
                      <p className="text-xs text-slate-600">{q.prompt}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Custom Vocabulary */}
      {activeTab === 'vocab' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleAddVocab} className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">Thêm từ vựng bổ sung</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Từ tiếng Anh</label>
                <input
                  type="text"
                  required
                  value={vWord}
                  onChange={(e) => setVWord(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Từ loại</label>
                <input
                  type="text"
                  value={vPos}
                  onChange={(e) => setVPos(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nghĩa tiếng Việt</label>
              <input
                type="text"
                required
                value={vMeaning}
                onChange={(e) => setVMeaning(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Chủ đề</label>
              <select
                value={vTopic}
                onChange={(e) => setVTopic(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {BACKBONE_TOPICS.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm từ vựng</span>
            </button>
          </form>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">
              Từ vựng mở rộng ({store.customVocab.length})
            </h2>
            {store.customVocab.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có từ vựng bổ sung ngoài {VOCABULARY_BANK.length} từ gốc.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {store.customVocab.map((v) => (
                  <div key={v.id} className="py-2.5">
                    <p className="text-sm font-semibold text-slate-900">
                      {v.word} <span className="font-normal text-slate-500">({v.partOfSpeech})</span>
                    </p>
                    <p className="text-xs text-slate-600">{v.viMeaning}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Duplicate Validation & Google Sheets Compatible Export */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center gap-2">
              <SearchCheck className="h-5 w-5 text-blue-700" />
              <h2 className="text-base font-semibold text-slate-900">Kiểm tra trùng lặp dữ liệu</h2>
            </div>
            <p className="text-sm text-slate-600">
              Kiểm tra trùng tiêu đề tình huống trong cùng Part hoặc trùng từ vựng giữa giáo trình gốc và nội dung mở rộng.
            </p>
            <button
              type="button"
              onClick={handleCheckDuplicates}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Chạy kiểm tra ngay
            </button>

            {duplicateReport && (
              <div className="rounded-lg bg-slate-50 p-4 space-y-2 text-xs">
                <p className="font-semibold text-slate-900">
                  Kết quả quét: {duplicateReport.duplicateSituations.length} cụm tiêu đề tình huống trùng ·{' '}
                  {duplicateReport.duplicateVocab.length} từ vựng trùng
                </p>
                {duplicateReport.duplicateSituations.map((d) => (
                  <p key={d.key} className="text-amber-800">
                    • Tình huống trùng ({d.key}): {d.ids.join(', ')}
                  </p>
                ))}
                {duplicateReport.duplicateVocab.map((d) => (
                  <p key={d.key} className="text-rose-800">
                    • Từ trùng ({d.key}): {d.ids.join(', ')}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-700" />
              <h2 className="text-base font-semibold text-slate-900">
                Xuất dữ liệu chuẩn Google Sheets & JSON
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Xuất dữ liệu theo đúng cấu trúc 15 bảng quan hệ trong <span className="font-mono-num">docs/DATABASE.md</span> để dễ dàng đồng bộ hoặc sao lưu.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800"
              >
                <Download className="h-4 w-4" />
                <span>Xuất toàn bộ JSON</span>
              </button>
              <button
                type="button"
                onClick={handleExportSituationsCsv}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                <span>CSV bảng Situations</span>
              </button>
              <button
                type="button"
                onClick={handleExportVocabCsv}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                <span>CSV bảng Vocabulary</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
