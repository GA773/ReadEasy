import React from 'react';
import {
  FileText,
  AlignLeft,
  Clock,
  Mic,
  Activity,
  Layers,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import type { ReadabilityMetrics } from '../types/readability';

interface StatsDashboardProps {
  metrics: ReadabilityMetrics | null;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Words', icon: FileText, desc: 'Pasted content' },
          { label: 'Total Sentences', icon: AlignLeft, desc: 'Sentence units' },
          { label: 'Avg Sentence Length', icon: Activity, desc: 'Target: 14–20 words' },
          { label: 'Estimated Reading Time', icon: Clock, desc: '~225 words/min' },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between opacity-60"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
              <item.icon className="w-4 h-4 text-slate-300" />
            </div>
            <div className="text-2xl font-bold text-slate-300 font-['Plus_Jakarta_Sans']">—</div>
            <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
          </div>
        ))}
      </div>
    );
  }

  // Calculate target feedback for average sentence length
  const avgLen = metrics.avgSentenceLength;
  let lenFeedback = 'Ideal length';
  let lenColor = 'text-emerald-600 bg-emerald-50';
  if (avgLen > 25) {
    lenFeedback = 'Very long, hard to follow';
    lenColor = 'text-rose-600 bg-rose-50';
  } else if (avgLen > 20) {
    lenFeedback = 'Slightly long';
    lenColor = 'text-amber-600 bg-amber-50';
  } else if (avgLen < 10) {
    lenFeedback = 'Short & brisk';
    lenColor = 'text-blue-600 bg-blue-50';
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Words */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-indigo-200 hover:shadow-sm transition-all duration-200 group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Words
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            {metrics.totalWords.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>{metrics.totalCharacters.toLocaleString()} letters</span>
            <span className="text-slate-400">{metrics.totalParagraphs} {metrics.totalParagraphs === 1 ? 'paragraph' : 'paragraphs'}</span>
          </div>
        </div>

        {/* Total Sentences */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-indigo-200 hover:shadow-sm transition-all duration-200 group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Sentences
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlignLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            {metrics.totalSentences.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Cadence</span>
            <span className="font-medium text-slate-600">
              {(metrics.totalWords / Math.max(1, metrics.totalParagraphs)).toFixed(0)} words/para
            </span>
          </div>
        </div>

        {/* Average Sentence Length */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-indigo-200 hover:shadow-sm transition-all duration-200 group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Avg Sentence Length
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              {metrics.avgSentenceLength}
            </span>
            <span className="text-xs font-medium text-slate-400">words</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${lenColor}`}>
              {lenFeedback}
            </span>
            <span className="text-[10px] text-slate-400">Aim 14–20</span>
          </div>
        </div>

        {/* Reading Time */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-indigo-200 hover:shadow-sm transition-all duration-200 group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reading Time
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            {metrics.readingTimeFormatted}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500">
              <Mic className="w-3 h-3 text-slate-400" />
              Speech: {metrics.speakingTimeFormatted}
            </span>
            <span className="text-[10px] text-slate-400">225 wpm</span>
          </div>
        </div>
      </div>

      {/* Secondary Detailed Cards: Complex Words & Additional Reading Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Complex Words Pill */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Complex Words (3+ Syl.)
              </div>
              <div className="text-base font-bold text-slate-800">
                {metrics.complexWordsCount} words{' '}
                <span className="text-xs font-normal text-slate-500">
                  ({metrics.complexWordsPercentage}%)
                </span>
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {metrics.complexWordsPercentage < 10 ? 'Low Jargon' : metrics.complexWordsPercentage < 20 ? 'Moderate' : 'Dense'}
          </span>
        </div>

        {/* Syllable Density */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Syllable Density
              </div>
              <div className="text-base font-bold text-slate-800">
                {metrics.avgSyllablesPerWord} <span className="text-xs font-normal text-slate-500">per word</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {metrics.totalSyllables.toLocaleString()} total
          </span>
        </div>

        {/* Gunning Fog & Coleman Liau */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Alternative Indices
              </div>
              <div className="text-xs font-semibold text-slate-700">
                Fog: <span className="text-slate-900 font-bold">{metrics.gunningFogIndex}</span> • CLI: <span className="text-slate-900 font-bold">{metrics.colemanLiauIndex}</span>
              </div>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">School Grades</span>
        </div>
      </div>
    </div>
  );
};
