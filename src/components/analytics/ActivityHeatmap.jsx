import React, { memo, useState } from 'react';
import { Activity } from 'lucide-react';
import { ChartCard } from './PieChartCard';
import { HEAT_COLORS } from '../../constants/analyticsColors';

/** Map a count to a heat-intensity colour. */
const heatColor = (count) => {
  if (count === 0) return HEAT_COLORS[0];
  if (count === 1) return HEAT_COLORS[1];
  if (count === 2) return HEAT_COLORS[2];
  if (count === 3) return HEAT_COLORS[3];
  if (count === 4) return HEAT_COLORS[4];
  return HEAT_COLORS[5];
};

/** Single heatmap cell (day square). */
const Cell = memo(({ date, count, label }) => {
  const [hover, setHover] = useState(false);

  return (
    <div className="relative group" style={{ lineHeight: 0 }}>
      <div
        className="w-3 h-3 rounded-[2px] cursor-default transition-transform duration-150 group-hover:scale-125"
        style={{ backgroundColor: heatColor(count) }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title={`${label}: ${count} lead${count !== 1 ? 's' : ''}`}
      />
      {/* Tooltip */}
      {hover && (
        <div
          className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded-lg whitespace-nowrap pointer-events-none shadow-lg"
          style={{ fontSize: 10 }}
        >
          <strong>{label}</strong>
          <br />
          {count} lead{count !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
});

Cell.displayName = 'HeatCell';

/**
 * GitHub-style contribution heatmap showing lead activity over the last 12 weeks.
 *
 * @param {{ data: {date:string,count:number,label:string}[] }} props
 */
const ActivityHeatmap = memo(({ data }) => {
  if (!data?.length) {
    return (
      <ChartCard title="Activity Heatmap" subtitle="Lead creation activity — last 12 weeks" icon={Activity}>
        <div className="h-56 flex items-center justify-center text-slate-400 text-sm">
          No activity data
        </div>
      </ChartCard>
    );
  }

  // Group into weeks (columns of 7 days)
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  // Derive day-of-week labels from the first week's dates
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const totalActivity = data.reduce((s, d) => s + d.count, 0);
  const activeDays    = data.filter((d) => d.count > 0).length;

  return (
    <ChartCard
      title="Activity Heatmap"
      subtitle="Lead creation activity — last 12 weeks"
      icon={Activity}
    >
      {/* Day-of-week row labels */}
      <div className="flex gap-1 mb-1">
        <div className="w-6" /> {/* Spacer for DOW column */}
        {weeks.map((_, wi) => (
          <div key={wi} className="flex-1 text-center text-[9px] text-slate-300">
            {wi % 3 === 0 ? weeks[wi][0]?.date.slice(5, 10) : ''}
          </div>
        ))}
      </div>

      {/* Grid: rows = day-of-week, columns = weeks */}
      <div className="flex gap-1">
        {/* Day-of-week labels column */}
        <div className="flex flex-col gap-1 w-6 shrink-0">
          {DAY_LABELS.map((d, i) => (
            <div key={d} className="h-3 flex items-center justify-end pr-1">
              {i % 2 === 1 && <span className="text-[9px] text-slate-300 leading-none">{d.slice(0, 1)}</span>}
            </div>
          ))}
        </div>

        {/* Week columns */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1 flex-1">
            {/* Pad weeks that don't start on Sunday */}
            {week.map((day, di) => (
              <Cell key={day.date} date={day.date} count={day.count} label={day.label} />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">
          {totalActivity} leads · {activeDays} active days
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 mr-1">Less</span>
          {HEAT_COLORS.map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: c }} />
          ))}
          <span className="text-[10px] text-slate-400 ml-1">More</span>
        </div>
      </div>
    </ChartCard>
  );
});

ActivityHeatmap.displayName = 'ActivityHeatmap';
export default ActivityHeatmap;
