import React from 'react';
import StatusBadge from '../leads/StatusBadge';

/**
 * A component displaying a table of the 5 most recent leads.
 *
 * @param {{ leads: Array }} props - The component props.
 * @returns {JSX.Element} The rendered RecentLeads component.
 */
const RecentLeads = ({ leads }) => {
  // Sort leads by date descending and take top 5
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Leads</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-gray-700/50 text-slate-500 dark:text-gray-400 text-sm">
              <th className="px-6 py-3 font-medium border-b border-slate-200 dark:border-gray-700">Name</th>
              <th className="px-6 py-3 font-medium border-b border-slate-200 dark:border-gray-700">Email</th>
              <th className="px-6 py-3 font-medium border-b border-slate-200 dark:border-gray-700">Company</th>
              <th className="px-6 py-3 font-medium border-b border-slate-200 dark:border-gray-700">Deal Value</th>
              <th className="px-6 py-3 font-medium border-b border-slate-200 dark:border-gray-700">Status</th>
              <th className="px-6 py-3 font-medium border-b border-slate-200 dark:border-gray-700">Date Added</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 dark:text-gray-300 divide-y divide-slate-100 dark:divide-gray-700">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{lead.name}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-gray-400">{lead.email}</td>
                  <td className="px-6 py-4">{lead.company}</td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-gray-300">
                    {lead.value ? `$${lead.value.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={lead.status} /></td>
                  <td className="px-6 py-4 text-slate-500 dark:text-gray-400">
                    {new Date(lead.dateAdded).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-gray-400">
                  No recent leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeads;
