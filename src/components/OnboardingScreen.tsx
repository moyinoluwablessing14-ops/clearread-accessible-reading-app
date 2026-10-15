import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sliders,
  Type,
  Sun,
  Volume2,
  Glasses,
  User as UserIcon,
} from 'lucide-react';
import {
  DisplaySettings,
  AccessibilitySettings,
  ChildProfile,
  ReadingLevel,
  User,
} from '../types';

interface OnboardingScreenProps {
  user: User;
  initialDisplaySettings: DisplaySettings;
  initialAccessibilitySettings: AccessibilitySettings;
  onComplete: (
    updatedDisplay: DisplaySettings,
    updatedAccessibility: AccessibilitySettings,
    preferredLevel: ReadingLevel,
    childName: string,
    childGrade: string
  ) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  user,
  initialDisplaySettings,
  initialAccessibilitySettings,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Settings in onboarding
  const [fontFamily, setFontFamily] = useState(initialDisplaySettings.fontFamily);
  const [fontSize, setFontSize] = useState(initialDisplaySettings.fontSize || 20);
  const [theme, setTheme] = useState(initialDisplaySettings.theme);
  const [lineSpacing, setLineSpacing] = useState(initialDisplaySettings.lineSpacing);

  const [readingRulerEnabled, setReadingRulerEnabled] = useState(false); // MUST be off by default
  const [audioFirstMode, setAudioFirstMode] = useState(
    initialAccessibilitySettings.audioFirstMode || false
  );
  const [showWordIcons, setShowWordIcons] = useState(
    initialAccessibilitySettings.showWordIcons || false
  );

  const [readingLevel, setReadingLevel] = useState<ReadingLevel>('easy');
  const [studentName, setStudentName] = useState(
    user.name !== 'New Reader' && user.name ? user.name : 'Maya'
  );
  const [studentGrade, setStudentGrade] = useState('4th Grade');

