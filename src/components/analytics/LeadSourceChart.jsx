import React, { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Globe } from 'lucide-react';
import { ChartCard } from './PieChartCard';
import { SOURCE_COLORS } from '../../constants/analyticsColors';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-blue-600 font-bold">{payload[0].value} Leads</p>
    </div>
  );
};

/**
 * Horizontal bar chart ranking lead acquisition sources.
 *
 * @param {{ data: {source:string,count:number}[] }} props
 */
const LeadSourceChart = memo(({ data }) => {
  if (!data?.length) {
    return (
      <ChartCard title="Lead Sources" subtitle="Leads by acquisition channel" icon={Globe}>
        <div className="h-80 flex items-center justify-center text-slate-400 text-sm">
          No source data available
        </div>
      </ChartCard>
    );
  }

  // recharts needs { source, count } → rename for dataKey
  const chartData = data.map((d) => ({ name: d.source, count: d.count }));
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <ChartCard
      title="Lead Sources"
      subtitle="Leads by acquisition channel — sorted by volume"
      icon={Globe}
    >
      {/* Recharts horizontal bar */}
      <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 40)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 40, left: 100, bottom: 4 }}
          barCategoryGap="30%"
        >
          <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fontSize: 11, fill: '#475569' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} animationDuration={800} animationBegin={0} label={{ position: 'right', fontSize: 11, fill: '#64748B' }}>
            {chartData.map((_, idx) => (
              <Cell key={idx} fill={SOURCE_COLORS[idx % SOURCE_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Percentage breakdown */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-x-6 gap-y-2">
        {data.slice(0, 6).map((d, idx) => (
          <div key={d.source} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: SOURCE_COLORS[idx % SOURCE_COLORS.length] }}
            />
            <span className="text-slate-500 truncate flex-1">{d.source}</span>
            <span className="text-slate-700 font-medium">
              {total > 0 ? Math.round((d.count / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
});

LeadSourceChart.displayName = 'LeadSourceChart';
export default LeadSourceChart;
