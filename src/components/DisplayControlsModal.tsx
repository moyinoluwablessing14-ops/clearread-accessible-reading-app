import React, { useState } from 'react';
import {
  Type,
  X,
  Check,
  Bookmark,
  Trash2,
  Sparkles,
  RotateCcw,
  Sliders,
  Eye,
  Maximize2,
  BookmarkCheck,
} from 'lucide-react';
import { DisplaySettings, ReadingProfile, FontOption, ThemeOption } from '../types';
import {
  FONT_CONFIGS,
  THEME_CONFIGS,
  DEFAULT_DISPLAY_SETTINGS,
} from '../constants/defaults';

interface DisplayControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DisplaySettings;
  onUpdateSettings: (newSettings: DisplaySettings) => void;
  profiles: ReadingProfile[];
  activeProfileId: string;
  onSelectProfile: (profile: ReadingProfile) => void;
  onSaveNewProfile: (name: string, settings: DisplaySettings) => void;
  onDeleteProfile: (id: string) => void;
}

export const DisplayControlsModal: React.FC<DisplayControlsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  profiles,
  activeProfileId,
  onSelectProfile,
  onSaveNewProfile,
  onDeleteProfile,
}) => {
  const [profileNameInput, setProfileNameInput] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'typography' | 'theme' | 'profiles'>('typography');

  if (!isOpen) return null;

  const handleFontChange = (font: FontOption) => {
    onUpdateSettings({ ...settings, font });
  };

  const handleThemeChange = (theme: ThemeOption) => {
    onUpdateSettings({ ...settings, theme });
  };

  const handleFontSizeChange = (fontSize: number) => {
    onUpdateSettings({ ...settings, fontSize });
  };

  const handleLineSpacingChange = (lineSpacing: number) => {
    onUpdateSettings({ ...settings, lineSpacing });
  };

  const handleLetterSpacingChange = (letterSpacing: number) => {
    onUpdateSettings({ ...settings, letterSpacing });
  };

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileNameInput.trim()) return;
    onSaveNewProfile(profileNameInput.trim(), settings);
    setProfileNameInput('');
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2500);
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleResetDefaults = () => {
    onUpdateSettings(DEFAULT_DISPLAY_SETTINGS);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="display-controls-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5 text-amber-700" aria-hidden="true" />
            </div>
            <div>
              <h2 id="display-controls-title" className="text-lg font-bold text-stone-900">
                Display & Accessibility Controls
              </h2>
              <p className="text-xs text-stone-500">
                Customize typography, contrast, spacing, and reading overlays
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-xl transition-colors focus:ring-2 focus:ring-amber-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close display controls dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100/60 px-5 pt-2 gap-2 text-sm">
          <button
            onClick={() => setActiveTab('typography')}
            className={`px-4 py-2.5 font-medium rounded-t-lg transition-colors border-b-2 flex items-center gap-2 min-h-[44px] ${
              activeTab === 'typography'
                ? 'border-amber-600 text-amber-900 bg-white font-semibold shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Type className="w-4 h-4" />
            Fonts & Spacing
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-4 py-2.5 font-medium rounded-t-lg transition-colors border-b-2 flex items-center gap-2 min-h-[44px] ${
              activeTab === 'theme'
                ? 'border-amber-600 text-amber-900 bg-white font-semibold shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            Colors & Ruler
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-4 py-2.5 font-medium rounded-t-lg transition-colors border-b-2 flex items-center gap-2 min-h-[44px] ${
              activeTab === 'profiles'
                ? 'border-amber-600 text-amber-900 bg-white font-semibold shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved Profiles ({profiles.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* TAB 1: Typography */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              {/* Font Family selection */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Reading Font
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(Object.keys(FONT_CONFIGS) as FontOption[]).map((key) => {
                    const cfg = FONT_CONFIGS[key];
                    const isSelected = settings.font === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleFontChange(key)}
                        className={`text-left p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[72px] ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-base font-bold ${cfg.cssClass}`}>
                            {cfg.name}
                          </span>
                          <span
                            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-stone-200/80 text-stone-700'
                            }`}
                          >
                            {cfg.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {cfg.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="font-size-slider" className="text-sm font-semibold text-stone-900">
                    Text Size: <span className="text-amber-800">{settings.fontSize}px</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleFontSizeChange(Math.max(14, settings.fontSize - 2))}
                      disabled={settings.fontSize <= 14}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-stone-300 hover:bg-stone-100 disabled:opacity-40 min-h-[36px]"
                      aria-label="Decrease font size"
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFontSizeChange(Math.min(36, settings.fontSize + 2))}
                      disabled={settings.fontSize >= 36}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-stone-300 hover:bg-stone-100 disabled:opacity-40 min-h-[36px]"
                      aria-label="Increase font size"
                    >
                      A+
                    </button>
                  </div>
                </div>
                <input
                  id="font-size-slider"
                  type="range"
                  min="14"
                  max="36"
                  step="1"
                  value={settings.fontSize}
                  onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-[11px] text-stone-500 mt-1.5 font-medium">
                  <span>14px (Compact)</span>
                  <span>19px (Standard)</span>
                  <span>26px (Large)</span>
                  <span>36px (Super Size)</span>
                </div>
              </div>

              {/* Line Spacing */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Line Spacing (Height between lines)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Normal', val: 1.5 },
                    { label: 'Relaxed', val: 1.8 },
                    { label: 'Wide', val: 2.1 },
                    { label: 'Loose', val: 2.4 },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => handleLineSpacingChange(item.val)}
                      className={`py-2 px-2 text-center rounded-xl border text-xs font-semibold transition-all min-h-[44px] ${
                        settings.lineSpacing === item.val
                          ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                          : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {item.label}
                      <span className="block text-[10px] text-stone-500 font-normal">
                        {item.val}x
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Letter Spacing */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Letter Spacing (Distance between characters)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Standard', val: 0 },
                    { label: 'Slight', val: 0.04 },
                    { label: 'Dyslexia+', val: 0.08 },
                    { label: 'Maximum', val: 0.14 },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => handleLetterSpacingChange(item.val)}
                      className={`py-2 px-2 text-center rounded-xl border text-xs font-semibold transition-all min-h-[44px] ${
                        settings.letterSpacing === item.val
                          ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                          : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {item.label}
                      <span className="block text-[10px] text-stone-500 font-normal">
                        +{item.val}em
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Themes & Reading Ruler */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              {/* Background Color themes */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Background Color & Contrast Theme
                </label>
                <p className="text-xs text-stone-500 mb-3">
                  Soft tinted colors reduce optical glare and visual distortion for dyslexic and photophobic readers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(Object.keys(THEME_CONFIGS) as ThemeOption[]).map((key) => {
                    const cfg = THEME_CONFIGS[key];
                    const isSelected = settings.theme === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleThemeChange(key)}
                        className={`text-left p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-3 min-h-[58px] ${
                          isSelected
                            ? 'border-amber-600 ring-2 ring-amber-500/20'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                        style={{ backgroundColor: cfg.previewBg }}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-7 h-7 rounded-full border border-black/20 flex items-center justify-center font-bold text-xs shrink-0"
                            style={{ backgroundColor: cfg.previewBg, color: cfg.previewText }}
                          >
                            Aa
                          </span>
                          <div>
                            <span
                              className="text-sm font-bold block"
                              style={{ color: cfg.previewText }}
                            >
                              {cfg.label}
                            </span>
                            <span
                              className="text-[11px] opacity-80 block line-clamp-1"
                              style={{ color: cfg.previewText }}
                            >
                              {cfg.description}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reading Ruler Toggle */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="reading-ruler-toggle" className="text-sm font-semibold text-stone-900 block cursor-pointer">
                      Assistive Reading Ruler
                    </label>
                    <p className="text-xs text-stone-500">
                      Shades the page and follows your pointer with a highlight window to prevent skipping lines.
                    </p>
                  </div>
                  <input
                    id="reading-ruler-toggle"
                    type="checkbox"
                    checked={settings.showReadingRuler}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, showReadingRuler: e.target.checked })
                    }
                    className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                </div>

                {settings.showReadingRuler && (
                  <div className="pt-2 border-t border-stone-200">
                    <label htmlFor="ruler-height-range" className="text-xs font-semibold text-stone-700 block mb-1">
                      Ruler Window Height: {settings.rulerHeight}px
                    </label>
                    <input
                      id="ruler-height-range"
                      type="range"
                      min="40"
                      max="120"
                      step="4"
                      value={settings.rulerHeight}
                      onChange={(e) =>
                        onUpdateSettings({ ...settings, rulerHeight: Number(e.target.value) })
                      }
                      className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>
                )}
              </div>

              {/* Chunk Guided Mode */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="chunk-guided-mode" className="text-sm font-semibold text-stone-900 block cursor-pointer">
                      Step-by-Step Chunk Mode
                    </label>
                    <p className="text-xs text-stone-500">
                      Display one paragraph chunk at a time with Previous/Next buttons to eliminate cognitive overwhelm.
                    </p>
                  </div>
                  <input
                    id="chunk-guided-mode"
                    type="checkbox"
                    checked={settings.focusChunkMode}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, focusChunkMode: e.target.checked })
                    }
                    className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Saved Profiles */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              {/* Save current as new profile */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
                <h3 className="text-sm font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-amber-700" />
                  Save Current Settings as Profile
                </h3>
                <p className="text-xs text-amber-800 mb-3">
                  Store this font, size, line spacing, and color theme combination for quick 1-click loading anytime.
                </p>
                <form onSubmit={handleSaveProfileSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={profileNameInput}
                    onChange={(e) => setProfileNameInput(e.target.value)}
                    placeholder="e.g. Maya's Homework Preset, Science Reader..."
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-amber-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={!profileNameInput.trim()}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors min-h-[44px]"
                  >
                    Save Profile
                  </button>
                </form>
                {showSaveSuccess && (
                  <p className="text-xs font-semibold text-emerald-800 mt-2 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-700" /> Profile saved successfully!
                  </p>
                )}
              </div>

              {/* Profiles list */}
              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-2">Available Profiles</h3>
                <div className="space-y-2">
                  {profiles.map((prof) => {
                    const isActive = activeProfileId === prof.id;
                    return (
                      <div
                        key={prof.id}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isActive
                            ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectProfile(prof)}
                          className="flex-1 text-left min-h-[44px] flex flex-col justify-center"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-900">{prof.name}</span>
                            {prof.isCustom ? (
                              <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
                                Custom
                              </span>
                            ) : (
                              <span className="text-[10px] bg-stone-200 text-stone-700 font-semibold px-2 py-0.5 rounded-full">
                                Built-in
                              </span>
                            )}
                            {isActive && (
                              <span className="text-[10px] bg-amber-200 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Font: {FONT_CONFIGS[prof.settings.font]?.name} • Size: {prof.settings.fontSize}px • Theme:{' '}
                            {THEME_CONFIGS[prof.settings.theme]?.label}
                          </p>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectProfile(prof)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors min-h-[38px] ${
                              isActive
                                ? 'bg-amber-600 text-white'
                                : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {isActive ? 'Applied' : 'Apply'}
                          </button>
                          {prof.isCustom && (
                            <button
                              type="button"
                              onClick={() => onDeleteProfile(prof.id)}
                              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
                              title="Delete custom profile"
                              aria-label={`Delete custom profile ${prof.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-medium px-2 py-1.5 rounded-lg hover:bg-stone-200/60 min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Dyslexia Defaults
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-colors shadow-xs min-h-[44px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
