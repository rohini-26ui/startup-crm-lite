/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

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

// Initial mock data to seed the application if localStorage is empty
const defaultLeads = [
  {
    id: '1',
    name: 'Alice Freeman',
    company: 'TechNova',
    email: 'alice@technova.com',
    phone: '(555) 123-4567',
    status: 'New',
    source: 'Website',
    createdAt: '2026-06-16T09:00:00Z',
    dateAdded: '2026-06-16T09:00:00Z',
    value: 15000,
  },
  {
    id: '2',
    name: 'Bob Smith',
    company: 'BuildRight Inc.',
    email: 'bob@buildright.inc',
    phone: '(555) 987-6543',
    status: 'Contacted',
    source: 'Referral',
    createdAt: '2026-06-15T14:30:00Z',
    dateAdded: '2026-06-15T14:30:00Z',
    value: 45000,
  },
  {
    id: '3',
    name: 'Charlie Davis',
    company: 'NextGen Solutions',
    email: 'charlie@nextgen.co',
    phone: '',
    status: 'Meeting Scheduled',
    source: 'LinkedIn',
    createdAt: '2026-06-14T10:15:00Z',
    dateAdded: '2026-06-14T10:15:00Z',
    value: 120000,
  },
  {
    id: '4',
    name: 'Diana Prince',
    company: 'Themyscira Corp',
    email: 'diana@themyscira.corp',
    phone: '(555) 300-1941',
    status: 'Won',
    source: 'Referral',
    createdAt: '2026-06-13T16:45:00Z',
    dateAdded: '2026-06-13T16:45:00Z',
    value: 85000,
  },
  {
    id: '5',
    name: 'Evan Wright',
    company: 'Wright & Co.',
    email: 'evan@wright.co',
    phone: '(555) 111-2222',
    status: 'Lost',
    source: 'Cold Call',
    createdAt: '2026-06-12T11:20:00Z',
    dateAdded: '2026-06-12T11:20:00Z',
    value: 12000,
  },
  {
    id: '6',
    name: 'Fiona Gallagher',
    company: 'Shameless Inc.',
    email: 'fiona@shameless.inc',
    phone: '(555) 999-8888',
    status: 'New',
    source: 'Email Campaign',
    createdAt: '2026-06-11T08:00:00Z',
    dateAdded: '2026-06-11T08:00:00Z',
    value: 25000,
  }
];

export const LeadContext = createContext(null);

/**
 * LeadProvider component wraps the React app and exposes leads data and state modifiers.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped.
 * @returns {JSX.Element} The rendered Provider wrapper.
 */
export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState(() => {
    try {
      const stored = localStorage.getItem('leads');
      return stored ? JSON.parse(stored) : defaultLeads;
    } catch (error) {
      console.error('Failed to parse leads from localStorage:', error);
      return defaultLeads;
    }
  });

  // Sync leads list to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('leads', JSON.stringify(leads));
    } catch (error) {
      console.error('Failed to save leads to localStorage:', error);
    }
  }, [leads]);

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
