// src/config/api.js

export const API_CONFIG = {
  // Microservice base URLs
  IAM_BASE_URL: 'http://localhost:8081',
  STALL_SERVICE_BASE_URL: 'http://localhost:8082',
  RESERVATION_SERVICE_BASE_URL: 'http://localhost:3000',

  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      // optional: admin-only employee registration
      REGISTER_EMPLOYEE: '/api/auth/admin/register-employee',
      TEST: '/api/auth/test',
    },

    PROFILE: {
      GET: '/api/profile',
      UPDATE: '/api/profile',
      CHANGE_PASSWORD: '/api/profile/change-password',
    },

    // Stall-management-service (Spring Boot)
    STALLS: {
      // GET /api/stalls  (optional StallFilter body, page & size as query params)
      SEARCH: '/api/stalls',
      GET_BY_ID: (id) => `/api/stalls/${id}`,
      CHANGE_STATUS: (id) => `/api/stalls/${id}/status`,
    },

    HALLS: {
      SEARCH: '/api/halls',
      GET_BY_ID: (id) => `/api/halls/${id}`,
      CHANGE_STATUS: (id) => `/api/halls/${id}/status`,
    },

    AMENITIES: {
      SEARCH: '/api/amenities',
      GET_BY_ID: (id) => `/api/amenities/${id}`,
    },

    // Reservation-service (Node/Express)
    RESERVATIONS: {
      // POST /api/reservations  { stallIds: number[] }
      CREATE: '/api/reservations',
      // GET /api/reservations/me
      MY_RESERVATIONS: '/api/reservations/me',
      // GET /api/reservations/:id
      GET_BY_ID: (id) => `/api/reservations/${id}`,
      // PATCH /api/reservations/:id/cancel
      CANCEL: (id) => `/api/reservations/${id}/cancel`,
    },

    // Not implemented yet in backend; kept for future
    GENRES: {
      ADD: '/api/genres',
      MY_GENRES: '/api/genres/my',
      DELETE: (id) => `/api/genres/${id}`,
    },
  },
};

export default API_CONFIG;
