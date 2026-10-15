import {
  DisplaySettings,
  ReadingProfile,
  ThemeOption,
  FontOption,
  AccessibilitySettings,
} from '../types';

export const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  font: 'lexend',
  fontSize: 19,
  lineSpacing: 1.8,
  letterSpacing: 0.05,
  theme: 'cream',
  showReadingRuler: false,
  rulerHeight: 56,
  focusChunkMode: false,
  highlightActiveChunk: true,
};

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  userNeeds: [],
  audioFirstMode: false,
  voiceCommandsEnabled: false,
  captionsEnabled: false,
  plainLanguageMode: false,
  showWordIcons: false,
  speechRate: 1.0,
  speechPitch: 1.0,
  selectedVoiceURI: null,
  hasCompletedWelcomeSurvey: false,
};

export const BUILT_IN_PROFILES: ReadingProfile[] = [
  {
    id: 'preset-dyslexia',
    name: 'Dyslexia Friendly',
    settings: {
      font: 'lexend',
      fontSize: 20,
      lineSpacing: 1.9,
      letterSpacing: 0.06,
      theme: 'cream',
      showReadingRuler: false,
      rulerHeight: 60,
      focusChunkMode: false,
      highlightActiveChunk: true,
    },
    accessibility: {
      plainLanguageMode: true,
      showWordIcons: false,
    },
    isCustom: false,
  },
  {
    id: 'preset-opendyslexic',
    name: 'OpenDyslexic Heavy',
    settings: {
      font: 'opendyslexic',
      fontSize: 20,
      lineSpacing: 2.0,
      letterSpacing: 0.08,
      theme: 'yellow',
      showReadingRuler: false,
      rulerHeight: 64,
      focusChunkMode: false,
      highlightActiveChunk: true,
    },
    accessibility: {
      plainLanguageMode: true,
    },
    isCustom: false,
  },
  {
    id: 'preset-low-vision',
    name: 'Low-Vision High Contrast (200% Large)',
    settings: {
      font: 'atkinson',
      fontSize: 32, // Large text preset (up to 200%)
      lineSpacing: 2.1,
      letterSpacing: 0.08,
      theme: 'high-contrast-yellow',
      showReadingRuler: false,
      rulerHeight: 70,
      focusChunkMode: true,
      highlightActiveChunk: true,
    },
    accessibility: {
      audioFirstMode: true,
      voiceCommandsEnabled: true,
      captionsEnabled: false,
    },
    isCustom: false,
  },
  {
    id: 'preset-deaf-hoh',
    name: 'Deaf / Visual Support Mode',
    settings: {
      font: 'lexend',
      fontSize: 20,
      lineSpacing: 1.8,
      letterSpacing: 0.04,
      theme: 'blue',
      showReadingRuler: false,
      rulerHeight: 56,
      focusChunkMode: false,
      highlightActiveChunk: true,
    },
    accessibility: {
      captionsEnabled: true,
      plainLanguageMode: true,
      showWordIcons: true,
      audioFirstMode: false,
    },
    isCustom: false,
  },
  {
    id: 'preset-calm-mint',
    name: 'Calm Tint (Irlen/Sensory)',
    settings: {
      font: 'lexend',
      fontSize: 19,
      lineSpacing: 1.8,
      letterSpacing: 0.04,
      theme: 'mint',
      showReadingRuler: false,
      rulerHeight: 56,
      focusChunkMode: false,
      highlightActiveChunk: true,
    },
    isCustom: false,
  },
  {
    id: 'preset-night-dark',
    name: 'Dark Soft Glow',
    settings: {
      font: 'atkinson',
      fontSize: 20,
      lineSpacing: 1.8,
      letterSpacing: 0.05,
      theme: 'dark',
      showReadingRuler: false,
      rulerHeight: 56,
      focusChunkMode: false,
      highlightActiveChunk: true,
    },
    isCustom: false,
  },
];

export const THEME_CONFIGS: Record<
  ThemeOption,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    cardBgClass: string;
    accentClass: string;
    previewBg: string;
    previewText: string;
    description: string;
  }
