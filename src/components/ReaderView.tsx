import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Clock,
  FileText,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Printer,
  Copy,
  Check,
  Split,
  Eye,
  Sliders,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  FastForward,
  RotateCcw,
  Subtitles,
  Accessibility,
} from 'lucide-react';
import {
  ProcessedDocument,
  DisplaySettings,
  TextChunk,
  AccessibilitySettings,
} from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../constants/defaults';
import { QuickDisplayBar } from './QuickDisplayBar';
import { speechService, SpeechWordBoundary } from '../utils/speech';
import { getWordIcon } from '../utils/keywordIcons';

interface ReaderViewProps {
  document: ProcessedDocument;
  settings: DisplaySettings;
  onUpdateSettings: (newSettings: DisplaySettings) => void;
  onOpenFullControls: () => void;
  onBackToInput: () => void;
  accessibilitySettings: AccessibilitySettings;
  onUpdateAccessibility: (settings: AccessibilitySettings) => void;
  onSpokenSentenceChange?: (sentence: string, currentWord?: string) => void;
  voiceCommandTrigger?: string | null;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  document,
  settings,
  onUpdateSettings,
  onOpenFullControls,
  onBackToInput,
  accessibilitySettings,
  onUpdateAccessibility,
  onSpokenSentenceChange,
  voiceCommandTrigger,
}) => {
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Read-Aloud state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speakingChunkIndex, setSpeakingChunkIndex] = useState<number | null>(null);
  const [currentWordCharIndex, setCurrentWordCharIndex] = useState<number | null>(null);
  const [currentSpokenWord, setCurrentSpokenWord] = useState<string>('');
  const [activeSpeechText, setActiveSpeechText] = useState<string>('');

  const themeConfig = THEME_CONFIGS[settings.theme] || THEME_CONFIGS.cream;
  const fontConfig = FONT_CONFIGS[settings.font] || FONT_CONFIGS.lexend;
  const voices = speechService.getVoices();

  // Stop speech when unmounting
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  // Listen for voice commands passed down from App
  useEffect(() => {
    if (!voiceCommandTrigger) return;
    if (voiceCommandTrigger === 'read') {
      handlePlay();
    } else if (voiceCommandTrigger === 'pause') {
      handlePause();
    } else if (voiceCommandTrigger === 'next') {
      setActiveChunkIndex((prev) => Math.min(document.chunks.length - 1, prev + 1));
    } else if (voiceCommandTrigger === 'previous') {
      setActiveChunkIndex((prev) => Math.max(0, prev - 1));
    }
  }, [voiceCommandTrigger]);

  // Read a specific chunk or sequence
  const startReadingChunk = (chunkIndex: number) => {
    if (chunkIndex < 0 || chunkIndex >= document.chunks.length) {
      handleStop();
      return;
    }

    const chunk = document.chunks[chunkIndex];
    const textToSpeak = `${chunk.heading}. ${chunk.paragraph}`;
    setActiveSpeechText(textToSpeak);
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
        if (onSpokenSentenceChange) {
          onSpokenSentenceChange(textToSpeak.slice(0, 80));
        }
      },
      onBoundary: (boundary: SpeechWordBoundary) => {
        setCurrentWordCharIndex(boundary.charIndex);

        // Find current word text
        const substr = textToSpeak.slice(boundary.charIndex);
        const match = substr.match(/^\S+/);
        const word = match ? match[0].replace(/[.,!?;:]/g, '') : '';
        setCurrentSpokenWord(word);

        // Approximate current sentence for captions
        const before = textToSpeak.slice(0, boundary.charIndex);
        const lastSentenceStart = Math.max(0, before.lastIndexOf('.') + 1, before.lastIndexOf('?') + 1, before.lastIndexOf('!') + 1);
        const after = textToSpeak.slice(boundary.charIndex);
        const nextSentenceEnd = after.search(/[.?!]/);
        const sentenceEnd = nextSentenceEnd !== -1 ? boundary.charIndex + nextSentenceEnd + 1 : textToSpeak.length;
        const currentSentence = textToSpeak.slice(lastSentenceStart, sentenceEnd).trim();

        if (onSpokenSentenceChange) {
          onSpokenSentenceChange(currentSentence, word);
        }
      },
      onEnd: () => {
        // Automatically progress to next chunk if available!
        if (chunkIndex + 1 < document.chunks.length) {
          startReadingChunk(chunkIndex + 1);
        } else {
          handleStop();
          if (accessibilitySettings.audioFirstMode) {
            speechService.announce('Finished reading the entire document.');
          }
        }
      },
      onError: () => {
        handleStop();
      },
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
    if (onSpokenSentenceChange) {
      onSpokenSentenceChange('');
    }
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
      // fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to render paragraph with word-by-word highlight and optional keyword icons
  const renderParagraphWithAccessibility = (
    text: string,
    isThisChunkSpeaking: boolean
  ) => {
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

          const isWordSpoken =
            isThisChunkSpeaking &&
            currentWordCharIndex !== null &&
            wordStart <= currentWordCharIndex &&
            currentWordCharIndex < wordStart + token.length + 2;

          const icon = accessibilitySettings.showWordIcons ? getWordIcon(token) : null;

          return (
            <span
              key={idx}
              className={`inline-block transition-colors duration-100 rounded-sm ${
                isWordSpoken
                  ? 'bg-amber-400 text-stone-950 font-bold px-1 ring-2 ring-amber-500 scale-105 shadow-sm'
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
    <div className="space-y-6">
      {/* Top Navigation & Action Toolbar (Screen only) */}
      <div className="no-print flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            handleStop();
            onBackToInput();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 font-semibold text-sm shadow-xs transition-colors self-start min-h-[44px]"
          aria-label="Back to document input"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Document / Edit Input</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle between simplified & original text */}
          <div className="flex items-center bg-stone-200/80 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setShowOriginal(false)}
              className={`px-3 py-1.5 rounded-lg transition-all min-h-[36px] ${
                !showOriginal
                  ? 'bg-white text-amber-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Simplified ({document.level})
            </button>
            <button
              type="button"
              onClick={() => setShowOriginal(true)}
              className={`px-3 py-1.5 rounded-lg transition-all min-h-[36px] ${
                showOriginal
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Original Source
            </button>
          </div>

          {/* Copy Clean Text */}
          <button
            type="button"
            onClick={handleCopyCleanText}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold shadow-xs transition-colors min-h-[40px]"
            title="Copy clean formatted text to clipboard"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Clean Text</span>
              </>
            )}
          </button>

          {/* Print Clean Reader */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold shadow-xs transition-colors min-h-[40px]"
            title="Print or save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print Clean</span>
          </button>
        </div>
      </div>

      {/* READ-ALOUD SPEECH CONTROLLER BAR (BLIND / LOW-VISION / READERS) */}
      <div
        role="region"
        aria-label="Read Aloud and Audio Navigation Controls"
        className="no-print bg-amber-900 text-amber-50 p-3 sm:p-4 rounded-2xl shadow-md border-2 border-amber-700/80 flex flex-wrap items-center justify-between gap-3"
      >
        {/* Playback action buttons */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs sm:text-sm transition-all min-h-[44px] shadow-sm"
              aria-label="Start read-aloud from current section"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isPaused ? 'Resume Reading' : 'Read Aloud'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm transition-all min-h-[44px] shadow-sm"
              aria-label="Pause reading"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-950/80 hover:bg-amber-950 text-amber-200 border border-amber-600/60 rounded-xl text-xs font-bold transition-all min-h-[44px]"
              aria-label="Stop reading"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          )}

          {/* Active Status indicator */}
          {isPlaying && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-800/80 border border-amber-600 text-xs text-amber-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Speaking Section {speakingChunkIndex !== null ? speakingChunkIndex + 1 : 1}</span>
            </div>
          )}
        </div>

        {/* Read-Aloud Speed & Voice Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Speed Preset selector */}
          <div className="flex items-center gap-1 bg-amber-950/70 p-1 rounded-xl border border-amber-800/80">
            <span className="text-[11px] font-bold text-amber-300 px-2 uppercase tracking-wider">
              Speed:
            </span>
            {[0.75, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() =>
                  onUpdateAccessibility({
                    ...accessibilitySettings,
                    speechRate: rate,
                  })
                }
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all min-h-[32px] ${
                  accessibilitySettings.speechRate === rate
                    ? 'bg-amber-400 text-stone-950 font-extrabold shadow-xs'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Captions toggle button */}
          <button
            type="button"
            onClick={() =>
              onUpdateAccessibility({
                ...accessibilitySettings,
                captionsEnabled: !accessibilitySettings.captionsEnabled,
              })
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all min-h-[38px] ${
              accessibilitySettings.captionsEnabled
                ? 'bg-amber-400 text-stone-950 border-amber-300 font-extrabold'
                : 'bg-amber-950/70 text-amber-200 border-amber-800 hover:text-white'
            }`}
            title="Toggle Live Subtitles Overlay"
            aria-pressed={accessibilitySettings.captionsEnabled}
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>Captions {accessibilitySettings.captionsEnabled ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Quick Display Floating Bar (Sticky on desktop) */}
      <div className="no-print sticky top-3 z-30">
        <QuickDisplayBar
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onOpenFullControls={onOpenFullControls}
        />
      </div>

      {/* Main Accessible Reader Canvas */}
      <article
        id="main-content"
        tabIndex={-1}
        className={`rounded-3xl border-2 transition-colors duration-200 p-5 sm:p-8 md:p-12 shadow-md focus:outline-none ${themeConfig.bgClass} ${themeConfig.textClass} ${themeConfig.borderClass}`}
        style={{
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineSpacing,
          letterSpacing: `${settings.letterSpacing}em`,
        }}
      >
        {/* Document Header Metadata */}
        <header className="pb-6 mb-8 border-b border-current/15">
          <div className="flex flex-wrap items-center gap-2 mb-3 no-print">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${themeConfig.accentClass}`}
            >
              {document.level.toUpperCase()} READING LEVEL
            </span>
            <span className="text-xs font-semibold opacity-80 flex items-center gap-1.5 px-3 py-1 rounded-full border border-current/20">
              <Clock className="w-3.5 h-3.5" />
              ~{document.estimatedReadingTimeMinutes} min read
            </span>
            <span className="text-xs font-semibold opacity-80 flex items-center gap-1.5 px-3 py-1 rounded-full border border-current/20">
              <FileText className="w-3.5 h-3.5" />
              {document.wordCount} words
            </span>
            <span className="text-xs font-semibold opacity-80 px-3 py-1 rounded-full border border-current/20">
              {document.chunks.length} Chunks
            </span>
          </div>

          <h1
            className={`font-bold tracking-tight mb-2 ${fontConfig.cssClass}`}
            style={{ fontSize: `${Math.round(settings.fontSize * 1.55)}px`, lineHeight: 1.25 }}
          >
            {document.title}
          </h1>
          <p className="text-xs opacity-75 font-sans-clean no-print">
            ClearRead Phase 2 Accessible Reader • Screen-reader labeled • High-contrast compliant
          </p>
        </header>

        {showOriginal ? (
          /* Original Text View */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-black/5 border border-current/15 text-sm">
              <p className="font-bold mb-1">Showing Original Unaltered Source Text:</p>
              <p className="opacity-80">
                You can switch back to the Simplified and Chunked view using the toggle at the top.
              </p>
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
          /* Simplified & Chunked Content */
          <div className="space-y-8">
            {/* 3-BULLET KEY POINTS SUMMARY */}
            <section
              aria-labelledby="key-points-heading"
              className={`p-5 sm:p-6 rounded-2xl border-2 transition-all ${themeConfig.cardBgClass} border-current/20 shadow-xs`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2
                    id="key-points-heading"
                    className="font-bold text-base sm:text-lg tracking-tight"
                  >
                    3 Key Points Summary
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fullSummary = `3 Key Points: ${document.keyPoints.join('. ')}`;
                    speechService.announce(fullSummary, accessibilitySettings.speechRate);
                  }}
                  className="no-print flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border border-current/20 hover:bg-current/10 transition-colors min-h-[36px]"
                  title="Read key takeaways aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Hear Points</span>
                </button>
              </div>
              <ul className="space-y-2.5">
                {document.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-current/15 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
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

            {/* CHUNKS VIEW */}
            {settings.focusChunkMode ? (
              /* Guided 1-Chunk at a time focus mode */
              <div className="space-y-6">
                {/* Chunk progress meter */}
                <div className="flex items-center justify-between no-print text-xs font-bold opacity-80 pb-2 border-b border-current/15">
                  <span>
                    Focus Section {activeChunkIndex + 1} of {document.chunks.length}
                  </span>
                  <span>
                    {Math.round(((activeChunkIndex + 1) / document.chunks.length) * 100)}% Complete
                  </span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-2 bg-current/10 rounded-full overflow-hidden no-print">
                  <div
                    className="h-full bg-amber-600 transition-all duration-300"
                    style={{
                      width: `${((activeChunkIndex + 1) / document.chunks.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Single Active Chunk Display Card */}
                <div
                  className={`p-6 sm:p-8 rounded-2xl border-2 border-current/25 ${themeConfig.cardBgClass} shadow-md transition-all relative`}
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3
                      className={`font-bold tracking-tight ${fontConfig.cssClass}`}
                      style={{
                        fontSize: `${Math.round(settings.fontSize * 1.25)}px`,
                        lineHeight: 1.3,
                      }}
                    >
                      {currentChunk.heading}
                    </h3>

                    {/* Read this section button */}
                    <button
                      type="button"
                      onClick={() => startReadingChunk(activeChunkIndex)}
                      className="no-print flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-current/25 hover:bg-current/10 text-xs font-bold transition-all min-h-[38px] shrink-0"
                      title="Read aloud from this section"
                      aria-label={`Read aloud section ${activeChunkIndex + 1}: ${currentChunk.heading}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Read Here</span>
                    </button>
                  </div>

                  <p
                    className={`${fontConfig.cssClass}`}
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

                {/* Previous / Next Controls */}
                <div className="flex items-center justify-between gap-4 no-print pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newIdx = Math.max(0, activeChunkIndex - 1);
                      setActiveChunkIndex(newIdx);
                      if (isPlaying) startReadingChunk(newIdx);
                    }}
                    disabled={activeChunkIndex === 0}
                    className="px-5 py-3 rounded-xl border-2 border-current/30 hover:bg-current/10 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm flex items-center gap-2 transition-colors min-h-[48px]"
                    aria-label="Previous section"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous Section</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const newIdx = Math.min(document.chunks.length - 1, activeChunkIndex + 1);
                      setActiveChunkIndex(newIdx);
                      if (isPlaying) startReadingChunk(newIdx);
                    }}
                    disabled={activeChunkIndex === document.chunks.length - 1}
                    className="px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm flex items-center gap-2 transition-colors min-h-[48px] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Next section"
                  >
                    <span>Next Section</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Continuous Chunk List with headings and generous spacing */
              <div className="space-y-6 sm:space-y-8">
                {document.chunks.map((chunk, index) => {
                  const isCurrent = activeChunkIndex === index;
                  const isSpeakingThis = speakingChunkIndex === index;
                  return (
                    <section
                      key={index}
                      onClick={() => setActiveChunkIndex(index)}
                      className={`p-5 sm:p-7 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
                        isSpeakingThis
                          ? 'border-amber-500 ring-4 ring-amber-400/40 shadow-lg'
                          : settings.highlightActiveChunk && isCurrent
                          ? `border-amber-600/70 ${themeConfig.cardBgClass} ring-2 ring-amber-500/30 shadow-sm`
                          : 'border-current/15 hover:border-current/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                          Section {index + 1}
                        </span>

                        {/* Read from here button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startReadingChunk(index);
                          }}
                          className="no-print flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-current/25 hover:bg-current/10 text-xs font-semibold transition-all min-h-[36px]"
                          title="Read aloud from this paragraph"
                          aria-label={`Read aloud section ${index + 1}: ${chunk.heading}`}
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
                        className={`${fontConfig.cssClass}`}
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

        {/* Reader Footer Note */}
        <footer className="mt-12 pt-6 border-t border-current/15 text-xs opacity-75 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>ClearRead Phase 2 Accessible Core Reader</span>
          <span>Web Speech API Word-by-Word Highlighting • Zero Audio-Only Cues</span>
        </footer>
      </article>
    </div>
  );
};
