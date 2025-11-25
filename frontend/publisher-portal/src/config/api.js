export const API_CONFIG = {
  BASE_URL: 'http://localhost:8081',
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
    },
    STALLS: {
      GET_ALL: '/api/stalls',
      GET_BY_ID: (id) => `/api/stalls/${id}`,
      GET_AVAILABLE: '/api/stalls/available',
    },
    RESERVATIONS: {
      CREATE: '/api/reservations',
      MY_RESERVATIONS: '/api/reservations/my',
      GET_BY_ID: (id) => `/api/reservations/${id}`,
      CANCEL: (id) => `/api/reservations/${id}/cancel`,
    },
    GENRES: {
      ADD: '/api/genres',
      MY_GENRES: '/api/genres/my',
      DELETE: (id) => `/api/genres/${id}`,
    },
    PROFILE: {
      GET: '/api/profile',
      UPDATE: '/api/profile',
    },
  },
};

export default API_CONFIG;