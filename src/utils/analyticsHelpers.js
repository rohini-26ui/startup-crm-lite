/**
 * @file analyticsHelpers.js
 * @description Pure utility functions that derive analytics metrics from raw lead data.
 */

// ─── Internal date helpers ─────────────────────────────────────────────────────

/** Safely parse any date-like value. Returns null on failure. */
const toDate = (v) => {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

/** Return 'YYYY-MM' key for a Date object. */
const monthKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

/** Return short label like "Jan", "Feb" for a Date (no year for short charts). */
const monthLabel = (d) =>
  d.toLocaleString('en-US', { month: 'short' });

/** Build an ordered list of the last `n` calendar months: [{ key, label }, ...]. */
const lastNMonths = (n) => {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return { key: monthKey(d), label: monthLabel(d) };
  });
};

// ─── Public: Filtering ─────────────────────────────────────────────────────────

/**
 * Filter leads that fall within a named date range.
 *
 * @param {Object[]} leads - Raw lead array.
 * @param {string} range - '7d' | '30d' | '90d' | 'year' | 'all'.
 * @param {{ start?: string, end?: string } | null} custom - Custom range endpoints.
 * @returns {Object[]} Filtered lead array.
 */
export function filterLeadsByDateRange(leads, range = '30d', custom = null) {
  if (!Array.isArray(leads) || !leads.length) return [];
  const now = new Date();
  let startDate = null;
  let endDate = now;

  if (range === 'custom' && custom?.start) {
    startDate = toDate(custom.start);
    if (custom.end) endDate = toDate(custom.end) ?? now;
  } else {
    const MS_PER_DAY = 86_400_000;
    const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
    if (daysMap[range]) {
      startDate = new Date(now.getTime() - daysMap[range] * MS_PER_DAY);
    } else if (range === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }
  }

  if (!startDate) return leads;

  return leads.filter((lead) => {
    const d = toDate(lead.createdAt || lead.dateAdded);
    return d && d >= startDate && d <= endDate;
  });
}

/**
 * Get leads from the period immediately preceding the current date range.
 * Used for computing growth percentages on KPI cards.
 *
 * @param {Object[]} leads
 * @param {string} range - Same range tokens as filterLeadsByDateRange.
 * @returns {Object[]}
 */
export function getPreviousLeads(leads, range = '30d') {
  if (!Array.isArray(leads) || !leads.length) return [];
  const now = new Date();
  const MS_PER_DAY = 86_400_000;
  const daysMap = { '7d': 7, '30d': 30, '90d': 90, year: 365 };
  const days = daysMap[range] || 30;

  const periodEnd   = new Date(now.getTime() - days * MS_PER_DAY);
  const periodStart = new Date(now.getTime() - 2 * days * MS_PER_DAY);

  return leads.filter((lead) => {
    const d = toDate(lead.createdAt || lead.dateAdded);
    return d && d >= periodStart && d <= periodEnd;
  });
}

// ─── Public: Status & Funnel ───────────────────────────────────────────────────

/**
 * Shared utility to calculate status counts for both Lead Status Distribution and Sales Funnel.
 * 
 * @param {Object[]} leads 
 * @returns {Record<string, number>}
 */
export function getLeadStatusCounts(leads) {
  const counts = {
    'New': 0,
    'Contacted': 0,
    'Meeting': 0,
    'Proposal': 0,
    'Won': 0,
    'Lost': 0
  };
  if (!Array.isArray(leads)) return counts;

  leads.forEach((l) => {
    let status = l.status;
    if (status === 'Meeting Scheduled') status = 'Meeting';
    if (status === 'Proposal Sent') status = 'Proposal';
    if (counts[status] !== undefined) {
      counts[status]++;
    }
  });
  return counts;
}

/**
 * Distribution of leads by pipeline status.
 *
 * @param {Object[]} leads
 * @returns {{ name: string, value: number }[]}
 */
