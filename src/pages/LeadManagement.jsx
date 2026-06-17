import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';

/**
 * The main Lead Management page component.
 * Assembles the CRUD functionality for leads including listing, adding, editing, and deleting.
 *
 * @returns {JSX.Element} The rendered Lead Management page.
 */
const LeadManagement = () => {
  // Sample initial data
  const initialLeads = [
    { id: '1', name: 'Alice Freeman', email: 'alice@technova.com', phone: '(555) 123-4567', company: 'TechNova', status: 'New', source: 'Website', dateAdded: '2026-06-16T09:00:00Z' },
    { id: '2', name: 'Bob Smith', email: 'bob@buildright.inc', phone: '(555) 987-6543', company: 'BuildRight Inc.', status: 'Contacted', source: 'Referral', dateAdded: '2026-06-15T14:30:00Z' },
    { id: '3', name: 'Charlie Davis', email: 'charlie@nextgen.co', phone: '', company: 'NextGen Solutions', status: 'Meeting Scheduled', source: 'LinkedIn', dateAdded: '2026-06-14T10:15:00Z' },
  ];

  // State Management
  const [leads, setLeads] = useState(initialLeads);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // null means "Create mode", object means "Edit mode"

  // Open modal for creating a new lead
  const handleOpenAdd = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing lead
  const handleOpenEdit = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  // Handle form submission (Create or Update)
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // Edit mode
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, ...formData } : l));
      toast.success('Lead updated successfully!');
    } else {
      // Create mode
      const newLead = {
        ...formData,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
      };
      setLeads(prev => [newLead, ...prev]);
      toast.success('New lead created successfully!');
    }
    handleCloseModal();
  };

  // Handle deleting a lead
  const handleDelete = (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      toast.error('Lead deleted.', { icon: '🗑️' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lead Management</h1>
          <p className="text-slate-500 text-sm mt-1">View, track, and manage all your sales prospects.</p>
        </div>
        
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Lead
        </button>
      </div>

      {/* Leads Table / Grid Component */}
      <LeadTable 
        leads={leads} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
      />

      {/* Add / Edit Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 relative">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-slate-200 rounded-t-xl z-10">
              <h2 className="text-xl font-semibold text-slate-800">
                {selectedLead ? 'Edit Lead' : 'Create New Lead'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body: Lead Form */}
            <div className="p-6">
              <LeadForm 
                initialData={selectedLead} 
                onSubmit={handleFormSubmit} 
                onCancel={handleCloseModal} 
              />
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManagement;
