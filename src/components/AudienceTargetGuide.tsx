import { Target, CheckCircle2 } from 'lucide-react';
import type { ReadabilityMetrics } from '../types/readability';

interface AudienceTargetGuideProps {
  metrics: ReadabilityMetrics | null;
}

export const AudienceTargetGuide: React.FC<AudienceTargetGuideProps> = ({ metrics }) => {
  const currentScore = metrics?.fleschReadingEase ?? null;

  const genres = [
    {
      genre: 'Blog Posts & Newsletters',
      targetScore: '70 – 85',
      min: 70,
      max: 85,
      note: 'Maximizes reader engagement, conversion, and fast mobile reading.',
    },
    {
      genre: 'Commercial Fiction & Novels',
      targetScore: '65 – 80',
      min: 65,
      max: 80,
      note: 'Keeps narrative pacing snappy while allowing descriptive richness.',
    },
    {
      genre: 'Journalism & Non-Fiction',
      targetScore: '55 – 70',
      min: 55,
      max: 70,
      note: 'Mainstream press standard (e.g. Wall Street Journal, Time).',
    },
    {
      genre: 'Academic & Technical Papers',
      targetScore: '30 – 50',
      min: 30,
      max: 50,
      note: 'Precise domain terminology naturally produces lower readability ease.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <Target className="w-5 h-5 text-indigo-600" />
        <div>
          <h4 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Audience Target Benchmarks
          </h4>
          <p className="text-xs text-slate-500">
            Compare your manuscript against standard industry targets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {genres.map(item => {
          const isMatching =
            currentScore !== null &&
            currentScore >= item.min &&
            currentScore <= item.max;

          return (
            <div
              key={item.genre}
              className={`p-3.5 rounded-xl border transition-all ${
                isMatching
                  ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-300/40 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800">
                  {item.genre}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    isMatching
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {item.targetScore}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-normal">{item.note}</p>
              {isMatching && (
                <div className="mt-2 pt-2 border-t border-indigo-200/60 flex items-center gap-1 text-[11px] font-bold text-indigo-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Your current score ({currentScore}) fits this genre!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
