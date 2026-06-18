import React, { memo } from 'react';
import { Award } from 'lucide-react';
import { ChartCard } from './PieChartCard';
import { formatINR } from '../../utils/analyticsHelpers';
import { SOURCE_COLORS } from '../../constants/analyticsColors';

/** Medal colours for positions 1-3. */
const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * A single performer row with avatar, stats, and an animated win-rate bar.
 */
const PerformerRow = memo(({ performer, rank, color }) => {
  const { name, revenue, deals, winRate } = performer;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0 group">
      {/* Rank / medal */}
      <div className="w-7 text-center shrink-0">
        {rank <= 2 ? (
          <span className="text-base leading-none">{MEDALS[rank]}</span>
        ) : (
          <span className="text-xs font-bold text-slate-400">#{rank + 1}</span>
        )}
      </div>

      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ backgroundColor: color }}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>

      {/* Name + win-rate bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-slate-800 truncate">{name}</p>
          <span className="text-xs text-slate-400 shrink-0 ml-2">{winRate}% win</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${winRate}%`, backgroundColor: color }}
          />
        </div>
      </div>

      {/* Revenue + deals */}
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-slate-800">{formatINR(revenue)}</p>
        <p className="text-[10px] text-slate-400">{deals} deal{deals !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
});

PerformerRow.displayName = 'PerformerRow';

/**
 * Top performers leaderboard ranked by Won revenue.
 * Falls back to grouping by Lead Source when no `owner` field is present.
 *
 * @param {{ data: {name:string,revenue:number,deals:number,winRate:number}[] }} props
 */
const TopPerformersCard = memo(({ data }) => {
  if (!data?.length) {
    return (
      <ChartCard
        title="Top Performers"
        subtitle="Ranked by Won revenue"
        icon={Award}
      >
        <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
          No performance data available
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Top Performers"
      subtitle="Ranked by Won revenue · grouped by source (add owner field for rep-level data)"
      icon={Award}
    >
      <div className="divide-y divide-slate-100">
        {data.map((performer, idx) => (
          <PerformerRow
            key={performer.name}
            performer={performer}
            rank={idx}
            color={SOURCE_COLORS[idx % SOURCE_COLORS.length]}
          />
        ))}
      </div>

      {/* Total row */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs">
        <span className="text-slate-500">Total Won</span>
        <span className="font-semibold text-slate-700">
          {formatINR(data.reduce((s, p) => s + p.revenue, 0))}
        </span>
      </div>
    </ChartCard>
  );
});

TopPerformersCard.displayName = 'TopPerformersCard';
export default TopPerformersCard;
