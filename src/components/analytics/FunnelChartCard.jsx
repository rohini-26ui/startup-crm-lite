import React, { memo } from 'react';
import { Filter } from 'lucide-react';
import { ChartCard } from './PieChartCard';

const STAGE_COLORS = [
  '#4a90e2', // New
  '#8a58d6', // Contacted
  '#d98a2c', // Meeting Scheduled
  '#3baca3', // Proposal Sent
  '#47b36a', // Won
  '#EF4444', // Lost
];

const FunnelChartCard = memo(({ data }) => {
  const hasData = data && data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <ChartCard title="Sales Funnel" subtitle="Lead progression through pipeline stages" icon={Filter}>
        <div className="h-80 flex flex-col items-center justify-center text-slate-400 text-sm">
          <Filter className="w-12 h-12 text-slate-300 mb-2 stroke-[1.5]" />
          <span>No funnel data available</span>
        </div>
      </ChartCard>
    );
  }

  // Calculate coordinates for the trapezoids
  const totalWidth = 300;
  const topWidth = 240;
  const bottomWidth = 60;
  const totalHeight = 320;
  const gap = 2; // Gap between sections
  const n = data.length;
  const sectionHeight = (totalHeight - gap * (n - 1)) / n;

  return (
    <ChartCard title="Sales Funnel" subtitle="Stage-by-stage pipeline" icon={Filter}>
      <div className="flex justify-center items-center min-h-[380px] py-4 w-full relative">
        <svg
          width="100%"
          height={totalHeight}
          viewBox={`0 0 500 ${totalHeight}`}
          className="max-w-[500px]"
          preserveAspectRatio="xMidYMid meet"
        >
          {data.map((item, idx) => {
            const y1 = idx * (sectionHeight + gap);
            const y2 = y1 + sectionHeight;
            
            // Calculate widths based on depth (linear interpolation)
            const w1 = topWidth - ((topWidth - bottomWidth) * (idx / n));
            let w2 = topWidth - ((topWidth - bottomWidth) * ((idx + 1) / n));
            
            // If it's the last stage, let it be pointed at the very bottom
            if (idx === n - 1) {
              w2 = 0;
            }

            const x1_left = 250 - w1 / 2;
            const x1_right = 250 + w1 / 2;
            const x2_left = 250 - w2 / 2;
            const x2_right = 250 + w2 / 2;

            const path = `
              M ${x1_left} ${y1}
              L ${x1_right} ${y1}
              L ${x2_right} ${y2}
              L ${x2_left} ${y2}
              Z
            `;

            return (
              <g key={item.stage}>
                {/* Number Label */}
                <text
                  x={100}
                  y={y1 + sectionHeight / 2}
                  fill={STAGE_COLORS[idx]}
                  fontSize="28"
                  fontWeight="bold"
                  textAnchor="end"
                  dominantBaseline="middle"
                  opacity={0.8}
                >
                  0{idx + 1}
                </text>

                {/* Trapezoid */}
                <path
                  d={path}
                  fill={STAGE_COLORS[idx]}
                  opacity={0.85}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />

                {/* Stage Name */}
                <text
                  x={250}
                  y={y1 + sectionHeight / 2}
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {item.stage === 'Meeting' ? 'Meeting Scheduled' : item.stage === 'Proposal' ? 'Proposal Sent' : item.stage}
                </text>

                {/* Dotted lines and side stats */}
                <path
                  d={`M ${250 + (w1 + w2) / 4 + 10} ${y1 + sectionHeight / 2} L 390 ${y1 + sectionHeight / 2}`}
                  className="stroke-slate-300 dark:stroke-slate-600"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Right side stats */}
                <g transform={`translate(400, ${y1 + sectionHeight / 2})`}>
                  <text y={idx > 0 ? -16 : 0} className="fill-slate-700 dark:fill-slate-200" fontSize="11" fontWeight="600">
                    {item.count} Leads
                  </text>
                  {idx > 0 && (
                    <text y="0" className="fill-slate-500 dark:fill-slate-400" fontSize="11" fontWeight="500">
                      {item.convRate}% Conversion Rate
                    </text>
                  )}
                  {idx > 0 && (
                    <text y={16} className="fill-slate-500 dark:fill-slate-400" fontSize="11" fontWeight="500">
                      Drop off: {item.dropOff}%
                    </text>
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </ChartCard>
  );
});

FunnelChartCard.displayName = 'FunnelChartCard';
export default FunnelChartCard;