  const handleFinish = () => {
    const updatedDisplay: DisplaySettings = {
      ...initialDisplaySettings,
      fontFamily,
      fontSize,
      theme,
      lineSpacing,
      readingRulerEnabled,
    };

    const updatedAccess: AccessibilitySettings = {
      ...initialAccessibilitySettings,
      audioFirstMode,
      showWordIcons,
      hasCompletedWelcomeSurvey: true,
    };

    onComplete(updatedDisplay, updatedAccess, readingLevel, studentName, studentGrade);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 font-lexend text-stone-900 selection:bg-teal-200">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Progress Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Step 3: Personalized Onboarding
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950">
            Welcome to ClearRead, {user.name}!
          </h1>
          <p className="text-stone-600 text-sm">
            Let's customize your comfortable reading environment before opening the reader.
          </p>

          {/* Stepper pills */}
          <div className="flex items-center justify-center gap-2 pt-3">
            {[
              { num: 1, title: 'Typography & Colors' },
              { num: 2, title: 'Reading Aids' },
              { num: 3, title: 'Reader Profile' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  currentStep === s.num
                    ? 'bg-teal-800 text-white shadow-xs'
                    : currentStep > s.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                <span>{s.num}.</span>
                <span>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 space-y-6">
          {/* STEP 1: TYPOGRAPHY & COLORS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2">
                  <Type className="w-5 h-5 text-teal-800" />
                  <span>Choose Your Dyslexia-Friendly Font</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Designed to reduce letter flipping and visual crowding.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
                  {[
                    { id: 'OpenDyslexic', label: 'OpenDyslexic' },
                    { id: 'Lexend', label: 'Lexend Deca' },
                    { id: 'Atkinson Hyperlegible', label: 'Atkinson' },
                    { id: 'sans-serif', label: 'Clean Sans' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFontFamily(f.id)}
                      className={`p-3 rounded-2xl border-2 text-xs font-bold text-center transition-all ${
                        fontFamily === f.id
                          ? 'border-teal-700 bg-teal-50 text-teal-950 shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Size */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900">Text Size: {fontSize}px</label>
                  <span className="text-[11px] text-stone-500 font-medium">Standard / Large</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="28"
                  step="2"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-teal-800 mt-2"
                />
              </div>

              {/* Theme / Contrast */}
              <div>
                <h3 className="text-xs font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-teal-700" />
                  <span>Background Comfort Color</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'cream', name: 'Warm Cream', bg: 'bg-[#FBF8EF] border-[#E8DFCA]' },
                    { id: 'soft-blue', name: 'Calm Blue', bg: 'bg-[#F0F5FA] border-[#D4E2ED]' },
                    { id: 'light', name: 'Pure White', bg: 'bg-white border-stone-200' },
                    { id: 'high-contrast-yellow', name: 'High Contrast', bg: 'bg-[#000000] text-yellow-300 border-stone-800' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id as any)}
                      className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all text-center ${t.bg} ${
                        theme === t.id ? 'ring-2 ring-teal-600 ring-offset-2' : ''
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Box */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  theme === 'cream'
                    ? 'bg-[#FBF8EF] text-stone-900 border-[#E8DFCA]'
                    : theme === 'soft-blue'
                    ? 'bg-[#F0F5FA] text-stone-900 border-[#D4E2ED]'
                    : theme === 'high-contrast-yellow'
                    ? 'bg-black text-yellow-300 border-stone-800'
                    : 'bg-white text-stone-900 border-stone-200'
                }`}
                style={{ fontSize: `${fontSize}px`, fontFamily }}
              >
                <p className="font-medium leading-relaxed">
                  "Reading is a passport to countless adventures. ClearRead gives words room to breathe."
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all min-h-[48px]"
              >
                <span>Continue to Reading Aids</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: READING AIDS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2">
                  <Glasses className="w-5 h-5 text-teal-800" />
                  <span>Dyslexia & Focus Tools</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Configure real-time reading guides and auditory feedback.
                </p>
              </div>

              <div className="space-y-3">
                {/* Reading Ruler Toggle */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Reading Ruler</h3>
                    <p className="text-xs text-stone-500">
                      Highlights the current line under your cursor to prevent line skipping (OFF by default).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReadingRulerEnabled(!readingRulerEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      readingRulerEnabled ? 'bg-teal-800' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        readingRulerEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Audio-First Highlighting */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-teal-700" />
                      <span>Word-by-Word Voice Highlighting</span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      Follow along visually with spoken audio highlighting each syllable.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAudioFirstMode(!audioFirstMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      audioFirstMode ? 'bg-teal-800' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        audioFirstMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Dyslexia Word Symbols */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Word Context Icons</h3>
                    <p className="text-xs text-stone-500">
                      Places tiny visual cues beside key vocabulary words to aid word recognition.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowWordIcons(!showWordIcons)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      showWordIcons ? 'bg-teal-800' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        showWordIcons ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-100 min-h-[44px]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all min-h-[48px]"
                >
                  <span>Continue to Reader Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: READER PROFILE */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-teal-800" />
                  <span>Reader Profile & Target Level</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Who will be reading? We customize comprehension questions and text complexity for them.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    Reader or Child Name
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Maya"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-200 text-sm focus:border-teal-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">Grade Level</label>
                  <select
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-200 text-sm focus:border-teal-700 focus:outline-none bg-white"
                  >
                    <option value="2nd Grade">2nd Grade</option>
                    <option value="3rd Grade">3rd Grade</option>
                    <option value="4th Grade">4th Grade</option>
                    <option value="5th Grade">5th Grade</option>
                    <option value="Middle School">Middle School</option>
                    <option value="High School">High School</option>
                    <option value="Adult Reader">Adult Reader</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-2">
                    Default Simplification Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'easy', label: 'Easy (Short Chunks)' },
                      { id: 'medium', label: 'Medium (Standard)' },
                      { id: 'original', label: 'Original Text' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setReadingLevel(lvl.id as ReadingLevel)}
                        className={`p-3 rounded-2xl border-2 text-xs font-bold text-center transition-all ${
                          readingLevel === lvl.id
                            ? 'border-teal-700 bg-teal-50 text-teal-950 shadow-2xs'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-100 min-h-[44px]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex-1 py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all min-h-[48px]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Complete Setup & Launch Reader</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
