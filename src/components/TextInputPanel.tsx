import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  Clipboard,
  Trash2,
  FileUp,
  AlertCircle,
  Loader2,
  BookOpen,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { ReadingLevel } from '../types';
import { SAMPLE_TEXTS } from '../constants/sampleTexts';

interface TextInputPanelProps {
  text: string;
  onChangeText: (text: string) => void;
  selectedLevel: ReadingLevel;
  onChangeLevel: (level: ReadingLevel) => void;
  onSimplify: (pdfBase64?: string) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
}

export const TextInputPanel: React.FC<TextInputPanelProps> = ({
  text,
  onChangeText,
  selectedLevel,
  onChangeLevel,
  onSimplify,
  isLoading,
  loadingStep,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleFileProcess = async (file: File) => {
    setInputError(null);
    setUploadedFileName(file.name);

    if (file.name.endsWith('.txt')) {
      try {
        const fileContent = await file.text();
        onChangeText(fileContent);
        setPdfBase64(null);
      } catch (err) {
        setInputError('Could not read the text file. Please try pasting the text instead.');
      }
    } else if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
      try {
        setIsExtractingPdf(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
          const result = e.target?.result as string;
          // Extract base64 without prefix
          const base64Data = result.split(',')[1] || result;
          setPdfBase64(base64Data);

          // Ask server to extract text so the student can preview/edit it too!
          try {
            const res = await fetch('/api/extract-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pdfBase64: base64Data, mimeType: file.type || 'application/pdf' }),
            });
            const data = await res.json();
            if (data.text) {
              onChangeText(data.text);
            }
          } catch (extractErr) {
            console.warn('PDF preview extraction error:', extractErr);
          } finally {
            setIsExtractingPdf(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setIsExtractingPdf(false);
        setInputError('Failed to read the PDF. Please try a .txt file or paste the text.');
      }
    } else {
      setInputError('Please select a valid .txt or .pdf file.');
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        onChangeText(clipText);
        setUploadedFileName(null);
        setPdfBase64(null);
        setInputError(null);
      }
    } catch {
      // In case browser clipboard permissions need focus
      setInputError('Clipboard access was blocked by your browser. Please use Ctrl+V / Cmd+V in the box.');
    }
  };

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_TEXTS.find((s) => s.id === sampleId);
    if (sample) {
      onChangeText(sample.fullText);
      setUploadedFileName(null);
      setPdfBase64(null);
      setInputError(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !pdfBase64) {
      setInputError('Please paste some text, load a sample text, or upload a .txt / .pdf file.');
      return;
    }
    setInputError(null);
    await onSimplify(pdfBase64 || undefined);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-7 space-y-6">
      {/* Introduction Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-700" aria-hidden="true" />
            Paste or Upload Your Text
          </h2>
          <p className="text-sm text-stone-600 mt-0.5">
            ClearRead chunks long walls of text, simplifies vocabulary, and generates a 3-bullet takeaway summary.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Try Sample:
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {SAMPLE_TEXTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample.id)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-colors min-h-[36px]"
              >
                {sample.title.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* File Upload Zone & Paste Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-semibold">
            <span className="text-stone-700">Source Document:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors min-h-[38px]"
                aria-label="Paste text from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                Paste from Clipboard
              </button>
              {text && (
                <button
                  type="button"
                  onClick={() => {
                    onChangeText('');
                    setUploadedFileName(null);
                    setPdfBase64(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors min-h-[38px]"
                  aria-label="Clear entered text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => {
                onChangeText(e.target.value);
                if (inputError) setInputError(null);
              }}
              rows={8}
              placeholder="Paste article, textbook chapter, homework passage, or story here..."
              className="w-full p-4 rounded-2xl border-2 border-stone-200 focus:border-amber-600 focus:ring-4 focus:ring-amber-500/15 focus:outline-none text-base sm:text-lg text-stone-800 placeholder:text-stone-400 font-lexend leading-relaxed transition-all resize-y min-h-[180px]"
              aria-label="Input text to simplify and chunk"
            />

            {/* Word & char counter badge */}
            <div className="absolute right-3 bottom-3 flex items-center gap-2 text-xs bg-stone-100/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-stone-600 border border-stone-200 font-medium">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          {/* File Drag and Drop or Browse */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileProcess(e.dataTransfer.files[0]);
              }
            }}
            className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition-all cursor-pointer ${
              dragOver
                ? 'border-amber-600 bg-amber-50/80 scale-[1.01]'
                : uploadedFileName
                ? 'border-emerald-500 bg-emerald-50/50'
                : 'border-stone-300 hover:border-amber-500 bg-stone-50/60'
            }`}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click();
              }
            }}
            aria-label="Upload a .txt or .pdf file"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt, .pdf, text/plain, application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  uploadedFileName
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {uploadedFileName ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <FileUp className="w-6 h-6" />
                )}
              </div>

              <div className="text-center sm:text-left">
                {uploadedFileName ? (
                  <div>
                    <p className="text-sm font-bold text-stone-900 flex items-center justify-center sm:justify-start gap-1.5">
                      <span>Loaded: {uploadedFileName}</span>
                      {isExtractingPdf && (
                        <span className="text-xs text-amber-700 flex items-center gap-1 font-normal">
                          <Loader2 className="w-3 h-3 animate-spin" /> Extracting preview...
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-stone-500">
                      Click to choose a different .txt or .pdf file
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-stone-900">
                      Upload a document (.txt or .pdf)
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Drag & drop here or click to browse from your device
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reading Level Selector */}
        <div className="bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Select Reading Level
              </label>
              <p className="text-xs text-stone-500">
                Chooses sentence length and vocabulary while faithfully preserving all facts and details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* EASY LEVEL */}
            <button
              type="button"
              onClick={() => onChangeLevel('easy')}
              className={`text-left p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[96px] ${
                selectedLevel === 'easy'
                  ? 'border-amber-600 bg-amber-50/80 shadow-xs ring-2 ring-amber-500/15'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-stone-900">Easy Level</span>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Elementary
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Short sentences (8–14 words), straightforward words, explanations for hard terms. Great for younger readers and dyslexia.
              </p>
            </button>

            {/* MEDIUM LEVEL */}
            <button
              type="button"
              onClick={() => onChangeLevel('medium')}
              className={`text-left p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[96px] ${
                selectedLevel === 'medium'
                  ? 'border-amber-600 bg-amber-50/80 shadow-xs ring-2 ring-amber-500/15'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-stone-900">Medium Level</span>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  Standard
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Natural, conversational everyday flow. Removes dense academic clutter while maintaining rich nuance.
              </p>
            </button>

            {/* ORIGINAL LEVEL */}
            <button
              type="button"
              onClick={() => onChangeLevel('original')}
              className={`text-left p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[96px] ${
                selectedLevel === 'original'
                  ? 'border-amber-600 bg-amber-50/80 shadow-xs ring-2 ring-amber-500/15'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-stone-900">Original Text</span>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                  Preserved
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Keeps your exact phrasing and vocabulary, but adds 3 key takeaway bullets and breaks it into chunked paragraphs with headings.
              </p>
            </button>
          </div>
        </div>

        {/* Input Error Message */}
        {inputError && (
          <div
            className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-start gap-2.5 text-sm"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to process</p>
              <p className="text-xs mt-0.5">{inputError}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || (!text.trim() && !pdfBase64)}
            className="w-full py-4 px-6 rounded-2xl bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] focus:ring-4 focus:ring-amber-500/30"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>{loadingStep || 'Processing with ClearRead AI...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>
                  Simplify & Chunk Text ({selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Mode)
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
