import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  Download,
  Check,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DailyReminder, User } from '../../types';

interface RemindersTabProps {
  reminder: DailyReminder;
  onUpdateReminder: (reminder: DailyReminder) => void;
  user: User;
  onOpenUpgradeModal: (featureName: string, requiredPlan: 'plus' | 'family') => void;
}

export const RemindersTab: React.FC<RemindersTabProps> = ({
  reminder,
  onUpdateReminder,
  user,
  onOpenUpgradeModal,
}) => {
  const isLocked = user.plan === 'free';
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Generate downloadable .ics calendar file
  const handleDownloadICS = () => {
    const [hours, minutes] = reminder.time.split(':');
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const dtStart = `${year}${month}${day}T${hours.padStart(2, '0')}${minutes.padStart(2, '0')}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ClearRead//Accessible Daily Reading//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${dtStart}`,
      `DURATION:PT${reminder.targetMinutes}M`,
      'RRULE:FREQ=DAILY',
      'SUMMARY:ClearRead Daily Reading Time',
      'DESCRIPTION:Time for your comfortable, accessible reading session with ClearRead! Read without rush or pressure.',
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT10M',
      'ACTION:DISPLAY',
      'DESCRIPTION:ClearRead reading time starting in 10 minutes',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'clearread-daily-reading.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  if (isLocked) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center font-lexend space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Daily Reading Reminders
          </h1>
          <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Automated reading schedule reminders and downloadable `.ics` calendar sync are included with <strong>ClearRead Plus</strong> and <strong>Family</strong>.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200 text-left space-y-3 max-w-md mx-auto shadow-xs">
          <p className="font-bold text-xs uppercase tracking-wider text-teal-800">
            What you get with Plus:
          </p>
          <ul className="text-xs text-stone-700 space-y-2">
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Personalized daily reading schedule (time + target minutes)</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Downloadable .ics file for Google Calendar, Outlook, and Apple Calendar</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Gentle, encouraging in-app reminders that never shame</span>
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={() => onOpenUpgradeModal('Daily Reading Reminders', 'plus')}
          className="px-6 py-3.5 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 min-h-[48px]"
        >
          <span>Upgrade to Plus ($3/mo)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-lexend pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-950 flex items-center gap-2">
          <Bell className="w-6 h-6 text-teal-800" />
          <span>Daily Reading Reminders</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          Establish an accessible, gentle reading routine with no stress or shaming.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <label htmlFor="daily-reminder-switch" className="font-bold text-base text-stone-900 block cursor-pointer">
              Enable Daily Reading Reminder
            </label>
            <p className="text-xs text-stone-500 mt-0.5">
              ClearRead will display a calm reading prompt at your designated time.
            </p>
          </div>
          <input
            id="daily-reminder-switch"
            type="checkbox"
            checked={reminder.enabled}
            onChange={(e) => onUpdateReminder({ ...reminder, enabled: e.target.checked })}
            className="w-5 h-5 rounded text-teal-700 focus:ring-teal-500 cursor-pointer"
          />
        </div>

        {/* Schedule settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="reminder-time-input" className="block text-xs font-bold text-stone-800">
              Reminder Time
            </label>
            <input
              id="reminder-time-input"
              type="time"
              value={reminder.time}
              onChange={(e) => onUpdateReminder({ ...reminder, time: e.target.value })}
              className="w-full p-3 rounded-xl border border-stone-300 font-bold text-stone-900 text-sm focus:border-teal-700 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="target-minutes-select" className="block text-xs font-bold text-stone-800">
              Goal Session Duration
            </label>
            <select
              id="target-minutes-select"
              value={reminder.targetMinutes}
              onChange={(e) =>
                onUpdateReminder({ ...reminder, targetMinutes: Number(e.target.value) })
              }
              className="w-full p-3 rounded-xl border border-stone-300 font-bold text-stone-900 text-sm focus:border-teal-700 focus:ring-2 focus:ring-teal-500/20"
            >
              <option value={10}>10 Minutes (Gentle)</option>
              <option value={15}>15 Minutes (Recommended)</option>
              <option value={20}>20 Minutes (Standard)</option>
              <option value={30}>30 Minutes (Deep Reading)</option>
            </select>
          </div>
        </div>

        {/* Calendar Sync (.ics download) */}
        <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-800" />
            <h2 className="font-bold text-sm text-teal-950">
              Sync with Your Calendar (.ics File)
            </h2>
          </div>
          <p className="text-xs text-teal-900 leading-relaxed">
            Download an `.ics` calendar invitation to automatically add your daily {reminder.targetMinutes}-minute reading session at {reminder.time} to Apple Calendar, Google Calendar, or Outlook.
          </p>

          <button
            type="button"
            onClick={handleDownloadICS}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition-colors min-h-[42px]"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Downloaded .ics File!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download .ics Calendar Event</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
