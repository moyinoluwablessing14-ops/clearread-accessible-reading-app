import React from 'react';
import {
  Settings,
  Accessibility,
  Sliders,
  User as UserIcon,
  CreditCard,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { User, DisplaySettings, AccessibilitySettings, PlanType } from '../../types';

interface SettingsTabProps {
  user: User;
  isDemoMode: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
  onOpenAccessibilityModal: () => void;
  onOpenDisplayModal: () => void;
  onOpenPlanSelection: () => void;
  onSignOut: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  user,
  isDemoMode,
  onToggleDemoMode,
  onOpenAccessibilityModal,
  onOpenDisplayModal,
  onOpenPlanSelection,
  onSignOut,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 font-lexend pb-20">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-950 flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-800" />
          <span>Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          Manage your accessibility preferences, typography, account profile, and subscription.
        </p>
      </div>

      <div className="space-y-4">
        {/* DEMO MODE SWITCH */}
        <div className="bg-gradient-to-r from-amber-50 via-teal-50 to-emerald-50 rounded-3xl border-2 border-amber-300 p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs shrink-0">
                <Sparkles className="w-6 h-6 text-stone-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base text-stone-950">Demo Mode</h2>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-300 text-stone-950 uppercase tracking-wider">
                    Full Preview
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  Unlocks the Family plan, resets your daily page quota to 0, and loads realistic sample data (5-day streak, weekly minutes, and two child profiles with quiz scores).
                </p>
              </div>
            </div>

            <label
              htmlFor="demo-mode-toggle"
              className="relative inline-flex items-center cursor-pointer shrink-0"
            >
              <input
                id="demo-mode-toggle"
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => onToggleDemoMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-800"></div>
            </label>
          </div>

          {isDemoMode && (
            <div className="pt-2.5 border-t border-amber-300/60 text-xs text-teal-950 font-medium flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5 font-bold text-teal-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                Active: Family plan unlocked, daily quota reset, Maya &amp; Leo child profiles loaded
              </span>
              <span className="text-[11px] text-stone-500 font-normal">
                Toggle off anytime to return to Free
              </span>
            </div>
          )}
        </div>
        {/* SECTION 1: ACCESSIBILITY PREFERENCES */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Accessibility className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-stone-950">
                  Accessibility & Assistive Tools
                </h2>
                <p className="text-xs text-stone-500">
                  Audio-First mode, live captions, voice commands, and keyword symbols
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenAccessibilityModal}
              className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs rounded-xl transition-colors min-h-[40px] flex items-center gap-1.5"
            >
              <span>Configure</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECTION 2: DISPLAY & TYPOGRAPHY */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-stone-950">
                  Display & Typography
                </h2>
                <p className="text-xs text-stone-500">
                  Lexend / OpenDyslexic / Atkinson fonts, text scale up to 200%, contrast themes & ruler
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenDisplayModal}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs rounded-xl transition-colors min-h-[40px] flex items-center gap-1.5"
            >
              <span>Customize</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECTION 3: USER PROFILE */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-950">Account Profile</h2>
              <p className="text-xs text-stone-500">Your student or parent account credentials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-500 block text-[11px] font-semibold">Name</span>
              <span className="font-bold text-stone-900 text-sm mt-0.5 block">{user.name}</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-500 block text-[11px] font-semibold">Email</span>
              <span className="font-bold text-stone-900 text-sm mt-0.5 block">{user.email}</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: BILLING AND PLAN */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-stone-950">Billing and Plan</h2>
                <p className="text-xs text-stone-500">
                  Manage your subscription tier and change plans
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-teal-100 text-teal-900">
              {user.plan} Plan
            </span>
          </div>

          <div className="bg-stone-50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-stone-200">
            <div>
              <p className="font-bold text-sm text-stone-900 capitalize">
                ClearRead {user.plan} ({user.billingCycle})
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                {user.plan === 'free'
                  ? '3 simplified pages per day. Upgrade anytime for unlimited access.'
                  : user.plan === 'plus'
                  ? 'Unlimited pages, library, word helper, and reading reminders.'
                  : 'Family plan active with up to 5 child profiles and parent reporting.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenPlanSelection}
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs transition-colors self-start sm:self-auto min-h-[40px]"
            >
              Change Plan
            </button>
          </div>
        </div>

        {/* SECTION 5: SIGN OUT */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-stone-950">Sign Out</h2>
            <p className="text-xs text-stone-500">Exit your account on this device</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-red-50 hover:text-red-700 text-stone-700 font-bold text-xs transition-colors min-h-[42px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
