import React, { useState } from 'react';
import {
  Bookmark,
  Search,
  BookOpen,
  Trash2,
  ArrowRight,
  Clock,
  Sparkles,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { ProcessedDocument, User, PlanType } from '../../types';

interface LibraryTabProps {
  documents: ProcessedDocument[];
  onSelectDoc: (doc: ProcessedDocument) => void;
  onDeleteDoc: (id: string) => void;
  user: User;
  onOpenUpgradeModal: (featureName: string, requiredPlan: 'plus' | 'family') => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  documents,
  onSelectDoc,
  onDeleteDoc,
  user,
  onOpenUpgradeModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isLocked = user.plan === 'free';

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLocked) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center font-lexend space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Saved Document Library
          </h1>
          <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Personal document saving, search, and categorization are available on the <strong>ClearRead Plus</strong> and <strong>Family</strong> plans.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200 text-left space-y-3 max-w-md mx-auto shadow-xs">
          <p className="font-bold text-xs uppercase tracking-wider text-teal-800">
            What you get with Plus:
          </p>
          <ul className="text-xs text-stone-700 space-y-2">
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Save unlimited articles, book chapters & homework passages</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>One-click access across all your devices</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Preserves your custom font and contrast settings per text</span>
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={() => onOpenUpgradeModal('Saved Document Library', 'plus')}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-950 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-teal-800" />
            <span>Saved Document Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {documents.length} simplified readings saved in your personal library.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved readings..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-teal-700 min-h-[40px]"
          />
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-base text-stone-800">Your library is empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            When you simplify documents on the Read screen, they will automatically be stored here for future review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 sm:p-5 rounded-2xl border border-stone-200 hover:border-teal-600 bg-white transition-all shadow-2xs hover:shadow-sm flex items-center justify-between gap-4 group"
            >
              <button
                type="button"
                onClick={() => onSelectDoc(doc)}
                className="flex-1 text-left min-h-[44px] flex flex-col justify-center"
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-bold text-base text-stone-950 group-hover:text-teal-900 transition-colors line-clamp-1">
                    {doc.title}
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 shrink-0">
                    {doc.level}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    Available offline
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 flex-wrap">
                  <span>{doc.wordCount} words</span>
                  <span>•</span>
                  <span>~{doc.estimatedReadingTimeMinutes} min read</span>
                  <span>•</span>
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectDoc(doc)}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs transition-colors flex items-center gap-1 min-h-[38px]"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteDoc(doc.id)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
                  aria-label={`Delete ${doc.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
