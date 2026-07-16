import api from './api';

const leadService = {
  /**
   * Fetch leads with optional pagination and filters
   * @param {Object} params - e.g., { status: 'New', search: 'John', page: 1 }
   * @returns {Promise<Object>} Response data
   */
  getLeads: async (params) => {
    const response = await api.get('/api/leads', { params });
    // The backend paginatedResponse returns { data: [...], pagination: {...} }
    // LeadContext expects { leads: [...], pagination: {...} }
    return {
      leads: response.data.data,
      pagination: response.data.pagination
    };
  },

  /**
   * Create a new lead
   * @param {Object} leadData 
   * @returns {Promise<Object>} Response data
   */
  createLead: async (leadData) => {
    const response = await api.post('/api/leads', leadData);
    // Backend returns { success: true, data: {lead} }
    return response.data.data;
  },

  /**
   * Update an existing lead
   * @param {string} id 
   * @param {Object} leadData 
   * @returns {Promise<Object>} Response data
   */
  updateLead: async (id, leadData) => {
    const response = await api.put(`/api/leads/${id}`, leadData);
    return response.data.data;
  },

  /**
   * Update the status of a lead
   * @param {string} id 
   * @param {string} status 
   * @returns {Promise<Object>} Response data
   */
  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/api/leads/${id}/status`, { status });
    return response.data.data;
  },

  /**
   * Delete a lead
   * @param {string} id 
   * @returns {Promise<Object>} Response data
   */
  deleteLead: async (id) => {
    const response = await api.delete(`/api/leads/${id}`);
    return response.data;
  },

  /**
   * Get summary stats for leads
   * @returns {Promise<Object>} Response data
   */
  getLeadStats: async () => {
    const response = await api.get('/api/leads/stats/summary');
    return response.data;
  },

  /**
   * Get monthly stats for leads
   * @returns {Promise<Object>} Response data
   */
  getMonthlyStats: async () => {
    const response = await api.get('/api/leads/stats/monthly');
    return response.data;
  }
};

export default leadService;
