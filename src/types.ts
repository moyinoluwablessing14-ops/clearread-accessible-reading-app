export type ReadingLevel = 'easy' | 'medium' | 'original';

export type FontOption =
  | 'lexend'
  | 'opendyslexic'
  | 'atkinson'
  | 'comic'
  | 'sans'
  | 'serif'
  | 'mono';

export type ThemeOption =
  | 'cream'
  | 'yellow'
  | 'blue'
  | 'mint'
  | 'white'
  | 'dark'
  | 'high-contrast-yellow'
  | 'high-contrast-white';

export interface DisplaySettings {
  font: FontOption;
  fontSize: number; // in pixels (e.g. 18, 22, 26, up to 38-40px for 200% large text)
  lineSpacing: number; // multiplier (e.g. 1.5, 1.8, 2.1, 2.4)
  letterSpacing: number; // in em (e.g. 0, 0.04, 0.08, 0.14)
  theme: ThemeOption;
  showReadingRuler: boolean;
  rulerHeight: number; // in pixels (e.g. 48, 64, 96)
  focusChunkMode: boolean; // 1-chunk at a time guided mode vs full scroll
  highlightActiveChunk: boolean;
}

export type AccessibilityNeed =
  | 'dyslexia'
  | 'low-vision'
  | 'deaf-hoh'
  | 'ell';

export interface AccessibilitySettings {
  userNeeds: AccessibilityNeed[];
  audioFirstMode: boolean; // Announces screen changes, button clicks, and simplifies aloud
  voiceCommandsEnabled: boolean; // Web speech recognition for "read", "pause", "next", etc.
  captionsEnabled: boolean; // Displays large live caption overlay of read-aloud sentence
  plainLanguageMode: boolean; // Replaces complex idioms with plain terms
  showWordIcons: boolean; // Small visual cue icons beside key nouns and verbs for deaf / visual learners
  speechRate: number; // 0.5x to 2.0x
  speechPitch: number; // 0.8 to 1.2
  selectedVoiceURI: string | null;
  hasCompletedWelcomeSurvey: boolean;
}

export interface ReadingProfile {
  id: string;
  name: string;
  settings: DisplaySettings;
  accessibility?: Partial<AccessibilitySettings>;
  isCustom?: boolean;
}

export interface TextChunk {
  heading: string;
  paragraph: string;
}

export interface ProcessedDocument {
  id: string;
  title: string;
  originalText: string;
  level: ReadingLevel;
  keyPoints: string[];
  estimatedReadingTimeMinutes: number;
  wordCount: number;
  chunks: TextChunk[];
  createdAt: string;
  isSaved?: boolean;
}

export type PlanType = 'free' | 'plus' | 'family';
export type BillingCycle = 'monthly' | 'yearly';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  billingCycle: BillingCycle;
  pagesSimplifiedToday: number;
  createdAt: string;
}

export type ScreenType = 'landing' | 'how-it-works' | 'auth' | 'plan-selection' | 'onboarding' | 'app';

export type AppTab = 'read' | 'library' | 'reminders' | 'progress' | 'family' | 'settings';

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  minutesReadThisWeek: number;
  streakDays: number;
  quizAverage: number;
  trickyWords: string[];
  assignedReadings: string[];
  weeklySummary?: string;
  badges?: string[];
  weeklyMinutesGoal?: number;
}

export interface DailyReminder {
  enabled: boolean;
  time: string; // "17:00"
  targetMinutes: number;
  weekdaysOnly: boolean;
}

export type VoiceCommand =
  | 'read'
  | 'pause'
  | 'next'
  | 'previous'
  | 'simplify'
  | 'bigger text'
  | 'smaller text'
  | 'high contrast';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  documentTitle: string;
  score: number;
  total: number;
  date: string;
}

export interface ReadingProgress {
  streak: number;
  lastReadDate: string;
  weeklyMinutes: Record<string, number>;
  quizResults: QuizResult[];
  trickyWords: string[];
}

