import React, { useState } from 'react';
import { LayoutGrid, List as ListIcon, Pencil, Trash2, Mail, Phone } from 'lucide-react';
import StatusBadge from './StatusBadge';
import LeadCard from './LeadCard';

/**
 * @typedef {Object} LeadTableProps
 * @property {Array} leads - The array of leads to display.
 * @property {function} onEdit - Callback when the user clicks edit on a lead.
 * @property {function} onDelete - Callback when the user clicks delete on a lead.
 */

/**
 * A component that renders either a data table (desktop) or a grid of cards (mobile) 
 * to display all leads, with a manual view toggle.
 *
 * @param {LeadTableProps} props - Component props.
 * @returns {JSX.Element} The rendered LeadTable component.
 */
const LeadTable = ({ leads, onEdit, onDelete }) => {
  // Allow user to manually toggle the view, default to table
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* View Toggle Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-800">
          All Leads ({leads.length})
        </h3>
        
        {/* Toggle Controls */}
        <div className="hidden sm:flex bg-white rounded-lg border border-slate-200 p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md flex items-center transition-colors ${
              viewMode === 'table' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-label="Table View"
          >
            <ListIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md flex items-center transition-colors ml-1 ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-label="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leads Content Area */}
      {leads.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          No leads found. Add a new lead to get started.
        </div>
      ) : (
        <>
          {/* Responsive Layout: Force grid on mobile, respect viewMode on sm and above */}
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
                    <tr className="bg-white border-b border-slate-200 text-slate-500 text-sm font-medium">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Date Added</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 font-medium text-slate-800">{lead.name}</td>
                        <td className="px-6 py-4">{lead.company}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <span className="flex items-center"><Mail className="w-3 h-3 mr-1 text-slate-400"/> {lead.email}</span>
                            {lead.phone && <span className="flex items-center text-xs text-slate-500"><Phone className="w-3 h-3 mr-1 text-slate-400"/> {lead.phone}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{lead.source}</td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(lead.dateAdded).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => onEdit(lead)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit Lead"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => onDelete(lead.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
