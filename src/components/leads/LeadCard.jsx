import React from 'react';
import { Pencil, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * @typedef {Object} LeadCardProps
 * @property {Object} lead - The lead object.
 * @property {function} onEdit - Callback to edit the lead.
 * @property {function} onDelete - Callback to delete the lead.
 */

/**
 * A card view representing a single lead, primarily used on mobile or grid layouts.
 *
 * @param {LeadCardProps} props - Component props.
 * @returns {JSX.Element} The rendered LeadCard.
 */
const LeadCard = ({ lead, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full transition-shadow hover:shadow-md">
      {/* Header: Name and Actions */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">{lead.name}</h3>
          <div className="flex items-center text-slate-500 text-sm mt-1">
            <Building2 className="w-4 h-4 mr-1.5" />
            <span>{lead.company}</span>
          </div>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(lead)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            aria-label={`Edit ${lead.name}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(lead.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
      <div className="mt-auto space-y-2 pt-4 border-t border-slate-100">
        <div className="flex items-center text-sm text-slate-600">
          <Mail className="w-4 h-4 mr-2 text-slate-400" />
          <span className="truncate">{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center text-sm text-slate-600">
            <Phone className="w-4 h-4 mr-2 text-slate-400" />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>
      
      {/* Footer: Meta Info */}
      <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
        <span>Source: {lead.source}</span>
        <span>{new Date(lead.dateAdded).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default LeadCard;
