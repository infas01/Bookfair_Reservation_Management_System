const ReservationRepository = require('../models/Reservation');
const StallRepository = require('../models/Stall');
const { generateForReservation } = require('./qrService');
const { NotFoundError, ConflictError } = require('../utils/errors');

const createReservation = async ({ user_id, stall_id, start_date, end_date, genre_id }) => {
  const stall = await StallRepository.findById(stall_id);
  if (!stall) throw new NotFoundError('Stall not found');

  const conflicts = await ReservationRepository.findByStallAndDateRange(
    stall_id, start_date, end_date
  );
  if (conflicts.length > 0) throw new ConflictError('Stall is not available for the selected dates');

  const start = new Date(start_date);
  const end = new Date(end_date);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const total_price = days * Number(stall.price_per_day);

  const reservation = await ReservationRepository.create({
    user_id, stall_id, start_date, end_date, total_price, genre_id,
  });

  await generateForReservation(reservation.id);
  return ReservationRepository.findById(reservation.id);
};

const confirmReservation = async (id) => {
  const reservation = await ReservationRepository.findById(id);
  if (!reservation) throw new NotFoundError('Reservation not found');
  if (reservation.status !== 'pending')
    throw new ConflictError(`Cannot confirm a reservation with status '${reservation.status}'`);
  return ReservationRepository.updateStatus(id, 'confirmed');
};

const cancelReservation = async (id, userId, role) => {
  const reservation = await ReservationRepository.findById(id);
  if (!reservation) throw new NotFoundError('Reservation not found');
  if (role !== 'admin' && reservation.user_id !== userId)
    throw new NotFoundError('Reservation not found');
  if (reservation.status === 'cancelled')
    throw new ConflictError('Reservation is already cancelled');
  return ReservationRepository.updateStatus(id, 'cancelled');
};

module.exports = { createReservation, confirmReservation, cancelReservation };
