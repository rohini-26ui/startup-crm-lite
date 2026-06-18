import React, { memo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ChartCard } from './PieChartCard';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl px-4 py-2.5 text-xs text-white">
      <p className="font-semibold text-slate-400 mb-1">{label}</p>
      <p className="text-white font-bold">Conversion Rate: <span className="text-emerald-400 font-extrabold">{payload[0].value}%</span></p>
    </div>
  );
};

const LineChartCard = memo(({ data }) => {
  const hasData = data && data.some((d) => d.rate > 0);

  if (!hasData) {
    return (
      <ChartCard title="Conversion Rate Trend" subtitle="Monthly win rate over time — last 6 months" icon={TrendingUp}>
        <div className="h-72 flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 text-sm">
          <TrendingUp className="w-12 h-12 text-slate-300 dark:text-gray-600 mb-2 stroke-[1.5]" />
          <span>No conversion rate data</span>
        </div>
      </ChartCard>
    );
  }

  const avg = Math.round(data.reduce((sum, d) => sum + d.rate, 0) / data.length);

  return (
    <ChartCard title="Conversion Rate Trend" subtitle="Won ÷ Total leads per month — last 6 months" icon={TrendingUp}>
      <div>
        <div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} className="dark:opacity-20" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#22C55E"
                strokeWidth={3}
                dot={{ r: 4.5, fill: '#22C55E', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#22C55E', stroke: '#fff', strokeWidth: 2 }}
                animationDuration={600}
                animationBegin={0}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-700 flex items-center justify-between text-xs text-slate-400 dark:text-gray-500">
          <span>
            Average conversion rate:{' '}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {avg}%
            </span>
          </span>
        </div>
      </div>
    </ChartCard>
  );
});

LineChartCard.displayName = 'LineChartCard';
export default LineChartCard;
