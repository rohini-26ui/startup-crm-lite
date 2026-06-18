import React from 'react';
import { Pencil, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * A card view representing a single lead, primarily used on mobile or grid layouts.
 *
 * @param {{ lead: Object, onEdit: function, onDelete: function }} props - Component props.
 * @returns {JSX.Element} The rendered LeadCard.
 */
const LeadCard = ({ lead, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 flex flex-col h-full transition-shadow hover:shadow-md transition-colors duration-200">
      {/* Header: Name and Actions */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{lead.name}</h3>
          <div className="flex items-center text-slate-500 dark:text-gray-400 text-sm mt-1">
            <Building2 className="w-4 h-4 mr-1.5" />
            <span>{lead.company}</span>
          </div>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(lead)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
            aria-label={`Edit ${lead.name}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(lead.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
            aria-label={`Delete ${lead.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle: Status Badge */}
      <div className="mb-4">
        <StatusBadge status={lead.status} />
      </div>

      {/* Footer: Contact Info */}
      <div className="mt-auto space-y-2 pt-4 border-t border-slate-100 dark:border-gray-700">
        <div className="flex items-center text-sm text-slate-600 dark:text-gray-300">
          <Mail className="w-4 h-4 mr-2 text-slate-400 dark:text-gray-500" />
          <span className="truncate">{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center text-sm text-slate-600 dark:text-gray-300">
            <Phone className="w-4 h-4 mr-2 text-slate-400 dark:text-gray-500" />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>
      
      {/* Footer: Meta Info */}
      <div className="mt-4 flex justify-between items-center text-xs text-slate-400 dark:text-gray-500">
        <span>Source: {lead.source}</span>
        <span>{new Date(lead.dateAdded).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default LeadCard;
