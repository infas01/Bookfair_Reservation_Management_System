import axios from 'axios';
import authUtils from '../utils/authUtils';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
  // Get all reservations
  getAllReservations: async () => {
    try {
      const response = await apiClient.get('/reservations');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch reservations';
    }
  },

  // Get reservation by ID
  getReservationById: async (reservationId) => {
    try {
      const response = await apiClient.get(`/reservations/${reservationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch reservation';
    }
  },

  // Get reservations by stall ID
  getReservationsByStall: async (stallId) => {
    try {
      const response = await apiClient.get(`/reservations/stall/${stallId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch reservations';
    }
  },

  // Get reservations by user ID
  getReservationsByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/reservations/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch reservations';
    }
  },
};

export default reservationService;