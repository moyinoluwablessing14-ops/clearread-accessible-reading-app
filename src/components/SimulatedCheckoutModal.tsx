import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  X,
  Loader2,
  Sparkles,
  ArrowRight,
  Check,
  Building,
} from 'lucide-react';
import { PlanType, BillingCycle } from '../types';

interface SimulatedCheckoutModalProps {
  isOpen: boolean;
  plan: PlanType;
  cycle: BillingCycle;
  currency: 'USD' | 'NGN';
  onClose: () => void;
  onSuccess: (plan: PlanType, cycle: BillingCycle) => void;
}

export const SimulatedCheckoutModal: React.FC<SimulatedCheckoutModalProps> = ({
  isOpen,
  plan,
  cycle,
  currency,
  onClose,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paystack'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [nameOnCard, setNameOnCard] = useState('Jordan Rivera');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'review' | 'processing' | 'confirmed'>('review');

  if (!isOpen) return null;

  const isFree = plan === 'free';
  const isFamily = plan === 'family';

  // Calculate pricing based on currency & cycle
  let priceDisplay = '$0.00';
  let periodDisplay = '/ month';
  if (isFree) {
    priceDisplay = currency === 'NGN' ? '₦0' : '$0.00';
    periodDisplay = 'Free forever';
  } else if (plan === 'plus') {
    if (currency === 'NGN') {
      priceDisplay = cycle === 'yearly' ? '₦6,800' : '₦8,500';
      periodDisplay = '/ month';
    } else {
      priceDisplay = cycle === 'yearly' ? '$7.99' : '$9.99';
      periodDisplay = '/ month';
    }
  } else if (plan === 'family') {
    if (currency === 'NGN') {
      priceDisplay = cycle === 'yearly' ? '₦13,600' : '₦17,000';
      periodDisplay = '/ month';
    } else {
      priceDisplay = cycle === 'yearly' ? '$15.99' : '$19.99';
      periodDisplay = '/ month';
    }
  }

  const handleAuthorize = () => {
    setIsProcessing(true);
    setStep('processing');

    setTimeout(() => {
      setStep('confirmed');
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(plan, cycle);
      }, 1200);
    }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-lexend text-stone-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 id="checkout-title" className="text-base font-bold text-stone-950">
                {isFree ? 'Activate Free Account' : 'Simulated Secure Checkout'}
              </h2>
              <p className="text-xs text-stone-500">
                {isFree ? 'No credit card required' : 'No real charges will be made'}
              </p>
            </div>
          </div>
          {step === 'review' && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 flex items-center justify-center transition-colors"
              aria-label="Close checkout"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {step === 'processing' ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 animate-spin text-teal-800" />
              <h3 className="text-lg font-bold text-stone-900">
                {isFree ? 'Setting up your reading space...' : 'Authorizing Subscription...'}
              </h3>
              <p className="text-xs text-stone-500 max-w-xs">
                Generating your accessibility token and unlocking ClearRead{' '}
                {plan.toUpperCase()} capabilities.
              </p>
            </div>
          ) : step === 'confirmed' ? (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-extrabold text-stone-900">Subscription Confirmed!</h3>
              <p className="text-xs text-stone-600 max-w-xs">
                Welcome to ClearRead {plan.toUpperCase()}! Taking you to personalized onboarding...
              </p>
            </div>
          ) : (
            <>
              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-700" />
                    <span className="font-bold text-sm text-stone-900 capitalize">
                      ClearRead {plan} Plan
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-800 text-white uppercase tracking-wider">
                    {cycle}
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-teal-200/60 pt-2.5">
                  <span className="text-xs text-stone-600 font-medium">Billed Amount:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-teal-950">{priceDisplay}</span>
                    <span className="text-xs text-stone-500 font-medium">{periodDisplay}</span>
                  </div>
                </div>
                <ul className="text-xs text-teal-900 space-y-1 pt-1 border-t border-teal-200/60">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>
                      {isFree
                        ? '3 pages/day, dyslexia fonts, read-aloud voice'
                        : isFamily
                        ? 'Unlimited pages, 4 child profiles, parent dashboard & goal rewards'
                        : 'Unlimited pages, Word Helper, definitions & syllables'}
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>Instant offline library access & cross-device sync</span>
                  </li>
                </ul>
              </div>

              {/* Payment Details (Only for Paid Plans) */}
              {!isFree && (
                <div className="space-y-4">
                  {currency === 'NGN' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          paymentMethod === 'card'
                            ? 'border-teal-700 bg-teal-50 text-teal-950 ring-2 ring-teal-600/30'
                            : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Debit Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paystack')}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          paymentMethod === 'paystack'
                            ? 'border-teal-700 bg-teal-50 text-teal-950 ring-2 ring-teal-600/30'
                            : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <Building className="w-4 h-4" />
                        <span>Paystack / Bank</span>
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Name on Subscription
                      </label>
                      <input
                        type="text"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-200 text-sm focus:border-teal-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        {paymentMethod === 'paystack' ? 'Card / Bank Account' : 'Card Number'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-stone-200 text-sm font-mono focus:border-teal-700 focus:outline-none"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <CreditCard className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-stone-200 text-sm font-mono focus:border-teal-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="text"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-stone-200 text-sm font-mono focus:border-teal-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100 pt-3">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>256-Bit SSL Encryption</span>
                </span>
                <span>Cancel Anytime</span>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleAuthorize}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px] focus:ring-4 focus:ring-teal-500/20 disabled:opacity-50"
              >
                <span>
                  {isFree ? 'Activate Free Plan' : `Authorize Simulated Payment (${priceDisplay})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
