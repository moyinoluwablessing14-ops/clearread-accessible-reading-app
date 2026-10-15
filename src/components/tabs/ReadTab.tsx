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
  Zap,
  Lock,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { ReadingLevel, User } from '../../types';
import { SAMPLE_TEXTS } from '../../constants/sampleTexts';

interface ReadTabProps {
  text: string;
  onChangeText: (text: string) => void;
  selectedLevel: ReadingLevel;
  onChangeLevel: (level: ReadingLevel) => void;
  onSimplify: (pdfBase64?: string) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
  user: User;
  onOpenUpgradeModal: (featureName: string, requiredPlan: 'plus' | 'family') => void;
}

export const ReadTab: React.FC<ReadTabProps> = ({
  text,
  onChangeText,
  selectedLevel,
  onChangeLevel,
  onSimplify,
  isLoading,
  loadingStep,
  user,
  onOpenUpgradeModal,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [isExtractingImage, setIsExtractingImage] = useState(false);
  const [photoExtractSuccess, setPhotoExtractSuccess] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isFreePlan = user.plan === 'free';
  const freePagesRemaining = Math.max(0, 3 - user.pagesSimplifiedToday);

  const handleImageProcess = async (file: File) => {
    setInputError(null);
    setPhotoExtractSuccess(false);
    setIsExtractingImage(true);
    setUploadedFileName(file.name || 'Photo of page');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result as string;
          const base64Data = result.split(',')[1] || result;

          const res = await fetch('/api/extract-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64Data,
              mimeType: file.type || 'image/jpeg',
            }),
          });

          const data = await res.json();
          if (data.text) {
            onChangeText(data.text);
            setPdfBase64(null);
            setPhotoExtractSuccess(true);
            setTimeout(() => setPhotoExtractSuccess(false), 5000);
          } else {
            setInputError(data.error || 'Could not find readable text in the photo. Please ensure clear lighting.');
          }
        } catch {
          setInputError('Failed to extract text from photo. Please check connection and try again.');
        } finally {
          setIsExtractingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsExtractingImage(false);
      setInputError('Failed to open photo. Please try another image.');
    }
  };

  const handleFileProcess = async (file: File) => {
    setInputError(null);
    setUploadedFileName(file.name);

    // If image file, send to Gemini vision extractor
    if (file.type.startsWith('image/') || /\.(jpe?g|png|webp|heic|bmp)$/i.test(file.name)) {
      await handleImageProcess(file);
      return;
    }

    if (file.name.endsWith('.txt')) {
      try {
        const fileContent = await file.text();
        onChangeText(fileContent);
        setPdfBase64(null);
      } catch {
        setInputError('Could not read the text file. Please try pasting the text instead.');
      }
    } else if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
      try {
        setIsExtractingPdf(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
          const result = e.target?.result as string;
          const base64Data = result.split(',')[1] || result;
          setPdfBase64(base64Data);

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
      } catch {
        setIsExtractingPdf(false);
        setInputError('Failed to read the PDF. Please try a .txt file or paste the text.');
      }
    } else {
      setInputError('Please select a valid .txt, .pdf, or image file (.jpg, .png).');
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
      setInputError('Clipboard access was blocked by your browser. Please use Ctrl+V / Cmd+V.');
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

    if (isFreePlan && freePagesRemaining <= 0) {
      onOpenUpgradeModal('Unlimited Daily Pages', 'plus');
      return;
    }

    setInputError(null);
    await onSimplify(pdfBase64 || undefined);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-lexend pb-16">
      {/* Free Plan Page Counter Card */}
      {isFreePlan && (
        <div className="bg-teal-50 border border-teal-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {freePagesRemaining}
            </div>
            <div>
              <p className="text-xs font-bold text-teal-950">
                {freePagesRemaining} of 3 Free Daily Pages Remaining
              </p>
              <p className="text-[11px] text-teal-800">
                Resets every 24 hours. Upgrade to Plus for unlimited pages.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenUpgradeModal('Unlimited Daily Pages', 'plus')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto min-h-[38px]"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Unlock Unlimited</span>
          </button>
        </div>
      )}

      {/* Main Input Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-teal-800" aria-hidden="true" />
              <span>Paste or Upload Text</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              ClearRead simplifies dense language, chunks into short paragraphs, and creates a 3-bullet takeaway.
            </p>
          </div>

          {/* Sample Picker */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Samples:
            </span>
            {SAMPLE_TEXTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample.id)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors min-h-[34px]"
              >
                {sample.title.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Source Document Text Area */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-semibold">
              <span className="text-stone-700">Enter Reading Material:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Take Photo with Camera */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/80 rounded-lg transition-colors min-h-[36px]"
                  title="Take a photo of a textbook page, worksheet, or article with your camera"
                >
                  <Camera className="w-3.5 h-3.5 text-teal-700" />
                  <span>Take Page Photo</span>
                </button>

                {/* Upload Photo File */}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors min-h-[36px]"
                  title="Upload a photo from your photo library or files"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
                  <span>Upload Image</span>
                </button>

                {/* Hidden camera input with environment capture */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageProcess(e.target.files[0]);
                    }
                  }}
                />

                {/* Hidden standard image input */}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageProcess(e.target.files[0]);
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors min-h-[36px]"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Paste</span>
                </button>
                {text && (
                  <button
                    type="button"
                    onClick={() => {
                      onChangeText('');
                      setUploadedFileName(null);
                      setPdfBase64(null);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors min-h-[36px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Photo extraction loading state */}
            {isExtractingImage && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2.5 text-xs text-teal-900 font-semibold animate-pulse">
                <Loader2 className="w-4 h-4 text-teal-700 animate-spin shrink-0" />
                <span>Gemini Vision is transcribing text from your photo...</span>
              </div>
            )}

            {/* Photo extraction success banner */}
            {photoExtractSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Text successfully extracted from photo! You can edit it above, then choose a reading level and tap Simplify & Read.</span>
              </div>
            )}

            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => {
                  onChangeText(e.target.value);
                  if (inputError) setInputError(null);
                }}
                rows={8}
                placeholder="Paste article, textbook chapter, or take a photo of a page using the camera button above..."
                className="w-full p-4 rounded-2xl border-2 border-stone-200 focus:border-teal-700 focus:ring-4 focus:ring-teal-500/15 focus:outline-none text-base sm:text-lg text-stone-800 placeholder:text-stone-400 font-lexend leading-relaxed transition-all resize-y min-h-[180px]"
                aria-label="Input text to simplify and chunk"
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2 text-xs bg-stone-100/90 px-2.5 py-1 rounded-lg text-stone-600 border border-stone-200 font-medium">
                <span>{wordCount} words</span>
              </div>
            </div>

            {/* Document Drag & Drop */}
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
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-teal-700 bg-teal-50/70 scale-[1.01]'
                  : uploadedFileName
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-stone-300 hover:border-teal-700 bg-stone-50/60'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
              }}
              aria-label="Upload a .txt, .pdf, or photo file"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt, .pdf, text/plain, application/pdf, image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />
              <div className="flex items-center justify-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    uploadedFileName ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {uploadedFileName ? <CheckCircle2 className="w-5 h-5" /> : <FileUp className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold text-stone-900">
                    {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Upload document or photo (PDF, TXT, JPG, PNG)'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {isExtractingPdf ? 'Extracting text from PDF...' : isExtractingImage ? 'Extracting text from photo...' : 'Drag & drop here or click to browse'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reading Level Selector */}
          <div className="bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3">
            <div>
              <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Reading Level</span>
              </label>
              <p className="text-xs text-stone-500">
                Chooses sentence length and vocabulary while preserving all key educational facts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onChangeLevel('easy')}
                className={`text-left p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[88px] ${
                  selectedLevel === 'easy'
                    ? 'border-teal-700 bg-teal-50/70 shadow-xs ring-2 ring-teal-500/15'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900">Easy Level</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Elementary
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Short sentences (8–14 words), straightforward words, explained terms.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onChangeLevel('medium')}
                className={`text-left p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[88px] ${
                  selectedLevel === 'medium'
                    ? 'border-teal-700 bg-teal-50/70 shadow-xs ring-2 ring-teal-500/15'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900">Medium Level</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    Standard
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Clear, conversational flow. Removes academic clutter with full nuance.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onChangeLevel('original')}
                className={`text-left p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[88px] ${
                  selectedLevel === 'original'
                    ? 'border-teal-700 bg-teal-50/70 shadow-xs ring-2 ring-teal-500/15'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900">Original Text</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                    Preserved
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Keeps exact phrasing, but chunks into short sections with headings & takeaways.
                </p>
              </button>
            </div>
          </div>

          {inputError && (
            <div
              className="p-3.5 bg-red-50 border border-red-200 text-red-900 rounded-xl flex items-start gap-2.5 text-xs font-semibold"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{inputError}</span>
            </div>
          )}

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (!text.trim() && !pdfBase64)}
            className="w-full py-4 px-6 rounded-2xl bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 min-h-[54px] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{loadingStep || 'Simplifying & Chunking...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>
                  Simplify & Read ({selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Level)
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
