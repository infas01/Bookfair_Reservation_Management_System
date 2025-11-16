const { generateQRDataURL } = require('../utils/qrGenerator');
const ReservationRepository = require('../models/Reservation');
const { NotFoundError } = require('../utils/errors');

const generateForReservation = async (reservationId) => {
  const reservation = await ReservationRepository.findById(reservationId);
  if (!reservation) throw new NotFoundError('Reservation not found');

  const payload = {
    reservationId: reservation.id,
    userId: reservation.user_id,
    stallId: reservation.stall_id,
    startDate: reservation.start_date,
    endDate: reservation.end_date,
  };

  const qrCode = await generateQRDataURL(payload);
  return ReservationRepository.updateQrCode(reservationId, qrCode);
};

module.exports = { generateForReservation };
