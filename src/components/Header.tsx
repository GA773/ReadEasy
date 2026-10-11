import React from 'react';
import { BookOpen, HelpCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenFormulaModal: () => void;
  onSelectSample: (id: string) => void;
  hasText: boolean;
  onClear: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenFormulaModal,
  onSelectSample,
  hasText,
  onClear,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-100">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent font-['Plus_Jakarta_Sans']">
                  ReadEasy
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/60">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Readability Analyzer
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Clarity insights for authors, bloggers, and writers
              </p>
            </div>
          </div>

          {/* Quick Badges & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Free & Privacy Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Free • Private</span>
            </div>

            {/* Formula Explanation Button */}
            <button
              onClick={onOpenFormulaModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 rounded-lg shadow-xs hover:border-slate-300 transition-colors"
              title="Learn how the Flesch Reading Ease score is calculated"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Formula</span>
              <span className="sm:hidden">Math</span>
            </button>

            {/* Sample Selector Quick Dropdown */}
            <div className="relative group">
              <button
                className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80 active:bg-indigo-200/60 border border-indigo-200/80 rounded-lg transition-colors"
              >
                <span>Samples</span>
                <span className="text-[10px] text-indigo-500">▼</span>
              </button>
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Load Test Sample
                </div>
                <button
                  onClick={() => onSelectSample('literary-fiction')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 flex flex-col"
                >
                  <span className="font-semibold">Literary Fiction</span>
                  <span className="text-[11px] text-slate-500">Standard novel chapter</span>
                </button>
                <button
                  onClick={() => onSelectSample('academic-neuroscience')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 flex flex-col"
                >
                  <span className="font-semibold">Academic Paper</span>
                  <span className="text-[11px] text-slate-500">Dense & challenging text</span>
                </button>
                <button
                  onClick={() => onSelectSample('engaging-blog')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 flex flex-col"
                >
                  <span className="font-semibold">Modern Blog Post</span>
                  <span className="text-[11px] text-slate-500">Punchy & easy to read</span>
                </button>
              </div>
            </div>

            {/* Clear Button */}
            {hasText && (
              <button
                onClick={onClear}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Clear current text"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
