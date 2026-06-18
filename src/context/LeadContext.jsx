/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import sampleLeads from '../data/sampleLeads';

/**
 * TypeScript-style definition of a Lead object.
 * 
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier for the lead.
 * @property {string} name - Full name of the contact.
 * @property {string} company - Company name.
 * @property {string} email - Email address.
 * @property {string} phone - Phone number.
 * @property {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} status - Pipeline status.
 * @property {'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'} source - Acquisition source.
 * @property {string} createdAt - ISO format date/time when created.
 * @property {string} dateAdded - ISO format date/time when created (for backward compatibility).
 * @property {number} [value] - Optional estimated deal value.
 */

export const LeadContext = createContext(null);

/**
 * LeadProvider component wraps the React app and exposes leads data and state modifiers.
 * Leads are persisted to localStorage under the key 'startup-crm-leads' so they
 * survive page refreshes and browser restarts. On first visit, sampleLeads is
 * used as the seed data.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped.
 * @returns {JSX.Element} The rendered Provider wrapper.
 */
export const LeadProvider = ({ children }) => {
  // useLocalStorage mirrors the useState API exactly:
  //   - On first render: reads 'startup-crm-leads' from localStorage.
  //   - If the key is absent (first visit), falls back to sampleLeads.
  //   - Every setLeads call automatically writes the new array to localStorage.
  const [leads, setLeads] = useLocalStorage('startup-crm-leads', sampleLeads);

  /**
   * Adds a new lead to the CRM.
   * Generates a unique ID and ISO date timestamps automatically.
   * 
   * @param {Omit<Lead, 'id' | 'createdAt' | 'dateAdded'>} leadData - The lead form data.
   * @returns {void}
   */
  const addLead = (leadData) => {
    const timestamp = new Date().toISOString();
    const newLead = {
      ...leadData,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: timestamp,
      dateAdded: timestamp, // Backward compatibility
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  /**
   * Updates an existing lead by its unique ID.
   * 
   * @param {string} id - The ID of the lead to update.
   * @param {Partial<Lead>} updatedFields - The fields to update.
   * @returns {void}
   */
  const updateLead = (id, updatedFields) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updatedFields } : lead))
    );
  };

  /**
   * Deletes a lead from the CRM.
   * 
   * @param {string} id - The ID of the lead to delete.
   * @returns {void}
   */
  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  /**
   * Retrieves a specific lead by its ID.
   * 
   * @param {string} id - The unique ID of the lead.
   * @returns {Lead | undefined} The matching lead or undefined.
   */
  const getLeadById = (id) => {
    return leads.find((lead) => lead.id === id);
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
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

/**
 * Custom React hook to consume the LeadContext.
 * 
 * @returns {{
 *   leads: Lead[],
 *   addLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'dateAdded'>) => void,
 *   updateLead: (id: string, updatedFields: Partial<Lead>) => void,
 *   deleteLead: (id: string) => void,
 *   getLeadById: (id: string) => Lead | undefined
 * }} The lead context value.
 * @throws {Error} If consumed outside of a LeadProvider.
 */
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
