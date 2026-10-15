import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Volume2,
  Eye,
  Subtitles,
  Users,
  Check,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Zap,
  Lock,
  Headphones,
  Sliders,
  Type,
} from 'lucide-react';
import { PlanType, BillingCycle } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogIn: () => void;
  onSelectPlanPreview: (plan: PlanType, cycle: BillingCycle) => void;
  onNavigateHowItWorks: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogIn,
  onSelectPlanPreview,
  onNavigateHowItWorks,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does ClearRead adapt text for dyslexic readers?',
      a: 'ClearRead removes visual clutter by chunking walls of text into short, 2–4 sentence paragraphs with descriptive subheadings. It uses research-backed fonts like Lexend and OpenDyslexic, customizable line and letter spacing, and soft color overlays (like cream and warm sunlight) to prevent visual glare and letter movement.',
    },
    {
      q: 'Can blind or low-vision students navigate independently?',
      a: 'Yes. ClearRead features an Audio-First mode where every screen change, button action, and result is announced aloud. It includes hands-free voice commands, Web Speech word-by-word read-aloud highlighting, and high-contrast AAA yellow/black presets scaling up to 200%.',
    },
    {
      q: 'How does it help deaf and hard-of-hearing readers?',
      a: 'Every alert and feedback cue in ClearRead is 100% visual with no sound dependencies. When read-aloud runs, a real-time live caption bar displays current spoken sentences, and optional contextual visual icons appear beside key nouns and verbs.',
    },
    {
      q: 'Can I upload school homework or PDF documents?',
      a: 'Yes! You can paste raw text or upload `.txt` and `.pdf` files. ClearRead extracts the content and formats it cleanly for your chosen reading level (Easy, Medium, or Original).',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-lexend selection:bg-teal-200">
      {/* Top Navbar */}
      <nav className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-stone-900">
              Clear<span className="text-teal-700">Read</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onNavigateHowItWorks}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-teal-900 transition-colors min-h-[44px]"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={onLogIn}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 transition-colors min-h-[44px]"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="px-4 sm:px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 min-h-[44px]"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-teal-700" />
          Accessible Reading Engine
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-950 leading-[1.15]">
          Reading without barriers, <br className="hidden sm:inline" />
          <span className="text-teal-800">tailored to how you learn.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-stone-600 leading-relaxed font-normal">
          ClearRead transforms dense textbooks, articles, and homework into clear, chunked paragraphs with dyslexia-friendly typography, word-by-word read-aloud, and high-contrast visuals.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[56px]"
          >
            <span>Start Reading for Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onLogIn}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-base border border-stone-300 transition-colors min-h-[56px]"
          >
            Sign in to Existing Account
          </button>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" /> WCAG AA Compliant
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" /> Web Speech Read-Aloud
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" /> 100% Visual Cues Option
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" /> No Credit Card Required
          </span>
        </div>
      </section>

      {/* WHO IT HELPS */}
      <section className="py-16 bg-white border-y border-stone-200 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-stone-950 tracking-tight">
              Designed for Diverse Learners
            </h2>
            <p className="text-stone-600 text-base">
              Every learner processes information differently. ClearRead adjusts to your individual sensory and cognitive needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dyslexia */}
            <div className="p-6 rounded-3xl bg-[#FDFBF7] border-2 border-[#E6DFD5] space-y-3 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Type className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Dyslexia</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Lexend and OpenDyslexic weighted typefaces, warm tinted backgrounds to prevent glare, and short 3-sentence chunks.
              </p>
            </div>

            {/* Blind & Low Vision */}
            <div className="p-6 rounded-3xl bg-stone-950 text-white border-2 border-stone-800 space-y-3 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-amber-300">Blind & Low Vision</h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Audio-First mode with screen announcements, hands-free voice commands, Atkinson Hyperlegible, and 200% large text.
              </p>
            </div>

            {/* Deaf & Hard of Hearing */}
            <div className="p-6 rounded-3xl bg-[#F0F7FF] border-2 border-[#D2E3F4] space-y-3 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                <Subtitles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Deaf / Hard of Hearing</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                100% visual cues (no sound-dependent alerts), large live captions for speech, and plain-language mode with contextual icons.
              </p>
            </div>

            {/* English Learners */}
            <div className="p-6 rounded-3xl bg-[#F2F8F4] border-2 border-[#D1E6D7] space-y-3 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">English Learners</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Simplified vocabulary with key facts preserved, 3-bullet takeaway orientation, and syllable breakdown helpers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-stone-950 tracking-tight">
            Built for Independence and Comprehension
          </h2>
          <p className="text-stone-600 text-base">
            Everything students and parents need to make reading stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white border border-stone-200 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Smart Chunking & Simplification</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Choose Easy, Medium, or Original reading level. ClearRead breaks texts into manageable sections with friendly headings and a 3-bullet takeaway summary.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-stone-200 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Word-by-Word Read-Aloud</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Listen along with high-contrast active word highlighting. Tap any paragraph to "Read from here", and adjust playback speed from 0.5x to 2.0x.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-stone-200 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Full Typography & Ruler Controls</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Fine-tune font size, line spacing, letter spacing, and tint overlays (cream, yellow, mint, blue, high-contrast). Save combinations as profiles.
            </p>
          </div>
        </div>
      </section>

      {/* PLAN COMPARISON CARDS */}
      <section className="py-16 sm:py-24 bg-stone-100/80 border-t border-stone-200 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
              Simple, Accessible Plans
            </h2>
            <p className="text-stone-600 text-base">
              Start free with daily reading pages, or unlock unlimited readings and family monitoring.
            </p>

            {/* Country & Currency Switcher + Monthly / Yearly Toggle */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {/* Currency Toggle (USD vs Nigeria Naira) */}
              <div
                className="inline-flex items-center bg-white p-1 rounded-2xl border border-stone-300 shadow-xs"
                role="group"
                aria-label="Currency selection"
              >
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 min-h-[38px] ${
                    currency === 'USD'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  aria-pressed={currency === 'USD'}
                >
                  <span>🇺🇸 USD ($)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('NGN')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 min-h-[38px] ${
                    currency === 'NGN'
                      ? 'bg-emerald-850 text-white shadow-xs ring-2 ring-emerald-600/30'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  aria-pressed={currency === 'NGN'}
                >
                  <span>🇳🇬 Nigeria (₦ Naira)</span>
                </button>
              </div>

              {/* Monthly / Yearly Billing Toggle */}
              <div
                className="inline-flex items-center bg-white p-1 rounded-2xl border border-stone-300 shadow-xs"
                role="group"
                aria-label="Billing frequency"
              >
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[38px] ${
                    billingCycle === 'monthly'
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  aria-pressed={billingCycle === 'monthly'}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 min-h-[38px] ${
                    billingCycle === 'yearly'
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  aria-pressed={billingCycle === 'yearly'}
                >
                  <span>Yearly Billing</span>
                  <span className="text-[10px] bg-amber-400 text-stone-950 font-extrabold px-1.5 py-0.5 rounded-full">
                    {currency === 'NGN' ? 'Save 17%' : 'Save 20%'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* FREE PLAN */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Starter
                </span>
                <h3 className="text-2xl font-extrabold text-stone-900 mt-1">Free</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-stone-950">
                    {currency === 'NGN' ? '₦0' : '$0'}
                  </span>
                  <span className="text-stone-500 text-sm ml-1">/ forever</span>
                </div>
                <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                  Ideal for casual daily homework help and testing out ClearRead’s accessibility features.
                </p>

                <ul className="space-y-3 text-sm text-stone-700">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>3 simplified pages per day</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Easy, Medium, Original reading levels</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Display & typography controls</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Web Speech Read-Aloud & Word Highlighting</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Core accessibility modes</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onSelectPlanPreview('free', billingCycle)}
                className="mt-8 w-full py-3.5 px-4 rounded-xl border-2 border-stone-300 hover:border-teal-700 text-stone-900 font-bold text-sm transition-colors min-h-[48px]"
              >
                Get Started Free
              </button>
            </div>

            {/* PLUS PLAN (MOST POPULAR) */}
            <div className="p-7 rounded-3xl bg-white border-2 border-teal-700 flex flex-col justify-between shadow-lg relative ring-4 ring-teal-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-800 text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  Student Solo
                </span>
                <h3 className="text-2xl font-extrabold text-stone-900 mt-1">Plus</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-stone-950">
                    {currency === 'NGN'
                      ? billingCycle === 'monthly'
                        ? '₦4,500'
                        : '₦45,000'
                      : billingCycle === 'monthly'
                      ? '$3'
                      : '$29'}
                  </span>
                  <span className="text-stone-500 text-sm ml-1">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                  {currency === 'NGN' && billingCycle === 'yearly' && (
                    <span className="block text-[11px] font-semibold text-emerald-700 mt-1">
                      Save ₦9,000 (2 months free!)
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                  Everything in Free, plus unlimited reading, word definitions, progress streaks, and reminders.
                </p>

                <ul className="space-y-3 text-sm text-stone-700">
                  <li className="flex items-center gap-2.5 font-semibold text-teal-950">
                    <Check className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>Unlimited pages per day</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Saved personal document library</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Word helper (definitions + syllables)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Reading reminders with .ics calendar download</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Reading streak counter & weekly minutes chart</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Comprehension checks & quizzes</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onSelectPlanPreview('plus', billingCycle)}
                className="mt-8 w-full py-3.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all min-h-[48px]"
              >
                Choose Plus Plan
              </button>
            </div>

            {/* FAMILY PLAN */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Family & Parent Monitor
                </span>
                <h3 className="text-2xl font-extrabold text-stone-900 mt-1">Family</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-stone-950">
                    {currency === 'NGN'
                      ? billingCycle === 'monthly'
                        ? '₦7,500'
                        : '₦75,000'
                      : billingCycle === 'monthly'
                      ? '$5'
                      : '$48'}
                  </span>
                  <span className="text-stone-500 text-sm ml-1">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                  {currency === 'NGN' && billingCycle === 'yearly' && (
                    <span className="block text-[11px] font-semibold text-emerald-700 mt-1">
                      Save ₦15,000 (2 months free!)
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                  Everything in Plus, with up to 5 child profiles, parent dashboard, and progress summaries.
                </p>

                <ul className="space-y-3 text-sm text-stone-700">
                  <li className="flex items-center gap-2.5 font-semibold text-stone-950">
                    <Check className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>Up to 5 child profiles (separate settings)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Parent Dashboard & tricky words tracker</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Auto-generated weekly progress report</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Parent-assigned reading texts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Rewards, badges & reading milestones</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onSelectPlanPreview('family', billingCycle)}
                className="mt-8 w-full py-3.5 px-4 rounded-xl border-2 border-stone-300 hover:border-teal-700 text-stone-900 font-bold text-sm transition-colors min-h-[48px]"
              >
                Choose Family Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl font-extrabold text-stone-950 tracking-tight text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left font-bold text-base text-stone-900 flex items-center justify-between gap-4 min-h-[48px]"
                aria-expanded={openFaq === idx}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-stone-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-500 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER WITH DISCLAIMER */}
      <footer className="border-t border-stone-200 bg-white py-12 px-4 sm:px-6 text-stone-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
              <BookOpen className="w-5 h-5 text-teal-800" />
              <span>ClearRead</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500">
              <strong>Educational Disclaimer:</strong> ClearRead is an accessibility reading aid designed to enhance legibility and text comprehension. It does not diagnose, treat, or cure dyslexia, vision loss, or any medical condition.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-600">
            <button type="button" onClick={onNavigateHowItWorks} className="hover:text-stone-900 min-h-[44px]">
              How It Works
            </button>
            <button type="button" onClick={onLogIn} className="hover:text-stone-900 min-h-[44px]">
              Sign In
            </button>
            <button type="button" onClick={onGetStarted} className="hover:text-stone-900 min-h-[44px]">
              Get Started
            </button>
            <span className="text-stone-400">© ClearRead</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
