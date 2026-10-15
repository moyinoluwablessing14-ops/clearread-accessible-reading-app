import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Square,
  Sliders,
  Subtitles,
  Eye,
  Copy,
  Printer,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  Clock,
  FileText,
  Lock,
  BookOpen,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  ProcessedDocument,
  DisplaySettings,
  AccessibilitySettings,
  TextChunk,
  User,
  QuizResult,
} from '../../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../../constants/defaults';
import { speechService, SpeechWordBoundary } from '../../utils/speech';
import { getWordIcon } from '../../utils/keywordIcons';
import { WordHelperModal } from '../WordHelperModal';
import { ComprehensionQuizModal } from '../ComprehensionQuizModal';
import { recordReadingMinutes, recordQuizResult, saveTrickyWord } from '../../utils/storage';

interface FocusedReaderScreenProps {
  document: ProcessedDocument;
  settings: DisplaySettings;
  onUpdateSettings: (newSettings: DisplaySettings) => void;
  onOpenDisplayControls: () => void;
  onBackToInput: () => void;
  accessibilitySettings: AccessibilitySettings;
  onUpdateAccessibility: (settings: AccessibilitySettings) => void;
  onSpokenSentenceChange?: (sentence: string, currentWord?: string) => void;
  voiceCommandTrigger?: string | null;
  user?: User;
  onOpenUpgradeModal?: (featureName: string, requiredPlan?: 'plus' | 'family') => void;
}

