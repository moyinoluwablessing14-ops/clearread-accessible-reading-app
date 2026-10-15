/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Sliders,
  Check,
  AlertCircle,
  Subtitles,
  Database,
  RotateCcw,
  Bell,
} from 'lucide-react';
import {
  DisplaySettings,
  ReadingProfile,
  ProcessedDocument,
  ReadingLevel,
  User,
  PlanType,
  BillingCycle,
  ScreenType,
  AppTab,
  ChildProfile,
  DailyReminder,
  AccessibilitySettings,
  VoiceCommand,
  ReadingProgress,
} from './types';
import {
  loadStoredSettings,
  saveStoredSettings,
  loadStoredAccessibilitySettings,
  saveStoredAccessibilitySettings,
  loadAllProfiles,
  saveCustomProfile,
  deleteCustomProfile,
  loadActiveProfileId,
  saveActiveProfileId,
  loadRecentDocs,
  saveRecentDoc,
  deleteRecentDoc,
  loadStoredUser,
  saveStoredUser,
  loadStoredReminder,
  saveStoredReminder,
  loadStoredChildProfiles,
  saveStoredChildProfiles,
  DEFAULT_USER,
  DEFAULT_CHILD_PROFILES,
  DEFAULT_READING_PROGRESS,
  saveStoredProgress,
} from './utils/storage';
import { LandingPage } from './components/LandingPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { AuthScreen } from './components/AuthScreen';
import { PlanSelectionScreen } from './components/PlanSelectionScreen';
import { Navigation } from './components/Navigation';
import { ReadTab } from './components/tabs/ReadTab';
import { FocusedReaderScreen } from './components/tabs/FocusedReaderScreen';
import { LibraryTab } from './components/tabs/LibraryTab';
import { RemindersTab } from './components/tabs/RemindersTab';
import { ProgressTab } from './components/tabs/ProgressTab';
import { FamilyTab } from './components/tabs/FamilyTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { DisplayControlsModal } from './components/DisplayControlsModal';
import { AccessibilityPanelModal } from './components/AccessibilityPanelModal';
import { UpgradeModal } from './components/UpgradeModal';
import { CaptionsOverlay } from './components/CaptionsOverlay';
import { VoiceCommandIndicator } from './components/VoiceCommandIndicator';
import { ReadingRuler } from './components/ReadingRuler';
import { SAMPLE_TEXTS } from './constants/sampleTexts';
import { speechService, voiceRecognitionService } from './utils/speech';

