import React, { memo } from 'react';
import { Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ChartCard } from './PieChartCard';
import { formatINR } from '../../utils/analyticsHelpers';

const MetricRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700 last:border-0">
    <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{value}</span>
  </div>
);

/**
 * Sales velocity widget.
 * Formula: (Opportunities × Win Rate × Avg Deal Size) ÷ Sales Cycle Length
 *
 * @param {{ data: {velocity:number, opportunities:number, winRate:number, avgDeal:number, cycle:number} }} props
 */
const SalesVelocityCard = memo(({ data }) => {
  const { velocity = 0, opportunities = 0, winRate = 0, avgDeal = 0, cycle = 0 } = data ?? {};

  const velocityStr = velocity > 0 ? `${formatINR(velocity)}/day` : '₹0/day';

  // Simple qualitative indicator vs a "good" baseline
  const TrendIcon = velocity > 5000 ? TrendingUp : velocity > 0 ? Minus : TrendingDown;
  const trendColor = velocity > 5000 ? 'text-emerald-500' : velocity > 0 ? 'text-amber-500' : 'text-red-400';

  return (
    <ChartCard
      title="Sales Velocity"
      subtitle="Revenue generated per day in the pipeline"
      icon={Zap}
    >
      {/* Hero metric */}
      <div className="flex items-end gap-3 mb-6">
        <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{velocityStr}</p>
        <TrendIcon className={`w-5 h-5 mb-1 ${trendColor}`} />
      </div>

      {/* Formula breakdown */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 space-y-1 mb-4">
        <MetricRow label="Active Opportunities"  value={opportunities} />
        <MetricRow label="Win Rate"              value={`${winRate}%`} />
        <MetricRow label="Avg Deal Size"         value={formatINR(avgDeal)} />
        <MetricRow label="Avg Sales Cycle"       value={cycle > 0 ? `${cycle} days` : '—'} />
      </div>

      {/* Formula legend */}
      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed mb-4">
        (Opportunities × Win Rate × Avg Deal) ÷ Sales Cycle
      </p>

      {/* Gauge bar */}
      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mb-2">
          <span>₹0</span>
          <span>₹10K/day</span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, (velocity / 10000) * 100)}%` }}
          />
        </div>
      </div>
    </ChartCard>
  );
});

SalesVelocityCard.displayName = 'SalesVelocityCard';
export default SalesVelocityCard;
