import { BookOpen, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenFormulaModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFormulaModal }) => {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200/80 py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-100">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 font-['Plus_Jakarta_Sans']">
                ReadEasy
              </span>
            </div>
            <p className="text-slate-600 max-w-md leading-relaxed text-sm">
              The modern readability suite for authors, novelists, bloggers, copywriters, and students.
              Evaluate sentence friction, uncover your hardest lines, and refine your voice without paying a dime.
            </p>
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80 w-fit text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Strict Privacy: All analysis runs entirely in your browser.</span>
            </div>
          </div>

          {/* Readability Resources */}
          <div>
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">
              Readability Guides
            </h5>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button
                  onClick={onOpenFormulaModal}
                  className="hover:text-indigo-600 transition-colors text-left"
                >
                  Flesch Reading Ease Formula
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFormulaModal}
                  className="hover:text-indigo-600 transition-colors text-left"
                >
                  Flesch-Kincaid Grade Equivalents
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFormulaModal}
                  className="hover:text-indigo-600 transition-colors text-left"
                >
                  Gunning Fog & Syllable Density
                </button>
              </li>
            </ul>
          </div>

          {/* Writing Tips */}
          <div>
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">
              Core Principles
            </h5>
            <ul className="space-y-2 text-slate-600">
              <li>Aim for 14–20 words per sentence</li>
              <li>Vary sentence length for cadence</li>
              <li>Swap complex words for plain English</li>
              <li>Prune unnecessary filler phrases</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} ReadEasy • Built for writers everywhere. 100% Free & Open.
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for clearer storytelling</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
