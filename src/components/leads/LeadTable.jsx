import React, { useState } from 'react';
import { LayoutGrid, List as ListIcon, Pencil, Trash2, Mail, Phone } from 'lucide-react';
import StatusBadge from './StatusBadge';
import LeadCard from './LeadCard';

/**
 * A component that renders either a data table (desktop) or a grid of cards (mobile) 
 * to display all leads, with a manual view toggle.
 *
 * @param {{ leads: Array, onEdit: function, onDelete: function }} props - Component props.
 * @returns {JSX.Element} The rendered LeadTable component.
 */
const LeadTable = ({ leads, onEdit, onDelete }) => {
  const [viewMode, setViewMode] = useState('table');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
      
      {/* View Toggle Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 flex justify-between items-center bg-slate-50 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          All Leads ({leads.length})
        </h3>
        
        {/* Toggle Controls */}
        <div className="hidden sm:flex bg-white dark:bg-gray-700 rounded-lg border border-slate-200 dark:border-gray-600 p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md flex items-center transition-colors ${
              viewMode === 'table' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
            }`}
            aria-label="Table View"
          >
            <ListIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md flex items-center transition-colors ml-1 ${
              viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
            }`}
            aria-label="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leads Content Area */}
      {leads.length === 0 ? (
        <div className="p-12 text-center text-slate-500 dark:text-gray-400">
          No leads found. Add a new lead to get started.
        </div>
      ) : (
        <>
          {/* Mobile: Force grid */}
          <div className={`sm:hidden p-4 grid grid-cols-1 gap-4`}>
             {leads.map(lead => (
               <LeadCard key={lead.id} lead={lead} onEdit={onEdit} onDelete={onDelete} />
             ))}
          </div>

          <div className={`hidden sm:block ${viewMode === 'grid' ? 'p-6' : ''}`}>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {leads.map(lead => (
                  <LeadCard key={lead.id} lead={lead} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 text-sm font-medium">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Date Added</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-700 text-sm text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors group">
                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{lead.name}</td>
                        <td className="px-6 py-4">{lead.company}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <span className="flex items-center"><Mail className="w-3 h-3 mr-1 text-slate-400 dark:text-gray-500"/> {lead.email}</span>
                            {lead.phone && <span className="flex items-center text-xs text-slate-500 dark:text-gray-400"><Phone className="w-3 h-3 mr-1 text-slate-400 dark:text-gray-500"/> {lead.phone}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-gray-400">{lead.source}</td>
                        <td className="px-6 py-4 text-slate-500 dark:text-gray-400">
                          {new Date(lead.dateAdded).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => onEdit(lead)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                              title="Edit Lead"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => onDelete(lead.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LeadTable;
