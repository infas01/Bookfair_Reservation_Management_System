import axios from 'axios';
import API_CONFIG from '../config/api';
import authUtils from '../utils/authUtils';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

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
  getAllStalls: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.STALLS.GET_ALL);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch stalls';
    }
  },

  getAvailableStalls: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.STALLS.GET_AVAILABLE);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch available stalls';
    }
  },

  getStallById: async (stallId) => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.STALLS.GET_BY_ID(stallId));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch stall details';
    }
  },
};

export default stallService;