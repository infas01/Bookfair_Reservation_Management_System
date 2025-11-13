const express = require('express');
const authRoutes = require('./authRoutes');
const reservationRoutes = require('./reservationRoutes');
const stallRoutes = require('./stallRoutes');
const genreRoutes = require('./genreRoutes');

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Service health check
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 service:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'reservation-service',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/reservations', reservationRoutes);
router.use('/stalls', stallRoutes);
router.use('/genres', genreRoutes);

module.exports = router;
