const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const reservationRoutes = require('./routes/reservationRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'reservation-service' });
});

// Core API
app.use('/api/reservations', reservationRoutes);

// Central error handler
app.use(errorHandler);

module.exports = app;
