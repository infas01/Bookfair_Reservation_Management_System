import axios from 'axios';
import API_CONFIG from '../config/api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
        { email, password }
      );

      console.log('Login response:', response);
      const data = response.data;

      // Check if response has the expected structure
      if (!data) {
        throw new Error('Empty response from server');
      }

      // Backend might return token in different fields
      const accessToken = data.accessToken || data.message || data.token;
      const refreshToken = data.refreshToken || data.refresh_token;

      if (!accessToken) {
        throw new Error('No access token in response');
      }

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: data.userId || data.id,
        email: data.email,
        user: data.user || {
          id: data.userId || data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          phone: data.phone,
          businessName: data.businessName,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Response data:', error.response?.data);
      throw (
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Login failed'
      );
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

  refreshToken: async (refreshToken) => {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken }
      );

      const data = response.data;
      const accessToken = data.accessToken || data.message || data.token;

      return {
        accessToken: accessToken,
        refreshToken: data.refreshToken || refreshToken,
        userId: data.userId,
        email: data.email,
        user: data.user,
      };
    } catch (error) {
      throw error.response?.data || 'Token refresh failed';
    }
  },
};

export default authService;
