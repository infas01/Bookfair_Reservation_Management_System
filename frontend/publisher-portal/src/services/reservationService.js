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

const reservationService = {
  createReservation: async (stallIds) => {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.RESERVATIONS.CREATE,
        { stallIds }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to create reservation';
    }
  },

  getMyReservations: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.RESERVATIONS.MY_RESERVATIONS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch reservations';
    }
  },

  cancelReservation: async (reservationId) => {
    try {
      const response = await apiClient.put(API_CONFIG.ENDPOINTS.RESERVATIONS.CANCEL(reservationId));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to cancel reservation';
    }
  },
};

export default reservationService;