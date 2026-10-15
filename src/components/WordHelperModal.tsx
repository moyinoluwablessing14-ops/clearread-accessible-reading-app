import React, { useState, useEffect } from 'react';
import { Volume2, X, Bookmark, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { speechService } from '../utils/speech';

interface WordHelperModalProps {
  word: string | null;
  contextSentence?: string;
  onClose: () => void;
  onSaveTrickyWord?: (word: string) => void;
  isSaved?: boolean;
}

interface WordDetails {
  word: string;
  syllables: string;
  definition: string;
  partOfSpeech: string;
  exampleSentence: string;
}

export const WordHelperModal: React.FC<WordHelperModalProps> = ({
  word,
  contextSentence = '',
  onClose,
  onSaveTrickyWord,
  isSaved = false,
}) => {
  const [details, setDetails] = useState<WordDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  useEffect(() => {
    if (!word) {
      setDetails(null);
      return;
    }

    const clean = word.trim().replace(/[^a-zA-Z-]/g, '');
    if (!clean) return;

    let isMounted = true;
    setIsLoading(true);
    setSaved(isSaved);

    fetch('/api/word-helper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: clean, context: contextSentence }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setDetails(res.data);
        } else {
          // Fallback
          setDetails({
            word: clean,
            syllables: clean.length <= 4 ? clean : clean.replace(/([aeiouy]+)([^aeiouy]+)/gi, '$1-$2'),
            definition: 'A useful word from your reading text.',
            partOfSpeech: 'word',
            exampleSentence: `Notice how "${clean}" is used in the story.`,
          });
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setDetails({
          word: clean,
          syllables: clean,
          definition: 'A vocabulary word. Tap "Hear It" to listen.',
          partOfSpeech: 'word',
          exampleSentence: `Practice saying "${clean}" aloud.`,
        });
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [word, contextSentence, isSaved]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!word) return null;

  const cleanWord = word.replace(/[^a-zA-Z-]/g, '');

  const handleHearIt = () => {
    speechService.announce(cleanWord);
  };

  const handleSave = () => {
    if (!saved && onSaveTrickyWord) {
      onSaveTrickyWord(cleanWord);
      setSaved(true);
      speechService.announce(`Saved ${cleanWord} to tricky words.`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-helper-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden font-lexend p-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                Word Helper
              </span>
              <h3 id="word-helper-title" className="text-xl font-bold text-stone-900 capitalize">
                {cleanWord}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center transition-colors"
            aria-label="Close word helper"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center text-stone-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-teal-700" />
            <p className="text-xs font-medium">Looking up definition...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Syllable split badge */}
            <div className="flex items-center justify-between gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Syllables</span>
                <span className="text-sm font-bold text-teal-900 tracking-wide font-mono">
                  {details?.syllables || cleanWord}
                </span>
              </div>
              {details?.partOfSpeech && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                  {details.partOfSpeech}
                </span>
              )}
            </div>

            {/* Definition */}
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wide block mb-1">
                Meaning
              </span>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                {details?.definition || 'Tap Hear It to practice pronouncing.'}
              </p>
            </div>

            {/* Example */}
            {details?.exampleSentence && (
              <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-100/60 text-xs text-teal-950 italic">
                "{details.exampleSentence}"
              </div>
            )}

            {/* Actions: Hear It & Save */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={handleHearIt}
                className="py-2.5 px-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear It</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saved}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  saved
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 cursor-default'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                <span>{saved ? 'Saved Word' : 'Save Tricky'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
