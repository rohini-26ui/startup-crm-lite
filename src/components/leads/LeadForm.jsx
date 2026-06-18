import React, { useState, useEffect } from 'react';

/**
 * A form component to create a new lead or edit an existing one.
 * Includes built-in validation for required fields.
 *
 * @param {{ initialData: Object, onSubmit: function, onCancel: function }} props - Component props.
 * @returns {JSX.Element} The rendered LeadForm.
 */
const LeadForm = ({ initialData, onSubmit, onCancel }) => {
  const statusOptions = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  const sourceOptions = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.company.trim()) newErrors.company = 'Company is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const inputBase = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1" htmlFor="name">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`${inputBase} ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-gray-600'}`}
          placeholder="e.g. Jane Doe"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1" htmlFor="company">
            Company <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`${inputBase} ${errors.company ? 'border-red-500' : 'border-slate-300 dark:border-gray-600'}`}
            placeholder="e.g. Acme Corp"
          />
          {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${inputBase} ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-gray-600'}`}
            placeholder="e.g. jane@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Phone Field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1" htmlFor="phone">
          Phone Number
        </label>
        <input 
          type="tel" 
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`${inputBase} border-slate-300 dark:border-gray-600`}
          placeholder="e.g. (555) 123-4567"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1" htmlFor="status">
            Status
          </label>
          <select 
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`${inputBase} border-slate-300 dark:border-gray-600`}
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Source Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1" htmlFor="source">
            Source
          </label>
          <select 
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className={`${inputBase} border-slate-300 dark:border-gray-600`}
          >
            {sourceOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 flex space-x-3">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {initialData ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
