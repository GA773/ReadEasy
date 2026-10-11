import { X, Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ReadabilityMetrics } from '../types/readability';

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: ReadabilityMetrics | null;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({
  isOpen,
  onClose,
  metrics,
}) => {
  if (!isOpen) return null;

  const words = metrics?.totalWords || 100;
  const sentences = metrics?.totalSentences || 5;
  const syllables = metrics?.totalSyllables || 150;
  const asl = metrics?.avgSentenceLength || 20;
  const asw = metrics?.avgSyllablesPerWord || 1.5;
  const score = metrics?.fleschReadingEase;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              The Flesch Reading Ease Formula
            </h3>
            <p className="text-xs text-slate-500">
              Created in 1948 by Rudolf Flesch to assess reading comprehension difficulty
            </p>
          </div>
        </div>

        {/* The Mathematical Equation */}
        <div className="bg-slate-900 text-slate-100 rounded-xl p-5 mb-6 font-mono text-xs sm:text-sm shadow-inner overflow-x-auto">
          <div className="text-slate-400 text-xs mb-1 font-sans font-semibold uppercase tracking-wider">
            Standard Equation:
          </div>
          <div className="text-indigo-300 font-bold text-sm sm:text-base leading-relaxed">
            Score = 206.835 - 1.015 × (Words / Sentences) - 84.6 × (Syllables / Words)
          </div>
        </div>

        {/* Live Calculation with current manuscript numbers */}
        {metrics && (
          <div className="bg-indigo-50/70 rounded-xl border border-indigo-100 p-4 sm:p-5 mb-6">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Calculated from your current text:</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 font-mono">
              <div>
                • Words / Sentences: <strong>{words}</strong> / <strong>{sentences}</strong> ={' '}
                <span className="text-indigo-700 font-bold">{asl.toFixed(2)} words/sentence</span>
              </div>
              <div>
                • Syllables / Words: <strong>{syllables}</strong> / <strong>{words}</strong> ={' '}
                <span className="text-indigo-700 font-bold">{asw.toFixed(2)} syllables/word</span>
              </div>
              <div className="pt-2 border-t border-indigo-200/80 text-xs font-sans text-slate-800">
                206.835 - (1.015 × {asl.toFixed(2)}) - (84.6 × {asw.toFixed(2)}) ={' '}
                <strong className="text-indigo-700 font-mono text-sm">{score}</strong> (out of 100)
              </div>
            </div>
          </div>
        )}

        {/* Score Benchmark Scale */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-slate-900 mb-3 font-['Plus_Jakarta_Sans']">
            How to Interpret the 0–100 Scale
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
            {[
              { range: '90–100', label: 'Very Easy', grade: '5th Grade', example: 'Comics, children stories, simple speech' },
              { range: '80–89', label: 'Easy', grade: '6th Grade', example: 'Conversational novels, casual blogs' },
              { range: '70–79', label: 'Fairly Easy', grade: '7th Grade', example: 'Popular newsletters, consumer articles' },
              { range: '60–69', label: 'Standard', grade: '8th–9th Grade', example: "Reader's Digest, Time, mainstream press" },
              { range: '50–59', label: 'Fairly Difficult', grade: '10th–12th Grade', example: 'High school textbooks, technical guides' },
              { range: '30–49', label: 'Difficult', grade: 'College Level', example: 'Academic essays, Harvard Business Review' },
              { range: '0–29', label: 'Very Confusing', grade: 'Graduate Level', example: 'Legal contracts, dense scientific papers' },
            ].map(row => (
              <div key={row.range} className="flex items-center p-2.5 sm:px-3 hover:bg-slate-50 transition-colors">
                <span className="w-16 sm:w-20 font-bold font-mono text-slate-800 shrink-0">
                  {row.range}
                </span>
                <span className="w-28 sm:w-32 font-semibold text-indigo-700 shrink-0">
                  {row.label}
                </span>
                <span className="w-24 sm:w-28 text-slate-500 shrink-0 hidden sm:inline">
                  {row.grade}
                </span>
                <span className="text-slate-500 truncate">{row.example}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Limitations & Real-world nuances */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Important Limitations to Keep in Mind</span>
          </div>
          <ul className="space-y-2 text-xs text-amber-950/90 leading-relaxed">
            <li>
              <strong>No concept of semantics or meaning:</strong> The formula only inspects syllables and word counts. A grammatically nonsensical sentence can still score 100 if it uses short words.
            </li>
            <li>
              <strong>Technical jargon impact:</strong> Specialized words like &ldquo;hemoglobin&rdquo; or &ldquo;asynchronous&rdquo; lower the score, even if your intended audience understands them immediately.
            </li>
            <li>
              <strong>Artistic sentence rhythm:</strong> In literary fiction, alternating between long lyrical sentences and short punchy fragments creates beauty. Don&apos;t sacrifice voice simply to chase a higher number.
            </li>
          </ul>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
