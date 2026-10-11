import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText } from 'lucide-react';
import type { ReadabilityMetrics } from '../types/readability';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: ReadabilityMetrics | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  metrics,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !metrics) return null;

  const generateReportMarkdown = () => {
    const lines = [
      `# ReadEasy – Readability Analysis Report`,
      `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      ``,
      `## 1. Overall Readability Score`,
      `- **Flesch Reading Ease Score:** ${metrics.fleschReadingEase} / 100 (${metrics.fleschInterpretation.label})`,
      `- **Target Audience Equivalent:** ${metrics.fleschInterpretation.gradeLevel}`,
      `- **Flesch-Kincaid Grade Level:** Grade ${metrics.fleschKincaidGradeLevel}`,
      `- **Gunning Fog Index:** ${metrics.gunningFogIndex}`,
      `- **Coleman-Liau Index:** ${metrics.colemanLiauIndex}`,
      ``,
      `## 2. Text Statistics`,
      `- **Total Words:** ${metrics.totalWords.toLocaleString()}`,
      `- **Total Sentences:** ${metrics.totalSentences.toLocaleString()}`,
      `- **Average Sentence Length:** ${metrics.avgSentenceLength} words per sentence`,
      `- **Estimated Reading Time:** ${metrics.readingTimeFormatted} (at 225 wpm)`,
      `- **Speaking Time:** ${metrics.speakingTimeFormatted} (at 135 wpm)`,
      `- **Complex Words (3+ syllables):** ${metrics.complexWordsCount} (${metrics.complexWordsPercentage}%)`,
      `- **Syllable Density:** ${metrics.avgSyllablesPerWord} syllables per word`,
      ``,
      `## 3. Top ${metrics.hardestSentences.length} Hardest Sentences & Recommendations`,
      ``,
    ];

    metrics.hardestSentences.forEach((s, idx) => {
      lines.push(`### Sentence #${s.difficultyRank || idx + 1}`);
      lines.push(`> "${s.text}"`);
      lines.push(``);
      lines.push(`- **Metrics:** ${s.wordCount} words, ${s.complexWords.length} complex words, ${s.avgSyllablesPerWord.toFixed(1)} avg syllables/word`);
      lines.push(`- **Why it's tough:** ${s.reasons.join('; ')}`);
      lines.push(`- **Suggestions:**`);
      s.suggestions.forEach(sug => {
        lines.push(`  - ${sug}`);
      });
      if (s.complexWords.length > 0) {
        lines.push(`- **Simpler Word Swaps:**`);
        s.complexWords.forEach(cw => {
          lines.push(`  - "${cw.word}" → ${cw.suggestions.slice(0, 2).join(' or ')}`);
        });
      }
      lines.push(``);
    });

    lines.push(`---`);
    lines.push(`Report generated for free via ReadEasy (Client-Side Readability Analyzer).`);
    return lines.join('\n');
  };

  const reportText = generateReportMarkdown();

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `readeasy-report-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-7 relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Export Readability Report
            </h3>
            <p className="text-xs text-slate-500">
              Download or copy your complete readability breakdown
            </p>
          </div>
        </div>

        {/* Preview box */}
        <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 max-h-64 overflow-y-auto font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed mb-6 select-all">
          {reportText}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download .MD Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
