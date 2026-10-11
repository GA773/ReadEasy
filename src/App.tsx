import { useState, useEffect, useCallback, useTransition } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Share2,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { Header } from './components/Header';
import { TextInputArea } from './components/TextInputArea';
import { ScoreGauge } from './components/ScoreGauge';
import { StatsDashboard } from './components/StatsDashboard';
import { DifficultSentencesSection } from './components/DifficultSentencesSection';
import { HighlightedTextViewer } from './components/HighlightedTextViewer';
import { AudienceTargetGuide } from './components/AudienceTargetGuide';
import { FormulaModal } from './components/FormulaModal';
import { ExportModal } from './components/ExportModal';
import { Footer } from './components/Footer';
import { calculateReadability } from './utils/readabilityFormulas';
import { SAMPLE_TEXTS } from './utils/sampleTexts';
import type { ReadabilityMetrics } from './types/readability';

export function App() {
  // Pre-load classic literary excerpt so user immediately sees working app
  const [text, setText] = useState<string>(SAMPLE_TEXTS[0].content);
  const [metrics, setMetrics] = useState<ReadabilityMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'editor' | 'heatmap'>('editor');
  const [autoAnalyze, setAutoAnalyze] = useState<boolean>(true);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Run analysis function
  const runAnalysis = useCallback((contentToAnalyze: string, triggerCelebration = false) => {
    if (!contentToAnalyze.trim()) {
      setMetrics(null);
      return;
    }

    setIsAnalyzing(true);
    startTransition(() => {
      const result = calculateReadability(contentToAnalyze);
      setMetrics(result);
      setIsAnalyzing(false);

      if (triggerCelebration && result && result.fleschReadingEase >= 70) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#a855f7', '#10b981'],
          });
        } catch {
          // Ignore if confetti context fails
        }
      }
    });
  }, []);

  // Initial calculation on mount
  useEffect(() => {
    runAnalysis(SAMPLE_TEXTS[0].content, false);
  }, [runAnalysis]);

  // Debounced auto-analyze on text change if autoAnalyze is on
  useEffect(() => {
    if (!autoAnalyze) return;
    if (!text.trim()) {
      setMetrics(null);
      return;
    }

    const timer = setTimeout(() => {
      runAnalysis(text, false);
    }, 400);

    return () => clearTimeout(timer);
  }, [text, autoAnalyze, runAnalysis]);

  // Handler for manual "Check Readability" button
  const handleManualCheck = () => {
    runAnalysis(text, true);
  };

  // Handler to clear text
  const handleClear = () => {
    setText('');
    setMetrics(null);
    setActiveView('editor');
  };

  // Handler to load sample
  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_TEXTS.find(s => s.id === sampleId);
    if (found) {
      setText(found.content);
      runAnalysis(found.content, false);
    }
  };

  // Handler to jump to sentence card
  const handleSelectSentence = (sentenceId: string) => {
    const el = document.getElementById(`hardest-card-${sentenceId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-2');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-2');
      }, 2000);
    }
  };

  const handleShareSummary = () => {
    if (!metrics) return;
    const summary = `My writing scored ${metrics.fleschReadingEase}/100 (${metrics.fleschInterpretation.label}) on ReadEasy! Average sentence length: ${metrics.avgSentenceLength} words. Check your readability for free at ReadEasy!`;
    navigator.clipboard.writeText(summary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <Header
        onOpenFormulaModal={() => setIsFormulaModalOpen(true)}
        onSelectSample={handleSelectSample}
        hasText={text.trim().length > 0}
        onClear={handleClear}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Hero Banner / Introduction */}
        <section className="text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
              Make Your Writing Effortless to Read
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Analyze chapter drafts, essays, or blog posts. ReadEasy evaluates sentence friction,
              calculates your <span className="font-semibold text-indigo-700">Flesch Reading Ease</span> score,
              and identifies the 5 hardest sentences with actionable suggestions.
            </p>
          </div>

          {/* Quick Action Buttons */}
          {metrics && (
            <div className="flex items-center gap-2 self-center sm:self-auto shrink-0">
              <button
                onClick={handleShareSummary}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
                title="Copy quick summary to clipboard"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{copiedNotification ? 'Copied Summary!' : 'Share Score'}</span>
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-xs transition-all"
                title="Export complete readability audit"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          )}
        </section>

        {/* Primary Interactive Workspace: Text Editor & Score Card Side-by-Side */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Text Input / Manuscript Heatmap (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {activeView === 'editor' ? (
              <TextInputArea
                text={text}
                onChangeText={setText}
                onAnalyze={handleManualCheck}
                onClear={handleClear}
                onLoadSample={handleSelectSample}
                isAnalyzing={isAnalyzing}
                activeView={activeView}
                setActiveView={setActiveView}
                hasAnalysis={Boolean(metrics)}
                autoAnalyze={autoAnalyze}
                setAutoAnalyze={setAutoAnalyze}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-3 px-4 rounded-xl border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700">
                    Currently viewing Manuscript Heatmap
                  </span>
                  <button
                    onClick={() => setActiveView('editor')}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Switch back to Editor
                  </button>
                </div>
                <HighlightedTextViewer
                  rawText={text}
                  hardestSentences={metrics?.hardestSentences || []}
                  onSelectHardestSentence={handleSelectSentence}
                />
              </div>
            )}

            {/* Quick Tips Box below Text Area */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  Pro-Tip for Authors & Novelists:
                </strong>
                Aim for a Flesch score between <span className="font-semibold text-indigo-700">65 and 80</span> for mainstream fiction.
                Vary sentence lengths naturally—pair short 6-word punchy action beats with occasional 20-word descriptive rhythms.
              </div>
            </div>
          </div>

          {/* Right Column: Score Gauge & Metrics (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Flesch Gauge */}
            <ScoreGauge
              metrics={metrics}
              onOpenFormulaModal={() => setIsFormulaModalOpen(true)}
            />

            {/* Industry Target Benchmarks */}
            <AudienceTargetGuide metrics={metrics} />
          </div>
        </section>

        {/* Statistics Dashboard Bar */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Manuscript Diagnostics & Metrics
            </h3>
            {metrics && (
              <span className="text-xs font-medium text-slate-500">
                Reading speed estimated at 225 wpm
              </span>
            )}
          </div>
          <StatsDashboard metrics={metrics} />
        </section>

        {/* Top 5 Hardest Sentences Section */}
        {metrics && metrics.hardestSentences.length > 0 && (
          <section className="pt-4">
            <DifficultSentencesSection
              sentences={metrics.hardestSentences}
              onSelectSentence={(_sentenceId) => {
                setActiveView('heatmap');
                // Scroll to top of heatmap
                window.scrollTo({ top: 220, behavior: 'smooth' });
              }}
            />
          </section>
        )}

        {/* Empty State when text cleared */}
        {!metrics && (
          <section className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center my-6">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Ready to Analyze Your Next Chapter
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Paste any text above, or click one of our test presets to explore how ReadEasy diagnoses sentence complexity.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                {SAMPLE_TEXTS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSample(s.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition-colors"
                  >
                    Load &ldquo;{s.title.split(' (')[0]}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenFormulaModal={() => setIsFormulaModalOpen(true)} />

      {/* Educational Formula Modal */}
      <FormulaModal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        metrics={metrics}
      />

      {/* Export Report Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        metrics={metrics}
      />
    </div>
  );
}

export default App;
