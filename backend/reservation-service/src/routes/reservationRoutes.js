const express = require('express');
const {
  listReservations, getReservation, createReservation,
  confirmReservation, cancelReservation,
} = require('../controllers/reservationController');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateCreateReservation } = require('../middlewares/reservationValidator');

const router = express.Router();

router.use(authenticate);

router.get('/', listReservations);
router.get('/:id', getReservation);
router.post('/', validateCreateReservation, createReservation);
router.patch('/:id/confirm', authorize('admin'), confirmReservation);
router.patch('/:id/cancel', cancelReservation);

module.exports = router;
