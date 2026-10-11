import React, { useState } from 'react';
import {
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  ChevronRight,
  Flame,
  ArrowRight,
  PenTool,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { SentenceAnalysis } from '../types/readability';
import { countSyllables } from '../utils/syllableCounter';
import { extractWords } from '../utils/textParser';

interface DifficultSentencesSectionProps {
  sentences: SentenceAnalysis[];
  onSelectSentence?: (sentenceId: string) => void;
}

export const DifficultSentencesSection: React.FC<DifficultSentencesSectionProps> = ({
  sentences,
  onSelectSentence,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeScratchpadId, setActiveScratchpadId] = useState<string | null>(null);
  const [scratchpadTexts, setScratchpadTexts] = useState<Record<string, string>>({});

  if (!sentences || sentences.length === 0) {
    return null;
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          label: '#1 Hardest Sentence',
          color: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-600',
        };
      case 2:
        return {
          label: '#2 Hardest Sentence',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          dot: 'bg-orange-600',
        };
      case 3:
        return {
          label: '#3 Hardest Sentence',
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-600',
        };
      case 4:
        return {
          label: '#4 Challenging Sentence',
          color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-600',
        };
      default:
        return {
          label: `#${rank} Challenging Sentence`,
          color: 'bg-slate-100 text-slate-800 border-slate-200',
          dot: 'bg-slate-600',
        };
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 mb-2">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Top {sentences.length} Cognitive Friction Points</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Hardest Sentences in Your Text
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Identified by high word count, multisyllabic complexity, and syllable density. 
            Polishing these key sentences will immediately elevate your manuscript&apos;s clarity.
          </p>
        </div>
        <div className="text-xs text-slate-400 self-start sm:self-center font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          Ranked 1 to {sentences.length}
        </div>
      </div>

      {/* Sentence Cards List */}
      <div className="mt-6 space-y-6">
        {sentences.map((sentence, idx) => {
          const rank = sentence.difficultyRank || idx + 1;
          const badge = getRankBadge(rank);
          const isScratchpadOpen = activeScratchpadId === sentence.id;
          const draftText = scratchpadTexts[sentence.id] ?? sentence.text;

          // Scratchpad quick metrics
          const draftWords = extractWords(draftText);
          const draftWordCount = draftWords.length;
          let draftSyllables = 0;
          for (const w of draftWords) {
            draftSyllables += countSyllables(w);
          }
          const draftAvgSyllables = draftWordCount > 0 ? (draftSyllables / draftWordCount).toFixed(1) : '0';

          return (
            <div
              key={sentence.id}
              id={`hardest-card-${sentence.id}`}
              className="bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/90 p-5 sm:p-6 transition-all duration-200 hover:border-indigo-300 hover:shadow-xs group"
            >
              {/* Top Row: Rank & Metrics */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Score: {sentence.difficultyScore}
                  </span>
                </div>

                {/* Metrics Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs">
                    Length:{' '}
                    <strong className={sentence.wordCount > 30 ? 'text-rose-600' : 'text-slate-900'}>
                      {sentence.wordCount} words
                    </strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs">
                    Complex Words:{' '}
                    <strong className="text-amber-600">
                      {sentence.complexWords.length}
                    </strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs hidden sm:inline-block">
                    Avg Syl.:{' '}
                    <strong className="text-slate-800">
                      {sentence.avgSyllablesPerWord.toFixed(1)}/word
                    </strong>
                  </span>
                </div>
              </div>

              {/* The Sentence Text */}
              <div className="relative pl-4 border-l-3 border-indigo-400 my-4 bg-white/70 p-3.5 rounded-r-lg border-y border-r border-slate-200/60">
                <p className="text-base text-slate-800 font-normal leading-relaxed italic select-all">
                  &ldquo;{sentence.text}&rdquo;
                </p>
              </div>

              {/* Diagnosis reasons */}
              <div className="mb-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Why it&apos;s difficult</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sentence.reasons.map((r, rIdx) => (
                    <span
                      key={rIdx}
                      className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actionable Improvement Suggestions */}
              <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100/80 mb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  <span>Actionable Suggestions</span>
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-indigo-950/90 leading-relaxed">
                  {sentence.suggestions.map((sug, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>

                {/* Specific Vocabulary Replacement Pills */}
                {sentence.complexWords.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-indigo-100/70">
                    <span className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider block mb-1.5">
                      Recommended Word Swaps:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sentence.complexWords.map((cw, wIdx) => (
                        <div
                          key={wIdx}
                          className="inline-flex items-center gap-1.5 text-xs bg-white text-slate-800 px-2.5 py-1 rounded-md border border-indigo-200 shadow-2xs"
                        >
                          <span className="line-through text-rose-500 font-medium">
                            {cw.word}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="font-semibold text-emerald-700">
                            {cw.suggestions[0] || 'simpler term'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer: Copy, Rewrite Scratchpad toggle, Jump to text */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(sentence.id, sentence.text)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
                  >
                    {copiedId === sentence.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Sentence</span>
                      </>
                    )}
                  </button>

                  {/* Rewrite Scratchpad Toggle */}
                  <button
                    onClick={() => {
                      if (!isScratchpadOpen && !scratchpadTexts[sentence.id]) {
                        setScratchpadTexts(prev => ({ ...prev, [sentence.id]: sentence.text }));
                      }
                      setActiveScratchpadId(isScratchpadOpen ? null : sentence.id);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border shadow-2xs transition-colors ${
                      isScratchpadOpen
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-indigo-700 hover:bg-indigo-50 border-indigo-200'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>{isScratchpadOpen ? 'Close Scratchpad' : 'Try Rewriting Here'}</span>
                  </button>
                </div>

                {/* Focus/Locate in text */}
                {onSelectSentence && (
                  <button
                    onClick={() => onSelectSentence(sentence.id)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <span>View in text</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Interactive Rewrite Scratchpad */}
              {isScratchpadOpen && (
                <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Live Rewrite Scratchpad
                    </span>
                    <button
                      onClick={() =>
                        setScratchpadTexts(prev => ({ ...prev, [sentence.id]: sentence.text }))
                      }
                      className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset to original
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={draftText}
                    onChange={e =>
                      setScratchpadTexts(prev => ({ ...prev, [sentence.id]: e.target.value }))
                    }
                    placeholder="Rewrite the sentence into 1 or 2 shorter, clearer thoughts..."
                    className="w-full text-sm p-3 rounded-lg border border-indigo-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans leading-relaxed resize-y"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                    <div className="flex items-center gap-3">
                      <span>
                        Words:{' '}
                        <strong
                          className={
                            draftWordCount < sentence.wordCount
                              ? 'text-emerald-600'
                              : 'text-slate-700'
                          }
                        >
                          {draftWordCount}
                        </strong>{' '}
                        {draftWordCount < sentence.wordCount && (
                          <span className="text-emerald-600 font-bold">
                            (-{sentence.wordCount - draftWordCount} words)
                          </span>
                        )}
                      </span>
                      <span>
                        Avg Syl: <strong>{draftAvgSyllables}</strong>
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(sentence.id, draftText)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Copy Revision
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
