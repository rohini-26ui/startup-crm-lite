import React from 'react';
import { SearchX, Inbox, RefreshCw, Plus } from 'lucide-react';

/**
 * EmptyState displays a friendly message when no items match criteria or when no data is available.
 *
 * @param {{ isFiltered: boolean, onClear: function, onAddLead: function }} props
 * @returns {JSX.Element} The rendered EmptyState component.
 */
const EmptyState = ({ isFiltered, onClear, onAddLead }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm text-center animate-fade-in transition-colors duration-200">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-gray-700 text-slate-400 mb-4 border border-slate-100 dark:border-gray-600">
        {isFiltered ? (
          <SearchX className="w-8 h-8 text-blue-500 animate-pulse" />
        ) : (
          <Inbox className="w-8 h-8 text-slate-300 dark:text-gray-500" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
        {isFiltered ? 'No leads found' : 'No leads available'}
      </h3>

      <p className="text-sm text-slate-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
        {isFiltered
          ? "We couldn't find any leads matching your current search terms or active status filter. Try clearing or modifying your criteria."
          : "Get started by adding your very first sales prospect to the system."}
      </p>

      {isFiltered ? (
        onClear && (
          <button
            onClick={onClear}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-600 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4 mr-2 text-slate-400 dark:text-gray-400" />
            Clear filters
          </button>
        )
      ) : (
        onAddLead && (
          <button
            onClick={onAddLead}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Lead
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