> = {
  cream: {
    label: 'Soft Cream',
    bgClass: 'bg-[#FDFBF7]',
    textClass: 'text-[#2D2620]',
    borderClass: 'border-[#E6DFD5]',
    cardBgClass: 'bg-[#F6F2EB]',
    accentClass: 'text-amber-800 border-amber-800/20 bg-amber-100/70',
    previewBg: '#FDFBF7',
    previewText: '#2D2620',
    description: 'Gentle warm background that removes harsh white glare',
  },
  yellow: {
    label: 'Warm Sunlight',
    bgClass: 'bg-[#FFFDE8]',
    textClass: 'text-[#2C2712]',
    borderClass: 'border-[#EDE7B8]',
    cardBgClass: 'bg-[#F9F5D2]',
    accentClass: 'text-amber-900 border-amber-700/20 bg-amber-200/60',
    previewBg: '#FFFDE8',
    previewText: '#2C2712',
    description: 'Proven color tint for visual stress and letter movement',
  },
  blue: {
    label: 'Calm Sky',
    bgClass: 'bg-[#F1F7FD]',
    textClass: 'text-[#182838]',
    borderClass: 'border-[#D2E3F4]',
    cardBgClass: 'bg-[#E5F0FA]',
    accentClass: 'text-sky-900 border-sky-800/20 bg-sky-100',
    previewBg: '#F1F7FD',
    previewText: '#182838',
    description: 'Cooling tone that relaxes tired eyes during long reading sessions',
  },
  mint: {
    label: 'Pastel Mint',
    bgClass: 'bg-[#F2F8F4]',
    textClass: 'text-[#183120]',
    borderClass: 'border-[#D1E6D7]',
    cardBgClass: 'bg-[#E4F2E8]',
    accentClass: 'text-emerald-900 border-emerald-800/20 bg-emerald-100',
    previewBg: '#F2F8F4',
    previewText: '#183120',
    description: 'Soothing green overlay popular in classroom reading aids',
  },
  white: {
    label: 'Pure Paper',
    bgClass: 'bg-[#FFFFFF]',
    textClass: 'text-[#1C1D1F]',
    borderClass: 'border-[#E4E6EA]',
    cardBgClass: 'bg-[#F6F7F9]',
    accentClass: 'text-stone-900 border-stone-800/20 bg-stone-100',
    previewBg: '#FFFFFF',
    previewText: '#1C1D1F',
    description: 'Standard clean high-clarity crisp view',
  },
  dark: {
    label: 'Dark Mode',
    bgClass: 'bg-[#18191C]',
    textClass: 'text-[#E4E6EB]',
    borderClass: 'border-[#2F3238]',
    cardBgClass: 'bg-[#23252A]',
    accentClass: 'text-amber-300 border-amber-400/30 bg-amber-950/40',
    previewBg: '#18191C',
    previewText: '#E4E6EB',
    description: 'Low-light comfort to prevent eye fatigue and light sensitivity',
  },
  'high-contrast-yellow': {
    label: 'High Contrast (Yellow on Black)',
    bgClass: 'bg-[#000000]',
    textClass: 'text-[#FFE600]',
    borderClass: 'border-[#FFE600]',
    cardBgClass: 'bg-[#141414]',
    accentClass: 'text-black border-yellow-300 bg-[#FFE600]',
    previewBg: '#000000',
    previewText: '#FFE600',
    description: 'Maximum contrast AAA standard for low vision and acuity support',
  },
  'high-contrast-white': {
    label: 'High Contrast (White on Black)',
    bgClass: 'bg-[#000000]',
    textClass: 'text-[#FFFFFF]',
    borderClass: 'border-[#FFFFFF]',
    cardBgClass: 'bg-[#161616]',
    accentClass: 'text-black border-white bg-[#FFFFFF]',
    previewBg: '#000000',
    previewText: '#FFFFFF',
    description: 'High contrast crisp monochrome for low vision',
  },
};

export const FONT_CONFIGS: Record<
  FontOption,
  {
    name: string;
    cssClass: string;
    description: string;
    badge: string;
  }
> = {
  lexend: {
    name: 'Lexend',
    cssClass: 'font-lexend',
    description: 'Specially engineered by font researchers to improve reading fluency and reduce word-crowding.',
    badge: 'Recommended',
  },
  opendyslexic: {
    name: 'OpenDyslexic',
    cssClass: 'font-opendyslexic',
    description: 'Features heavy weighted bottoms to anchor letters and reduce rotation or flipping.',
    badge: 'Dyslexia Specific',
  },
  atkinson: {
    name: 'Atkinson Hyperlegible',
    cssClass: 'font-atkinson',
    description: 'Created by the Braille Institute to maximize letter distinction for low-vision readers.',
    badge: 'Low Vision Choice',
  },
  comic: {
    name: 'Comic Neue',
    cssClass: 'font-comic',
    description: 'Casual, friendly letterforms with distinct shapes that many readers find very approachable.',
    badge: 'Friendly',
  },
  sans: {
    name: 'Modern Sans',
    cssClass: 'font-sans-clean',
    description: 'Clean, neutral modern sans-serif typography with balanced proportions.',
    badge: 'Standard',
  },
  serif: {
    name: 'Merriweather Serif',
    cssClass: 'font-serif-clean',
    description: 'A pleasant text face designed to be highly readable at moderate sizes on screens.',
    badge: 'Classic',
  },
  mono: {
    name: 'Monospace Grid',
    cssClass: 'font-mono-clean',
    description: 'Every character occupies uniform width, making letter boundaries unmistakable.',
    badge: 'Uniform Width',
  },
};