export default function App() {
  // Navigation / Screen State
  const [currentUser, setCurrentUser] = useState<User | null>(loadStoredUser);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(
    currentUser ? 'app' : 'landing'
  );
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [activeTab, setActiveTab] = useState<AppTab>('read');

  // Reader & Document State
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS[0].fullText);
  const [selectedLevel, setSelectedLevel] = useState<ReadingLevel>('easy');
  const [currentDoc, setCurrentDoc] = useState<ProcessedDocument | null>(null);
  const [recentDocs, setRecentDocs] = useState<ProcessedDocument[]>(loadRecentDocs);
  const [isLoadingSimplify, setIsLoadingSimplify] = useState(false);
  const [simplifyStep, setSimplifyStep] = useState('');
  const [appError, setAppError] = useState<string | null>(null);

  // Settings & Accessibility State
  const [settings, setSettings] = useState<DisplaySettings>(loadStoredSettings);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(
    loadStoredAccessibilitySettings
  );
  const [profiles, setProfiles] = useState<ReadingProfile[]>(loadAllProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string>(loadActiveProfileId);

  // Reminders & Family State
  const [reminder, setReminder] = useState<DailyReminder>(loadStoredReminder);
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>(loadStoredChildProfiles);

  // Modals State
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [upgradeModalConfig, setUpgradeModalConfig] = useState<{
    isOpen: boolean;
    featureName: string;
    requiredPlan: 'plus' | 'family';
  }>({
    isOpen: false,
    featureName: '',
    requiredPlan: 'plus',
  });

  // Captions & Speech State
  const [spokenSentence, setSpokenSentence] = useState('');
  const [spokenWord, setSpokenWord] = useState('');

  // Voice Recognition
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [lastVoiceTranscript, setLastVoiceTranscript] = useState('');
  const [lastVoiceCommand, setLastVoiceCommand] = useState<VoiceCommand | null>(null);
  const [voiceErrorMessage, setVoiceErrorMessage] = useState<string | null>(null);
  const [voiceCommandTrigger, setVoiceCommandTrigger] = useState<string | null>(null);

  // Screen reader polite announcements
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('');
  const [visualToast, setVisualToast] = useState<{ message: string; type: 'success' | 'info' | 'alert' } | null>(null);

  const showVisualToast = (message: string, type: 'success' | 'info' | 'alert' = 'info') => {
    setVisualToast({ message, type });
    setTimeout(() => {
      setVisualToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const announceAccessible = (message: string) => {
    setScreenReaderAnnouncement(message);
    if (accessibilitySettings.audioFirstMode) {
      speechService.announce(
        message,
        accessibilitySettings.speechRate,
        accessibilitySettings.selectedVoiceURI
      );
    }
  };

  // Sync settings
  const handleUpdateSettings = (newSettings: DisplaySettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const handleUpdateAccessibility = (newAccess: AccessibilitySettings) => {
    setAccessibilitySettings(newAccess);
    saveStoredAccessibilitySettings(newAccess);

    if (newAccess.voiceCommandsEnabled && !isVoiceListening) {
      startVoiceListening();
    } else if (!newAccess.voiceCommandsEnabled && isVoiceListening) {
      stopVoiceListening();
    }
  };

  const handleUpdateUser = (updatedUser: User | null) => {
    setCurrentUser(updatedUser);
    saveStoredUser(updatedUser);
  };

  const handleUpdateReminder = (newRem: DailyReminder) => {
    setReminder(newRem);
    saveStoredReminder(newRem);
    showVisualToast('Reading reminder schedule saved.', 'success');
  };

  const handleUpdateChildren = (newChildren: ChildProfile[]) => {
    setChildProfiles(newChildren);
    saveStoredChildProfiles(newChildren);
  };

  // Demo Mode Handler
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('clearread_demo_mode') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    if (enabled) {
      try {
        localStorage.setItem('clearread_demo_mode', 'true');
      } catch {}

      // 1. Unlocks Family plan and resets daily page quota
      const updatedUser: User = {
        ...(currentUser || DEFAULT_USER),
        plan: 'family',
        billingCycle: 'yearly',
        pagesSimplifiedToday: 0,
      };
      handleUpdateUser(updatedUser);

      // 2. Populates realistic sample data for Family tab: two child profiles with quiz scores
      const demoChildren: ChildProfile[] = [
        {
          id: 'ch_1',
          name: 'Maya',
          avatar: '🦊',
          grade: '4th Grade',
          minutesReadThisWeek: 95,
          streakDays: 5,
          quizAverage: 92,
          trickyWords: ['photosynthesis', 'chlorophyll', 'atmosphere', 'ecosystem'],
          assignedReadings: ['The Great Pyramids of Giza', 'How Clouds Form'],
          badges: ['5-Day Streak Master', 'Science Explorer'],
          weeklySummary: 'Maya had an exceptional week, reading 95 minutes across 5 consecutive days and mastering photosynthesis concepts with a 92% quiz accuracy.',
        },
        {
          id: 'ch_2',
          name: 'Leo',
          avatar: '🐬',
          grade: '7th Grade',
          minutesReadThisWeek: 130,
          streakDays: 5,
          quizAverage: 88,
          trickyWords: ['hydrothermal', 'archaeological', 'biodiversity'],
          assignedReadings: ['Life in the Deep Ocean Trenches'],
          badges: ['Deep Sea Pioneer', 'Vocab Champion'],
          weeklySummary: 'Leo completed all assigned ocean trench readings with high comprehension, maintaining a 5-day reading streak and scoring 88% on quizzes.',
        },
      ];
      handleUpdateChildren(demoChildren);

      // 3. Populates realistic sample data for Progress tab: 5-day streak, weekly minutes, quiz results
      const demoProgress: ReadingProgress = {
        streak: 5,
        lastReadDate: new Date().toISOString().split('T')[0],
        weeklyMinutes: {
          Mon: 25,
          Tue: 30,
          Wed: 20,
          Thu: 35,
          Fri: 40,
          Sat: 20,
          Sun: 15,
        },
        quizResults: [
          {
            id: 'quiz-demo-1',
            documentTitle: 'How Clouds Form in the Atmosphere',
            score: 3,
            total: 3,
            date: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 'quiz-demo-2',
            documentTitle: 'The Great Barrier Reef Ecosystem',
            score: 3,
            total: 3,
            date: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: 'quiz-demo-3',
            documentTitle: 'Ancient Pyramids of Giza',
            score: 3,
            total: 3,
            date: new Date(Date.now() - 259200000).toISOString(),
          },
        ],
        trickyWords: [
          'photosynthesis',
          'biodiversity',
          'condensation',
          'precipitation',
          'atmosphere',
        ],
      };
      saveStoredProgress(demoProgress);

      showVisualToast(
        'Demo mode enabled: Family plan unlocked, quota reset, & sample data populated!',
        'success'
      );
    } else {
      try {
        localStorage.removeItem('clearread_demo_mode');
      } catch {}

      const resetUser: User = {
        ...(currentUser || DEFAULT_USER),
        plan: 'free',
        billingCycle: 'monthly',
        pagesSimplifiedToday: 1,
      };
      handleUpdateUser(resetUser);
      handleUpdateChildren(DEFAULT_CHILD_PROFILES);
      saveStoredProgress(DEFAULT_READING_PROGRESS);

      showVisualToast('Demo mode turned off. Switched back to Free plan.', 'info');
    }
  };

  // Auth flow handlers
  const handleAuthSuccess = (user: User, isNewUser: boolean) => {
    handleUpdateUser(user);
    if (isNewUser) {
      setCurrentScreen('plan-selection');
    } else {
      setCurrentScreen('app');
      announceAccessible(`Welcome back, ${user.name}.`);
    }
  };

  const handlePlanChosen = (plan: PlanType, cycle: BillingCycle) => {
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        plan,
        billingCycle: cycle,
      };
      handleUpdateUser(updatedUser);
    }

    // If survey not completed yet, open accessibility survey
    if (!accessibilitySettings.hasCompletedWelcomeSurvey) {
      setIsAccessibilityModalOpen(true);
    }
    setCurrentScreen('app');
    showVisualToast(`ClearRead ${plan.toUpperCase()} Plan activated!`, 'success');
    announceAccessible(`ClearRead ${plan} Plan activated.`);
  };

  const handleSignOut = () => {
    handleUpdateUser(null);
    setCurrentDoc(null);
    setCurrentScreen('landing');
    announceAccessible('Signed out of ClearRead.');
  };

  // Upgrade Modal Triggers
  const openUpgradeModal = (
    featureName: string,
    requiredPlan: 'plus' | 'family' = 'plus'
  ) => {
    setUpgradeModalConfig({
      isOpen: true,
      featureName,
      requiredPlan,
    });
  };

  const handleUpgradeToPlan = (plan: PlanType) => {
    if (currentUser) {
      const updated: User = { ...currentUser, plan };
      handleUpdateUser(updated);
      showVisualToast(`Upgraded to ClearRead ${plan.toUpperCase()}!`, 'success');
      announceAccessible(`Upgraded to ClearRead ${plan} Plan.`);
    }
  };

  // Voice Command Handlers
  const handleVoiceCommand = (cmd: VoiceCommand, raw: string) => {
    setLastVoiceCommand(cmd);
    setLastVoiceTranscript(raw);
    showVisualToast(`Voice command: "${cmd}"`, 'info');

    setTimeout(() => setLastVoiceCommand(null), 3000);

    switch (cmd) {
      case 'read':
        setVoiceCommandTrigger('read');
        setTimeout(() => setVoiceCommandTrigger(null), 300);
        break;
      case 'pause':
        setVoiceCommandTrigger('pause');
        setTimeout(() => setVoiceCommandTrigger(null), 300);
        break;
      case 'next':
        setVoiceCommandTrigger('next');
        setTimeout(() => setVoiceCommandTrigger(null), 300);
        break;
      case 'previous':
        setVoiceCommandTrigger('previous');
        setTimeout(() => setVoiceCommandTrigger(null), 300);
        break;
      case 'simplify':
        if (!currentDoc) handleSimplify();
        break;
      case 'bigger text':
        handleUpdateSettings({
          ...settings,
          fontSize: Math.min(38, settings.fontSize + 3),
        });
        announceAccessible(`Text size increased to ${Math.min(38, settings.fontSize + 3)} pixels.`);
        break;
      case 'smaller text':
        handleUpdateSettings({
          ...settings,
          fontSize: Math.max(14, settings.fontSize - 3),
        });
        announceAccessible(`Text size decreased to ${Math.max(14, settings.fontSize - 3)} pixels.`);
        break;
      case 'high contrast':
        handleUpdateSettings({
          ...settings,
          theme: settings.theme === 'high-contrast-yellow' ? 'cream' : 'high-contrast-yellow',
        });
        break;
      default:
        break;
    }
  };

  const startVoiceListening = () => {
    if (!voiceRecognitionService.isSupported()) {
      setVoiceErrorMessage('Voice recognition not supported in this browser.');
      return;
    }
    setVoiceErrorMessage(null);
    voiceRecognitionService.start({
      onCommand: handleVoiceCommand,
      onTranscript: (t) => setLastVoiceTranscript(t),
      onError: (err) => setVoiceErrorMessage(err),
    });
    setIsVoiceListening(true);
    announceAccessible('Voice listening active.');
  };

  const stopVoiceListening = () => {
    voiceRecognitionService.stop();
    setIsVoiceListening(false);
    announceAccessible('Voice listening paused.');
  };

  const toggleVoiceListening = () => {
    if (isVoiceListening) stopVoiceListening();
    else startVoiceListening();
  };

  // AI Simplification execution
  const handleSimplify = async (pdfBase64?: string) => {
    setIsLoadingSimplify(true);
    setAppError(null);
    setSimplifyStep('Connecting to ClearRead reading engine...');

    announceAccessible(`Simplifying document at ${selectedLevel} reading level.`);

    const t1 = setTimeout(() => setSimplifyStep('Adapting sentences & clarifying terms...'), 1100);
    const t2 = setTimeout(() => setSimplifyStep('Chunking into bite-sized paragraphs...'), 2400);
    const t3 = setTimeout(() => setSimplifyStep('Generating 3-bullet takeaway summary...'), 3800);

    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          pdfBase64: pdfBase64,
          level: selectedLevel,
        }),
      });

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Could not process text.');
      }

      const resultData = json.data;
      const processed: ProcessedDocument = {
        id: 'doc-' + Date.now().toString(36),
        title: resultData.title || 'Untitled Document',
        originalText: inputText,
        level: selectedLevel,
        keyPoints: resultData.keyPoints || [],
        estimatedReadingTimeMinutes: resultData.estimatedReadingTimeMinutes || 2,
        wordCount: resultData.wordCount || 150,
        chunks: resultData.chunks || [],
        createdAt: new Date().toISOString(),
      };

      setCurrentDoc(processed);
      saveRecentDoc(processed);
      setRecentDocs(loadRecentDocs());

      // Increment daily pages used if free plan
      if (currentUser && currentUser.plan === 'free') {
        const updated = {
          ...currentUser,
          pagesSimplifiedToday: (currentUser.pagesSimplifiedToday || 0) + 1,
        };
        handleUpdateUser(updated);
      }

      announceAccessible(
        `Simplification complete. Title: ${processed.title}. 3 key points and ${processed.chunks.length} sections are ready.`
      );
      showVisualToast(`"${processed.title}" ready to read!`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Simplification error:', err);
      const msg = err.message || 'Failed to simplify document. Please try again.';
      setAppError(msg);
      announceAccessible(`Error: ${msg}`);
      showVisualToast(msg, 'alert');
    } finally {
      setIsLoadingSimplify(false);
      setSimplifyStep('');
    }
  };

  // Keyboard accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAccessibilityModalOpen((prev) => !prev);
      }
      if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsDisplayModalOpen((prev) => !prev);
      }
      if (e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        toggleVoiceListening();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVoiceListening]);

  // SCREEN 1: LANDING PAGE
  if (currentScreen === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => {
          setAuthMode('signup');
          setCurrentScreen('auth');
        }}
        onLogIn={() => {
          setAuthMode('login');
          setCurrentScreen('auth');
        }}
        onSelectPlanPreview={(plan, cycle) => {
          setAuthMode('signup');
          setCurrentScreen('auth');
        }}
        onNavigateHowItWorks={() => setCurrentScreen('how-it-works')}
      />
    );
  }

  // SCREEN: HOW IT WORKS
  if (currentScreen === 'how-it-works') {
    return (
      <HowItWorksPage
        onBackToHome={() => setCurrentScreen('landing')}
        onGetStarted={() => {
          setAuthMode('signup');
          setCurrentScreen('auth');
        }}
      />
    );
  }

  // SCREEN 2: AUTH SCREEN
  if (currentScreen === 'auth') {
    return (
      <AuthScreen
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
        onBackToLanding={() => setCurrentScreen('landing')}
      />
    );
  }

  // SCREEN 3: PLAN SELECTION SCREEN
  if (currentScreen === 'plan-selection') {
    return (
      <PlanSelectionScreen
        currentPlan={currentUser?.plan || 'free'}
        onPlanChosen={handlePlanChosen}
        onSkipToApp={() => setCurrentScreen('app')}
      />
    );
  }

  // SCREEN 4: MAIN APP
  const activeUser = currentUser || DEFAULT_USER;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 font-lexend flex flex-col md:flex-row selection:bg-teal-200">
      {/* Screen Reader Live Region */}
      <div role="status" aria-live="polite" className="sr-only" aria-atomic="true">
        {screenReaderAnnouncement}
      </div>

      {/* Accessible Skip Link */}
      <a
        href="#app-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-teal-800 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Assistive Reading Ruler Guide - ONLY active when user has explicitly enabled it in Display controls and is actively reading a document */}
      <ReadingRuler
        enabled={
          settings.showReadingRuler &&
          currentScreen === 'app' &&
          activeTab === 'read' &&
          Boolean(currentDoc) &&
          !isDisplayModalOpen &&
          !isAccessibilityModalOpen &&
          !upgradeModalConfig.isOpen
        }
        height={settings.rulerHeight}
      />

      {/* Visual Toast Notification Banner */}
      {visualToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 right-4 z-50 transition-all duration-300 max-w-sm"
        >
          <div
            className={`p-3.5 rounded-2xl shadow-xl border-2 flex items-center gap-3 ${
              visualToast.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-400'
                : visualToast.type === 'alert'
                ? 'bg-red-950 text-red-100 border-red-400'
                : 'bg-stone-900 text-stone-100 border-teal-400'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold leading-snug">{visualToast.message}</p>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION (Desktop) & BOTTOM TAB BAR (Mobile) */}
      {!currentDoc && (
        <Navigation
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            announceAccessible(`Navigated to ${tab} tab.`);
          }}
          user={activeUser}
          onOpenUpgradeModal={openUpgradeModal}
          onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
        />
      )}

      {/* MAIN VIEW AREA */}
      <main
        id="app-main-content"
        className={`flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-6xl mx-auto w-full ${
          currentDoc ? 'max-w-4xl' : ''
        }`}
      >
        {/* App Error Banner */}
        {appError && (
          <div
            className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-900 rounded-2xl flex items-start gap-3 shadow-xs"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-sm">Notice</p>
              <p className="text-xs text-red-700 mt-0.5">{appError}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAppError(null);
                  handleSimplify();
                }}
                className="text-xs font-bold text-teal-850 hover:text-teal-950 px-3 py-1.5 bg-white border border-teal-300 rounded-lg min-h-[36px] shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <button
                type="button"
                onClick={() => setAppError(null)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 px-2.5 py-1.5 bg-stone-100 rounded-lg min-h-[36px] transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* In-App Reading Reminder Banner when due */}
        {reminder.enabled && !currentDoc && (
          <div className="mb-6 p-4 rounded-2xl bg-teal-50/80 border-2 border-teal-200/90 text-stone-900 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900">Daily Reading Routine</p>
                <p className="text-xs text-stone-600">
                  Ready for your {reminder.targetMinutes}-minute comfortable reading session? Read at your own pace without rush.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('read');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shrink-0 min-h-[36px] transition-colors"
            >
              Start Reading
            </button>
          </div>
        )}

        {/* FOCUSED READING CANVAS (WHEN A DOCUMENT IS OPEN) */}
        {currentDoc ? (
          <FocusedReaderScreen
            document={currentDoc}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onOpenDisplayControls={() => setIsDisplayModalOpen(true)}
            onBackToInput={() => {
              setCurrentDoc(null);
              announceAccessible('Returned to document input.');
            }}
            accessibilitySettings={accessibilitySettings}
            onUpdateAccessibility={handleUpdateAccessibility}
            onSpokenSentenceChange={(s, w) => {
              setSpokenSentence(s);
              if (w) setSpokenWord(w);
            }}
            voiceCommandTrigger={voiceCommandTrigger}
            user={activeUser}
            onOpenUpgradeModal={openUpgradeModal}
          />
        ) : (
          /* TAB SCREENS */
          <>
            {activeTab === 'read' && (
              <ReadTab
                text={inputText}
                onChangeText={setInputText}
                selectedLevel={selectedLevel}
                onChangeLevel={setSelectedLevel}
                onSimplify={handleSimplify}
                isLoading={isLoadingSimplify}
                loadingStep={simplifyStep}
                user={activeUser}
                onOpenUpgradeModal={openUpgradeModal}
              />
            )}

            {activeTab === 'library' && (
              <LibraryTab
                documents={recentDocs}
                onSelectDoc={(doc) => {
                  setCurrentDoc(doc);
                  announceAccessible(`Opened ${doc.title} in focused reading mode.`);
                }}
                onDeleteDoc={(id) => {
                  deleteRecentDoc(id);
                  setRecentDocs(loadRecentDocs());
                  showVisualToast('Removed from library.', 'info');
                }}
                user={activeUser}
                onOpenUpgradeModal={openUpgradeModal}
              />
            )}

            {activeTab === 'reminders' && (
              <RemindersTab
                reminder={reminder}
                onUpdateReminder={handleUpdateReminder}
                user={activeUser}
                onOpenUpgradeModal={openUpgradeModal}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressTab
                user={activeUser}
                onOpenUpgradeModal={openUpgradeModal}
              />
            )}

            {activeTab === 'family' && (
              <FamilyTab
                childrenProfiles={childProfiles}
                onUpdateChildren={handleUpdateChildren}
                user={activeUser}
                onOpenUpgradeModal={openUpgradeModal}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                user={activeUser}
                isDemoMode={isDemoMode}
                onToggleDemoMode={handleToggleDemoMode}
                onOpenAccessibilityModal={() => setIsAccessibilityModalOpen(true)}
                onOpenDisplayModal={() => setIsDisplayModalOpen(true)}
                onOpenPlanSelection={() => setCurrentScreen('plan-selection')}
                onSignOut={handleSignOut}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Captions for Read-Aloud */}
      <CaptionsOverlay
        sentence={spokenSentence}
        currentWord={spokenWord}
        isVisible={accessibilitySettings.captionsEnabled && Boolean(spokenSentence)}
        onClose={() =>
          handleUpdateAccessibility({
            ...accessibilitySettings,
            captionsEnabled: false,
          })
        }
      />

      {/* Floating Voice Recognition Button (Only appears when Audio-First mode is on) */}
      {(accessibilitySettings.audioFirstMode || isVoiceListening) && (
        <VoiceCommandIndicator
          isListening={isVoiceListening}
          onToggleListening={toggleVoiceListening}
          lastTranscript={lastVoiceTranscript}
          lastCommand={lastVoiceCommand}
          errorMessage={voiceErrorMessage}
          onDismissError={() => setVoiceErrorMessage(null)}
          isSupported={voiceRecognitionService.isSupported()}
        />
      )}

      {/* Accessibility Preferences Modal (Welcome Survey & Full Suite) */}
      <AccessibilityPanelModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        accessibilitySettings={accessibilitySettings}
        onUpdateAccessibility={handleUpdateAccessibility}
        displaySettings={settings}
        onUpdateDisplay={handleUpdateSettings}
        isFirstLaunch={!accessibilitySettings.hasCompletedWelcomeSurvey}
      />

      {/* Display & Typography Controls Modal */}
      <DisplayControlsModal
        isOpen={isDisplayModalOpen}
        onClose={() => setIsDisplayModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={(prof) => {
          setActiveProfileId(prof.id);
          saveActiveProfileId(prof.id);
          handleUpdateSettings(prof.settings);
          showVisualToast(`Profile "${prof.name}" applied.`, 'success');
        }}
        onSaveNewProfile={(name, s) => {
          const saved = saveCustomProfile(name, s);
          setProfiles(loadAllProfiles());
          setActiveProfileId(saved.id);
          saveActiveProfileId(saved.id);
          showVisualToast(`Saved profile "${saved.name}".`, 'success');
        }}
        onDeleteProfile={(id) => {
          deleteCustomProfile(id);
          const updated = loadAllProfiles();
          setProfiles(updated);
          showVisualToast('Profile deleted.', 'info');
        }}
      />

      {/* Clean Upgrade Modal for Locked Features */}
      <UpgradeModal
        isOpen={upgradeModalConfig.isOpen}
        onClose={() =>
          setUpgradeModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        featureName={upgradeModalConfig.featureName}
        requiredPlan={upgradeModalConfig.requiredPlan}
        onUpgradeToPlan={handleUpgradeToPlan}
      />
    </div>
  );
}
