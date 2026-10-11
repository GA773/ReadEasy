import { useRef } from 'react';
import {
  Sparkles,
  RotateCcw,
  ClipboardPaste,
  Eye,
  Edit3,
  Zap,
} from 'lucide-react';
import { SAMPLE_TEXTS } from '../utils/sampleTexts';

interface TextInputAreaProps {
  text: string;
  onChangeText: (newText: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  onLoadSample: (sampleId: string) => void;
  isAnalyzing: boolean;
  activeView: 'editor' | 'heatmap';
  setActiveView: (view: 'editor' | 'heatmap') => void;
  hasAnalysis: boolean;
  autoAnalyze: boolean;
  setAutoAnalyze: (enabled: boolean) => void;
}

export const TextInputArea: React.FC<TextInputAreaProps> = ({
  text,
  onChangeText,
  onAnalyze,
  onClear,
  onLoadSample,
  isAnalyzing,
  activeView,
  setActiveView,
  hasAnalysis,
  autoAnalyze,
  setAutoAnalyze,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Quick live counts
  const charCount = text.length;
  const wordCount = text.trim() ? (text.trim().match(/\S+/g) || []).length : 0;
  const isShortText = wordCount > 0 && wordCount < 20;

  const handlePaste = async () => {
    try {
      const clipboardContent = await navigator.clipboard.readText();
      if (clipboardContent) {
        onChangeText(clipboardContent);
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }
    } catch {
      // Fallback for browsers with restricted clipboard permissions
      alert('Please use Ctrl+V or Cmd+V to paste your text directly into the box.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd + Enter or Ctrl + Enter triggers analysis
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onAnalyze();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Top Toolbar: View switcher & Sample presets */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        {/* Editor vs Heatmap View Toggle */}
        <div className="flex items-center bg-slate-200/60 p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveView('editor')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeView === 'editor'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            onClick={() => {
              if (hasAnalysis) {
                setActiveView('heatmap');
              } else {
                onAnalyze();
                setActiveView('heatmap');
              }
            }}
            disabled={!text.trim()}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              activeView === 'heatmap'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Heatmap</span>
          </button>
        </div>

        {/* Quick Sample Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
            Test Samples:
          </span>
          {SAMPLE_TEXTS.map(sample => (
            <button
              key={sample.id}
              onClick={() => onLoadSample(sample.id)}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors shrink-0 shadow-2xs"
              title={sample.description}
            >
              {sample.title.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Text Area */}
      <div className="relative flex-1 p-4 sm:p-6 bg-white min-h-[360px] flex flex-col">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your chapter, blog post, draft, or essay here to inspect readability..."
          className="w-full flex-1 min-h-[280px] sm:min-h-[340px] text-base sm:text-lg text-slate-800 placeholder:text-slate-300 leading-relaxed border-0 focus:outline-hidden resize-y font-sans"
        />

        {/* Friendly short text warning */}
        {isShortText && (
          <div className="mt-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
            <span>
              <strong>Note:</strong> Statistical readability formulas work best on samples of at least 30–50 words.
            </span>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="px-4 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
        {/* Live Counters */}
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <div>
            <strong className="text-slate-800 font-semibold">{wordCount.toLocaleString()}</strong> words
          </div>
          <span className="text-slate-300">•</span>
          <div>
            <strong className="text-slate-800 font-semibold">{charCount.toLocaleString()}</strong> chars
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="hidden sm:inline">
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-200 text-slate-600 rounded-sm font-mono">
              ⌘ + Enter
            </kbd>{' '}
            to check
          </div>
        </div>

        {/* Action Buttons: Paste, Clear, Auto-analyze toggle, Check Readability */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real-time auto-analyze toggle */}
          <label className="hidden md:flex items-center gap-1.5 cursor-pointer text-xs text-slate-600 select-none mr-1">
            <input
              type="checkbox"
              checked={autoAnalyze}
              onChange={e => setAutoAnalyze(e.target.checked)}
              className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              Live update
            </span>
          </label>

          {/* Paste button */}
          <button
            onClick={handlePaste}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-2xs transition-colors"
            title="Paste text from clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </button>

          {/* Clear button */}
          {text.length > 0 && (
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent rounded-xl transition-colors"
              title="Clear all text"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {/* Check Readability Primary Button */}
          <button
            onClick={onAnalyze}
            disabled={!text.trim() || isAnalyzing}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all duration-200 ${
              !text.trim()
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-98 shadow-indigo-500/25'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Check Readability'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
