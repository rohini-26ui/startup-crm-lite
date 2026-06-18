import React from 'react';

/**
 * @typedef {Object} LeadStatus
 * @property {string} status - The status of the lead (e.g., 'New', 'Contacted').
 */

/**
 * @typedef {Object} PipelineOverviewProps
 * @property {LeadStatus[]} leads - An array of lead objects containing at least a status property.
 * @property {number} [target] - Optional target number of leads for the pipeline.
 */

/**
 * A component that visualizes the current pipeline stages using a segmented horizontal bar.
 * It also displays progress towards a pipeline target if provided.
 *
 * @param {PipelineOverviewProps} props - The component props.
 * @returns {JSX.Element} The rendered PipelineOverview component.
 */
const PipelineOverview = ({ leads, target }) => {
  const totalLeads = leads.length;

  // Calculate the counts for each status
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  // Define the stages, their labels, and corresponding Tailwind colors
  const stages = [
    { key: 'New', label: 'New', color: 'bg-blue-600' },
    { key: 'Contacted', label: 'Contacted', color: 'bg-amber-500' },
    { key: 'Meeting Scheduled', label: 'Meeting', color: 'bg-purple-500' },
    { key: 'Proposal Sent', label: 'Proposal', color: 'bg-indigo-500' },
    { key: 'Won', label: 'Won', color: 'bg-green-500' },
    { key: 'Lost', label: 'Lost', color: 'bg-red-500' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Pipeline Overview</h3>
        {target && (
          <div className="text-sm font-medium text-slate-500">
            Target: <span className="text-slate-800 font-bold">{totalLeads} / {target}</span> Leads
          </div>
        )}
      </div>
      
      {/* Target Progress Bar (Optional) */}
      {target && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Progress to Target</span>
            <span>{Math.round((totalLeads / target) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: `${Math.min((totalLeads / target) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Segmented Bar for Current Statuses */}
      <h4 className="text-sm font-medium text-slate-600 mb-2">Stage Breakdown</h4>
      <div className="flex h-4 rounded-full overflow-hidden mb-6">
        {totalLeads === 0 ? (
          <div className="w-full bg-slate-100" />
        ) : (
          stages.map((stage) => {
            const count = statusCounts[stage.key] || 0;
            const percentage = (count / totalLeads) * 100;
            if (percentage === 0) return null;
            return (
              <div 
                key={stage.key} 
                className={`${stage.color} transition-all duration-300`} 
                style={{ width: `${percentage}%` }}
                title={`${stage.label}: ${count}`}
              />
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-auto">
        {stages.map((stage) => {
          const count = statusCounts[stage.key] || 0;
          return (
            <div key={stage.key} className="flex flex-col items-start">
              <div className="flex items-center mb-1">
                <span className={`w-3 h-3 rounded-full mr-2 ${stage.color}`}></span>
                <span className="text-sm font-medium text-slate-600 whitespace-nowrap">{stage.label}</span>
              </div>
              <span className="text-xl font-bold text-slate-800 ml-5">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineOverview;
