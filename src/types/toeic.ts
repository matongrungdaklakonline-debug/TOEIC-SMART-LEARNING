export type ToeicPart = 'part1' | 'part2' | 'part3' | 'part4' | 'part6' | 'part7';

export type ContentOrigin = 'curriculum' | 'extended_practice' | 'ai_generated';

export type DifficultyLevel = 'Cao' | 'Trung bình–Cao' | 'Trung bình' | 'Thấp–Trung bình';

export interface KeywordItem {
  word: string;
  meaning: string;
  synonyms?: string[];
  antonyms?: string[];
  example?: string;
  confusingPair?: string;
  origin: ContentOrigin;
}

export interface Part1ActionVerb {
  verb: string;
  meaning: string;
  synonyms: string[];
  antonyms?: string[];
  example: string;
  group: string;
}

export interface Part1Preposition {
  preposition: string;
  meaning: string;
  example: string;
}

export interface Part1SceneGroup {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageNotice: string;
  keywords: KeywordItem[];
  confusingPairs: string[];
  actionTips: string;
  traps: string[];
  sourceReference: string;
}

export interface Part2DialogueExample {
  question: string;
  answers: string[];
  note?: string;
}

export interface Part2QuestionType {
  id: string;
  order: number;
  title: string;
  starters: string[];
  identificationGuide: string;
  expectedAnswerForms: string[];
  directExamples: Part2DialogueExample[];
  indirectExamples: Part2DialogueExample[];
  commonPhrases: string[];
  traps: string[];
  sourceReference: string;
}

export interface GoldenPhrase {
  phrase: string;
  meaning: string;
  synonyms: string[];
  usageNote: string;
}

export interface SituationItem {
  id: string; // e.g., P3-01
  part: 'part3' | 'part4' | 'part6' | 'part7';
  order: number;
  title: string;
  description: string;
  context: string;
  backboneTopic: string;
  difficulty: DifficultyLevel;
  keywords: KeywordItem[];
  synonyms: string[];
  antonymsOrConfusing: string[];
  examples: string[];
  paraphrases: string[];
  commonQuestionTypes: string[];
  grammarFocus?: string[];
  passageFormats?: string[];
  readingSkills?: string[];
  traps: string[];
  learningStrategy: string;
  selfQuestions?: string[];
  hasDeepExpansion?: boolean;
  sourceReference: string;
}

export interface BackboneTopic {
  id: string;
  name: string;
  parts: string[];
  estimatedFrequency: DifficultyLevel;
  coreVocabulary: string[];
  collocations?: string[];
  paraphrases?: string[];
  confusingPairs?: string[];
  sourceReference: string;
}

export interface VocabEntry {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  viMeaning: string;
  synonyms: string[];
  antonyms: string[];
  confusingPairs: string[];
  collocations: string[];
  examples: string[];
  viExplanation: string;
  relatedParts: ToeicPart[];
  relatedSituationIds: string[];
  backboneTopic: string;
  origin: ContentOrigin;
}

export interface PracticeQuestion {
  id: string;
  part: ToeicPart;
  situationId: string;
  questionType: string;
  origin: ContentOrigin;
  imageUrl?: string;
  audioScript?: string[]; // lines for TTS playback
  passageTitle?: string;
  passages?: { label: string; docType: string; content: string }[];
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  trapAnalysis: string;
  evidenceQuote?: string;
  grammarRule?: string;
}

export type ReviewStatus = 'unlearned' | 'learning' | 'needs_review' | 'mastered';

export interface ReviewCardState {
  targetId: string; // vocabId or situationId
  targetType: 'vocab' | 'situation';
  status: ReviewStatus;
  repetitions: number;
  intervalDays: number;
  easinessFactor: number;
  lastReviewedAt?: string;
  nextReviewAt: string;
  isHard?: boolean;
}

export interface SituationProgress {
  situationId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedSteps: number[];
  lastStep: number;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  title: string;
  mode: string;
  partFilter: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  durationSeconds: number;
  createdAt: string;
  breakdownByPart: Record<string, { total: number; correct: number }>;
  weakSituations: string[];
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  part: ToeicPart;
  situationId: string;
  questionType: string;
  selectedOptionIndex: number;
  correctIndex: number;
  reasonCategory: string;
  createdAt: string;
  resolved: boolean;
}

export interface UserStoreState {
  user: {
    id: string;
    name: string;
    role: 'student' | 'admin';
    streakDays: number;
    lastActiveDate: string;
    dailyStudyMinutes: number;
    lastSituationId?: string;
    studyHistoryDates: string[];
  };
  situationProgress: Record<string, SituationProgress>;
  reviewCards: Record<string, ReviewCardState>;
  quizAttempts: QuizAttempt[];
  mistakes: MistakeRecord[];
  customSituations: SituationItem[];
  customQuestions: PracticeQuestion[];
  customVocab: VocabEntry[];
  settings: {
    audioSpeed: number;
    dailyGoalSituations: number;
    activeRoadmapWeek: number;
  };
}
