import React, { memo } from 'react';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Trophy,
  Clock,
  XCircle,
} from 'lucide-react';
import { formatINR } from '../../utils/analyticsHelpers';

/** Returns the right Tailwind colour class for a growth value. */
const growthColor = (g) => {
  if (g === null || g === undefined) return 'text-slate-400';
  return g > 0 ? 'text-emerald-600' : g < 0 ? 'text-red-500' : 'text-slate-400';
};

/** Renders a +/-/0 growth badge next to a KPI value. */
const GrowthBadge = ({ value }) => {
  if (value === null || value === undefined) return null;
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${growthColor(value)}`}>
      <Icon className="w-3 h-3" />
      {Math.abs(value)}%
    </span>
  );
};

/** Single KPI card. */
const StatCard = memo(({ id, icon: Icon, label, value, growth, accent, sub }) => (
  <div
    id={id}
    className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-3"
  >
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <GrowthBadge value={growth} />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

/**
 * Six-card KPI summary row.
 *
 * @param {{ stats: Object }} props
 */
const StatsCards = memo(({ stats }) => {
  const {
    totalLeads,
    totalLeadsGrowth,
    conversionRate,
    pipelineValue,
    pipelineGrowth,
    wonRevenue,
    wonRevenueGrowth,
    avgSalesCycle,
    lostRate,
  } = stats;

  const cards = [
    {
      id:     'kpi-total-leads',
      icon:   Users,
      label:  'Total Leads',
      value:  totalLeads,
      growth: totalLeadsGrowth,
      accent: 'bg-blue-500',
    },
    {
      id:     'kpi-conversion-rate',
      icon:   TrendingUp,
      label:  'Conversion Rate',
      value:  `${conversionRate}%`,
      growth: null,
      accent: 'bg-emerald-500',
      sub:    'Won ÷ Total leads',
    },
    {
      id:     'kpi-pipeline-value',
      icon:   DollarSign,
      label:  'Pipeline Value',
      value:  formatINR(pipelineValue),
      growth: pipelineGrowth,
      accent: 'bg-violet-500',
      sub:    'Active deals only',
    },
    {
      id:     'kpi-won-revenue',
      icon:   Trophy,
      label:  'Won Revenue',
      value:  formatINR(wonRevenue),
      growth: wonRevenueGrowth,
      accent: 'bg-amber-500',
    },
    {
      id:     'kpi-sales-cycle',
      icon:   Clock,
      label:  'Avg Sales Cycle',
      value:  avgSalesCycle > 0 ? `${avgSalesCycle}d` : '—',
      growth: null,
      accent: 'bg-cyan-500',
      sub:    'Days from create → win',
    },
    {
      id:     'kpi-lost-rate',
      icon:   XCircle,
      label:  'Lost Rate',
      value:  `${lostRate}%`,
      growth: null,
      accent: 'bg-red-500',
      sub:    'Lost ÷ Total leads',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c) => (
        <StatCard key={c.id} {...c} />
      ))}
    </div>
  );
});

StatsCards.displayName = 'StatsCards';
export default StatsCards;
