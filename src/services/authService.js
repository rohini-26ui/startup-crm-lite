import api from './api';

const authService = {
  /**
   * Register a new user
   * @param {string} name 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Response data
   */
  register: async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  /**
   * Login an existing user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Response data
   */
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  /**
   * Logout user (stateless server, so just clear local storage)
   */
  logout: () => {
    localStorage.removeItem('crm-token');
  },

  /**
   * Get the current user's profile
   * @returns {Promise<Object>} Response data
   */
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  /**
   * Update the user's profile
   * @param {Object} data 
   * @returns {Promise<Object>} Response data
   */
  updateProfile: async (data) => {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  }
};

export default authService;
