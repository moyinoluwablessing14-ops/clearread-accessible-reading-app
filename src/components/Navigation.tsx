import React from 'react';
import {
  BookOpen,
  Bookmark,
  Bell,
  BarChart2,
  Users,
  Settings,
  Lock,
  Sparkles,
  Accessibility,
} from 'lucide-react';
import { AppTab, User } from '../types';

interface NavigationProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  user: User;
  onOpenUpgradeModal: (featureName: string, requiredPlan: 'plus' | 'family') => void;
  onOpenAccessibility: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  user,
  onOpenUpgradeModal,
  onOpenAccessibility,
}) => {
  const isFamilyUnlocked = user.plan === 'family';
  const isPlusUnlocked = user.plan === 'plus' || user.plan === 'family';

  const navItems: Array<{
    id: AppTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    locked: boolean;
    requiredPlan?: 'plus' | 'family';
  }> = [
    { id: 'read', label: 'Read', icon: BookOpen, locked: false },
    {
      id: 'library',
      label: 'Library',
      icon: Bookmark,
      locked: !isPlusUnlocked,
      requiredPlan: 'plus',
    },
    {
      id: 'reminders',
      label: 'Reminders',
      icon: Bell,
      locked: !isPlusUnlocked,
      requiredPlan: 'plus',
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart2,
      locked: !isPlusUnlocked,
      requiredPlan: 'plus',
    },
    {
      id: 'family',
      label: 'Family',
      icon: Users,
      locked: !isFamilyUnlocked,
      requiredPlan: 'family',
    },
    { id: 'settings', label: 'Settings', icon: Settings, locked: false },
  ];

  const handleTabClick = (item: (typeof navItems)[0]) => {
    if (item.locked && item.requiredPlan) {
      onOpenUpgradeModal(item.label, item.requiredPlan);
    } else {
      onSelectTab(item.id);
    }
  };

  return (
    <>
      {/* DESKTOP SLIM SIDEBAR */}
      <aside
        aria-label="Sidebar navigation"
        className="hidden md:flex flex-col justify-between w-64 bg-white border-r border-stone-200 p-4 shrink-0 font-lexend select-none h-screen sticky top-0"
      >
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-stone-950 block">
                Clear<span className="text-teal-700">Read</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-full inline-block mt-0.5">
                {user.plan.toUpperCase()} PLAN
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5" aria-label="Main menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all min-h-[46px] ${
                    isActive
                      ? 'bg-teal-800 text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.locked && (
                    <span
                      className="p-1 rounded-md bg-stone-100 text-stone-400 group-hover:text-stone-600"
                      title={`Requires ${item.requiredPlan} plan`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Badge & Quick Accessibility */}
        <div className="space-y-3 pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={onOpenAccessibility}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200 text-teal-900 text-xs font-bold transition-colors min-h-[42px]"
          >
            <Accessibility className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Accessibility Settings</span>
          </button>

          <div className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <span className="block text-xs font-bold text-stone-900 truncate">
                {user.name}
              </span>
              <span className="block text-[11px] text-stone-500 truncate">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 flex items-center justify-around font-lexend shadow-lg"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-w-[56px] min-h-[48px] relative ${
                isActive
                  ? 'text-teal-800 font-extrabold'
                  : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-800' : 'text-stone-500'}`} />
                {item.locked && (
                  <span className="absolute -top-1 -right-2 bg-stone-200 text-stone-600 rounded-full p-0.5">
                    <Lock className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-teal-800 mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
