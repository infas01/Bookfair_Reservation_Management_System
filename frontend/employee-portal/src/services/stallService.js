import axios from 'axios';
import authUtils from '../utils/authUtils';

const API_BASE_URL = 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = authUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const stallService = {
  // Get all stalls
  getAllStalls: async () => {
    try {
      const response = await apiClient.get('/stalls');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch stalls';
    }
  },

  // Get stall by ID
  getStallById: async (stallId) => {
    try {
      const response = await apiClient.get(`/stalls/${stallId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch stall details';
    }
  },

  // Get stalls by status
  getStallsByStatus: async (isReserved) => {
    try {
      const response = await apiClient.get(`/stalls?reserved=${isReserved}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch stalls';
    }
  },

  // Get stalls by size
  getStallsBySize: async (size) => {
    try {
      const response = await apiClient.get(`/stalls?size=${size}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch stalls';
    }
  },
};

export default stallService;