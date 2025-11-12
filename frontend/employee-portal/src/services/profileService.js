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

const profileService = {
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.PROFILE.GET);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch profile';
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put(
        API_CONFIG.ENDPOINTS.PROFILE.UPDATE,
        profileData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update profile';
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.put(
        API_CONFIG.ENDPOINTS.PROFILE.CHANGE_PASSWORD,
        passwordData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to change password';
    }
  },
};

export default profileService;