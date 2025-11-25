// src/services/stallService.js
import axios from 'axios';
import authUtils from '../utils/authUtils';

// Change this if your stall-management-service runs on a different port
// Example: Vite env: VITE_STALL_SERVICE_BASE_URL="http://localhost:8082/api"
const STALL_API_BASE_URL =
  import.meta.env.VITE_STALL_SERVICE_BASE_URL || 'http://localhost:8082/api';

const apiClient = axios.create({
  baseURL: STALL_API_BASE_URL,
});

// Attach IAM JWT to every request so Spring Security accepts it
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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Stall API error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(
      error.response?.data || error.message || 'Error calling stall service'
    );
  }
);

// Map backend StallResponse → UI model used by EmployeeHome
// Backend StallResponse has (from Java record):
//  id, hallId, hallCode, code, size, status,
//  widthMeters, depthMeters, areaSqM, basePrice, mapX, mapY, mapWidth, mapHeight, amenities, ...
const mapStall = (s) => {
  const width = s.widthMeters ?? 0;
  const depth = s.depthMeters ?? 0;
  const area = s.areaSqM ?? (width && depth ? width * depth : null);

  // Treat anything that is not AVAILABLE as "reserved/unavailable" in UI
  const isReserved = s.status && s.status !== 'AVAILABLE';

  return {
    id: s.id,
    // what EmployeeHome calls "name" is backend "code" (A1, B2, etc.)
    name: s.code,
    size: s.size, // SMALL / MEDIUM / LARGE
    // a simple location text – can be made fancier later
    location: s.hallCode ? `Hall ${s.hallCode}` : 'Unassigned hall',
    dimensions:
      width && depth ? `${width}m x ${depth}m` : 'Dimensions not specified',
    price: s.basePrice ?? 0,
    isReserved,
    status: s.status, // AVAILABLE / RESERVED / RESERVATION_IN_PROGRESS / OUT_OF_SERVICE
    hallCode: s.hallCode,
    hallId: s.hallId,
    areaSqM: area,
  };
};

const stallService = {
  // For Employee portal we just need “all stalls” view.
  // Uses the /api/stalls GET search endpoint with pagination.
  getAllStalls: async () => {
    try {
      const response = await apiClient.get('/stalls', {
        params: {
          page: 0,
          size: 200, // enough to cover all stalls; adjust if needed
        },
      });

      const data = response.data;

      // Spring Data Page<StallResponse> → { content, totalElements, ... }
      const content = Array.isArray(data) ? data : data.content || [];

      return content.map(mapStall);
    } catch (error) {
      throw (
        error ||
        'Failed to load stalls from stall-management-service'
      );
    }
  },
};

export default stallService;
