import axios from 'axios';
import API_CONFIG from '../config/api';
import authUtils from '../utils/authUtils';

// Create axios instance with auth interceptor
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

// Add authorization header to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = authUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      headers: config.headers,
    });
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

const adminService = {
  registerEmployee: async (employeeData) => {
    try {
      console.log('Registering employee:', employeeData);

      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER_EMPLOYEE,
        employeeData
      );

      console.log('Employee registered successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to register employee:', error);

      // Handle different error types
      if (error.response) {
        // Server responded with error
        const errorMessage =
          error.response.data?.message ||
          error.response.data ||
          `Server error: ${error.response.status}`;
        throw errorMessage;
      } else if (error.request) {
        // Request made but no response
        throw 'No response from server. Please check if the backend is running.';
      } else {
        // Error in request setup
        throw error.message || 'Failed to register employee';
      }
    }
  },

  // Get all users with optional role filter
  getAllUsers: async (role = null) => {
    try {
      const url = role
        ? `${API_CONFIG.ENDPOINTS.ADMIN.USERS}?role=${role}`
        : API_CONFIG.ENDPOINTS.ADMIN.USERS;

      console.log('Fetching users from:', url);
      const response = await apiClient.get(url);

      console.log('Users fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error.response?.data || 'Failed to fetch users';
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.ADMIN.USER_BY_ID(userId)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error.response?.data || 'Failed to fetch user';
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(
        API_CONFIG.ENDPOINTS.ADMIN.DELETE_USER(userId)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error.response?.data || 'Failed to delete user';
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.STATS);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      throw error.response?.data || 'Failed to fetch statistics';
    }
  },
};

export default adminService;
