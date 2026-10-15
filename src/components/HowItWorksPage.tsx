import React from 'react';
import {
  BookOpen,
  Camera,
  Sliders,
  Award,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Volume2,
  Eye,
  FileText,
} from 'lucide-react';

interface HowItWorksPageProps {
  onBackToHome: () => void;
  onGetStarted: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onBackToHome,
  onGetStarted,
}) => {
  const steps = [
    {
      number: '01',
      title: 'Snap, Upload, or Paste Any Text',
      icon: Camera,
      badge: 'Input & Vision OCR',
      color: 'teal',
      description:
        'Take a photo of any physical textbook page, worksheet, or homework passage using your phone camera. Or upload a PDF document or paste an online article directly.',
      highlights: [
        'Camera photo capture with Gemini Vision OCR',
        'PDF and TXT document drag-and-drop',
        'One-click clipboard paste',
      ],
    },
    {
      number: '02',
      title: 'Personalize Your Reading Canvas',
      icon: Sliders,
      badge: 'Adapt & Simplify',
      color: 'sky',
      description:
        'Select your preferred reading level (Easy, Medium, or Original). ClearRead automatically chunks dense text into 2–4 sentence paragraphs with subheadings and 3 key takeaways.',
      highlights: [
        'Dyslexia-friendly fonts (Lexend, OpenDyslexic)',
        'Adjustable letter spacing & guided reading ruler',
        'Calming color overlays (Cream, Mint, Yellow on Black)',
      ],
    },
    {
      number: '03',
      title: 'Read, Listen & Earn Reward Badges',
      icon: Award,
      badge: 'Comprehension & Rewards',
      color: 'amber',
      description:
        'Follow along with word-by-word spoken audio highlighting. Tap any tricky word for instant syllables and kid-friendly definitions. Meet weekly parent goals and unlock celebration badges.',
      highlights: [
        'Word-by-word Web Speech read-aloud',
        'Instant Word Helper with syllable breakdown',
        'Parent weekly minute goals & reward badges',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-lexend selection:bg-teal-200">
      {/* Top Navigation */}
      <nav className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-2 text-stone-900 hover:text-teal-800 transition-colors group"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold shadow-xs">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-stone-900">
                Clear<span className="text-teal-700">Read</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="px-4 sm:px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 min-h-[40px]"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-16">
        {/* Header Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-700" />
            Simple 3-Step Process
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-tight">
            How ClearRead Works
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            From physical book pages to accessible, chunked reading in seconds. Designed for dyslexic readers, ADHD learners, and children building reading fluency.
          </p>
        </section>

        {/* 3 Steps Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all space-y-6 relative overflow-hidden group"
              >
                <div className="space-y-4">
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-stone-200 group-hover:text-teal-200 transition-colors">
                      {step.number}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-xs ${
                        step.color === 'teal'
                          ? 'bg-teal-100 text-teal-800'
                          : step.color === 'sky'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-800 block mb-1">
                      {step.badge}
                    </span>
                    <h3 className="text-lg font-bold text-stone-950 leading-snug">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Highlights */}
                <div className="pt-4 border-t border-stone-100 space-y-2">
                  {step.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Feature Comparison / Highlights Bar */}
        <section className="bg-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Built on Cognitive Reading Science
            </h2>
            <p className="text-sm text-teal-100 leading-relaxed">
              ClearRead eliminates visual crowding, reduces letter transposition, and preserves 100% of core educational concepts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="bg-teal-800/80 rounded-2xl p-5 border border-teal-700/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-teal-200">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">2–4 Sentence Chunks</h4>
              <p className="text-xs text-teal-200 leading-relaxed">
                Prevents the cognitive fatigue caused by dense walls of small text.
              </p>
            </div>

            <div className="bg-teal-800/80 rounded-2xl p-5 border border-teal-700/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-teal-200">
                <Volume2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">Dual-Modality Audio</h4>
              <p className="text-xs text-teal-200 leading-relaxed">
                Simultaneous visual highlighting and speech strengthens word recognition.
              </p>
            </div>

            <div className="bg-teal-800/80 rounded-2xl p-5 border border-teal-700/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-teal-200">
                <Eye className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">Color Sensory Tints</h4>
              <p className="text-xs text-teal-200 leading-relaxed">
                Cream, Mint, and Yellow tints alleviate glare and visual stress symptoms.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-teal-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>Try ClearRead for Free</span>
              <ArrowRight className="w-4 h-4 text-teal-900" />
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-sm border border-teal-600 transition-colors min-h-[48px]"
            >
              Back to Home
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
