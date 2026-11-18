import { useEffect, useState } from 'react';
import {
  BarChart3,
  BookMarked,
  BookOpen,
  ClipboardCheck,
  FileText,
  Headphones,
  Image as ImageIcon,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Mic,
  RotateCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { AdminPanelView } from './components/AdminPanelView';
import { AiTutorView } from './components/AiTutorView';
import { DashboardView } from './components/DashboardView';
import { Part1View } from './components/Part1View';
import { Part2View } from './components/Part2View';
import { ProgressTrackerView } from './components/ProgressTrackerView';
import { QuizEngineView } from './components/QuizEngineView';
import { SituationsView } from './components/SituationsView';
import { SmartReviewView } from './components/SmartReviewView';
import { VocabularyView } from './components/VocabularyView';
import { api } from './services/api';
import type { PracticeQuestion, ToeicPart, UserStoreState } from './types/toeic';
import { isDueForReview, type Sm2Rating } from './utils/sm2';

type NavTabId =
  | 'dashboard'
  | 'part1'
  | 'part2'
  | 'part3'
  | 'part4'
  | 'part6'
  | 'part7'
  | 'vocabulary'
  | 'review'
  | 'quiz'
  | 'progress'
  | 'ai_tutor'
  | 'admin';

export default function App() {
  const [store, setStore] = useState<UserStoreState | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [targetSituationId, setTargetSituationId] = useState<string | undefined>(undefined);
  const [targetVocabWord, setTargetVocabWord] = useState<string | undefined>(undefined);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;
    api
      .getStore()
      .then((data) => {
        if (active) {
          setStore(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setErrorBanner(
            err instanceof Error ? err.message : 'Không thể tải dữ liệu học tập từ máy chủ.'
          );
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const handleNavigate = (tab: string, _partFilter?: ToeicPart, situationId?: string) => {
    setActiveTab(tab as NavTabId);
    setTargetSituationId(situationId);
    if (tab !== 'vocabulary') setTargetVocabWord(undefined);
    if (tab !== 'ai_tutor') setAiInitialPrompt(undefined);
    setMobileNavOpen(false);
  };

  const handleSaveSituationProgress = async (
    situationId: string,
    step: number,
    completed: boolean
  ) => {
    try {
      const next = await api.saveSituationProgress({ situationId, step, completed });
      setStore(next);
    } catch (err: unknown) {
      setErrorBanner(err instanceof Error ? err.message : 'Không thể lưu tiến độ.');
    }
  };

  const handleSpeedChange = async (speed: number) => {
    try {
      const next = await api.updateSettings({ audioSpeed: speed });
      setStore(next);
    } catch (err: unknown) {
      setErrorBanner(err instanceof Error ? err.message : 'Không thể lưu tốc độ phát.');
    }
  };

  const handleSelectRoadmapWeek = async (week: number) => {
    try {
      const next = await api.updateSettings({ activeRoadmapWeek: week });
      setStore(next);
    } catch (err: unknown) {
      setErrorBanner(err instanceof Error ? err.message : 'Không thể cập nhật lộ trình.');
    }
  };

  const handleRateCard = async (
    targetId: string,
    targetType: 'vocab' | 'situation',
    rating: Sm2Rating
  ) => {
    try {
      const next = await api.rateReviewCard({ targetId, targetType, rating });
      setStore(next);
    } catch (err: unknown) {
      setErrorBanner(err instanceof Error ? err.message : 'Không thể cập nhật SM-2.');
    }
  };

  const handleToggleHard = async (targetId: string, targetType: 'vocab' | 'situation') => {
    try {
      const next = await api.toggleHardCard(targetId, targetType);
      setStore(next);
    } catch (err: unknown) {
      setErrorBanner(err instanceof Error ? err.message : 'Không thể đánh dấu từ khó.');
    }
  };

  const handleSubmitQuiz = async (payload: {
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
  }) => {
    const res = await api.submitQuiz(payload);
    setStore(res.store);
    return { attempt: res.attempt };
  };

  const handleResolveMistake = async (mistakeId: string) => {
    try {
      const next = await api.resolveMistake(mistakeId);
      setStore(next);
    } catch (err: unknown) {
      setErrorBanner(err instanceof Error ? err.message : 'Không thể cập nhật Sổ lỗi.');
    }
  };

  const handleSwitchRole = async (role: 'student' | 'admin') => {
    try {
      const next = await api.switchRole(role);
      setStore(next);
    } catch (err: unknown) {
      setErrorBanner(err instanceof Error ? err.message : 'Không thể chuyển vai trò.');
    }
  };

  const handleAskAi = (situationId: string, prompt: string) => {
    setTargetSituationId(situationId);
    setAiInitialPrompt(prompt);
    setActiveTab('ai_tutor');
    setMobileNavOpen(false);
  };

  const handleAskAiVocab = (word: string) => {
    setTargetVocabWord(word);
    setAiInitialPrompt(`Giải thích từ "${word}" trong ngữ cảnh TOEIC, phân biệt từ đồng nghĩa và cặp dễ nhầm.`);
    setActiveTab('ai_tutor');
    setMobileNavOpen(false);
  };

  const handleOpenVocabWord = (word: string) => {
    setTargetVocabWord(word);
    setActiveTab('vocabulary');
    setMobileNavOpen(false);
  };

  if (loading || !store) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-700">
          {errorBanner ? errorBanner : 'Đang khởi tạo TOEIC Master – Smart Learning System...'}
        </div>
      </div>
    );
  }

  const dueCount = Object.values(store.reviewCards).filter((c) => isDueForReview(c)).length;

  const curriculumNavItems: { id: NavTabId; label: string; meta: string; icon: typeof BookOpen }[] = [
    { id: 'part1', label: 'Part 1 · Photographs', meta: '5 nhóm', icon: ImageIcon },
    { id: 'part2', label: 'Part 2 · Q-Response', meta: '5 dạng', icon: MessageSquare },
    { id: 'part3', label: 'Part 3 · Conversations', meta: '55 bài', icon: Headphones },
    { id: 'part4', label: 'Part 4 · Short Talks', meta: '55 bài', icon: Mic },
    { id: 'part6', label: 'Part 6 · Text Completion', meta: '55 bài', icon: FileText },
    { id: 'part7', label: 'Part 7 · Reading', meta: '55 bài', icon: BookOpen },
  ];

  const toolsNavItems: { id: NavTabId; label: string; meta?: string; icon: typeof BookOpen }[] = [
    { id: 'vocabulary', label: 'Vocabulary Master', icon: BookMarked },
    {
      id: 'review',
      label: 'Smart Review SM-2',
      meta: dueCount > 0 ? `${dueCount}` : undefined,
      icon: RotateCw,
    },
    { id: 'quiz', label: 'Quiz Engine', icon: ClipboardCheck },
    { id: 'progress', label: 'Progress Tracker', icon: BarChart3 },
    { id: 'ai_tutor', label: 'AI Tutor', icon: Sparkles },
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-200">
        <p className="text-base font-bold tracking-tight text-slate-900">TOEIC MASTER</p>
        <p className="text-xs text-slate-500 mt-0.5">Smart Learning System · 220 Tình Huống</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <button
            type="button"
            onClick={() => handleNavigate('dashboard')}
            className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-700 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span>Tổng quan học tập</span>
          </button>
        </div>

        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Giáo trình (Part 1, 2, 3, 4, 6, 7)
          </p>
          {curriculumNavItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono-num shrink-0">{item.meta}</span>
              </button>
            );
          })}
          <p className="px-3 pt-1 text-[11px] text-slate-400">
            * Tài liệu không bao gồm Part 5
          </p>
        </div>

        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Luyện tập & Công cụ
          </p>
          {toolsNavItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.meta && (
                  <span className="text-[11px] font-bold text-amber-700 font-mono-num shrink-0">
                    {item.meta}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Role Switcher Footer (Student / Admin RBAC) */}
      <div className="border-t border-slate-200 p-4 space-y-2.5 bg-slate-50/70">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
            <UserCheck className="h-3.5 w-3.5 text-blue-700" />
            {store.user.name}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {store.user.role === 'admin' ? 'Admin' : 'Học viên'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-200/70 p-1">
          <button
            type="button"
            onClick={() => handleSwitchRole('student')}
            className={`rounded-md py-1 text-xs font-semibold transition-colors ${
              store.user.role === 'student'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Học viên
          </button>
          <button
            type="button"
            onClick={() => handleSwitchRole('admin')}
            className={`rounded-md py-1 text-xs font-semibold transition-colors ${
              store.user.role === 'admin'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 bg-white sticky top-0 h-screen">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Compact Header */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-bold text-slate-900">TOEIC MASTER</p>
          <p className="text-[11px] text-slate-500">
            {store.user.role === 'admin' ? 'Chế độ Admin' : 'Học viên'} · 220 Tình huống
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen((o) => !o)}
          className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
          aria-label="Mở menu điều hướng"
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-72 bg-white h-full border-r border-slate-200 shadow-xl">
            {renderSidebarContent()}
          </div>
          <div
            className="flex-1 bg-slate-900/40"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {errorBanner && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 flex items-center justify-between gap-3 text-sm text-rose-800">
            <span>{errorBanner}</span>
            <button
              type="button"
              onClick={() => setErrorBanner(null)}
              className="text-xs font-semibold underline shrink-0"
            >
              Đóng
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            store={store}
            onNavigate={handleNavigate}
            onSelectRoadmapWeek={handleSelectRoadmapWeek}
          />
        )}

        {activeTab === 'part1' && (
          <Part1View
            store={store}
            onSaveProgress={handleSaveSituationProgress}
            onSpeedChange={handleSpeedChange}
            onAskAi={handleAskAi}
          />
        )}

        {activeTab === 'part2' && (
          <Part2View
            store={store}
            onSaveProgress={handleSaveSituationProgress}
            onSpeedChange={handleSpeedChange}
            onAskAi={handleAskAi}
          />
        )}

        {(activeTab === 'part3' ||
          activeTab === 'part4' ||
          activeTab === 'part6' ||
          activeTab === 'part7') && (
          <SituationsView
            key={activeTab}
            part={activeTab}
            store={store}
            initialSituationId={targetSituationId}
            onSaveProgress={handleSaveSituationProgress}
            onSpeedChange={handleSpeedChange}
            onOpenVocabWord={handleOpenVocabWord}
            onAskAi={handleAskAi}
          />
        )}

        {activeTab === 'vocabulary' && (
          <VocabularyView
            store={store}
            initialSearchWord={targetVocabWord}
            onRateCard={handleRateCard}
            onToggleHard={handleToggleHard}
            onOpenSituation={(part, sitId) => handleNavigate(part, part, sitId)}
            onAskAiVocab={handleAskAiVocab}
          />
        )}

        {activeTab === 'review' && (
          <SmartReviewView
            store={store}
            onRateCard={handleRateCard}
            onOpenSituation={(part, sitId) => handleNavigate(part, part, sitId)}
            onOpenVocab={() => handleNavigate('vocabulary')}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizEngineView
            store={store}
            onSubmitQuiz={handleSubmitQuiz}
            onSpeedChange={handleSpeedChange}
            onOpenSituation={(part, sitId) => handleNavigate(part, part, sitId)}
            onOpenProgress={() => handleNavigate('progress')}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressTrackerView
            store={store}
            onResolveMistake={handleResolveMistake}
            onOpenSituation={(part, sitId) => handleNavigate(part, part, sitId)}
            onStartQuiz={() => handleNavigate('quiz')}
          />
        )}

        {activeTab === 'ai_tutor' && (
          <AiTutorView
            store={store}
            initialSituationId={targetSituationId}
            initialVocabWord={targetVocabWord}
            initialPrompt={aiInitialPrompt}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanelView
            store={store}
            onStoreUpdate={setStore}
            onSwitchToAdmin={() => handleSwitchRole('admin')}
          />
        )}
      </main>
    </div>
  );
}
