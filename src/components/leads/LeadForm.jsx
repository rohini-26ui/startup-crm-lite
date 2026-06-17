import React, { useState, useEffect } from 'react';

/**
 * @typedef {Object} LeadFormProps
 * @property {Object} [initialData] - Existing lead data for editing mode.
 * @property {function} onSubmit - Callback fired when form is successfully validated and submitted.
 * @property {function} onCancel - Callback to close or cancel the form.
 */

/**
 * A form component to create a new lead or edit an existing one.
 * Includes built-in validation for required fields.
 *
 * @param {LeadFormProps} props - Component props.
 * @returns {JSX.Element} The rendered LeadForm.
 */
const LeadForm = ({ initialData, onSubmit, onCancel }) => {
  // Define available options
  const statusOptions = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  const sourceOptions = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
  });

  // Error state for validation
  const [errors, setErrors] = useState({});

  // Populate form if we have initialData (Edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Handle generic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field as the user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate and submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate required fields
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.company.trim()) newErrors.company = 'Company is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // If we have errors, block submission and update state
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If valid, pass data back up
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
          placeholder="e.g. Jane Doe"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="company">
            Company <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.company ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="e.g. Acme Corp"
          />
          {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="e.g. jane@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Phone Field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="phone">
          Phone Number
        </label>
        <input 
          type="tel" 
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. (555) 123-4567"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="status">
            Status
          </label>
          <select 
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Source Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="source">
            Source
          </label>
          <select 
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
          className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
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
