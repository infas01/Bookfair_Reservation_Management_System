const axios = require('axios');

const STALL_BASE_URL = process.env.STALL_SERVICE_URL || 'http://localhost:8082';

async function fetchStallById(stallId, adminToken) {
  const resp = await axios.get(`${STALL_BASE_URL}/api/stalls/${stallId}`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return resp.data; // StallResponse record
}

async function fetchStallsByIds(stallIds, adminToken) {
  const promises = stallIds.map((id) => fetchStallById(id, adminToken));
  return Promise.all(promises);
}

/**
 * Mark stalls as RESERVED in stall-management-service
 * Uses StallController.changeStatus(id, status, reason, changedBy)
 */
async function markStallsReserved(stallIds, adminToken, reservationId, changedByEmail) {
  const status = 'RESERVED';
  const reason = `Reserved via reservation-service, reservationId=${reservationId}`;

  const queries = stallIds.map((id) =>
    axios.patch(
      `${STALL_BASE_URL}/api/stalls/${id}/status`,
      null,
      {
        params: {
          status,
          reason,
          changedBy: changedByEmail || 'reservation-service',
        },
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    )
  );

  await Promise.all(queries);
}

async function markStallsAvailable(stallIds, adminToken, reservationId, changedByEmail) {
  const status = 'AVAILABLE';
  const reason = `Reservation cancelled, reservationId=${reservationId}`;
  const queries = stallIds.map((id) =>
    axios.patch(
      `${STALL_BASE_URL}/api/stalls/${id}/status`,
      null,
      {
        params: {
          status,
          reason,
          changedBy: changedByEmail || 'reservation-service',
        },
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    )
  );

  await Promise.all(queries);
}

module.exports = {
  fetchStallsByIds,
  markStallsReserved,
  markStallsAvailable,
};
