import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  Flame,
  Clock,
  CheckCircle,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';
import { User, ReadingProgress, QuizResult } from '../../types';
import { loadStoredProgress } from '../../utils/storage';
import { WordHelperModal } from '../WordHelperModal';

interface ProgressTabProps {
  user: User;
  onOpenUpgradeModal: (featureName: string, requiredPlan: 'plus' | 'family') => void;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  user,
  onOpenUpgradeModal,
}) => {
  const isLocked = user.plan === 'free';
  const [progress, setProgress] = useState<ReadingProgress>(loadStoredProgress());
  const [selectedTrickyWord, setSelectedTrickyWord] = useState<string | null>(null);

  useEffect(() => {
    setProgress(loadStoredProgress());
  }, [user]);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = daysOfWeek.map((day) => ({
    day,
    minutes: progress.weeklyMinutes[day] || 0,
    target: 15,
  }));

  const totalWeeklyMinutes: number = Object.values(progress.weeklyMinutes).reduce(
    (sum: number, m: number) => sum + (m || 0),
    0
  );

  // Compute comprehension accuracy
  const totalQuestions = progress.quizResults.reduce(
    (sum: number, q: QuizResult) => sum + q.total,
    0
  );
  const totalCorrect = progress.quizResults.reduce(
    (sum: number, q: QuizResult) => sum + q.score,
    0
  );
  const quizAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 100;

  const maxMinutes = Math.max(30, ...weeklyData.map((d) => d.minutes), 1);

  if (isLocked) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center font-lexend space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Reading Progress & Streaks
          </h1>
          <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Streaks, weekly reading time charts, and comprehension scores are unlocked on <strong>ClearRead Plus</strong> and <strong>Family</strong>.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200 text-left space-y-3 max-w-md mx-auto shadow-xs">
          <p className="font-bold text-xs uppercase tracking-wider text-teal-800">
            What you get with Plus:
          </p>
          <ul className="text-xs text-stone-700 space-y-2">
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Streaks counter to celebrate daily reading consistency</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Weekly minutes chart with visual bar graphs</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Comprehension quiz tracking and confidence scores</span>
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={() => onOpenUpgradeModal('Reading Progress & Streaks', 'plus')}
          className="px-6 py-3.5 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 min-h-[48px]"
        >
          <span>Upgrade to Plus ($3/mo)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-lexend pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-950 flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-teal-800" />
          <span>Reading Progress</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          Track consistency, reading duration, and comprehension growth.
        </p>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-300/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
              Active Streak
            </span>
            <span className="text-2xl font-extrabold text-stone-950">{progress.streak} Days</span>
            <p className="text-[11px] text-amber-800">
              {progress.streak > 0 ? 'Reading daily builds confidence!' : 'Start your streak today!'}
            </p>
          </div>
        </div>

        {/* Minutes Read This Week */}
        <div className="p-5 rounded-3xl bg-teal-50 border-2 border-teal-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
              Time This Week
            </span>
            <span className="text-2xl font-extrabold text-stone-950">{totalWeeklyMinutes} Min</span>
            <p className="text-[11px] text-teal-800">Real tracked reading time</p>
          </div>
        </div>

        {/* Comprehension Score */}
        <div className="p-5 rounded-3xl bg-sky-50 border-2 border-sky-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-sky-900 uppercase tracking-wider block">
              Quiz Accuracy
            </span>
            <span className="text-2xl font-extrabold text-stone-950">{quizAccuracy}%</span>
            <p className="text-[11px] text-sky-800">
              {progress.quizResults.length > 0
                ? `Across ${progress.quizResults.length} quiz checks`
                : 'Complete a quiz to track accuracy'}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Minutes Chart */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-base text-stone-950">
              Weekly Reading Activity
            </h2>
            <p className="text-xs text-stone-500">Minutes read each day this week</p>
          </div>
          <span className="text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-full">
            Goal: 15 min / day
          </span>
        </div>

        {/* Bar chart */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end pt-8 pb-2 h-48 border-b border-stone-100">
          {weeklyData.map((item, idx) => {
            const heightPercent = Math.max(8, Math.round((item.minutes / maxMinutes) * 100));
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.minutes}m
                </span>
                <div className="w-full max-w-[38px] bg-stone-100 rounded-xl overflow-hidden h-full flex items-end">
                  <div
                    className="w-full bg-teal-800 group-hover:bg-teal-700 rounded-xl transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-stone-700">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tricky Words Saved */}
      {progress.trickyWords.length > 0 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-800" />
              <h2 className="font-bold text-base text-stone-900">Tricky Words Mastered</h2>
            </div>
            <span className="text-xs font-bold text-stone-400">
              Tap any word for syllables & audio
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Words saved during reading for pronunciation practice and definitions.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {progress.trickyWords.map((word: string, wIdx: number) => (
              <button
                key={wIdx}
                type="button"
                onClick={() => setSelectedTrickyWord(word)}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 text-amber-950 font-bold text-xs capitalize transition-all cursor-pointer flex items-center gap-2 shadow-2xs group focus:ring-2 focus:ring-teal-500 min-h-[38px]"
                title={`Tap to view definition, syllables, and hear "${word}"`}
              >
                <span>{word}</span>
                <span className="text-[11px] text-amber-700 opacity-70 group-hover:opacity-100">
                  🔊
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Word Helper Modal for Tricky Words */}
      <WordHelperModal
        word={selectedTrickyWord}
        onClose={() => setSelectedTrickyWord(null)}
        isSaved={true}
      />
    </div>
  );
};
