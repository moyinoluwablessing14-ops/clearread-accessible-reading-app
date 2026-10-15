import {
  DisplaySettings,
  ReadingProfile,
  ProcessedDocument,
  AccessibilitySettings,
  User,
  DailyReminder,
  ChildProfile,
  ReadingProgress,
  QuizResult,
} from '../types';
import {
  DEFAULT_DISPLAY_SETTINGS,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  BUILT_IN_PROFILES,
} from '../constants/defaults';

const SETTINGS_KEY = 'clearread_display_settings_v2';
const ACCESSIBILITY_KEY = 'clearread_accessibility_settings_v2';
const PROFILES_KEY = 'clearread_custom_profiles_v2';
const RECENT_DOCS_KEY = 'clearread_recent_docs_v2';
const ACTIVE_PROFILE_KEY = 'clearread_active_profile_id_v2';
const USER_KEY = 'clearread_current_user_v2';
const REMINDER_KEY = 'clearread_reminder_config_v2';
const CHILDREN_KEY = 'clearread_children_profiles_v2';
const PROGRESS_KEY = 'clearread_reading_progress_v2';

export const DEFAULT_USER: User = {
  id: 'usr_demo_123',
  name: 'Alex Johnson',
  email: 'alex@clearread.app',
  plan: 'free',
  billingCycle: 'monthly',
  pagesSimplifiedToday: 1,
  createdAt: new Date().toISOString(),
};

export const DEFAULT_CHILD_PROFILES: ChildProfile[] = [
  {
    id: 'ch_1',
    name: 'Maya',
    avatar: '🦊',
    grade: '4th Grade',
    minutesReadThisWeek: 85,
    streakDays: 4,
    quizAverage: 92,
    weeklyMinutesGoal: 80,
    badges: ['Weekly Goal Crusher 🏆', 'Streak Starter 🌟', 'Curious Explorer 📚'],
    trickyWords: ['photosynthesis', 'chlorophyll', 'atmosphere'],
    assignedReadings: ['The Great Pyramids of Giza', 'How Clouds Form'],
  },
  {
    id: 'ch_2',
    name: 'Leo',
    avatar: '🐬',
    grade: '7th Grade',
    minutesReadThisWeek: 120,
    streakDays: 6,
    quizAverage: 88,
    weeklyMinutesGoal: 100,
    badges: ['Weekly Goal Crusher 🏆', 'Vocabulary Champion 🎯', 'Deep Diver 🌊'],
    trickyWords: ['hydrothermal', 'archaeological', 'biodiversity'],
    assignedReadings: ['Life in the Deep Ocean Trenches'],
  },
];

export const DEFAULT_REMINDER: DailyReminder = {
  enabled: true,
  time: '17:30',
  targetMinutes: 15,
  weekdaysOnly: false,
};

export function loadStoredSettings(): DisplaySettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      let initialSettings = { ...DEFAULT_DISPLAY_SETTINGS };
      if (typeof window !== 'undefined' && window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          initialSettings.theme = 'dark';
        }
      }
      return initialSettings;
    }
    return { ...DEFAULT_DISPLAY_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_DISPLAY_SETTINGS;
  }
}

export function saveStoredSettings(settings: DisplaySettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('localStorage save settings error:', e);
  }
}

export function loadStoredAccessibilitySettings(): AccessibilitySettings {
  try {
    const raw = localStorage.getItem(ACCESSIBILITY_KEY);
    if (!raw) return DEFAULT_ACCESSIBILITY_SETTINGS;
    return { ...DEFAULT_ACCESSIBILITY_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }
}

export function saveStoredAccessibilitySettings(settings: AccessibilitySettings): void {
  try {
    localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('localStorage save accessibility settings error:', e);
  }
}

export function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: User | null): void {
  try {
    if (!user) {
      localStorage.removeItem(USER_KEY);
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.warn('Error saving user:', e);
  }
}

export function loadStoredReminder(): DailyReminder {
  try {
    const raw = localStorage.getItem(REMINDER_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_REMINDER;
  } catch {
    return DEFAULT_REMINDER;
  }
}

export function saveStoredReminder(rem: DailyReminder): void {
  try {
    localStorage.setItem(REMINDER_KEY, JSON.stringify(rem));
  } catch (e) {
    console.warn('Error saving reminder:', e);
  }
}

export function loadStoredChildProfiles(): ChildProfile[] {
  try {
    const raw = localStorage.getItem(CHILDREN_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CHILD_PROFILES;
  } catch {
    return DEFAULT_CHILD_PROFILES;
  }
}

export function saveStoredChildProfiles(profiles: ChildProfile[]): void {
  try {
    localStorage.setItem(CHILDREN_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.warn('Error saving children:', e);
  }
}

export function loadAllProfiles(): ReadingProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    const customProfiles: ReadingProfile[] = raw ? JSON.parse(raw) : [];
    return [...BUILT_IN_PROFILES, ...customProfiles];
  } catch {
    return BUILT_IN_PROFILES;
  }
}

export function saveCustomProfile(name: string, settings: DisplaySettings): ReadingProfile {
  const customProfile: ReadingProfile = {
    id: 'custom-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    name: name.trim() || 'My Custom Profile',
    settings: { ...settings },
    isCustom: true,
  };

  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    const existing: ReadingProfile[] = raw ? JSON.parse(raw) : [];
    const updated = [customProfile, ...existing];
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving custom profile:', e);
  }

  return customProfile;
}

export function deleteCustomProfile(id: string): void {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) return;
    const existing: ReadingProfile[] = JSON.parse(raw);
    const updated = existing.filter((p) => p.id !== id);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error deleting profile:', e);
  }
}

