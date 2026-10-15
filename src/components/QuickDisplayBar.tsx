import React from 'react';
import {
  Sliders,
  Type,
  Sun,
  Eye,
  Maximize2,
  Sparkles,
  BookOpen,
  Split,
} from 'lucide-react';
import { DisplaySettings, FontOption, ThemeOption } from '../types';
import { FONT_CONFIGS, THEME_CONFIGS } from '../constants/defaults';

interface QuickDisplayBarProps {
  settings: DisplaySettings;
  onUpdateSettings: (newSettings: DisplaySettings) => void;
  onOpenFullControls: () => void;
}

export const QuickDisplayBar: React.FC<QuickDisplayBarProps> = ({
  settings,
  onUpdateSettings,
  onOpenFullControls,
}) => {
  const currentFontCfg = FONT_CONFIGS[settings.font];
  const currentThemeCfg = THEME_CONFIGS[settings.theme];

  return (
    <div
      role="region"
      aria-label="Quick reading adjustments"
      className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-2.5 sm:p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-stone-800"
    >
      {/* Font & Quick Size */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Quick font toggle */}
        <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200/70">
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, font: 'lexend' })}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
              settings.font === 'lexend'
                ? 'bg-white shadow-xs text-amber-900 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Lexend Font (Designed for Reading Fluency)"
          >
            Lexend
          </button>
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, font: 'opendyslexic' })}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all min-h-[36px] font-opendyslexic ${
              settings.font === 'opendyslexic'
                ? 'bg-white shadow-xs text-amber-900 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="OpenDyslexic Font (Weighted Letter Bottoms)"
          >
            OpenDyslexic
          </button>
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, font: 'atkinson' })}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
              settings.font === 'atkinson'
                ? 'bg-white shadow-xs text-amber-900 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Atkinson Hyperlegible (Braille Institute Low-Vision Font)"
          >
            Atkinson
          </button>
        </div>

        {/* Font size adjustments */}
        <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200/70 gap-1">
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, fontSize: Math.max(14, settings.fontSize - 2) })}
            disabled={settings.fontSize <= 14}
            className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 disabled:opacity-40 text-xs font-bold flex items-center justify-center min-w-[34px] min-h-[34px]"
            title="Decrease text size"
            aria-label="Decrease text size"
          >
            A-
          </button>
          <span className="text-xs font-bold text-stone-700 px-1.5 tabular-nums">
            {settings.fontSize}px
          </span>
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, fontSize: Math.min(36, settings.fontSize + 2) })}
            disabled={settings.fontSize >= 36}
            className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 disabled:opacity-40 text-xs font-bold flex items-center justify-center min-w-[34px] min-h-[34px]"
            title="Increase text size"
            aria-label="Increase text size"
          >
            A+
          </button>
        </div>
      </div>

      {/* Quick Theme Switcher & Reading Tools */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Quick color dots */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200/70">
          {(['cream', 'yellow', 'mint', 'blue', 'white', 'dark'] as ThemeOption[]).map((themeKey) => {
            const isSelected = settings.theme === themeKey;
            const themeConfig = THEME_CONFIGS[themeKey];
            return (
              <button
                key={themeKey}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, theme: themeKey })}
                className={`w-7 h-7 rounded-full border transition-transform relative flex items-center justify-center ${
                  isSelected ? 'scale-110 ring-2 ring-amber-600 ring-offset-1' : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: themeConfig.previewBg,
                  borderColor: themeKey === 'white' ? '#d1d5db' : '#9ca3af',
                }}
                title={themeConfig.label}
                aria-label={`Switch color to ${themeConfig.label}`}
              >
                {isSelected && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: themeConfig.previewText }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Reading Ruler Toggle */}
        <button
          type="button"
          onClick={() =>
            onUpdateSettings({ ...settings, showReadingRuler: !settings.showReadingRuler })
          }
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors min-h-[38px] ${
            settings.showReadingRuler
              ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
              : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200/70'
          }`}
          title="Toggle Focus Reading Ruler"
          aria-pressed={settings.showReadingRuler}
        >
          <Eye className="w-3.5 h-3.5" />
          Ruler {settings.showReadingRuler ? 'On' : 'Off'}
        </button>

        {/* Chunk mode toggle */}
        <button
          type="button"
          onClick={() =>
            onUpdateSettings({ ...settings, focusChunkMode: !settings.focusChunkMode })
          }
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors min-h-[38px] ${
            settings.focusChunkMode
              ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
              : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200/70'
          }`}
          title="Toggle Chunk Guided Focus (One paragraph at a time)"
          aria-pressed={settings.focusChunkMode}
        >
          <Split className="w-3.5 h-3.5" />
          {settings.focusChunkMode ? '1-Chunk Mode' : 'Full Page'}
        </button>

        {/* All Display Controls Modal Trigger */}
        <button
          type="button"
          onClick={onOpenFullControls}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white flex items-center gap-1.5 shadow-xs transition-colors min-h-[38px]"
          aria-label="Open complete display and accessibility controls dialog"
        >
          <Sliders className="w-3.5 h-3.5" />
          All Controls
        </button>
      </div>
    </div>
  );
};
