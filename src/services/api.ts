import type { PracticeQuestion, SituationItem, UserStoreState, VocabEntry } from '../types/toeic';
import type { Sm2Rating } from '../utils/sm2';

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data && data.error) || `Yêu cầu thất bại (${res.status})`);
  }
  return data as T;
}

export const api = {
  getStore: () => requestJson<UserStoreState>('/api/store'),

  switchRole: (role: 'student' | 'admin', name?: string) =>
    requestJson<UserStoreState>('/api/role', {
      method: 'POST',
      body: JSON.stringify({ role, name }),
    }),

  saveSituationProgress: (payload: {
    situationId: string;
    step?: number;
    completed?: boolean;
    minutesSpent?: number;
  }) =>
    requestJson<UserStoreState>('/api/progress/situation', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  rateReviewCard: (payload: {
    targetId: string;
    targetType: 'vocab' | 'situation';
    rating: Sm2Rating;
  }) =>
    requestJson<UserStoreState>('/api/review/rate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  toggleHardCard: (targetId: string, targetType: 'vocab' | 'situation') =>
    requestJson<UserStoreState>('/api/review/toggle-hard', {
      method: 'POST',
      body: JSON.stringify({ targetId, targetType }),
    }),

  submitQuiz: (payload: {
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
  }) =>
    requestJson<{ store: UserStoreState; attempt: UserStoreState['quizAttempts'][0] }>('/api/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  resolveMistake: (mistakeId: string) =>
    requestJson<UserStoreState>('/api/mistakes/resolve', {
      method: 'POST',
      body: JSON.stringify({ mistakeId }),
    }),

  updateSettings: (settings: Partial<UserStoreState['settings']>) =>
    requestJson<UserStoreState>('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),

  askAiTutor: (payload: {
    mode: 'explain_vocab' | 'analyze_trap' | 'generate_practice' | 'study_advice' | 'free_qa';
    prompt?: string;
    situationId?: string;
    vocabWord?: string;
  }) =>
    requestJson<{ answer: string; model: string; origin: string }>('/api/ai/tutor', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  adminExport: () => requestJson<Record<string, unknown>>('/api/admin/export'),

  adminDuplicates: () =>
    requestJson<{
      duplicateSituations: { key: string; ids: string[] }[];
      duplicateVocab: { key: string; ids: string[] }[];
    }>('/api/admin/duplicates'),

  adminAddSituation: (item: Partial<SituationItem>) =>
    requestJson<{ store: UserStoreState; item: SituationItem }>('/api/admin/situations', {
      method: 'POST',
      body: JSON.stringify(item),
    }),

  adminDeleteSituation: (id: string) =>
    requestJson<UserStoreState>(`/api/admin/situations/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  adminAddQuestion: (q: Partial<PracticeQuestion>) =>
    requestJson<{ store: UserStoreState; question: PracticeQuestion }>('/api/admin/questions', {
      method: 'POST',
      body: JSON.stringify(q),
    }),

  adminDeleteQuestion: (id: string) =>
    requestJson<UserStoreState>(`/api/admin/questions/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  adminAddVocab: (v: Partial<VocabEntry>) =>
    requestJson<{ store: UserStoreState; vocab: VocabEntry }>('/api/admin/vocab', {
      method: 'POST',
      body: JSON.stringify(v),
    }),
};
