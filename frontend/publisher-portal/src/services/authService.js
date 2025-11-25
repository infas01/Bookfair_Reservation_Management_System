import axios from 'axios';
import API_CONFIG from '../config/api';

const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || 'Registration failed';
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
        { email, password }
      );

      const data = response.data;
      const accessToken = data.accessToken || data.message;

      return {
        accessToken: accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
        email: data.email,
        user: data.user || {
          id: data.userId,
          email: data.email,
          name: data.name,
          role: data.role || 'USER',
        },
      };
    } catch (error) {
      throw error.response?.data || error.message || 'Login failed';
    }
  },

  logout: async (refreshToken) => {
    try {
      await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,
        { refreshToken }
      );
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};

export default authService;