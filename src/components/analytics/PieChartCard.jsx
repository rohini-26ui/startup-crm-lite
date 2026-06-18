import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = {
  New: '#94A3B8',
  Contacted: '#2563EB',
  Meeting: '#F59E0B',
  Proposal: '#7C3AED',
  Won: '#22C55E',
  Lost: '#EF4444',
};

export const ChartCard = ({ title, subtitle, icon: Icon, children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
    <div className="px-6 pt-6 pb-5 flex items-start justify-between border-b border-slate-100 dark:border-gray-700">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 ml-4">
          <Icon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
        </div>
      )}
    </div>
    <div className="px-6 py-6">{children}</div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: entry } = payload[0];
  const total = entry._total || 1;
  const pct = Math.round((value / total) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl px-4 py-2.5 text-xs text-white">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[name] || '#ccc' }} />
        <span className="font-semibold">{name}</span>
      </div>
      <div className="space-y-0.5">
        <p className="text-slate-300 font-medium">Leads: <span className="text-white font-bold">{value}</span></p>
        <p className="text-slate-400">Percentage: <span className="text-white font-bold">{pct}%</span></p>
      </div>
    </div>
  );
};

const CustomLegend = ({ data, total }) => {
  return (
    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-gray-700 grid grid-cols-2 gap-y-2 gap-x-4">
      {data.map((entry) => {
        const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
        const color = COLORS[entry.name] || '#94A3B8';
        return (
          <div key={entry.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-slate-600 dark:text-gray-300 truncate">{entry.name}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-slate-800 dark:text-white">{entry.value}</span>
              <span className="text-slate-400 dark:text-gray-500 w-8 text-right font-medium">{pct}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const PieChartCard = memo(({ data, total }) => {
  const enriched = (data ?? []).map((d) => ({ ...d, _total: total || 1 }));
  const hasData = data && data.some((d) => d.value > 0);

  if (!hasData) {
    return (
      <ChartCard title="Lead Status Distribution" subtitle="Breakdown of leads by current status" icon={PieIcon}>
        <div className="h-80 flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 text-sm">
          <PieIcon className="w-12 h-12 text-slate-300 dark:text-gray-600 mb-2 stroke-[1.5]" />
          <span>No status distribution data</span>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Lead Status Distribution" subtitle="Breakdown of leads by current status" icon={PieIcon}>
      <div className="relative">
        <div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={enriched}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={600}
              >
                {enriched.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name] || '#94A3B8'}
                    stroke="none"
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-[120px] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="block text-2xl font-black text-slate-800 dark:text-white leading-none">{total}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-400 tracking-wider">Total Leads</span>
          </div>
        </div>
        <CustomLegend data={data} total={total || 1} />
      </div>
    </ChartCard>
  );
});

PieChartCard.displayName = 'PieChartCard';
export default PieChartCard;
