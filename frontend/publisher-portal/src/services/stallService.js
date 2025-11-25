// src/services/stallService.js

import axios from 'axios';
import API_CONFIG from '../config/api';
import authUtils from '../utils/authUtils';

const stallClient = axios.create({
  baseURL: API_CONFIG.STALL_SERVICE_BASE_URL,
});

stallClient.interceptors.request.use(
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
  /**
   * Get paginated stalls.
   * Backend: GET /api/stalls with optional StallFilter body + page,size
   */
  getAllStalls: async (page = 0, size = 100, filter = null) => {
    try {
      const response = await stallClient.get(
        API_CONFIG.ENDPOINTS.STALLS.SEARCH,
        {
          params: { page, size },
          // Spring allows GET with body; axios uses `data` for this
          ...(filter ? { data: filter } : {}),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch stalls';
    }
  },

  /**
   * Convenience helper: only AVAILABLE stalls
   * Uses StallFilter.status = 'AVAILABLE'
   */
  getAvailableStalls: async (page = 0, size = 100) => {
    const filter = { status: 'AVAILABLE' };
    try {
      const response = await stallClient.get(
        API_CONFIG.ENDPOINTS.STALLS.SEARCH,
        {
          params: { page, size },
          data: filter,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch available stalls';
    }
  },

  getStallById: async (stallId) => {
    try {
      const response = await stallClient.get(
        API_CONFIG.ENDPOINTS.STALLS.GET_BY_ID(stallId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch stall details';
    }
  },
};

export default stallService;