export function loadActiveProfileId(): string {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY) || 'preset-dyslexia';
  } catch {
    return 'preset-dyslexia';
  }
}

export function saveActiveProfileId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  } catch (e) {
    console.warn('Error saving active profile id:', e);
  }
}

export function loadRecentDocs(): ProcessedDocument[] {
  try {
    const raw = localStorage.getItem(RECENT_DOCS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecentDoc(doc: ProcessedDocument): void {
  try {
    const existing = loadRecentDocs();
    const filtered = existing.filter((d) => d.id !== doc.id);
    const updated = [doc, ...filtered].slice(0, 20); // Keep last 20
    localStorage.setItem(RECENT_DOCS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving recent doc:', e);
  }
}

export function deleteRecentDoc(id: string): void {
  try {
    const existing = loadRecentDocs();
    const updated = existing.filter((d) => d.id !== id);
    localStorage.setItem(RECENT_DOCS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error deleting recent doc:', e);
  }
}

export const DEFAULT_READING_PROGRESS: ReadingProgress = {
  streak: 3,
  lastReadDate: new Date().toISOString().split('T')[0],
  weeklyMinutes: {
    Mon: 15,
    Tue: 20,
    Wed: 18,
    Thu: 22,
    Fri: 25,
    Sat: 15,
    Sun: 10,
  },
  quizResults: [
    {
      id: 'quiz-init-1',
      documentTitle: 'How Clouds Form in the Atmosphere',
      score: 3,
      total: 3,
      date: new Date().toISOString(),
    },
    {
      id: 'quiz-init-2',
      documentTitle: 'Ancient Pyramids of Giza',
      score: 3,
      total: 3,
      date: new Date().toISOString(),
    },
  ],
  trickyWords: ['atmosphere', 'condensation', 'precipitation', 'architectural'],
};

export function loadStoredProgress(): ReadingProgress {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_READING_PROGRESS,
        ...parsed,
        weeklyMinutes: {
          ...DEFAULT_READING_PROGRESS.weeklyMinutes,
          ...(parsed.weeklyMinutes || {}),
        },
      };
    }
  } catch (e) {
    console.warn('Error loading progress:', e);
  }
  return DEFAULT_READING_PROGRESS;
}

export function saveStoredProgress(progress: ReadingProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Error saving progress:', e);
  }
}

export function recordReadingMinutes(minutes: number): void {
  try {
    const progress = loadStoredProgress();
    const todayDayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    const todayStr = new Date().toISOString().split('T')[0];

    const currentMinutes = progress.weeklyMinutes[todayDayName] || 0;
    progress.weeklyMinutes[todayDayName] = currentMinutes + minutes;

    // Check streak
    if (progress.lastReadDate !== todayStr) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (progress.lastReadDate === yesterday) {
        progress.streak += 1;
      } else {
        progress.streak = 1;
      }
      progress.lastReadDate = todayStr;
    }

    saveStoredProgress(progress);
  } catch (e) {
    console.warn('Error recording reading minutes:', e);
  }
}

export function recordQuizResult(result: QuizResult): void {
  try {
    const progress = loadStoredProgress();
    progress.quizResults = [result, ...progress.quizResults].slice(0, 30);
    saveStoredProgress(progress);
  } catch (e) {
    console.warn('Error recording quiz result:', e);
  }
}

export function saveTrickyWord(word: string): void {
  try {
    const clean = word.trim().toLowerCase().replace(/[^a-zA-Z-]/g, '');
    if (!clean) return;

    const progress = loadStoredProgress();
    if (!progress.trickyWords.includes(clean)) {
      progress.trickyWords = [clean, ...progress.trickyWords].slice(0, 50);
      saveStoredProgress(progress);
    }
  } catch (e) {
    console.warn('Error saving tricky word:', e);
  }
}

