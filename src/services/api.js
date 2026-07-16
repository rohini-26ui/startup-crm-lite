import axios from 'axios';
import toast from 'react-hot-toast';

// Create an Axios instance with base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor to automatically add the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('crm-token');
        // We use window.location here as we can't easily use useNavigate outside a React component
        // Note: Make sure not to redirect if already on the login page to prevent redirect loops
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received (Network Error)
      toast.error('Cannot connect to server. Check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;
