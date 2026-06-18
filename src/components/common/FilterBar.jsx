import React from 'react';

/**
 * FilterBar renders a list of clickable filter buttons for different lead statuses.
 *
 * @param {{ activeFilter: string, onFilterChange: function, leads: Array }} props
 * @returns {JSX.Element} The rendered FilterBar component.
 */
const FilterBar = ({ activeFilter, onFilterChange, leads = [] }) => {
  const filters = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mb-2 scrollbar-none scroll-smooth">
      {filters.map((filter) => {
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
                : 'bg-white dark:bg-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600 text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-gray-600 font-medium'
            }`}
          >
            {filter}
            <span className={`ml-1.5 text-xs ${isActive ? 'text-blue-100 font-normal' : 'text-slate-400 dark:text-gray-400 font-normal'}`}>
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