export const FocusedReaderScreen: React.FC<FocusedReaderScreenProps> = ({
  document,
  settings,
  onUpdateSettings,
  onOpenDisplayControls,
  onBackToInput,
  accessibilitySettings,
  onUpdateAccessibility,
  onSpokenSentenceChange,
  voiceCommandTrigger,
  user,
  onOpenUpgradeModal,
}) => {
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Word Helper modal state
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [contextSentence, setContextSentence] = useState<string>('');

  // Comprehension Quiz state
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizScoreNotice, setQuizScoreNotice] = useState<string | null>(null);

  // Track real reading minutes while this screen is active
  useEffect(() => {
    // Record 1 reading minute every 60 seconds
    const interval = setInterval(() => {
      recordReadingMinutes(1);
    }, 60000);
    // Also record initial minute for opening and reading document
    recordReadingMinutes(1);
    return () => clearInterval(interval);
  }, []);

  // Read-Aloud state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speakingChunkIndex, setSpeakingChunkIndex] = useState<number | null>(null);
  const [currentWordCharIndex, setCurrentWordCharIndex] = useState<number | null>(null);
  const [currentSpokenWord, setCurrentSpokenWord] = useState<string>('');

  const themeConfig = THEME_CONFIGS[settings.theme] || THEME_CONFIGS.cream;
  const fontConfig = FONT_CONFIGS[settings.font] || FONT_CONFIGS.lexend;

  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  // Voice command execution
  useEffect(() => {
    if (!voiceCommandTrigger) return;
    if (voiceCommandTrigger === 'read') handlePlay();
    else if (voiceCommandTrigger === 'pause') handlePause();
    else if (voiceCommandTrigger === 'next') {
      setActiveChunkIndex((prev) => Math.min(document.chunks.length - 1, prev + 1));
    } else if (voiceCommandTrigger === 'previous') {
      setActiveChunkIndex((prev) => Math.max(0, prev - 1));
    }
  }, [voiceCommandTrigger]);

  const startReadingChunk = (chunkIndex: number) => {
    if (chunkIndex < 0 || chunkIndex >= document.chunks.length) {
      handleStop();
      return;
    }

    const chunk = document.chunks[chunkIndex];
    const textToSpeak = `${chunk.heading}. ${chunk.paragraph}`;
    setSpeakingChunkIndex(chunkIndex);
    setActiveChunkIndex(chunkIndex);

    speechService.speakWithWordTracking({
      text: textToSpeak,
      rate: accessibilitySettings.speechRate,
      pitch: accessibilitySettings.speechPitch,
      voiceURI: accessibilitySettings.selectedVoiceURI,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
        onSpokenSentenceChange?.(textToSpeak.slice(0, 80));
      },
      onBoundary: (boundary: SpeechWordBoundary) => {
        setCurrentWordCharIndex(boundary.charIndex);
        const substr = textToSpeak.slice(boundary.charIndex);
        const match = substr.match(/^\S+/);
        const word = match ? match[0].replace(/[.,!?;:]/g, '') : '';
        setCurrentSpokenWord(word);

        const before = textToSpeak.slice(0, boundary.charIndex);
        const lastSentenceStart = Math.max(
          0,
          before.lastIndexOf('.') + 1,
          before.lastIndexOf('?') + 1,
          before.lastIndexOf('!') + 1
        );
        const after = textToSpeak.slice(boundary.charIndex);
        const nextSentenceEnd = after.search(/[.?!]/);
        const sentenceEnd =
          nextSentenceEnd !== -1 ? boundary.charIndex + nextSentenceEnd + 1 : textToSpeak.length;
        const currentSentence = textToSpeak.slice(lastSentenceStart, sentenceEnd).trim();

        onSpokenSentenceChange?.(currentSentence, word);
      },
      onEnd: () => {
        if (chunkIndex + 1 < document.chunks.length) {
          startReadingChunk(chunkIndex + 1);
        } else {
          handleStop();
          if (accessibilitySettings.audioFirstMode) {
            speechService.announce('Finished reading the entire document.');
          }
        }
      },
      onError: () => handleStop(),
    });
  };

  const handlePlay = () => {
    if (isPaused) {
      speechService.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      startReadingChunk(activeChunkIndex);
    }
  };

  const handlePause = () => {
    speechService.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    speechService.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setSpeakingChunkIndex(null);
    setCurrentWordCharIndex(null);
    setCurrentSpokenWord('');
    onSpokenSentenceChange?.('');
  };

  const handleCopyCleanText = async () => {
    try {
      const summaryText = document.keyPoints.map((k) => `• ${k}`).join('\n');
      const chunksText = document.chunks
        .map((c) => `### ${c.heading}\n${c.paragraph}`)
        .join('\n\n');
      const fullClean = `${document.title}\n\nKey Takeaways:\n${summaryText}\n\n${chunksText}`;
      await navigator.clipboard.writeText(fullClean);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
      if (accessibilitySettings.audioFirstMode) {
        speechService.announce('Clean text copied to clipboard.');
      }
    } catch {
      // ignore
    }
  };

  // Handle clicking any word in the reading screen for Word Helper
  const handleWordClick = (rawWord: string, sentence: string) => {
    const clean = rawWord.trim().replace(/[^a-zA-Z-]/g, '');
    if (!clean) return;

    setSelectedWord(clean);
    setContextSentence(sentence);
  };

  // Helper to render paragraph with word-by-word highlight and optional keyword icons
  const renderParagraphWithAccessibility = (text: string, isThisChunkSpeaking: boolean) => {
    const words = text.split(/(\s+)/);
    let cumulativeCharIndex = 0;

    return (
      <span>
        {words.map((token, idx) => {
          const isWhitespace = /^\s+$/.test(token);
          const wordStart = cumulativeCharIndex;
          cumulativeCharIndex += token.length;

          if (isWhitespace) {
            return <span key={idx}>{token}</span>;
          }

          const hasLetters = /[a-zA-Z]/.test(token);

          const isWordSpoken =
            isThisChunkSpeaking &&
            currentWordCharIndex !== null &&
            wordStart <= currentWordCharIndex &&
            currentWordCharIndex < wordStart + token.length + 2;

          const icon = accessibilitySettings.showWordIcons ? getWordIcon(token) : null;

          return (
            <span
              key={idx}
              onClick={() => {
                if (hasLetters) {
                  handleWordClick(token, text);
                }
              }}
              onKeyDown={(e) => {
                if (hasLetters && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleWordClick(token, text);
                }
              }}
              tabIndex={hasLetters ? 0 : undefined}
              role={hasLetters ? 'button' : undefined}
              aria-label={hasLetters ? `${token}, tap for definition and syllables` : undefined}
              title={hasLetters ? `Tap "${token}" for definition & syllables` : undefined}
              className={`inline-block transition-colors duration-100 rounded-xs ${
                hasLetters
                  ? 'hover:underline hover:text-teal-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-500'
                  : ''
              } ${
                isWordSpoken
                  ? 'bg-amber-400 text-stone-950 font-bold px-1 ring-2 ring-amber-500 scale-105 shadow-xs'
                  : ''
              }`}
            >
              {token}
              {icon && (
                <span
                  className="inline-block text-[0.8em] ml-0.5 select-none"
                  aria-hidden="true"
                  title={`Visual symbol for ${token}`}
                >
                  {icon}
                </span>
              )}
            </span>
          );
        })}
      </span>
    );
  };

  const currentChunk: TextChunk = document.chunks[activeChunkIndex] || document.chunks[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 font-lexend">
      {/* FLOATING CALM READING TOOLBAR (TOP OR BOTTOM PINNED) */}
      <div
        role="region"
        aria-label="Reading Controls"
        className="no-print sticky top-3 z-30 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-2.5 sm:p-3 shadow-md flex flex-wrap items-center justify-between gap-2.5 text-stone-800"
      >
        {/* Back action */}
        <button
          type="button"
          onClick={() => {
            handleStop();
            onBackToInput();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors min-h-[40px]"
          aria-label="Back to document input"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Input</span>
        </button>

        {/* Listen / Playback controls */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200/70">
          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-lg text-xs transition-all min-h-[36px]"
              aria-label="Start reading aloud"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Resume' : 'Listen'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs transition-all min-h-[36px]"
              aria-label="Pause reading"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleStop}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 min-w-[34px] min-h-[34px] flex items-center justify-center"
              aria-label="Stop reading aloud"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          {/* Speed Preset */}
          <div className="flex items-center border-l border-stone-200 pl-1">
            {[0.8, 1.0, 1.3].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() =>
                  onUpdateAccessibility({
                    ...accessibilitySettings,
                    speechRate: r,
                  })
                }
                className={`px-1.5 py-1 text-[11px] font-bold rounded transition-colors ${
                  accessibilitySettings.speechRate === r
                    ? 'text-teal-900 font-extrabold bg-white shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {r}x
              </button>
            ))}
          </div>
        </div>

        {/* Display & Accessibility Tools */}
        <div className="flex items-center gap-1.5">
          {/* Captions toggle */}
          <button
            type="button"
            onClick={() =>
              onUpdateAccessibility({
                ...accessibilitySettings,
                captionsEnabled: !accessibilitySettings.captionsEnabled,
              })
            }
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors min-h-[38px] ${
              accessibilitySettings.captionsEnabled
                ? 'bg-teal-100 text-teal-900 border-teal-300 font-bold'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title="Toggle Live Subtitles Overlay"
            aria-pressed={accessibilitySettings.captionsEnabled}
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Captions</span>
          </button>

          {/* Reading Ruler toggle */}
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({ ...settings, showReadingRuler: !settings.showReadingRuler })
            }
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors min-h-[38px] ${
              settings.showReadingRuler
                ? 'bg-teal-100 text-teal-900 border-teal-300 font-bold'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title="Toggle Guided Focus Ruler"
            aria-pressed={settings.showReadingRuler}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ruler</span>
          </button>

          {/* Display controls modal trigger */}
          <button
            type="button"
            onClick={onOpenDisplayControls}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 transition-colors min-h-[38px]"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-300" />
            <span>Display</span>
          </button>

          {/* Comprehension Quiz button */}
          <button
            type="button"
            onClick={() => {
              if (user && user.plan === 'free') {
                onOpenUpgradeModal?.('Comprehension Checks');
              } else {
                setIsQuizOpen(true);
              }
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-900 flex items-center gap-1.5 transition-colors min-h-[38px]"
            title="3-Question AI Comprehension Check"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span className="hidden sm:inline">Quiz</span>
            {user?.plan === 'free' && <Lock className="w-3 h-3 text-stone-400 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* FOCUSED READING CANVAS */}
      <article
        id="main-reading-canvas"
        className={`rounded-3xl border-2 transition-colors duration-200 p-6 sm:p-10 md:p-14 shadow-sm ${themeConfig.bgClass} ${themeConfig.textClass} ${themeConfig.borderClass}`}
        style={{
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineSpacing,
          letterSpacing: `${settings.letterSpacing}em`,
        }}
      >
        {/* Document Header */}
        <header className="pb-6 mb-8 border-b border-current/15">
          <div className="flex flex-wrap items-center gap-2 mb-3 no-print">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full ${themeConfig.accentClass}`}
            >
              {document.level.toUpperCase()} LEVEL
            </span>
            <span className="text-xs font-semibold opacity-80 flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-current/20">
              <Clock className="w-3.5 h-3.5" />
              ~{document.estimatedReadingTimeMinutes} min
            </span>
            <span className="text-xs font-semibold opacity-80 flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-current/20">
              <FileText className="w-3.5 h-3.5" />
              {document.wordCount} words
            </span>
            <span className="text-xs font-semibold flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Available offline
            </span>

            {/* Simplified / Original view switcher */}
            <button
              type="button"
              onClick={() => setShowOriginal(!showOriginal)}
              className="ml-auto text-xs font-bold underline opacity-80 hover:opacity-100 min-h-[36px]"
            >
              {showOriginal ? 'Switch to Simplified View' : 'View Original Source'}
            </button>
          </div>

          <h1
            className={`font-bold tracking-tight mb-2 ${fontConfig.cssClass}`}
            style={{ fontSize: `${Math.round(settings.fontSize * 1.5)}px`, lineHeight: 1.25 }}
          >
            {document.title}
          </h1>
        </header>

        {showOriginal ? (
          /* Original Text */
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-black/5 border border-current/15 text-xs">
              <p className="font-bold">Original Unaltered Source Text:</p>
            </div>
            <div
              className={`whitespace-pre-wrap ${fontConfig.cssClass}`}
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineSpacing,
                letterSpacing: `${settings.letterSpacing}em`,
              }}
            >
              {document.originalText}
            </div>
          </div>
        ) : (
          /* Simplified Content */
          <div className="space-y-8">
            {/* 3-BULLET KEY POINTS SUMMARY */}
            <section
              aria-labelledby="key-points-heading"
              className={`p-5 sm:p-6 rounded-2xl border-2 transition-all ${themeConfig.cardBgClass} border-current/20 shadow-2xs`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 id="key-points-heading" className="font-bold text-base tracking-tight">
                    3 Key Takeaways
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fullSummary = `3 Key Points: ${document.keyPoints.join('. ')}`;
                    speechService.announce(fullSummary, accessibilitySettings.speechRate);
                  }}
                  className="no-print flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border border-current/20 hover:bg-current/10 transition-colors min-h-[34px]"
                  title="Hear takeaways out loud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Hear Points</span>
                </button>
              </div>

              <ul className="space-y-2">
                {document.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-current/15 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span
                      className={`font-medium ${fontConfig.cssClass}`}
                      style={{
                        fontSize: `${settings.fontSize}px`,
                        lineHeight: settings.lineSpacing,
                        letterSpacing: `${settings.letterSpacing}em`,
                      }}
                    >
                      {renderParagraphWithAccessibility(point, false)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* CHUNKED PARAGRAPHS */}
            {settings.focusChunkMode ? (
              /* Guided 1-chunk at a time mode */
              <div className="space-y-5">
                <div className="flex items-center justify-between no-print text-xs font-bold opacity-80 pb-2 border-b border-current/15">
                  <span>
                    Section {activeChunkIndex + 1} of {document.chunks.length}
                  </span>
                  <span>
                    {Math.round(((activeChunkIndex + 1) / document.chunks.length) * 100)}%
                  </span>
                </div>

                <div
                  className={`p-6 sm:p-8 rounded-2xl border-2 border-current/25 ${themeConfig.cardBgClass} shadow-md`}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3
                      className={`font-bold tracking-tight ${fontConfig.cssClass}`}
                      style={{
                        fontSize: `${Math.round(settings.fontSize * 1.25)}px`,
                        lineHeight: 1.3,
                      }}
                    >
                      {currentChunk.heading}
                    </h3>
                    <button
                      type="button"
                      onClick={() => startReadingChunk(activeChunkIndex)}
                      className="no-print flex items-center gap-1 px-3 py-1.5 rounded-lg border border-current/25 hover:bg-current/10 text-xs font-bold transition-all min-h-[36px]"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Read Here</span>
                    </button>
                  </div>
                  <p
                    className={fontConfig.cssClass}
                    style={{
                      fontSize: `${settings.fontSize}px`,
                      lineHeight: settings.lineSpacing,
                      letterSpacing: `${settings.letterSpacing}em`,
                    }}
                  >
                    {renderParagraphWithAccessibility(
                      currentChunk.paragraph,
                      speakingChunkIndex === activeChunkIndex
                    )}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 no-print pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newIdx = Math.max(0, activeChunkIndex - 1);
                      setActiveChunkIndex(newIdx);
                      if (isPlaying) startReadingChunk(newIdx);
                    }}
                    disabled={activeChunkIndex === 0}
                    className="px-5 py-2.5 rounded-xl border border-current/30 hover:bg-current/10 disabled:opacity-30 font-bold text-xs flex items-center gap-1.5 transition-colors min-h-[44px]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newIdx = Math.min(document.chunks.length - 1, activeChunkIndex + 1);
                      setActiveChunkIndex(newIdx);
                      if (isPlaying) startReadingChunk(newIdx);
                    }}
                    disabled={activeChunkIndex === document.chunks.length - 1}
                    className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 transition-colors min-h-[44px] disabled:opacity-40"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Continuous clean flow */
              <div className="space-y-6 sm:space-y-8">
                {document.chunks.map((chunk, index) => {
                  const isSpeakingThis = speakingChunkIndex === index;
                  return (
                    <section
                      key={index}
                      onClick={() => setActiveChunkIndex(index)}
                      className={`p-5 sm:p-7 rounded-2xl border transition-all duration-150 relative ${
                        isSpeakingThis
                          ? 'border-amber-500 ring-4 ring-amber-400/40 shadow-md'
                          : 'border-current/15 hover:border-current/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                          Section {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startReadingChunk(index);
                          }}
                          className="no-print flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-current/25 hover:bg-current/10 text-xs font-semibold transition-all min-h-[34px]"
                          title="Read aloud from this paragraph"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Read From Here</span>
                        </button>
                      </div>

                      <h3
                        className={`font-bold mb-3 tracking-tight ${fontConfig.cssClass}`}
                        style={{
                          fontSize: `${Math.round(settings.fontSize * 1.25)}px`,
                          lineHeight: 1.3,
                        }}
                      >
                        {chunk.heading}
                      </h3>
                      <p
                        className={fontConfig.cssClass}
                        style={{
                          fontSize: `${settings.fontSize}px`,
                          lineHeight: settings.lineSpacing,
                          letterSpacing: `${settings.letterSpacing}em`,
                        }}
                      >
                        {renderParagraphWithAccessibility(chunk.paragraph, isSpeakingThis)}
                      </p>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Comprehension Quiz Check Card */}
        <div className="mt-10 p-5 rounded-2xl bg-teal-50/70 border-2 border-teal-200/80 text-stone-900 no-print flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-850 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">Finished Reading? Check Your Understanding</h4>
              <p className="text-xs text-stone-600">Take a 3-question AI comprehension quiz with instant feedback.</p>
              {quizScoreNotice && (
                <p className="text-xs font-bold text-teal-800 mt-1 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{quizScoreNotice}</span>
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (user && user.plan === 'free') {
                onOpenUpgradeModal?.('Comprehension Checks');
              } else {
                setIsQuizOpen(true);
              }
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 min-h-[40px]"
          >
            <span>Start Quick Quiz</span>
            {user?.plan === 'free' ? <Lock className="w-3.5 h-3.5 text-teal-200" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Footer Actions */}
        <footer className="mt-12 pt-6 border-t border-current/15 flex flex-wrap items-center justify-between gap-3 text-xs opacity-80 no-print">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCleanText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-current/30 hover:bg-current/10 font-bold min-h-[36px]"
            >
              {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSuccess ? 'Copied' : 'Copy Clean'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-current/30 hover:bg-current/10 font-bold min-h-[36px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
          <span>ClearRead Focused Reader</span>
        </footer>
      </article>

      {/* Word Helper Modal */}
      <WordHelperModal
        word={selectedWord}
        contextSentence={contextSentence}
        onClose={() => setSelectedWord(null)}
        onSaveTrickyWord={(w) => saveTrickyWord(w)}
      />

      {/* Comprehension Quiz Modal */}
      <ComprehensionQuizModal
        isOpen={isQuizOpen}
        documentTitle={document.title}
        keyPoints={document.keyPoints}
        chunksSnippet={document.chunks.map((c) => c.paragraph).join(' ')}
        onClose={() => setIsQuizOpen(false)}
        onQuizCompleted={(result) => {
          recordQuizResult(result);
          setQuizScoreNotice(`Comprehension score saved: ${result.score}/${result.total}`);
          setTimeout(() => setQuizScoreNotice(null), 4500);
        }}
      />
    </div>
  );
};
