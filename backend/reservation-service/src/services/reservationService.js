const db = require('../config/database');
const Reservation = require('../models/Reservation');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../utils/errors');
const { getUserProfile, getAdminAccessToken } = require('./iamClient');
const {
  fetchStallsByIds,
  markStallsReserved,
  markStallsAvailable,
} = require('./stallClient');
const { sendReservationConfirmation } = require('./notificationClient');

async function createReservationForUser(stallIds, userToken) {
  if (!Array.isArray(stallIds) || stallIds.length === 0) {
    throw new BadRequestError('At least one stall must be selected');
  }

  if (stallIds.length > 3) {
    throw new BadRequestError('You can reserve at most 3 stalls');
  }

  // Get user profile from iam-service
  const profile = await getUserProfile(userToken);

  // Admin token for stall-management-service
  const adminToken = await getAdminAccessToken();

  // Fetch stalls and validate availability
  const stalls = await fetchStallsByIds(stallIds, adminToken);

  const unavailable = stalls.filter((s) => s.status !== 'AVAILABLE');
  if (unavailable.length > 0) {
    const codes = unavailable.map((s) => s.code).join(', ');
    throw new BadRequestError(`Stall(s) not available: ${codes}`);
  }

  // Create reservation in our DB (transaction)
  const client = await db.getClient();
  let reservation;
  try {
    await client.query('BEGIN');

    reservation = await Reservation.createReservation(client, {
      userId: profile.id,
      businessName: profile.businessName || `${profile.name}'s Business`,
      contactName: profile.name,
      email: profile.email,
    });

    await Reservation.addStalls(client, reservation.id, stalls);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  // Mark stalls as RESERVED in stall-management-service
  await markStallsReserved(stallIds, adminToken, reservation.id, profile.email);

  // Send confirmation via notification-service
  await sendReservationConfirmation({
    reservationId: reservation.id,
    businessName: reservation.business_name,
    contactName: reservation.contact_name,
    email: reservation.email,
    stalls: stalls.map((s) => ({
      stallId: s.id,
      stallCode: s.code,
      size: s.size,
      hallName: s.hallCode,
    })),
  });

  return {
    ...reservation,
    stalls: stalls.map((s) => ({
      stallId: s.id,
      stallCode: s.code,
      hallCode: s.hallCode,
      size: s.size,
    })),
  };
}

async function getMyReservations(userToken) {
  const profile = await getUserProfile(userToken);
  return Reservation.findByUserId(profile.id);
}

async function getMyReservationById(reservationId, userToken) {
  const profile = await getUserProfile(userToken);
  const reservation = await Reservation.findByIdAndUser(
    reservationId,
    profile.id
  );

  if (!reservation) {
    throw new NotFoundError('Reservation not found');
  }

  return reservation;
}

async function cancelMyReservation(reservationId, userToken) {
  const profile = await getUserProfile(userToken);
  const adminToken = await getAdminAccessToken();

  const client = await db.getClient();
  let cancelled;
  try {
    await client.query('BEGIN');

    cancelled = await Reservation.cancelReservation(
      client,
      reservationId,
      profile.id
    );
    if (!cancelled) {
      throw new NotFoundError('Reservation not found or already cancelled');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  // Get stalls and mark them AVAILABLE again
  const stallIds = await Reservation.getStallsForReservation(reservationId);
  if (stallIds.length > 0) {
    await markStallsAvailable(
      stallIds,
      adminToken,
      reservationId,
      profile.email
    );
  }

  return cancelled;
}

module.exports = {
  createReservationForUser,
  getMyReservations,
  getMyReservationById,
  cancelMyReservation,
};
