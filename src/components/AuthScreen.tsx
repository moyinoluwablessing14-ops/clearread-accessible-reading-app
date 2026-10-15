import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
  Check,
} from 'lucide-react';
import { User } from '../types';

interface AuthScreenProps {
  initialMode?: 'login' | 'signup';
  onSuccess: (user: User, isNewUser: boolean) => void;
  onBackToLanding: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'signup',
  onSuccess,
  onBackToLanding,
}) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Field touch state for validation
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  // Validation logic
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isNameValid = name.trim().length >= 2;
  const isPasswordLengthValid = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

  // Password strength score 0-4
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (hasNumberOrSymbol) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    return score;
  };
  const strength = getPasswordStrength();

  const isFormValid = isSignUp
    ? isNameValid && isEmailValid && isPasswordLengthValid
    : isEmailValid && password.length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });

    if (!isFormValid) return;

    setIsLoading(true);

    setTimeout(() => {
      const user: User = {
        id: 'usr_' + Date.now().toString(36),
        name: isSignUp ? name.trim() : name.trim() || 'Welcome Back',
        email: email.trim().toLowerCase(),
        plan: 'free',
        billingCycle: 'monthly',
        pagesSimplifiedToday: 0,
        createdAt: new Date().toISOString(),
      };
      setIsLoading(false);
      onSuccess(user, isSignUp);
    }, 600);
  };

  const handleSelectGoogleAccount = (acc: { name: string; email: string }) => {
    setIsLoading(true);
    setShowGoogleModal(false);

    setTimeout(() => {
      const user: User = {
        id: 'usr_g_' + Date.now().toString(36),
        name: acc.name,
        email: acc.email,
        plan: 'free',
        billingCycle: 'monthly',
        pagesSimplifiedToday: 0,
        createdAt: new Date().toISOString(),
      };
      setIsLoading(false);
      onSuccess(user, isSignUp);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-10 px-4 sm:px-6 font-lexend text-stone-900 selection:bg-teal-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-6 transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ClearRead</span>
        </button>

        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-stone-950">
            Clear<span className="text-teal-700">Read</span>
          </span>
        </div>

        <h1 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          {isSignUp ? 'Create your ClearRead account' : 'Welcome back to ClearRead'}
        </h1>
        <p className="mt-1 text-center text-xs sm:text-sm text-stone-600">
          {isSignUp
            ? 'Accessible typography, read-aloud voice, and AI chunking.'
            : 'Access your saved library, customized profiles, and reading settings.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 sm:px-8 shadow-md rounded-3xl border border-stone-200 space-y-6">
          {/* Continue with Google button */}
          <div>
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-stone-200 hover:border-stone-300 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm shadow-2xs transition-all disabled:opacity-50 min-h-[50px] focus:ring-4 focus:ring-teal-500/20"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-stone-500 font-semibold">
                Or with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                    placeholder="e.g. Jordan Rivera"
                    className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
                      touched.name && !isNameValid
                        ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                        : 'border-stone-200 focus:border-teal-700 focus:ring-4 focus:ring-teal-500/15'
                    }`}
                  />
                </div>
                {touched.name && !isNameValid && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> Please enter your full name (at least 2 letters).
                  </p>
                )}
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  placeholder="name@example.com"
                  className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
                    touched.email && !isEmailValid
                      ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                      : 'border-stone-200 focus:border-teal-700 focus:ring-4 focus:ring-teal-500/15'
                  }`}
                />
              </div>
              {touched.email && !isEmailValid && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" /> Please enter a valid email address.
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-900">
                  Password <span className="text-red-500">*</span>
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordOpen(true);
                      setResetEmailSent(false);
                    }}
                    className="text-[11px] font-semibold text-teal-800 hover:text-teal-950 underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  placeholder={isSignUp ? 'At least 8 characters' : 'Enter password'}
                  className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
                    touched.password && (isSignUp ? !isPasswordLengthValid : password.length < 6)
                      ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                      : 'border-stone-200 focus:border-teal-700 focus:ring-4 focus:ring-teal-500/15'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength & validation meter for Sign Up */}
              {isSignUp && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          strength >= level
                            ? strength <= 1
                              ? 'bg-red-500'
                              : strength <= 2
                              ? 'bg-amber-500'
                              : 'bg-emerald-600'
                            : 'bg-stone-200'
                        }`}
                      />
                    ))}
                    <span className="text-[10px] font-bold text-stone-500 uppercase ml-1">
                      {strength <= 1
                        ? 'Weak'
                        : strength === 2
                        ? 'Fair'
                        : strength === 3
                        ? 'Good'
                        : 'Strong'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className={isPasswordLengthValid ? 'text-emerald-700 font-semibold' : ''}>
                      ✓ Minimum 8 characters
                    </span>
                    <span className={hasNumberOrSymbol ? 'text-emerald-700 font-semibold' : ''}>
                      ✓ Number or symbol
                    </span>
                  </div>
                </div>
              )}

              {!isSignUp && touched.password && password.length < 6 && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" /> Password must be at least 6 characters.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || (touched.email && !isFormValid)}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px] focus:ring-4 focus:ring-teal-500/20 disabled:opacity-50 cursor-pointer"
            >
              <span>{isSignUp ? 'Create Account & Choose Plan' : 'Sign In to ClearRead'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between login / sign up */}
          <div className="text-center pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setTouched({ name: false, email: false, password: false });
              }}
              className="text-xs font-semibold text-teal-800 hover:text-teal-950 underline min-h-[36px]"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account yet? Create one"}
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Google Account Chooser Modal */}
      {showGoogleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-lexend"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 w-full max-w-sm space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="font-bold text-sm text-stone-900">Sign in with Google</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">Choose an account to continue to ClearRead:</p>

            <div className="space-y-2">
              {[
                { name: 'Jordan Rivera', email: 'jordan.rivera@gmail.com', avatar: '🦊' },
                { name: 'Maya Rivera', email: 'maya.family@gmail.com', avatar: '🌟' },
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectGoogleAccount(acc)}
                  className="w-full p-3 rounded-2xl border border-stone-200 hover:border-teal-600 hover:bg-teal-50/50 flex items-center gap-3 transition-all text-left group"
                >
                  <span className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
                    {acc.avatar}
                  </span>
                  <div className="flex-1 truncate">
                    <p className="font-bold text-xs text-stone-900 group-hover:text-teal-950">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">{acc.email}</p>
                  </div>
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  handleSelectGoogleAccount({
                    name: 'School Reader',
                    email: 'student@school.edu',
                  })
                }
                className="w-full p-2.5 rounded-xl border border-dashed border-stone-300 hover:border-stone-400 text-stone-600 font-medium text-xs text-center transition-colors"
              >
                + Use another account
              </button>
            </div>

            <div className="text-[11px] text-stone-400 text-center pt-2 border-t border-stone-100">
              ClearRead will only access your profile name & email.
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-lexend"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 w-full max-w-sm space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900">Reset Your Password</h3>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {resetEmailSent ? (
              <div className="py-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-stone-900">Password Reset Link Sent</p>
                <p className="text-xs text-stone-500">
                  We sent instructions to {email || 'your email'}. Check your inbox!
                </p>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-teal-800 text-white text-xs font-bold w-full"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-stone-600">
                  Enter your email address and we will send you a secure password reset link:
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-teal-700"
                />
                <button
                  type="button"
                  onClick={() => setResetEmailSent(true)}
                  className="w-full py-2.5 rounded-xl bg-teal-800 text-white text-xs font-bold hover:bg-teal-900 transition-colors"
                >
                  Send Reset Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
