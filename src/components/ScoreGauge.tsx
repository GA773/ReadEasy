import React from 'react';
import { HelpCircle, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import type { ReadabilityMetrics } from '../types/readability';

interface ScoreGaugeProps {
  metrics: ReadabilityMetrics | null;
  onOpenFormulaModal: () => void;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  metrics,
  onOpenFormulaModal,
}) => {
  if (!metrics) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center text-center min-h-[320px]">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
          <BookOpen className="w-8 h-8 opacity-75" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 font-['Plus_Jakarta_Sans']">
          Awaiting Your Text
        </h3>
        <p className="text-sm text-slate-500 max-w-xs mt-1.5 leading-relaxed">
          Paste a chapter, blog draft, or essay on the left and click{' '}
          <span className="font-semibold text-indigo-600">Check Readability</span> to view your score.
        </p>
      </div>
    );
  }

  const score = metrics.fleschReadingEase;
  const interp = metrics.fleschInterpretation;

  // Circular progress calculations for SVG
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  // Flesch score is 0 to 100
  const progressPercent = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs relative overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Subtle top decorative accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500"
        style={{ backgroundColor: interp.ringColor }}
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Primary Readability Metric
          </span>
          <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-1.5">
            Flesch Reading Ease
          </h3>
        </div>
        <button
          onClick={onOpenFormulaModal}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80 rounded-lg transition-colors border border-indigo-100"
          title="See exact formula math"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Formula</span>
        </button>
      </div>

      {/* Main Gauge Visual */}
      <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-40 h-40 transform -rotate-90">
            {/* Background track circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Filled progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={interp.ringColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
              {score.toFixed(0)}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              out of 100
            </span>
          </div>
        </div>

        {/* Qualitative Classification Info */}
        <div className="flex-1 text-center sm:text-left space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs"
            style={{
              backgroundColor: `${interp.ringColor}15`,
              color: interp.ringColor,
              borderColor: `${interp.ringColor}40`,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{interp.label}</span>
          </div>

          <p className="text-sm text-slate-600 leading-snug">
            {interp.description}
          </p>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-md">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              <span>{interp.gradeLevel}</span>
            </div>
            <div className="text-xs text-slate-500">
              FKGL Grade: <span className="font-semibold text-slate-700">{metrics.fleschKincaidGradeLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Audiences Context Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center text-[11px] font-medium text-slate-500 mb-1.5">
          <span>Target Reader Benchmark</span>
          <span className="font-semibold text-slate-700">
            {score >= 70 ? 'Broad Public / Blog' : score >= 50 ? 'General Fiction & Press' : 'Academic & Technical'}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-rose-400 w-[30%]" title="0-30: Dense Academic / Legal" />
          <div className="h-full bg-amber-400 w-[20%]" title="30-50: Technical / High School" />
          <div className="h-full bg-indigo-400 w-[20%]" title="50-70: Standard Web / Novels" />
          <div className="h-full bg-emerald-400 w-[30%]" title="70-100: Conversational & Easy" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>0 (Complex)</span>
          <span>50 (Standard)</span>
          <span>100 (Easy)</span>
        </div>
      </div>
    </div>
  );
};