export function getStatusDistribution(leads) {
  const counts = getLeadStatusCounts(leads);
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

/**
 * Ordered funnel data showing cumulative lead counts at each pipeline stage.
 * A lead counts for a stage if it has reached or passed through it.
 *
 * @param {Object[]} leads
 * @returns {{ stage: string, count: number, convRate: number, dropOff: number }[]}
 */
export function getFunnelData(leads) {
  const counts = getLeadStatusCounts(leads);
  const STAGES = ['New', 'Contacted', 'Meeting', 'Proposal', 'Won', 'Lost'];

  return STAGES.map((stage, idx) => {
    const count = counts[stage];
    const prevCount = idx === 0 ? 0 : counts[STAGES[idx - 1]];
    const convRate = prevCount > 0 ? Math.round((count / prevCount) * 100) : 0;
    return { 
      stage, 
      count, 
      convRate, 
      dropOff: prevCount > 0 ? 100 - convRate : 0 
    };
  });
}

// ─── Public: Monthly time-series ───────────────────────────────────────────────

/**
 * Lead counts per calendar month for the last 6 months.
 *
 * @param {Object[]} leads
 * @returns {{ month: string, count: number }[]}
 */
export function getMonthlyLeads(leads) {
  const months = lastNMonths(6);
  const map = Object.fromEntries(months.map(({ key, label }) => [key, { month: label, count: 0 }]));

  if (leads?.length) {
    for (const l of leads) {
      const d = toDate(l.createdAt || l.dateAdded);
      if (!d) continue;
      const k = monthKey(d);
      if (map[k]) map[k].count += 1;
    }
  }
  return months.map(({ key }) => map[key]);
}

/**
 * Monthly conversion rates (Won / Total leads created that month), last 6 months.
 *
 * @param {Object[]} leads
 * @returns {{ month: string, rate: number }[]}
 */
export function getConversionByMonth(leads) {
  const months = lastNMonths(6);
  const totals = Object.fromEntries(months.map(({ key, label }) => [key, { month: label, total: 0, won: 0 }]));

  if (leads?.length) {
    for (const l of leads) {
      const d = toDate(l.createdAt || l.dateAdded);
      if (!d) continue;
      const k = monthKey(d);
      if (!totals[k]) continue;
      totals[k].total += 1;
      if (l.status === 'Won') totals[k].won += 1;
    }
  }
  return months.map(({ key }) => {
    const { month, total, won } = totals[key];
    return { month, rate: total > 0 ? Math.round((won / total) * 100) : 0 };
  });
}

/**
 * Monthly Won revenue for the last 6 months.
 *
 * @param {Object[]} leads
 * @returns {{ month: string, revenue: number }[]}
 */
export function getRevenueByMonth(leads) {
  const months = lastNMonths(6);
  const map = Object.fromEntries(months.map(({ key, label }) => [key, { month: label, revenue: 0 }]));

  if (leads?.length) {
    for (const l of leads) {
      if (l.status !== 'Won') continue;
      const d = toDate(l.createdAt || l.dateAdded);
      if (!d) continue;
      const k = monthKey(d);
      if (map[k]) map[k].revenue += l.value || 0;
    }
  }
  return months.map(({ key }) => map[key]);
}

// ─── Public: KPI scalars ───────────────────────────────────────────────────────

/**
 * Total value of all active (non-Won, non-Lost) leads.
 * @param {Object[]} leads
 * @returns {number}
 */
export function getPipelineValue(leads) {
  if (!leads?.length) return 0;
  return leads
    .filter((l) => l.status !== 'Won' && l.status !== 'Lost')
    .reduce((s, l) => s + (l.value || 0), 0);
}

/**
 * Total value of all Won leads.
 * @param {Object[]} leads
 * @returns {number}
 */
export function getWonRevenue(leads) {
  if (!leads?.length) return 0;
  return leads.filter((l) => l.status === 'Won').reduce((s, l) => s + (l.value || 0), 0);
}

/**
 * Won leads / Total leads as a percentage (0–100).
 * @param {Object[]} leads
 * @returns {number}
 */
export function getConversionRate(leads) {
  if (!leads?.length) return 0;
  return Math.round((leads.filter((l) => l.status === 'Won').length / leads.length) * 100);
}

/**
 * Average sales-cycle length in days for Won leads.
 * Uses the `wonAt` field if present; falls back to time from `createdAt` to today.
 * @param {Object[]} leads
 * @returns {number}
 */
export function getAverageSalesCycle(leads) {
  if (!leads?.length) return 0;
  const won = leads.filter((l) => l.status === 'Won');
  if (!won.length) return 0;
  const total = won.reduce((s, l) => {
    const start = toDate(l.createdAt || l.dateAdded);
    const end   = toDate(l.wonAt) ?? new Date();
    return s + (start ? Math.max(0, Math.round((end - start) / 86_400_000)) : 0);
  }, 0);
  return Math.round(total / won.length);
}

/**
 * Lost leads / Total leads as a percentage (0–100).
 * @param {Object[]} leads
 * @returns {number}
 */
export function getLostRate(leads) {
  if (!leads?.length) return 0;
  return Math.round((leads.filter((l) => l.status === 'Lost').length / leads.length) * 100);
}

// ─── Public: Sources & Performers ─────────────────────────────────────────────

/**
 * Aggregated lead count per acquisition source, sorted descending.
 * @param {Object[]} leads
 * @returns {{ source: string, count: number }[]}
 */
export function getLeadSourceStats(leads) {
  if (!leads?.length) return [];
  const map = {};
  for (const l of leads) {
    const s = l.source || 'Other';
    map[s] = (map[s] || 0) + 1;
  }
  return Object.entries(map)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Rank team members (or sources as proxy) by Won revenue.
 * @param {Object[]} leads
 * @returns {{ name: string, revenue: number, deals: number, winRate: number }[]}
 */
export function getTopPerformers(leads) {
  if (!leads?.length) return [];
  const hasOwner = leads.some((l) => l.owner);
  const key = hasOwner ? 'owner' : 'source';

  const map = {};
  for (const l of leads) {
    const name = l[key] || 'Unknown';
    if (!map[name]) map[name] = { name, revenue: 0, deals: 0, total: 0 };
    map[name].total += 1;
    if (l.status === 'Won') {
      map[name].revenue += l.value || 0;
      map[name].deals   += 1;
    }
  }
  return Object.values(map)
    .map((p) => ({ ...p, winRate: p.total ? Math.round((p.deals / p.total) * 100) : 0 }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

// ─── Public: Velocity & Forecast ──────────────────────────────────────────────

/**
 * Sales velocity = (Opportunities × Win Rate × Avg Deal Size) / Avg Sales Cycle.
 * @param {Object[]} leads
 * @returns {{ velocity: number, opportunities: number, winRate: number, avgDeal: number, cycle: number }}
 */
export function getSalesVelocity(leads) {
  const empty = { velocity: 0, opportunities: 0, winRate: 0, avgDeal: 0, cycle: 0 };
  if (!leads?.length) return empty;

  const won  = leads.filter((l) => l.status === 'Won').length;
  const lost = leads.filter((l) => l.status === 'Lost').length;
  const opportunities = leads.filter((l) => l.status !== 'Lost').length;
  const winRate  = (won + lost) > 0 ? won / (won + lost) : 0;
  const avgDeal  = leads.reduce((s, l) => s + (l.value || 0), 0) / leads.length;
  const cycle    = Math.max(1, getAverageSalesCycle(leads));
  const velocity = Math.round((opportunities * winRate * avgDeal) / cycle);

  return {
    velocity,
    opportunities,
    winRate: Math.round(winRate * 100),
    avgDeal: Math.round(avgDeal),
    cycle,
  };
}

/**
 * Revenue forecast for next month based on a 3-month trailing average with mild trend bias.
 * @param {Object[]} leads
 * @returns {{ predicted: number, confidence: number, trend: 'up'|'down'|'stable', history: number[] }}
 */
export function getForecastRevenue(leads) {
  const rev    = getRevenueByMonth(leads);
  const values = rev.map((r) => r.revenue);
  const last3  = values.slice(-3);

  const avg3 = last3.reduce((a, b) => a + b, 0) / Math.max(1, last3.length);
  const avg6 = values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);

  // Simple growth-adjusted prediction
  const growthRate = avg6 > 0 ? (avg3 - avg6) / avg6 : 0;
  const predicted  = Math.max(0, Math.round(avg3 * (1 + growthRate * 0.5)));

  // Confidence: penalises high variance
  const variance = last3.reduce((s, v) => s + (v - avg3) ** 2, 0) / Math.max(1, last3.length);
  const cv = avg3 > 0 ? Math.sqrt(variance) / avg3 : 1;
  const confidence = Math.min(95, Math.max(30, Math.round((1 - Math.min(1, cv)) * 100)));

  const trend = avg3 > avg6 * 1.05 ? 'up' : avg3 < avg6 * 0.95 ? 'down' : 'stable';

  return { predicted, confidence, trend, history: values };
}

// ─── Public: Heatmap ──────────────────────────────────────────────────────────

/**
 * Activity heatmap data for the last 84 days (12 weeks).
 * @param {Object[]} leads
 * @returns {{ date: string, count: number, label: string }[]}
 */
export function getActivityHeatmapData(leads) {
  const DAYS = 84;
  const MS   = 86_400_000;
  const now  = new Date();
  const start = new Date(now.getTime() - DAYS * MS);

  const map = {};
  if (leads?.length) {
    for (const l of leads) {
      const d = toDate(l.createdAt || l.dateAdded);
      if (!d || d < start) continue;
      const k = d.toISOString().slice(0, 10);
      map[k] = (map[k] || 0) + 1;
    }
  }

  return Array.from({ length: DAYS }, (_, i) => {
    const d   = new Date(start.getTime() + i * MS);
    const key = d.toISOString().slice(0, 10);
    return {
      date:  key,
      count: map[key] || 0,
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
  });
}

// ─── Public: Formatting & Math ─────────────────────────────────────────────────

/**
 * Format a number as an INR currency string (e.g. ₹12,40,000).
 * @param {number} value
 * @returns {string}
 */
export const formatINR = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Compute percentage growth between current and previous period values.
 * Returns null when both are zero.
 * @param {number} current
 * @param {number} previous
 * @returns {number | null}
 */
export const calcGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
};
