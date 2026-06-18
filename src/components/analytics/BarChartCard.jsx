import React, { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { ChartCard } from './PieChartCard';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl px-4 py-2.5 text-xs text-white">
      <p className="font-semibold text-slate-400 mb-1">{label}</p>
      <p className="text-white font-bold">Leads: <span className="text-blue-400 font-extrabold">{payload[0].value}</span></p>
    </div>
  );
};

const BarChartCard = memo(({ data }) => {
  const hasData = data && data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <ChartCard title="Monthly Leads Trend" subtitle="New leads created per month — last 6 months" icon={BarChart3}>
        <div className="h-72 flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 text-sm">
          <BarChart3 className="w-12 h-12 text-slate-300 dark:text-gray-600 mb-2 stroke-[1.5]" />
          <span>No monthly trend data</span>
        </div>
      </ChartCard>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <ChartCard title="Monthly Leads Trend" subtitle="New leads created per month — last 6 months" icon={BarChart3}>
      <div>
        <div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="primaryBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
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
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC', radius: 8 }} />
              <Bar
                dataKey="count"
                fill="url(#primaryBarGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={45}
                animationDuration={600}
                animationBegin={0}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-700 flex items-center justify-between text-xs text-slate-400 dark:text-gray-500">
          <span>
            Total in period:{' '}
            <span className="font-bold text-slate-700 dark:text-gray-200">
              {total} leads
            </span>
          </span>
        </div>
      </div>
    </ChartCard>
  );
});

BarChartCard.displayName = 'BarChartCard';
export default BarChartCard;
