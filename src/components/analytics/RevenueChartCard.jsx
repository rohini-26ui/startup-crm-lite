import React, { memo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign } from 'lucide-react';
import { ChartCard } from './PieChartCard';
import { CHART_COLORS } from '../../constants/analyticsColors';
import { formatINR } from '../../utils/analyticsHelpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-slate-800 dark:text-white mb-1">{label} Revenue</p>
      <p className="text-emerald-600 font-bold">{formatINR(payload[0].value)}</p>
    </div>
  );
};

/**
 * Monthly Won-revenue area chart with gradient fill.
 *
 * @param {{ data: {month:string,revenue:number}[] }} props
 */
const RevenueChartCard = memo(({ data }) => {
  if (!data?.length) {
    return (
      <ChartCard title="Revenue Analytics" subtitle="Monthly Won revenue" icon={DollarSign}>
        <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
          No revenue data available
        </div>
      </ChartCard>
    );
  }

  const total = data.reduce((s, d) => s + d.revenue, 0);
  const maxRev = Math.max(...data.map((d) => d.revenue));
  const peakMonth = data.find((d) => d.revenue === maxRev)?.month ?? '—';

  return (
    <ChartCard
      title="Revenue Analytics"
      subtitle="Won deal revenue by month — last 6 months"
      icon={DollarSign}
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={CHART_COLORS.success} stopOpacity={0.25} />
              <stop offset="100%" stopColor={CHART_COLORS.success} stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1_000_000 ? `₹${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={CHART_COLORS.success}
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
            dot={{ r: 4, fill: CHART_COLORS.success, stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            animationDuration={800}
            animationBegin={0}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>
          6-Month Total:{' '}
          <span className="font-semibold text-emerald-600">{formatINR(total)}</span>
        </span>
        <span>
          Peak:{' '}
          <span className="font-semibold text-slate-600">
            {formatINR(maxRev)} in {peakMonth}
          </span>
        </span>
      </div>
    </ChartCard>
  );
});

RevenueChartCard.displayName = 'RevenueChartCard';
export default RevenueChartCard;
