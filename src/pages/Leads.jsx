import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLeads } from '../context/LeadContext';

import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';

/**
 * The Leads page component.
 * Manages the listing, search, filtering, and CRUD operations for sales leads.
 *
 * @returns {JSX.Element} The rendered Leads page.
 */
const Leads = () => {
  const { leads, addLead, updateLead, deleteLead } = useLeads();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // null: Create, Object: Edit

  // Reset all search and status filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveFilter('All');
  };

  // Derive filtered list of leads based on active filter and search query
  const filteredLeads = leads
    .filter(lead => activeFilter === 'All' || lead.status === activeFilter)
    .filter(lead =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
      // Edit Mode
      updateLead(selectedLead.id, formData);
      toast.success('Lead updated successfully!');
    } else {
      // Create Mode
      addLead(formData);
      toast.success('New lead created successfully!');
    }
    handleCloseModal();
  };

  // Handle deleting a lead
  const handleDelete = (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      deleteLead(leadId);
      toast.error('Lead deleted.', { icon: '🗑️' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
          <p className="text-slate-500 text-sm mt-1">View, search, filter, and manage all your sales prospects.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Lead
        </button>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} leads={leads} />
      </div>

      {/* Leads List or Empty State */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          isFiltered={leads.length > 0}
          onClear={handleClearFilters}
          onAddLead={handleOpenAdd}
        />
      ) : (
        <LeadTable
          leads={filteredLeads}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

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

export default Leads;
