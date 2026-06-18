import React, { memo, useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';

const RANGES = [
  { value: '7d',    label: 'Last 7 Days'  },
  { value: '30d',   label: 'Last 30 Days' },
  { value: '90d',   label: 'Last 90 Days' },
  { value: 'year',  label: 'This Year'    },
  { value: 'all',   label: 'All Time'     },
  { value: 'custom', label: 'Custom Range' },
];

/**
 * Date-range filter pill row for the Analytics Dashboard.
 */
const AnalyticsFilters = memo(({ dateRange, onDateRangeChange, customRange, onCustomRangeChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeLabel = RANGES.find((r) => r.value === dateRange)?.label ?? 'Last 30 Days';

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
      {/* Date input picker for custom range */}
      {dateRange === 'custom' && onCustomRangeChange && (
        <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-100 dark:bg-gray-800 p-1.5 rounded-xl border border-slate-200 dark:border-gray-700 animate-in fade-in slide-in-from-right-4 duration-300 w-full sm:w-auto">
          <input
            type="date"
            value={customRange?.start || ''}
            onChange={(e) => onCustomRangeChange({ ...customRange, start: e.target.value })}
            className="px-2 py-2 sm:py-1 text-xs font-semibold bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 w-full sm:w-auto min-h-[44px] sm:min-h-[auto]"
          />
          <span className="text-slate-400 dark:text-gray-500 text-xs font-bold py-1 sm:py-0">to</span>
          <input
            type="date"
            value={customRange?.end || ''}
            onChange={(e) => onCustomRangeChange({ ...customRange, end: e.target.value })}
            className="px-2 py-2 sm:py-1 text-xs font-semibold bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 w-full sm:w-auto min-h-[44px] sm:min-h-[auto]"
          />
        </div>
      )}

      {/* Desktop pill row */}
      <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-gray-800 p-1 rounded-xl">
        <CalendarDays className="w-4 h-4 text-slate-400 dark:text-gray-500 ml-2 mr-1 shrink-0" />
        {RANGES.map((r) => (
          <button
            key={r.value}
            id={`analytics-filter-${r.value}`}
            onClick={() => onDateRangeChange(r.value)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              dateRange === r.value
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/60'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Mobile dropdown */}
      <div className="relative sm:hidden w-full min-w-[160px]">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 shadow-sm w-full min-h-[44px]"
        >
          <CalendarDays className="w-4 h-4 text-slate-400 dark:text-gray-500" />
          <span className="flex-1 text-left">{activeLabel}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-gray-500 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
        </button>
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => { onDateRangeChange(r.value); setMobileOpen(false); }}
                className={`w-full text-left px-4 py-3 min-h-[44px] text-sm transition-colors ${
                  dateRange === r.value
                    ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

AnalyticsFilters.displayName = 'AnalyticsFilters';
export default AnalyticsFilters;

