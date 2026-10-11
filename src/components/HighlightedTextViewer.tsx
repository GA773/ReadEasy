import React from 'react';
import type { SentenceAnalysis } from '../types/readability';
import { Eye, Flame } from 'lucide-react';

interface HighlightedTextViewerProps {
  rawText: string;
  hardestSentences: SentenceAnalysis[];
  onSelectHardestSentence: (sentenceId: string) => void;
}

export const HighlightedTextViewer: React.FC<HighlightedTextViewerProps> = ({
  rawText,
  hardestSentences,
  onSelectHardestSentence,
}) => {
  if (!rawText.trim()) return null;

  // Build a map of text to hardest sentence for rapid matching
  const hardestMap = new Map<string, SentenceAnalysis>();
  for (const s of hardestSentences) {
    // Normalise key by trimming and collapsing multiple spaces
    const key = s.text.trim().replace(/\s+/g, ' ');
    hardestMap.set(key, s);
  }

  // Split into paragraphs for natural reading formatting
  const paragraphs = rawText.split(/\n\s*\n+/);

  const getHighlightClass = (rank?: number) => {
    switch (rank) {
      case 1:
        return 'bg-rose-100/90 text-rose-950 border-b-2 border-rose-500 hover:bg-rose-200/90';
      case 2:
        return 'bg-orange-100/90 text-orange-950 border-b-2 border-orange-500 hover:bg-orange-200/90';
      case 3:
        return 'bg-amber-100/90 text-amber-950 border-b-2 border-amber-500 hover:bg-amber-200/90';
      case 4:
        return 'bg-indigo-100/80 text-indigo-950 border-b-2 border-indigo-500 hover:bg-indigo-200/80';
      default:
        return 'bg-purple-100/80 text-purple-950 border-b-2 border-purple-500 hover:bg-purple-200/80';
    }
  };

  const getRankBadgeClass = (rank?: number) => {
    switch (rank) {
      case 1:
        return 'bg-rose-600 text-white';
      case 2:
        return 'bg-orange-600 text-white';
      case 3:
        return 'bg-amber-600 text-white';
      case 4:
        return 'bg-indigo-600 text-white';
      default:
        return 'bg-purple-600 text-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Manuscript Heatmap View
          </h4>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="font-medium text-slate-400">Heatmap:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-rose-100 text-rose-800 border border-rose-200 font-medium">
            #1 Hardest
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-orange-100 text-orange-800 border border-orange-200 font-medium">
            #2 Hardest
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 border border-amber-200 font-medium">
            #3 Hardest
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-indigo-100 text-indigo-800 border border-indigo-200 font-medium">
            #4 & #5
          </span>
        </div>
      </div>

      {/* Paragraphs rendering */}
      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 text-base text-slate-700 leading-relaxed font-serif">
        {paragraphs.map((para, pIdx) => {
          // Check if any hardest sentence is in this paragraph
          // We can highlight matched sentences inside the paragraph
          let renderedContent: React.ReactNode = para;

          // Search for all hardest sentences in this paragraph
          const matchedSentencesInPara = hardestSentences.filter(hs =>
            para.includes(hs.text)
          );

          if (matchedSentencesInPara.length > 0) {
            // Sort by their appearance index in paragraph
            const parts: React.ReactNode[] = [];
            let remaining = para;

            while (remaining.length > 0) {
              // Find earliest occurrence of any matched sentence
              let earliestIndex = -1;
              let earliestSentence: SentenceAnalysis | null = null;

              for (const hs of matchedSentencesInPara) {
                const idx = remaining.indexOf(hs.text);
                if (idx !== -1 && (earliestIndex === -1 || idx < earliestIndex)) {
                  earliestIndex = idx;
                  earliestSentence = hs;
                }
              }

              if (earliestIndex === -1 || !earliestSentence) {
                // No more matches
                parts.push(remaining);
                break;
              }

              // Text before match
              if (earliestIndex > 0) {
                parts.push(remaining.substring(0, earliestIndex));
              }

              // The matched sentence
              const currentSentence = earliestSentence;
              const rank = currentSentence.difficultyRank || 1;
              parts.push(
                <span
                  key={`hs-${currentSentence.id}-${earliestIndex}`}
                  onClick={() => onSelectHardestSentence(currentSentence.id)}
                  title={`Hardest Sentence #${rank}: ${currentSentence.wordCount} words, ${currentSentence.complexWords.length} complex words. Click to inspect.`}
                  className={`cursor-pointer px-1 py-0.5 rounded-sm transition-colors duration-150 inline ${getHighlightClass(
                    rank
                  )}`}
                >
                  <sup
                    className={`inline-flex items-center justify-center font-sans font-bold px-1 py-0.2 text-[9px] rounded-xs mr-1 align-baseline ${getRankBadgeClass(
                      rank
                    )}`}
                  >
                    #{rank}
                  </sup>
                  {currentSentence.text}
                </span>
              );

              // Advance
              remaining = remaining.substring(
                earliestIndex + currentSentence.text.length
              );
            }

            renderedContent = parts;
          }

          return (
            <p key={pIdx} className="leading-relaxed">
              {renderedContent}
            </p>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Click any highlighted sentence to scroll to its diagnostic card below.
        </span>
        <span>{paragraphs.length} {paragraphs.length === 1 ? 'paragraph' : 'paragraphs'}</span>
      </div>
    </div>
  );
};
