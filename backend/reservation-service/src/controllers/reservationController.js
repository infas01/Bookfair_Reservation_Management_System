const reservationService = require('../services/reservationService');
const { BadRequestError } = require('../utils/errors');

async function createReservation(req, res, next) {
  try {
    const { stallIds } = req.body;

    if (!stallIds) {
      throw new BadRequestError('Body must contain stallIds array');
    }

    const result = await reservationService.createReservationForUser(
      stallIds,
      req.user.token
    );

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function getMyReservations(req, res, next) {
  try {
    const reservations = await reservationService.getMyReservations(
      req.user.token
    );
    return res.json(reservations);
  } catch (err) {
    next(err);
  }
}

async function getMyReservationById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const reservation = await reservationService.getMyReservationById(
      id,
      req.user.token
    );
    return res.json(reservation);
  } catch (err) {
    next(err);
  }
}

async function cancelMyReservation(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const cancelled = await reservationService.cancelMyReservation(
      id,
      req.user.token
    );
    return res.json(cancelled);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReservation,
  getMyReservations,
  getMyReservationById,
  cancelMyReservation,
};
