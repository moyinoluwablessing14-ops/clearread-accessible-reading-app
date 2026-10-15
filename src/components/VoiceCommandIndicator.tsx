import React, { useState } from 'react';
import { Mic, MicOff, Sparkles, HelpCircle, X, Check } from 'lucide-react';
import { VoiceCommand } from '../types';

interface VoiceCommandIndicatorProps {
  isListening: boolean;
  onToggleListening: () => void;
  lastTranscript: string;
  lastCommand: VoiceCommand | null;
  errorMessage: string | null;
  onDismissError: () => void;
  isSupported: boolean;
}

export const VoiceCommandIndicator: React.FC<VoiceCommandIndicatorProps> = ({
  isListening,
  onToggleListening,
  lastTranscript,
  lastCommand,
  errorMessage,
  onDismissError,
  isSupported,
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div
      role="region"
      aria-label="Voice Controls"
      className="fixed bottom-24 sm:bottom-24 md:bottom-8 right-3 sm:right-6 z-30 flex flex-col items-end gap-2 text-xs pointer-events-auto"
    >
      {/* Unsupported browser or mic permission error warning */}
      {errorMessage && (
        <div
          role="alert"
          className="bg-red-900 text-white p-3 rounded-xl shadow-lg border border-red-700 max-w-xs flex items-start gap-2.5"
        >
          <div className="flex-1">
            <p className="font-bold">Voice Command Alert</p>
            <p className="text-[11px] opacity-90 mt-0.5">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={onDismissError}
            className="p-1 hover:bg-white/20 rounded"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Voice Help Dialog */}
      {showHelp && (
        <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-xl border border-stone-700 max-w-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5 text-amber-400">
              <Mic className="w-3.5 h-3.5" /> Voice Commands
            </span>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="p-1 text-stone-400 hover:text-white"
              aria-label="Close voice commands help"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-stone-300">
            Say any of these commands clearly into your microphone:
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-amber-300">
            <span className="bg-stone-800 px-2 py-1 rounded">"read"</span>
            <span className="bg-stone-800 px-2 py-1 rounded">"pause"</span>
            <span className="bg-stone-800 px-2 py-1 rounded">"next"</span>
            <span className="bg-stone-800 px-2 py-1 rounded">"previous"</span>
            <span className="bg-stone-800 px-2 py-1 rounded">"simplify"</span>
            <span className="bg-stone-800 px-2 py-1 rounded">"bigger text"</span>
            <span className="bg-stone-800 px-2 py-1 rounded">"smaller text"</span>
            <span className="bg-stone-800 px-2 py-1 rounded">"high contrast"</span>
          </div>
        </div>
      )}

      {/* Recognized Command Notification pill */}
      {lastCommand && (
        <div
          role="status"
          aria-live="assertive"
          className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Executed: "{lastCommand}"</span>
        </div>
      )}

      {/* Active Transcript Bar */}
      {isListening && lastTranscript && (
        <div className="bg-stone-900/90 text-stone-200 px-3 py-1 rounded-lg backdrop-blur-xs max-w-xs truncate border border-stone-700">
          Hearing: <span className="text-amber-400 font-semibold">{lastTranscript}</span>
        </div>
      )}

      {/* Main Mic Toggle Button */}
      {isMinimized ? (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all ${
            isListening
              ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-400'
              : 'bg-stone-900 text-amber-300 hover:bg-stone-800 border border-stone-700'
          }`}
          title="Expand Voice Controls"
          aria-label="Expand voice controls"
        >
          {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
      ) : (
        <div className="flex items-center gap-1.5 bg-stone-900/95 text-white p-1.5 rounded-full shadow-xl border border-stone-700">
          <button
            type="button"
            onClick={onToggleListening}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-bold text-xs transition-all min-h-[44px] ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse ring-2 ring-red-400'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
            }`}
            aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
            aria-pressed={isListening}
          >
            {isListening ? (
              <>
                <Mic className="w-4 h-4 text-white" />
                <span>Voice Active</span>
              </>
            ) : (
              <>
                <MicOff className="w-4 h-4 text-stone-400" />
                <span>Voice Commands</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 text-stone-400 hover:text-amber-400 rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Voice command help"
            aria-label="View list of available voice commands"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-2 text-stone-400 hover:text-white rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Minimize to floating button"
            aria-label="Minimize voice controls"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
