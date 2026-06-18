/**
 * @file useAnalytics.js
 * @description Central hook that provides all analytics state and derived metrics to
 * the Analytics Dashboard. Consumes the LeadContext and applies memoised transformations
 * so that expensive computations only re-run when their dependencies actually change.
 *
 * Returns:
 *  - leads          : date-filtered lead array
 *  - dateRange      : currently active range token
 *  - setDateRange   : stable callback to update the range (wrapped in useCallback)
 *  - stats          : KPI scalar object (totalLeads, conversionRate, etc.)
 *  - statusDistribution, monthlyLeads, conversionByMonth, revenueByMonth,
 *    leadSourceStats, funnelData, salesVelocity, forecastData,
 *    topPerformers, heatmapData
 *  - isEmpty        : true when the filtered set has no leads
 *  - totalLeadsAll  : unfiltered lead count (used for empty-state detection)
 */

import { useState, useMemo, useCallback } from 'react';
import { useLeads } from '../context/LeadContext';
import {
  filterLeadsByDateRange,
  getPreviousLeads,
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getPipelineValue,
  getWonRevenue,
  getConversionRate,
  getAverageSalesCycle,
  getLostRate,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData,
  calcGrowth,
} from '../utils/analyticsHelpers';

/**
 * @returns {Object} Analytics state and derived metrics.
 */
function useAnalytics() {
  const { leads: allLeads } = useLeads();

  // ── Filter state ────────────────────────────────────────────────────────────
  const [dateRange, _setDateRange]   = useState('30d');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  /** Stable setter — avoids re-subscribing child components on every render. */
  const setDateRange = useCallback((range) => _setDateRange(range), []);

  // ── Filtered lead sets ──────────────────────────────────────────────────────
  const filteredLeads = useMemo(
    () => filterLeadsByDateRange(allLeads, dateRange, customRange),
    [allLeads, dateRange, customRange]
  );

  const previousLeads = useMemo(
    () => getPreviousLeads(allLeads, dateRange),
    [allLeads, dateRange]
  );

  // ── KPI scalars ─────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total       = filteredLeads.length;
    const prevTotal   = previousLeads.length;
    const wonRev      = getWonRevenue(filteredLeads);
    const prevWonRev  = getWonRevenue(previousLeads);
    const pipeVal     = getPipelineValue(filteredLeads);
    const prevPipeVal = getPipelineValue(previousLeads);

    return {
      totalLeads:        total,
      totalLeadsGrowth:  calcGrowth(total, prevTotal),
      conversionRate:    getConversionRate(filteredLeads),
      pipelineValue:     pipeVal,
      pipelineGrowth:    calcGrowth(pipeVal, prevPipeVal),
      wonRevenue:        wonRev,
      wonRevenueGrowth:  calcGrowth(wonRev, prevWonRev),
      avgSalesCycle:     getAverageSalesCycle(filteredLeads),
      lostRate:          getLostRate(filteredLeads),
    };
  }, [filteredLeads, previousLeads]);

  // ── Chart data — all use allLeads for historical time-series ───────────────
  // (Filtered leads only apply to distribution / KPI cards)
  const statusDistribution = useMemo(() => getStatusDistribution(filteredLeads), [filteredLeads]);
  const monthlyLeads       = useMemo(() => getMonthlyLeads(allLeads),            [allLeads]);
  const conversionByMonth  = useMemo(() => getConversionByMonth(allLeads),       [allLeads]);
  const revenueByMonth     = useMemo(() => getRevenueByMonth(allLeads),          [allLeads]);
  const leadSourceStats    = useMemo(() => getLeadSourceStats(filteredLeads),    [filteredLeads]);
  const funnelData         = useMemo(() => getFunnelData(filteredLeads),         [filteredLeads]);
  const salesVelocity      = useMemo(() => getSalesVelocity(filteredLeads),      [filteredLeads]);
  const forecastData       = useMemo(() => getForecastRevenue(allLeads),         [allLeads]);
  const topPerformers      = useMemo(() => getTopPerformers(filteredLeads),      [filteredLeads]);
  const heatmapData        = useMemo(() => getActivityHeatmapData(allLeads),     [allLeads]);

  return {
    leads: filteredLeads,
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
    isEmpty:       filteredLeads.length === 0,
    totalLeadsAll: allLeads.length,
  };
}

export default useAnalytics;
