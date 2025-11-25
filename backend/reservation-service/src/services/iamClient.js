const axios = require('axios');

const IAM_BASE_URL = process.env.IAM_SERVICE_URL || 'http://localhost:8081';
const SERVICE_ADMIN_EMAIL = process.env.SERVICE_ADMIN_EMAIL;
const SERVICE_ADMIN_PASSWORD = process.env.SERVICE_ADMIN_PASSWORD;

let adminToken = null;
let adminTokenFetchedAt = 0;
const ADMIN_TOKEN_TTL_MS = 1000 * 60 * 50; // ~50 minutes (jwt.expiration is 24h)

async function getAdminAccessToken() {
  const now = Date.now();
  if (adminToken && now - adminTokenFetchedAt < ADMIN_TOKEN_TTL_MS) {
    return adminToken;
  }

  if (!SERVICE_ADMIN_EMAIL || !SERVICE_ADMIN_PASSWORD) {
    throw new Error('SERVICE_ADMIN_EMAIL/PASSWORD not configured');
  }

  const resp = await axios.post(`${IAM_BASE_URL}/api/auth/login`, {
    email: SERVICE_ADMIN_EMAIL,
    password: SERVICE_ADMIN_PASSWORD,
  });

  // AuthResponse: message = accessToken, userId, email, refreshToken
  adminToken = resp.data.message;
  adminTokenFetchedAt = now;
  return adminToken;
}

async function getUserProfile(userAccessToken) {
  const resp = await axios.get(`${IAM_BASE_URL}/api/profile`, {
    headers: {
      Authorization: `Bearer ${userAccessToken}`,
    },
  });

  // UserProfileResponse from iam-service:
  // { id, email, name, businessName, phone, role, ... }
  return resp.data;
}

module.exports = {
  getAdminAccessToken,
  getUserProfile,
};
