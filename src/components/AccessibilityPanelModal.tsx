import React, { useState } from 'react';
import {
  Accessibility,
  X,
  Check,
  Volume2,
  Mic,
  Subtitles,
  Eye,
  Type,
  Sparkles,
  Sliders,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Ear,
  Sun,
} from 'lucide-react';
import {
  AccessibilitySettings,
  AccessibilityNeed,
  DisplaySettings,
  FontOption,
  ThemeOption,
} from '../types';
import {
  FONT_CONFIGS,
  THEME_CONFIGS,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  DEFAULT_DISPLAY_SETTINGS,
} from '../constants/defaults';
import { speechService } from '../utils/speech';

interface AccessibilityPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessibilitySettings: AccessibilitySettings;
  onUpdateAccessibility: (settings: AccessibilitySettings) => void;
  displaySettings: DisplaySettings;
  onUpdateDisplay: (settings: DisplaySettings) => void;
  isFirstLaunch?: boolean;
}

export const AccessibilityPanelModal: React.FC<AccessibilityPanelModalProps> = ({
  isOpen,
  onClose,
  accessibilitySettings,
  onUpdateAccessibility,
  displaySettings,
  onUpdateDisplay,
  isFirstLaunch = false,
}) => {
  const [activeTab, setActiveTab] = useState<'welcome' | 'vision' | 'hearing' | 'audio'>(
    isFirstLaunch ? 'welcome' : 'welcome'
  );

  if (!isOpen) return null;

  const voices = speechService.getVoices();

  const handleToggleNeed = (need: AccessibilityNeed) => {
    const currentNeeds = [...accessibilitySettings.userNeeds];
    const exists = currentNeeds.includes(need);
    const updatedNeeds = exists
      ? currentNeeds.filter((n) => n !== need)
      : [...currentNeeds, need];

    let newAccess = { ...accessibilitySettings, userNeeds: updatedNeeds };
    let newDisplay = { ...displaySettings };

    // Auto-apply tailored profile combinations based on selected needs
    if (!exists) {
      if (need === 'dyslexia') {
        newDisplay.font = 'lexend';
        newDisplay.fontSize = Math.max(newDisplay.fontSize, 20);
        newDisplay.lineSpacing = 1.9;
        newDisplay.letterSpacing = 0.06;
        if (newDisplay.theme === 'white') newDisplay.theme = 'cream';
        newAccess.plainLanguageMode = true;
      }
      if (need === 'low-vision') {
        newDisplay.font = 'atkinson';
        newDisplay.fontSize = 32; // 200% scale
        newDisplay.lineSpacing = 2.0;
        newDisplay.theme = 'high-contrast-yellow';
        newAccess.audioFirstMode = true;
        newAccess.voiceCommandsEnabled = true;
      }
      if (need === 'deaf-hoh') {
        newAccess.captionsEnabled = true;
        newAccess.plainLanguageMode = true;
        newAccess.showWordIcons = true;
        newAccess.audioFirstMode = false;
      }
      if (need === 'ell') {
        newAccess.plainLanguageMode = true;
        newAccess.showWordIcons = true;
        newAccess.speechRate = 0.85; // Slightly slower speech for clarity
      }
    }

    onUpdateAccessibility(newAccess);
    onUpdateDisplay(newDisplay);
  };

  const handleFinishWelcome = () => {
    onUpdateAccessibility({
      ...accessibilitySettings,
      hasCompletedWelcomeSurvey: true,
    });
    onClose();
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinishWelcome();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, accessibilitySettings]);

  if (!isOpen) return null;

  const voices = speechService.getVoices();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/65 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-panel-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleFinishWelcome();
        }
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col text-stone-900">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-stone-200 bg-amber-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Accessibility className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id="accessibility-panel-title" className="text-lg sm:text-xl font-bold tracking-tight">
                {isFirstLaunch ? 'Welcome to ClearRead' : 'Accessibility Preferences'}
              </h2>
              <p className="text-xs text-stone-600">
                Tailor ClearRead for dyslexia, blindness, low vision, and deafness
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFinishWelcome}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close accessibility settings dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 px-4 pt-2 gap-1.5 text-xs sm:text-sm overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('welcome')}
            className={`px-3.5 py-2.5 font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 shrink-0 min-h-[44px] ${
              activeTab === 'welcome'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            My Needs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vision')}
            className={`px-3.5 py-2.5 font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 shrink-0 min-h-[44px] ${
              activeTab === 'vision'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-700" />
            Vision & Contrast
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hearing')}
            className={`px-3.5 py-2.5 font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 shrink-0 min-h-[44px] ${
              activeTab === 'hearing'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Ear className="w-4 h-4 text-amber-700" />
            Deaf & Captions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`px-3.5 py-2.5 font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 shrink-0 min-h-[44px] ${
              activeTab === 'audio'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            Audio & Speech
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: HOW CAN CLEARREAD HELP YOU READ? */}
          {activeTab === 'welcome' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4">
                <h3 className="font-bold text-stone-900 text-base mb-1">
                  How can ClearRead help you read?
                </h3>
                <p className="text-xs text-stone-600">
                  Select all that apply. ClearRead will automatically apply the most helpful contrast, speech, typography, and caption settings for you.
                </p>
              </div>

              {/* Checkbox Options */}
              <div className="space-y-3">
                {/* 1. Dyslexia */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer min-h-[72px] ${
                    accessibilitySettings.userNeeds.includes('dyslexia')
                      ? 'border-amber-600 bg-amber-50/80 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={accessibilitySettings.userNeeds.includes('dyslexia')}
                    onChange={() => handleToggleNeed('dyslexia')}
                    className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 mt-1 cursor-pointer shrink-0"
                  />
                  <div>
                    <span className="font-bold text-sm sm:text-base text-stone-900 block">
                      Dyslexia or Reading Discomfort
                    </span>
                    <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                      Auto-applies Lexend font, anti-glare warm cream/yellow tint, wide letter spacing, chunked paragraphs, and reading ruler.
                    </p>
                  </div>
                </label>

                {/* 2. Blind or Low Vision */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer min-h-[72px] ${
                    accessibilitySettings.userNeeds.includes('low-vision')
                      ? 'border-amber-600 bg-amber-50/80 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={accessibilitySettings.userNeeds.includes('low-vision')}
                    onChange={() => handleToggleNeed('low-vision')}
                    className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 mt-1 cursor-pointer shrink-0"
                  />
                  <div>
                    <span className="font-bold text-sm sm:text-base text-stone-900 block">
                      Blindness or Low Vision
                    </span>
                    <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                      Auto-applies Audio-First Mode (spoken screen announcements), 200% large Atkinson font, AAA high-contrast yellow/black, and voice commands.
                    </p>
                  </div>
                </label>

                {/* 3. Deaf or Hard of Hearing */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer min-h-[72px] ${
                    accessibilitySettings.userNeeds.includes('deaf-hoh')
                      ? 'border-amber-600 bg-amber-50/80 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={accessibilitySettings.userNeeds.includes('deaf-hoh')}
                    onChange={() => handleToggleNeed('deaf-hoh')}
                    className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 mt-1 cursor-pointer shrink-0"
                  />
                  <div>
                    <span className="font-bold text-sm sm:text-base text-stone-900 block">
                      Deaf or Hard of Hearing
                    </span>
                    <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                      Guarantees zero sound-dependent cues (100% visual banners & icons), large live read-aloud captions, and plain-language mode with keyword icons.
                    </p>
                  </div>
                </label>

                {/* 4. English Language Learner */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer min-h-[72px] ${
                    accessibilitySettings.userNeeds.includes('ell')
                      ? 'border-amber-600 bg-amber-50/80 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={accessibilitySettings.userNeeds.includes('ell')}
                    onChange={() => handleToggleNeed('ell')}
                    className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 mt-1 cursor-pointer shrink-0"
                  />
                  <div>
                    <span className="font-bold text-sm sm:text-base text-stone-900 block">
                      English Language Learner (ELL) / Vocabulary Building
                    </span>
                    <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                      Applies Easy plain reading level, slower paced read-aloud with word-by-word highlighting, and helpful contextual icons.
                    </p>
                  </div>
                </label>
              </div>

              {/* Notice */}
              <p className="text-xs text-stone-500 italic">
                * You can always modify or fine-tune individual settings anytime from the persistent Accessibility button in the top navigation.
              </p>
            </div>
          )}

          {/* TAB 2: VISION & CONTRAST */}
          {activeTab === 'vision' && (
            <div className="space-y-6">
              {/* Audio-First Mode Toggle */}
              <div className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/70 flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="audio-first-mode-toggle" className="font-bold text-sm text-stone-900 block cursor-pointer">
                    Audio-First Mode (Operate Entire App by Audio)
                  </label>
                  <p className="text-xs text-stone-600 mt-0.5">
                    ClearRead will speak all screen transitions, button clicks, and reading status updates out loud.
                  </p>
                </div>
                <input
                  id="audio-first-mode-toggle"
                  type="checkbox"
                  checked={accessibilitySettings.audioFirstMode}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    onUpdateAccessibility({
                      ...accessibilitySettings,
                      audioFirstMode: checked,
                    });
                    if (checked) {
                      speechService.announce(
                        'Audio First mode activated. ClearRead will speak all screen updates and results aloud.'
                      );
                    }
                  }}
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer shrink-0 mt-0.5"
                />
              </div>

              {/* Large Text Presets (up to 200%) */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <label className="font-bold text-sm text-stone-900 block mb-2">
                  Text Scale Presets (Up to 200%)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Standard (100%)', size: 18 },
                    { label: 'Large (130%)', size: 24 },
                    { label: 'Extra (160%)', size: 29 },
                    { label: 'Max (200%)', size: 36 },
                  ].map((p) => (
                    <button
                      key={p.size}
                      type="button"
                      onClick={() => onUpdateDisplay({ ...displaySettings, fontSize: p.size })}
                      className={`p-2.5 rounded-xl border text-center transition-all min-h-[44px] ${
                        displaySettings.fontSize === p.size
                          ? 'border-amber-600 bg-amber-100/70 text-amber-950 font-bold'
                          : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="block text-xs font-bold">{p.label}</span>
                      <span className="text-[11px] opacity-75">{p.size}px</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* High-Contrast Themes */}
              <div>
                <label className="font-bold text-sm text-stone-900 block mb-2">
                  High-Contrast & Vision Themes
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(['high-contrast-yellow', 'high-contrast-white', 'cream', 'dark'] as ThemeOption[]).map(
                    (themeKey) => {
                      const cfg = THEME_CONFIGS[themeKey];
                      const isSelected = displaySettings.theme === themeKey;
                      return (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={() => onUpdateDisplay({ ...displaySettings, theme: themeKey })}
                          className={`p-3 rounded-xl border-2 flex items-center justify-between text-left min-h-[56px] transition-all ${
                            isSelected
                              ? 'border-amber-600 ring-2 ring-amber-500/20'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                          style={{ backgroundColor: cfg.previewBg }}
                        >
                          <div>
                            <span
                              className="font-bold text-sm block"
                              style={{ color: cfg.previewText }}
                            >
                              {cfg.label}
                            </span>
                            <span
                              className="text-[11px] opacity-80 block"
                              style={{ color: cfg.previewText }}
                            >
                              {cfg.description}
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-amber-500 shrink-0" />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEAF & CAPTIONS */}
          {activeTab === 'hearing' && (
            <div className="space-y-6">
              {/* Visual-Only Guarantee Notice */}
              <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/70">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-sm text-emerald-950">
                    Visual-Only Cues Enforced (No Sound Dependencies)
                  </span>
                </div>
                <p className="text-xs text-emerald-900">
                  Every alert, notification, simplify result, and error in ClearRead is strictly visual with high-contrast color badges, icons, and explicit text.
                </p>
              </div>

              {/* Large On-Screen Captions Toggle */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="captions-mode-toggle" className="font-bold text-sm text-stone-900 block cursor-pointer">
                    Live Large Captions for Read-Aloud
                  </label>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Displays the current sentence in a high-contrast caption bar at the bottom of the screen with active word tracking.
                  </p>
                </div>
                <input
                  id="captions-mode-toggle"
                  type="checkbox"
                  checked={accessibilitySettings.captionsEnabled}
                  onChange={(e) =>
                    onUpdateAccessibility({
                      ...accessibilitySettings,
                      captionsEnabled: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer shrink-0 mt-0.5"
                />
              </div>

              {/* Plain Language Mode */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="plain-lang-toggle" className="font-bold text-sm text-stone-900 block cursor-pointer">
                    Plain-Language Mode
                  </label>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Prefers active voice, shorter sentences, and direct vocabulary in the reading text.
                  </p>
                </div>
                <input
                  id="plain-lang-toggle"
                  type="checkbox"
                  checked={accessibilitySettings.plainLanguageMode}
                  onChange={(e) =>
                    onUpdateAccessibility({
                      ...accessibilitySettings,
                      plainLanguageMode: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer shrink-0 mt-0.5"
                />
              </div>

              {/* Contextual Keyword Icons Toggle */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="keyword-icons-toggle" className="font-bold text-sm text-stone-900 block cursor-pointer">
                    Contextual Word Icons (Nouns & Verbs)
                  </label>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Displays friendly visual cue icons (e.g. 🌱 for plant, 💧 for water, ☀️ for light) beside key terms for visual grounding.
                  </p>
                </div>
                <input
                  id="keyword-icons-toggle"
                  type="checkbox"
                  checked={accessibilitySettings.showWordIcons}
                  onChange={(e) =>
                    onUpdateAccessibility({
                      ...accessibilitySettings,
                      showWordIcons: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer shrink-0 mt-0.5"
                />
              </div>
            </div>
          )}

          {/* TAB 4: AUDIO & SPEECH */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              {/* Voice Commands Toggle */}
              <div className="p-4 rounded-2xl border-2 border-stone-200 bg-stone-50 flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="voice-commands-toggle" className="font-bold text-sm text-stone-900 block cursor-pointer">
                    Microphone Voice Commands
                  </label>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Speak commands: "read", "pause", "next", "previous", "simplify", "bigger text", "smaller text", "high contrast".
                  </p>
                </div>
                <input
                  id="voice-commands-toggle"
                  type="checkbox"
                  checked={accessibilitySettings.voiceCommandsEnabled}
                  onChange={(e) =>
                    onUpdateAccessibility({
                      ...accessibilitySettings,
                      voiceCommandsEnabled: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer shrink-0 mt-0.5"
                />
              </div>

              {/* Speech Rate Slider */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="speech-rate-slider" className="text-sm font-bold text-stone-900">
                    Read-Aloud Speed: <span className="text-amber-800">{accessibilitySettings.speechRate}x</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      speechService.announce(
                        'This is a preview of the current read-aloud speed in ClearRead.',
                        accessibilitySettings.speechRate,
                        accessibilitySettings.selectedVoiceURI
                      )
                    }
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-stone-300 rounded-lg hover:bg-stone-100 min-h-[36px]"
                  >
                    Test Voice
                  </button>
                </div>
                <input
                  id="speech-rate-slider"
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={accessibilitySettings.speechRate}
                  onChange={(e) =>
                    onUpdateAccessibility({
                      ...accessibilitySettings,
                      speechRate: Number(e.target.value),
                    })
                  }
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-[11px] text-stone-500 mt-1 font-medium">
                  <span>0.5x (Slow & Deliberate)</span>
                  <span>1.0x (Normal)</span>
                  <span>1.5x (Fast)</span>
                  <span>2.0x (Screen Reader Rate)</span>
                </div>
              </div>

              {/* Voice Picker */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <label htmlFor="voice-select" className="text-sm font-bold text-stone-900 block mb-1.5">
                  Voice Selection ({voices.length} available)
                </label>
                <select
                  id="voice-select"
                  value={accessibilitySettings.selectedVoiceURI || ''}
                  onChange={(e) =>
                    onUpdateAccessibility({
                      ...accessibilitySettings,
                      selectedVoiceURI: e.target.value || null,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm font-medium focus:ring-2 focus:ring-amber-500 min-h-[44px]"
                >
                  <option value="">Default System Voice</option>
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang}) {v.default ? '★' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onUpdateAccessibility(DEFAULT_ACCESSIBILITY_SETTINGS);
                onUpdateDisplay(DEFAULT_DISPLAY_SETTINGS);
              }}
              className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-semibold text-xs px-2 py-1.5 rounded-lg hover:bg-stone-200/60 min-h-[40px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All
            </button>
            {isFirstLaunch && (
              <button
                type="button"
                onClick={handleFinishWelcome}
                className="text-stone-500 hover:text-stone-800 font-semibold text-xs px-2.5 py-1.5 rounded-lg hover:bg-stone-200/60 min-h-[40px]"
              >
                Skip for now
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleFinishWelcome}
            className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm rounded-xl shadow-xs transition-colors min-h-[44px]"
          >
            {isFirstLaunch ? 'Start Reading with ClearRead' : 'Save & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
