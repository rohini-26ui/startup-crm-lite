import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * A modal component for adding a new lead.
 *
 * @param {{ isOpen: boolean, onClose: function, onAdd: function }} props - Component props
 * @returns {JSX.Element|null} The modal or null if not open
 */
const AddLeadModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    value: '',
    status: 'New',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.email) return;

    const newLeadData = {
      name: formData.name,
      email: formData.email,
      company: formData.company,
      value: Number(formData.value) || 0,
      status: formData.status,
      source: 'Other',
      phone: ''
    };

    onAdd(newLeadData);
    setFormData({ name: '', email: '', company: '', value: '', status: 'New' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex md:items-center justify-center bg-white/40 dark:bg-gray-900/60 backdrop-blur-sm md:p-4">
      <div className="bg-white dark:bg-gray-800 md:rounded-xl shadow-2xl border-0 md:border border-slate-200 dark:border-gray-700 w-full h-full md:h-auto max-w-none md:max-w-lg overflow-y-auto transition-colors duration-200 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 shrink-0">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Add New Lead</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1" htmlFor="name">
              Full Name
            </label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 transition-colors"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1" htmlFor="email">
              Email Address
            </label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 transition-colors"
              placeholder="e.g. jane@example.com"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1" htmlFor="company">
                Company
              </label>
              <input 
                type="text" 
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 transition-colors"
                placeholder="e.g. Acme Corp"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1" htmlFor="value">
                Deal Value ($)
              </label>
              <input 
                type="number" 
                id="value"
                name="value"
                value={formData.value}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 transition-colors"
                placeholder="e.g. 5000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1" htmlFor="status">
              Status
            </label>
            <select 
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-slate-800 dark:text-white transition-colors"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Meeting Scheduled">Meeting Scheduled</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          
          <div className="pt-4 flex space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
