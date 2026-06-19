import React, { memo } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ChartCard } from './PieChartCard';
import { formatINR } from '../../utils/analyticsHelpers';

const TREND_CONFIG = {
  up:     { Icon: TrendingUp,   color: 'text-emerald-500', label: 'Growth trend'  },
  down:   { Icon: TrendingDown, color: 'text-red-400',     label: 'Declining'     },
  stable: { Icon: Minus,        color: 'text-amber-500',   label: 'Stable'        },
};

/**
 * Revenue forecast widget — projects next-month revenue using a trailing 3-month average.
 *
 * @param {{ data: {predicted:number, confidence:number, trend:'up'|'down'|'stable', history:number[]} }} props
 */
const ForecastCard = memo(({ data }) => {
  const { predicted = 0, confidence = 0, trend = 'stable', history = [] } = data ?? {};
  const { Icon, color, label } = TREND_CONFIG[trend] ?? TREND_CONFIG.stable;

  // Mini sparkline dimensions
  const W = 200; const H = 40; const PAD = 4;
  const max = Math.max(...history, 1);
  const points = history.map((v, i) => {
    const x = PAD + (i / Math.max(history.length - 1, 1)) * (W - PAD * 2);
    const y = H - PAD - ((v / max) * (H - PAD * 2));
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <ChartCard
      title="Revenue Forecast"
      subtitle="Predicted next-month revenue based on trailing 3-month avg"
      icon={Sparkles}
    >
      {/* Predicted revenue hero */}
      <div className="flex items-center gap-3 mb-2">
        <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {formatINR(predicted)}
        </p>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-300 mb-6">Predicted Revenue — Next Month</p>

      {/* Confidence meter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Confidence Score</span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{confidence}%</span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              confidence >= 70 ? 'bg-emerald-400' : confidence >= 45 ? 'bg-amber-400' : 'bg-red-400'
            }`}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-2">
          {confidence >= 70 ? 'High confidence — consistent revenue data'
           : confidence >= 45 ? 'Moderate — add more Won deals to improve'
           : 'Low — insufficient historical data'}
        </p>
      </div>

      {/* Mini sparkline of the last 6 months */}
      {history.length >= 2 && (
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-3">6-Month Revenue History</p>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12" preserveAspectRatio="none">
            {/* Area fill */}
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#22C55E" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0"    />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="#22C55E"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={points.join(' ')}
            />
          </svg>
        </div>
      )}

      {/* Trend badge */}
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-xs font-medium ${color}`}>{label}</span>
        <span className="text-[10px] text-slate-400">vs. 6-month baseline</span>
      </div>
    </ChartCard>
  );
});

ForecastCard.displayName = 'ForecastCard';
export default ForecastCard;
