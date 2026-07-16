import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import leadService from '../services/leadService';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

export const LeadContext = createContext(null);

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const { user } = useAuth();

  const fetchLeads = useCallback(async (params = { limit: 1000 }) => {
    setIsLoading(true);
    try {
      const data = await leadService.getLeads(params);
      if (Array.isArray(data)) {
        setLeads(data);
      } else if (data && data.leads) {
        setLeads(data.leads);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Automatically fetch leads when the user is logged in
  useEffect(() => {
    if (user) {
      fetchLeads();
    } else {
      setLeads([]); // Clear leads on logout
    }
  }, [user, fetchLeads]);

  const addLead = async (leadData) => {
    try {
      const newLead = await leadService.createLead(leadData);
      setLeads((prev) => [newLead, ...prev]);
      toast.success('Lead added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add lead');
      throw error;
    }
  };

  const updateLead = async (id, updatedFields) => {
    try {
      const updatedLead = await leadService.updateLead(id, updatedFields);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id || lead._id === id ? updatedLead : lead))
      );
      toast.success('Lead updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update lead');
      throw error;
    }
  };

  const deleteLead = async (id) => {
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((lead) => lead.id !== id && lead._id !== id));
      toast.success('Lead deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
      throw error;
    }
  };

  const getLeadById = (id) => {
    return leads.find((lead) => lead.id === id || lead._id === id);
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        isLoading,
        pagination,
        fetchLeads,
        addLead,
        updateLead,
        deleteLead,
        getLeadById,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
