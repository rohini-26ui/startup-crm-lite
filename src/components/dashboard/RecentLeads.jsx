import React from 'react';

/**
 * @typedef {Object} Lead
 * @property {string} id - The unique identifier for the lead.
 * @property {string} name - The lead's full name.
 * @property {string} company - The lead's company name.
 * @property {string} status - The current status of the lead.
 * @property {string} dateAdded - The date the lead was added.
 */

/**
 * @typedef {Object} RecentLeadsProps
 * @property {Lead[]} leads - An array of lead objects.
 */

/**
 * A component displaying a table of the 5 most recent leads.
 *
 * @param {RecentLeadsProps} props - The component props.
 * @returns {JSX.Element} The rendered RecentLeads component.
 */
const RecentLeads = ({ leads }) => {
  // Sort leads by date descending (assuming dateAdded is a valid date string) and take top 5
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 5);

  // Helper function to render the appropriate status badge
  const renderStatusBadge = (status) => {
    let baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'New':
        return <span className={`${baseClasses} bg-blue-100 text-blue-700`}>{status}</span>;
      case 'Contacted':
        return <span className={`${baseClasses} bg-amber-100 text-amber-700`}>{status}</span>;
      case 'Negotiation':
        return <span className={`${baseClasses} bg-purple-100 text-purple-700`}>{status}</span>;
      case 'Closed':
        return <span className={`${baseClasses} bg-green-100 text-green-700`}>{status}</span>;
      case 'Lost':
        return <span className={`${baseClasses} bg-red-100 text-red-700`}>{status}</span>;
      default:
        return <span className={`${baseClasses} bg-slate-100 text-slate-700`}>{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800">Recent Leads</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm">
              <th className="px-6 py-3 font-medium border-b border-slate-200">Name</th>
              <th className="px-6 py-3 font-medium border-b border-slate-200">Email</th>
              <th className="px-6 py-3 font-medium border-b border-slate-200">Company</th>
              <th className="px-6 py-3 font-medium border-b border-slate-200">Deal Value</th>
              <th className="px-6 py-3 font-medium border-b border-slate-200">Status</th>
              <th className="px-6 py-3 font-medium border-b border-slate-200">Date Added</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{lead.name}</td>
                  <td className="px-6 py-4 text-slate-500">{lead.email}</td>
                  <td className="px-6 py-4">{lead.company}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {lead.value ? `$${lead.value.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4">{renderStatusBadge(lead.status)}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(lead.dateAdded).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
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
