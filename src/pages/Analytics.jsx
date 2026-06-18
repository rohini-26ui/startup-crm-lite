import React from 'react';
import { BarChart3 } from 'lucide-react';
import useAnalytics from '../hooks/useAnalytics';

import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import ForecastCard from '../components/analytics/ForecastCard';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';

const Analytics = () => {
  const {
    dateRange,
    setDateRange,
    customRange,
    setCustomRange,
    stats,
    statusDistribution,
    monthlyLeads,
    conversionByMonth,
    revenueByMonth,
    leadSourceStats,
    funnelData,
    salesVelocity,
    forecastData,
    topPerformers,
    heatmapData,
    totalLeadsAll,
  } = useAnalytics();

  if (totalLeadsAll === 0) {
    return <EmptyAnalyticsState />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3 tracking-tight">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
            Analytics Dashboard
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1.5 font-medium">
            Track sales performance and growth trends.
          </p>
        </div>
        <div className="shrink-0">
          <AnalyticsFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
        </div>
      </div>

      {/* KPI Cards Row (Total Leads, Conversion Rate, Pipeline Value, Won Revenue, Avg Sales Cycle, Lost Rate) */}
      <StatsCards stats={stats} />

      {/* Grid Layout for Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Row 1: Status Distribution & Funnel */}
        <PieChartCard data={statusDistribution} total={stats.totalLeads} />
        <FunnelChartCard data={funnelData} />

        {/* Row 2: Monthly Lead Counts & Conversion Trends */}
        <BarChartCard data={monthlyLeads} />
        <LineChartCard data={conversionByMonth} />

        {/* Row 3: Revenue & Lead Sources */}
        <RevenueChartCard data={revenueByMonth} />
        <LeadSourceChart data={leadSourceStats} />

        {/* Row 4: Heatmap & Top Performers */}
        <ActivityHeatmap data={heatmapData} />
        <TopPerformersCard data={topPerformers} />

        {/* Row 5: Revenue Forecast & Sales Velocity */}
        <ForecastCard data={forecastData} />
        <SalesVelocityCard data={salesVelocity} />
      </div>
    </div>
  );
};

export default Analytics;
