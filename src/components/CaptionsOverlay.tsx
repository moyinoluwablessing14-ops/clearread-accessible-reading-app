import React from 'react';
import { Subtitles, X } from 'lucide-react';

interface CaptionsOverlayProps {
  sentence: string;
  currentWord?: string;
  onClose: () => void;
  isVisible: boolean;
}

export const CaptionsOverlay: React.FC<CaptionsOverlayProps> = ({
  sentence,
  currentWord,
  onClose,
  isVisible,
}) => {
  if (!isVisible || !sentence) return null;

  return (
    <aside
      aria-label="Real-time Spoken Captions"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-2xl z-50 transition-all duration-200"
    >
      <div className="bg-black/95 text-white border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center shrink-0 font-bold">
            <Subtitles className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Spoken Caption
              </span>
              {currentWord && (
                <span className="text-[11px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                  {currentWord}
                </span>
              )}
            </div>
            <p className="text-base sm:text-xl font-bold leading-relaxed tracking-normal font-lexend text-white">
              {sentence}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Hide live captions overlay"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
