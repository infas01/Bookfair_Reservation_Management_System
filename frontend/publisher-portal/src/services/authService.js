// src/services/authService.js

import axios from 'axios';
import API_CONFIG from '../config/api';

const authClient = axios.create({
  baseURL: API_CONFIG.IAM_BASE_URL,
});

const authService = {
  register: async (userData) => {
    try {
      const response = await authClient.post(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || 'Registration failed';
    }
  },

  login: async (email, password) => {
    try {
      const response = await authClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const data = response.data;

      // Backend uses `message` field to carry the access token (backwards compatible)
      const accessToken = data.accessToken || data.message;

      return {
        accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
        email: data.email,
        user: {
          id: data.userId,
          email: data.email,
          role: data.role || 'USER',
        },
      };
    } catch (error) {
      throw error.response?.data || error.message || 'Login failed';
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await authClient.post(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );
      const data = response.data;
      const accessToken = data.accessToken || data.message;

      return {
        accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
        email: data.email,
        role: data.role,
      };
    } catch (error) {
      throw error.response?.data || error.message || 'Token refresh failed';
    }
  },

  logout: async (refreshToken) => {
    try {
      await authClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, { refreshToken });
    } catch (error) {
      // Backend just revokes refresh token; failure here is non-fatal on frontend
      console.error('Logout error:', error);
    }
  },
};

export default authService;
