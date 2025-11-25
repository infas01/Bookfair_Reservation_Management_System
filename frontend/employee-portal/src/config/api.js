export const API_CONFIG = {
  BASE_URL: 'http://localhost:8081',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      REGISTER: '/api/auth/register',
      REGISTER_EMPLOYEE: '/api/auth/admin/register-employee',
    },
    ADMIN: {
      USERS: '/api/admin/users',
      USER_BY_ID: (id) => `/api/admin/users/${id}`,
      DELETE_USER: (id) => `/api/admin/users/${id}`,
      UPDATE_ROLE: (id) => `/api/admin/users/${id}/role`,
      STATS: '/api/admin/stats',
    },
    PROFILE: {
      GET: '/api/profile',
      UPDATE: '/api/profile',
      CHANGE_PASSWORD: '/api/profile/change-password',
    },
  },
};

export default API_CONFIG;