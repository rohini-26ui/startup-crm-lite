import React from 'react';
import { PlusCircle, List, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * @typedef {Object} QuickActionsProps
 * @property {function} onOpenAddLead - Callback to open the add lead modal
 * @property {function} onExport - Callback to handle data export
 */

/**
 * A component displaying quick action buttons for common CRM tasks.
 *
 * @param {QuickActionsProps} props - Component props
 * @returns {JSX.Element} The rendered QuickActions component.
 */
const QuickActions = ({ onOpenAddLead, onExport }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
      <div className="flex flex-col space-y-3">
        <button 
          onClick={onOpenAddLead}
          className="flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          type="button"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Lead
        </button>
        <button 
          onClick={() => navigate('/leads')}
          className="flex items-center justify-center w-full px-4 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium shadow-sm"
          type="button"
        >
          <List className="w-5 h-5 mr-2" />
          View All Leads
        </button>
        <button 
          onClick={onExport}
          className="flex items-center justify-center w-full px-4 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium shadow-sm"
          type="button"
        >
          <Download className="w-5 h-5 mr-2" />
          Export Data
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
