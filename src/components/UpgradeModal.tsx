import React from 'react';
import { Sparkles, Lock, X, Check, ArrowRight } from 'lucide-react';
import { PlanType } from '../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  requiredPlan: 'plus' | 'family';
  onUpgradeToPlan: (plan: PlanType) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  featureName,
  requiredPlan,
  onUpgradeToPlan,
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const planTitle = requiredPlan === 'family' ? 'Family Plan' : 'Plus Plan';
  const planPrice = requiredPlan === 'family' ? '$5/month' : '$3/month';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-lexend"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="upgrade-modal-title" className="font-extrabold text-base text-stone-950">
                Unlock {featureName}
              </h3>
              <p className="text-xs text-stone-500">
                Available on the {planTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close upgrade dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 space-y-2">
          <p className="text-sm text-teal-950 font-bold">
            Upgrade to {planTitle} ({planPrice})
          </p>
          <p className="text-xs text-teal-900 leading-relaxed">
            {requiredPlan === 'family'
              ? 'Get up to 5 child profiles, parent dashboard, weekly progress summaries, and assigned reading lists.'
              : 'Enjoy unlimited daily readings, saved library, word definition helpers, and calendar reading reminders.'}
          </p>
        </div>

        <div className="space-y-2 text-xs text-stone-600">
          <p className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Instant access with simulated checkout</span>
          </p>
          <p className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Change or cancel anytime in Settings &gt; Billing</span>
          </p>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-50 min-h-[48px]"
          >
            Maybe later
          </button>
          <button
            type="button"
            onClick={() => {
              onUpgradeToPlan(requiredPlan);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5 min-h-[48px]"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
