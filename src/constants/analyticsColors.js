/**
 * @file analyticsColors.js
 * @description Centralised colour tokens for every analytics chart and visualisation.
 * Changing a value here updates every component that imports from this module.
 */

/** Lead pipeline status → hex colour mapping used by recharts Cell & custom UI. */
export const STATUS_COLORS = {
  New: '#94A3B8',
  Contacted: '#2563EB',
  'Meeting Scheduled': '#F59E0B',
  'Proposal Sent': '#7C3AED',
  Won: '#22C55E',
  Lost: '#EF4444',
};

/** Ordered array version of STATUS_COLORS for recharts index-based Cell colouring. */
export const STATUS_COLOR_ARRAY = Object.values(STATUS_COLORS);

/** Funnel stage colours (matches STAGES order in analyticsHelpers). */
export const FUNNEL_COLORS = [
  '#94A3B8', // New
  '#2563EB', // Contacted
  '#F59E0B', // Meeting Scheduled
  '#7C3AED', // Proposal Sent
  '#22C55E', // Won
];

/** Lead acquisition source colour palette (rotates for unknown sources). */
export const SOURCE_COLORS = [
  '#2563EB',
  '#7C3AED',
  '#F59E0B',
  '#22C55E',
  '#EF4444',
  '#06B6D4',
  '#F97316',
  '#EC4899',
];

/**
 * Heat-intensity scale for the activity heatmap (index 0 = no activity).
 * Index is clamped to 5 for 5+ events per day.
 */
export const HEAT_COLORS = [
  '#F1F5F9', // 0 – none
  '#BFDBFE', // 1 – very low
  '#93C5FD', // 2 – low
  '#60A5FA', // 3 – medium
  '#3B82F6', // 4 – high
  '#1D4ED8', // 5+ – very high
];

/** Named semantic colour tokens used across charts. */
export const CHART_COLORS = {
  primary: '#2563EB',
  success: '#22C55E',
  warning: '#F59E0B',
  danger:  '#EF4444',
  purple:  '#7C3AED',
  cyan:    '#06B6D4',
  orange:  '#F97316',
  slate:   '#94A3B8',
  indigo:  '#6366F1',
};
