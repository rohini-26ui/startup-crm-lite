import React from 'react';
import { SearchX, Inbox, RefreshCw, Plus } from 'lucide-react';

/**
 * EmptyState displays a friendly message when no items match criteria or when no data is available.
 *
 * @param {Object} props
 * @param {boolean} props.isFiltered - True if search or filter is active, false if there are zero leads total.
 * @param {function} props.onClear - Callback to reset all filters.
 * @param {function} props.onAddLead - Callback to trigger the creation of a new lead.
 * @returns {JSX.Element} The rendered EmptyState component.
 */
const EmptyState = ({ isFiltered, onClear, onAddLead }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm text-center animate-fade-in">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4 border border-slate-100">
        {isFiltered ? (
          <SearchX className="w-8 h-8 text-blue-500 animate-pulse" />
        ) : (
          <Inbox className="w-8 h-8 text-slate-300" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        {isFiltered ? 'No leads found' : 'No leads available'}
      </h3>

      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {isFiltered
          ? "We couldn't find any leads matching your current search terms or active status filter. Try clearing or modifying your criteria."
          : "Get started by adding your very first sales prospect to the system."}
      </p>

      {isFiltered ? (
        onClear && (
          <button
            onClick={onClear}
            className="inline-flex items-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4 mr-2 text-slate-400" />
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
