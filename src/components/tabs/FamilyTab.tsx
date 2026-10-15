import React, { useState } from 'react';
import {
  Users,
  Plus,
  Flame,
  Clock,
  Award,
  BookOpen,
  Lock,
  ArrowRight,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Target,
  RefreshCw,
  Loader2,
  Trash2,
} from 'lucide-react';
import { ChildProfile, User } from '../../types';

interface FamilyTabProps {
  childrenProfiles: ChildProfile[];
  onUpdateChildren: (profiles: ChildProfile[]) => void;
  user: User;
  onOpenUpgradeModal: (featureName: string, requiredPlan: 'plus' | 'family') => void;
}

export const FamilyTab: React.FC<FamilyTabProps> = ({
  childrenProfiles,
  onUpdateChildren,
  user,
  onOpenUpgradeModal,
}) => {
  const isLocked = user.plan !== 'family';
  const [activeChildId, setActiveChildId] = useState<string>(
    childrenProfiles[0]?.id || 'ch_1'
  );
  const [newAssignmentText, setNewAssignmentText] = useState('');
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  // Parent reward goal state
  const [isSettingGoal, setIsSettingGoal] = useState(false);
  const [goalFeedback, setGoalFeedback] = useState<string | null>(null);

  // Add child modal state
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildGrade, setNewChildGrade] = useState('3rd Grade');
  const [newChildAvatar, setNewChildAvatar] = useState('🦉');

  // AI Summary generation state
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const activeChild =
    childrenProfiles.find((c) => c.id === activeChildId) || childrenProfiles[0];

  const handleSetWeeklyGoal = (newMinutes: number) => {
    if (!activeChild || newMinutes <= 0) return;
    const isMet = activeChild.minutesReadThisWeek >= newMinutes;
    let updatedBadges = [...(activeChild.badges || ['Streak Starter', 'Curious Explorer'])];

    if (isMet && !updatedBadges.includes('Weekly Goal Crusher 🏆')) {
      updatedBadges = ['Weekly Goal Crusher 🏆', ...updatedBadges];
    }

    const updated = childrenProfiles.map((c) => {
      if (c.id === activeChild.id) {
        return {
          ...c,
          weeklyMinutesGoal: newMinutes,
          badges: updatedBadges,
        };
      }
      return c;
    });

    onUpdateChildren(updated);
    setIsSettingGoal(false);
    setGoalFeedback(`Goal set to ${newMinutes} minutes for ${activeChild.name}!`);
    setTimeout(() => setGoalFeedback(null), 3000);
  };

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignmentText.trim() || !activeChild) return;

    const updated = childrenProfiles.map((c) => {
      if (c.id === activeChild.id) {
        return {
          ...c,
          assignedReadings: [...c.assignedReadings, newAssignmentText.trim()],
        };
      }
      return c;
    });

    onUpdateChildren(updated);
    setNewAssignmentText('');
    setAssignmentSuccess(true);
    setTimeout(() => setAssignmentSuccess(false), 2500);
  };

  const handleRemoveAssignment = (index: number) => {
    if (!activeChild) return;
    const updated = childrenProfiles.map((c) => {
      if (c.id === activeChild.id) {
        const next = [...c.assignedReadings];
        next.splice(index, 1);
        return { ...c, assignedReadings: next };
      }
      return c;
    });
    onUpdateChildren(updated);
  };

  const handleAddChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim() || childrenProfiles.length >= 5) return;

    const newProfile: ChildProfile = {
      id: 'ch_' + Date.now().toString(36),
      name: newChildName.trim(),
      avatar: newChildAvatar,
      grade: newChildGrade,
      minutesReadThisWeek: 0,
      streakDays: 0,
      quizAverage: 100,
      trickyWords: [],
      assignedReadings: [],
      badges: ['Welcome Reader'],
      weeklySummary: `${newChildName.trim()} joined ClearRead! They are ready to begin their personalized reading journey.`,
    };

    const updated = [...childrenProfiles, newProfile];
    onUpdateChildren(updated);
    setActiveChildId(newProfile.id);
    setIsAddChildModalOpen(false);
    setNewChildName('');
  };

  const handleGenerateAISummary = async () => {
    if (!activeChild) return;
    setIsGeneratingSummary(true);

    try {
      const res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: activeChild.name,
          stats: {
            weeklyMinutes: activeChild.minutesReadThisWeek,
            streak: activeChild.streakDays,
            quizAccuracy: activeChild.quizAverage,
            trickyWords: activeChild.trickyWords,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.summary) {
        const updated = childrenProfiles.map((c) => {
          if (c.id === activeChild.id) {
            return { ...c, weeklySummary: data.summary };
          }
          return c;
        });
        onUpdateChildren(updated);
      }
    } catch (e) {
      console.warn('AI summary error:', e);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  if (isLocked) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center font-lexend space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Family Plan & Parent Dashboard
          </h1>
          <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Support up to 5 child readers with individual accessibility profiles, parent progress reports, and assigned texts on the <strong>Family Plan</strong>.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200 text-left space-y-3 max-w-md mx-auto shadow-xs">
          <p className="font-bold text-xs uppercase tracking-wider text-teal-800">
            Included in the Family Plan ($5/mo or $48/yr):
          </p>
          <ul className="text-xs text-stone-700 space-y-2">
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Up to 5 child profiles, each with individual fonts, color themes, and audio presets</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Parent dashboard with reading minutes, streaks, and tricky vocabulary words</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>AI weekly progress summaries generated in plain, encouraging language</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Assign custom reading texts directly to child accounts</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Weekly reading goals and celebration badges</span>
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={() => onOpenUpgradeModal('Family Dashboard & Child Profiles', 'family')}
          className="px-6 py-3.5 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 min-h-[48px]"
        >
          <span>Upgrade to Family Plan ($5/mo)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const defaultBadges = activeChild?.badges || [
    'Streak Starter',
    'Curious Explorer',
    'Vocabulary Champion',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-lexend pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-950 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-800" />
            <span>Parent Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Monitor reading streaks, tricky vocabulary, and assigned materials.
          </p>
        </div>

        {/* Child Profile Switcher + Add button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-stone-200 shadow-2xs">
            {childrenProfiles.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => setActiveChildId(child.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
                  activeChild?.id === child.id
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{child.avatar}</span>
                <span>{child.name}</span>
              </button>
            ))}
          </div>

          {childrenProfiles.length < 5 && (
            <button
              type="button"
              onClick={() => setIsAddChildModalOpen(true)}
              className="flex items-center gap-1 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors min-h-[38px]"
              title="Add a child profile (up to 5)"
            >
              <Plus className="w-4 h-4" />
              <span>Add Child ({childrenProfiles.length}/5)</span>
            </button>
          )}
        </div>
      </div>

      {activeChild && (
        <div className="space-y-6">
          {/* Child Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase block">Streak</span>
                <span className="text-xl font-extrabold text-stone-900">{activeChild.streakDays} Days</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase block">Weekly Time</span>
                <span className="text-xl font-extrabold text-stone-900">{activeChild.minutesReadThisWeek} Minutes</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase block">Quiz Average</span>
                <span className="text-xl font-extrabold text-stone-900">{activeChild.quizAverage}%</span>
              </div>
            </div>
          </div>

          {/* Weekly Reading Goal & Badges */}
          {(() => {
            const weeklyGoal = activeChild.weeklyMinutesGoal || 60;
            const isGoalMet = activeChild.minutesReadThisWeek >= weeklyGoal;
            const percent = Math.min(100, Math.round((activeChild.minutesReadThisWeek / weeklyGoal) * 100));
            const childBadges = activeChild.badges || [
              ...(isGoalMet ? ['Weekly Goal Crusher 🏆'] : []),
              'Streak Starter',
              'Curious Explorer',
            ];

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weekly Goal Progress */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-teal-800" />
                      <h3 className="font-bold text-base text-stone-900">Parent Reward Goal</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-full border border-teal-200">
                        Target: {weeklyGoal} min
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSettingGoal(!isSettingGoal)}
                        className="text-xs font-bold text-teal-800 hover:text-teal-950 underline px-2 py-1 rounded-lg hover:bg-teal-50 transition-colors min-h-[32px]"
                      >
                        {isSettingGoal ? 'Cancel' : 'Set Goal'}
                      </button>
                    </div>
                  </div>

                  {/* Goal feedback toast */}
                  {goalFeedback && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{goalFeedback}</span>
                    </div>
                  )}

                  {/* Parent Set Goal Controls */}
                  {isSettingGoal && (
                    <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2.5">
                      <p className="text-xs font-bold text-stone-700">
                        Choose weekly minutes goal for {activeChild.name}:
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[30, 45, 60, 90, 120].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => handleSetWeeklyGoal(mins)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[36px] ${
                              weeklyGoal === mins
                                ? 'bg-teal-800 text-white shadow-xs'
                                : 'bg-white border border-stone-200 text-stone-700 hover:border-teal-600'
                            }`}
                          >
                            {mins} min
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-stone-500">
                        When {activeChild.name} reads {weeklyGoal} minutes this week, they automatically unlock reward badges!
                      </p>
                    </div>
                  )}

                  {/* Goal Achieved Celebration Banner */}
                  {isGoalMet ? (
                    <div className="p-3.5 bg-amber-50 border-2 border-amber-300/80 rounded-2xl flex items-center gap-3 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center text-lg font-bold shrink-0">
                        🏆
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-amber-950">
                          Weekly Goal Achieved! ({activeChild.minutesReadThisWeek} / {weeklyGoal} min)
                        </p>
                        <p className="text-[11px] text-amber-800">
                          {activeChild.name} earned the <strong>&quot;Weekly Goal Crusher 🏆&quot;</strong> reward badge!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between text-xs font-bold text-stone-600 mb-1.5">
                        <span>{activeChild.minutesReadThisWeek} / {weeklyGoal} minutes read</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-700 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-stone-500 mt-2">
                        {weeklyGoal - activeChild.minutesReadThisWeek} more minutes needed this week to earn the next reward badge.
                      </p>
                    </div>
                  )}
                </div>

                {/* Badges Earned */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      <h3 className="font-bold text-base text-stone-900">Celebration Badges</h3>
                    </div>
                    <span className="text-[11px] font-bold text-stone-500">
                      {childBadges.length} Earned
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {childBadges.map((badge, bIdx) => {
                      const isRewardBadge = badge.includes('Goal Crusher') || badge.includes('🏆');
                      return (
                        <span
                          key={bIdx}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                            isRewardBadge
                              ? 'bg-amber-100 border-2 border-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-300/40'
                              : 'bg-amber-50 border border-amber-200 text-amber-950'
                          }`}
                        >
                          <span>{isRewardBadge ? '🏆' : '🎖️'}</span>
                          <span>{badge}</span>
                          {isRewardBadge && (
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-300 text-amber-950 font-extrabold ml-1">
                              Goal Reward
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-xs text-stone-500">
                    Reward badges are unlocked when parent weekly minute goals are met and reading quizzes are completed.
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Auto-Generated Weekly Progress Summary */}
          <div className="bg-teal-50/70 border-2 border-teal-200/80 rounded-3xl p-6 sm:p-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-800" />
                <h2 className="font-extrabold text-base text-teal-950">
                  Weekly Plain-Language Summary for {activeChild.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleGenerateAISummary}
                disabled={isGeneratingSummary}
                className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isGeneratingSummary ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Writing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Refresh with AI</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-teal-900 leading-relaxed font-normal whitespace-pre-line">
              {activeChild.weeklySummary ||
                `"${activeChild.name} completed ${activeChild.minutesReadThisWeek} minutes of reading this week across active sessions. Reading pace improved on multi-syllable science texts. They showed high recall on main ideas and were enthusiastic during the reading checks."`}
            </p>
          </div>

          {/* Tricky Words Section */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-stone-950">
                  Tricky Words & Pronunciation Needs
                </h3>
                <p className="text-xs text-stone-500">
                  Words where {activeChild.name} paused, requested syllable splits, or saved for practice.
                </p>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                {activeChild.trickyWords.length} Words
              </span>
            </div>

            {activeChild.trickyWords.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-2">
                No tricky words recorded yet. As {activeChild.name} taps words in reading, they will appear here.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {activeChild.trickyWords.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold capitalize"
                  >
                    {word}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Parent Assigned Reading */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-stone-950">
              Assigned Reading Material for {activeChild.name}
            </h3>

            {activeChild.assignedReadings.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No custom readings assigned yet.</p>
            ) : (
              <div className="space-y-2">
                {activeChild.assignedReadings.map((reading, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs font-bold text-stone-800"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-teal-800" />
                      <span>{reading}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Assigned
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAssignment(idx)}
                        className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                        aria-label="Remove assignment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddAssignment} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newAssignmentText}
                onChange={(e) => setNewAssignmentText(e.target.value)}
                placeholder="Assign a topic, article title, or chapter..."
                className="flex-1 p-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-teal-700"
              />
              <button
                type="submit"
                disabled={!newAssignmentText.trim()}
                className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold min-h-[40px]"
              >
                Assign Text
              </button>
            </form>
            {assignmentSuccess && (
              <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Added to {activeChild.name}'s reading list!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Add Child Profile Modal */}
      {isAddChildModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-lexend"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-child-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddChildModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 id="add-child-title" className="text-lg font-bold text-stone-900">
                Add Child Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsAddChildModalOpen(false)}
                className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddChildSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Child's Name</label>
                <input
                  type="text"
                  required
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="e.g. Sam"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Grade Level</label>
                <select
                  value={newChildGrade}
                  onChange={(e) => setNewChildGrade(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:border-teal-700 focus:outline-none"
                >
                  <option value="1st Grade">1st Grade</option>
                  <option value="2nd Grade">2nd Grade</option>
                  <option value="3rd Grade">3rd Grade</option>
                  <option value="4th Grade">4th Grade</option>
                  <option value="5th Grade">5th Grade</option>
                  <option value="Middle School">Middle School</option>
                  <option value="High School">High School</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Choose Avatar</label>
                <div className="flex gap-2 flex-wrap">
                  {['🦊', '🐬', '🦉', '🦁', '🚀', '🐼', '🦄', '🌟'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewChildAvatar(emoji)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${
                        newChildAvatar === emoji
                          ? 'border-teal-700 bg-teal-50 ring-2 ring-teal-500/20'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddChildModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newChildName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs disabled:opacity-50"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
