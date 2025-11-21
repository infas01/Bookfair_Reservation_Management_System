const reservationService = require('../services/reservationService');
const ReservationRepository = require('../models/Reservation');
const { asyncHandler } = require('../middlewares/errorHandler');
const { NotFoundError } = require('../utils/errors');

/**
 * @openapi
 * /reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: List reservations (admin sees all; user sees own)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *     responses:
 *       200:
 *         description: Array of reservations
 */
const listReservations = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const userId = req.user.role === 'admin' ? undefined : req.user.sub;
  const reservations = await ReservationRepository.findAll({ userId, status });
  res.status(200).json({ reservations });
});

/**
 * @openapi
 * /reservations/{id}:
 *   get:
 *     tags: [Reservations]
 *     summary: Get a reservation by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation object
 *       404:
 *         description: Not found
 */
const getReservation = asyncHandler(async (req, res) => {
  const reservation = await ReservationRepository.findById(req.params.id);
  if (!reservation) throw new NotFoundError('Reservation not found');
  if (req.user.role !== 'admin' && reservation.user_id !== req.user.sub)
    throw new NotFoundError('Reservation not found');
  res.status(200).json({ reservation });
});

/**
 * @openapi
 * /reservations:
 *   post:
 *     tags: [Reservations]
 *     summary: Create a new reservation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stall_id, start_date, end_date]
 *             properties:
 *               stall_id:
 *                 type: integer
 *               genre_id:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Reservation created with QR code
 *       409:
 *         description: Stall not available
 */
const createReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.createReservation({
    ...req.body,
    user_id: req.user.sub,
  });
  res.status(201).json({ reservation });
});

/**
 * @openapi
 * /reservations/{id}/confirm:
 *   patch:
 *     tags: [Reservations]
 *     summary: Confirm a pending reservation (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation confirmed
 *       404:
 *         description: Not found
 *       409:
 *         description: Invalid status transition
 */
const confirmReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.confirmReservation(req.params.id);
  res.status(200).json({ reservation });
});

/**
 * @openapi
 * /reservations/{id}/cancel:
 *   patch:
 *     tags: [Reservations]
 *     summary: Cancel a reservation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation cancelled
 *       404:
 *         description: Not found
 */
const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.cancelReservation(
    req.params.id, req.user.sub, req.user.role
  );
  res.status(200).json({ reservation });
});

module.exports = { listReservations, getReservation, createReservation, confirmReservation, cancelReservation };
