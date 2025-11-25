const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/reservationController');

// All reservation endpoints require authenticated user (JWT from iam-service)
router.use(auth);

// POST /api/reservations
router.post('/', controller.createReservation);

// GET /api/reservations/me
router.get('/me', controller.getMyReservations);

// GET /api/reservations/:id
router.get('/:id', controller.getMyReservationById);

// DELETE /api/reservations/:id or PATCH to cancel
router.patch('/:id/cancel', controller.cancelMyReservation);

module.exports = router;
