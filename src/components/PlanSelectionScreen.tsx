import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Lock,
  X,
  BookOpen,
  Globe,
} from 'lucide-react';
import { PlanType, BillingCycle } from '../types';
import { SimulatedCheckoutModal } from './SimulatedCheckoutModal';

interface PlanSelectionScreenProps {
  currentPlan?: PlanType;
  onPlanChosen: (plan: PlanType, cycle: BillingCycle) => void;
  onSkipToApp?: () => void;
}

export const PlanSelectionScreen: React.FC<PlanSelectionScreenProps> = ({
  currentPlan = 'free',
  onPlanChosen,
  onSkipToApp,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanType | null>(null);

  const handleSelectPlan = (plan: PlanType) => {
    setSelectedPlanForCheckout(plan);
  };

  const handleCheckoutSuccess = (plan: PlanType, cycle: BillingCycle) => {
    setSelectedPlanForCheckout(null);
    onPlanChosen(plan, cycle);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 font-lexend text-stone-900 selection:bg-teal-200">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Step 2: Choose Your Plan
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-950">
            Select the right ClearRead tier
          </h1>
          <p className="text-stone-600 text-sm sm:text-base">
            Start with our generous Free tier, or upgrade anytime to unlock unlimited reading, word breakdowns, and parent monitoring.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-2">
            <div className="inline-flex items-center bg-white p-1 rounded-2xl border border-stone-300 shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[38px] ${
                  billingCycle === 'monthly'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 min-h-[38px] ${
                  billingCycle === 'yearly'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>Yearly</span>
                <span className="text-[10px] bg-amber-400 text-stone-950 font-extrabold px-1.5 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* FREE */}
          <div className="bg-white rounded-3xl p-7 border-2 border-stone-200 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Core Access
              </span>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-1">Free</h2>
              <div className="mt-3 mb-5">
                <span className="text-4xl font-extrabold text-stone-950">$0</span>
                <span className="text-xs text-stone-500 ml-1">/ forever</span>
              </div>
              <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                Essential tools for daily homework chunking and testing accessibility options.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3 simplified pages per day</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Easy, Medium, Original reading levels</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Lexend, OpenDyslexic & Atkinson fonts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Read-aloud with word highlighting</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All core accessibility & contrast modes</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('free')}
              className="mt-8 w-full py-3.5 px-4 rounded-xl border-2 border-stone-300 hover:border-teal-700 font-bold text-sm text-stone-900 transition-colors min-h-[48px]"
            >
              Continue with Free
            </button>
          </div>

          {/* PLUS (MOST POPULAR) */}
          <div className="bg-white rounded-3xl p-7 border-2 border-teal-700 flex flex-col justify-between shadow-lg relative ring-4 ring-teal-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-800 text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              Most Popular
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Solo Reader
              </span>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-1">Plus</h2>
              <div className="mt-3 mb-5">
                <span className="text-4xl font-extrabold text-stone-950">
                  {billingCycle === 'monthly' ? '$3' : '$29'}
                </span>
                <span className="text-xs text-stone-500 ml-1">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                Everything in Free, plus unlimited text pages, word helper, reading reminders, and streaks.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2 font-bold text-teal-950">
                  <Check className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Unlimited reading pages</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Saved document library</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Word helper: definitions & syllables</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Daily reminders + .ics calendar file</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Streaks & weekly minutes chart</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Comprehension quizzes</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('plus')}
              className="mt-8 w-full py-3.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all min-h-[48px]"
            >
              Choose Plus Plan
            </button>
          </div>

          {/* FAMILY */}
          <div className="bg-white rounded-3xl p-7 border-2 border-stone-200 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Family & Parents
              </span>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-1">Family</h2>
              <div className="mt-3 mb-5">
                <span className="text-4xl font-extrabold text-stone-950">
                  {billingCycle === 'monthly' ? '$5' : '$48'}
                </span>
                <span className="text-xs text-stone-500 ml-1">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                Everything in Plus, with up to 5 child profiles and comprehensive parent monitoring.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2 font-bold text-stone-950">
                  <Check className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Up to 5 child profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Parent Dashboard & tricky words</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Weekly progress summaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Parent-assigned reading texts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Reading reward badges</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('family')}
              className="mt-8 w-full py-3.5 px-4 rounded-xl border-2 border-stone-300 hover:border-teal-700 font-bold text-sm text-stone-900 transition-colors min-h-[48px]"
            >
              Choose Family Plan
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Checkout Modal */}
      {selectedPlanForCheckout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-stone-950">
                    Simulated Plan Checkout
                  </h3>
                  <p className="text-xs text-stone-500">
                    Zero real payment required (prototype demo)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanForCheckout(null)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 space-y-2 border border-stone-200">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-stone-900 capitalize">
                  ClearRead {selectedPlanForCheckout} Plan
                </span>
                <span className="font-bold text-stone-900">
                  {selectedPlanForCheckout === 'plus'
                    ? billingCycle === 'monthly'
                      ? '$3.00/mo'
                      : '$29.00/yr'
                    : billingCycle === 'monthly'
                    ? '$5.00/mo'
                    : '$48.00/yr'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Billed {billingCycle}. You can switch or cancel anytime in Settings &gt; Billing.
              </p>
            </div>

            <div className="text-xs text-stone-500 space-y-1">
              <p className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Instant access to all {selectedPlanForCheckout} features
              </p>
              <p className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> No charge or credit card required
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPlanForCheckout(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-50 min-h-[48px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingCheckout}
                onClick={handleConfirmSimulatedCheckout}
                className="flex-1 py-3 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>{isProcessingCheckout ? 'Activating...' : 'Activate Plan'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
