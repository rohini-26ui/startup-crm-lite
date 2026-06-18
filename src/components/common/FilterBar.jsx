import React from 'react';

/**
 * FilterBar renders a list of clickable filter buttons for different lead statuses.
 * It shows the count of leads for each filter category and highlights the active filter.
 *
 * @param {Object} props
 * @param {string} props.activeFilter - The current active filter status.
 * @param {function} props.onFilterChange - Callback when a filter button is clicked.
 * @param {Array} props.leads - The raw array of leads used to calculate counts.
 * @returns {JSX.Element} The rendered FilterBar component.
 */
const FilterBar = ({ activeFilter, onFilterChange, leads = [] }) => {
  const filters = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mb-2 scrollbar-none scroll-smooth">
      {filters.map((filter) => {
        // Calculate the count of leads matching the filter
        const count = filter === 'All'
          ? leads.length
          : leads.filter(lead => lead.status === filter).length;
        
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ease-in-out whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md font-semibold transform scale-102'
                : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border border-slate-200 font-medium'
            }`}
          >
            {filter}
            <span className={`ml-1.5 text-xs ${isActive ? 'text-blue-100 font-normal' : 'text-slate-400 font-normal'}`}>
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
