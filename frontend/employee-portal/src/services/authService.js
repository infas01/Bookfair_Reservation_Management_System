import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/auth';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Login failed';
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Registration failed';
    }
  },

  logout: async (refreshToken) => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/refresh`, {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Token refresh failed';
    }
  },
};

export default authService;
