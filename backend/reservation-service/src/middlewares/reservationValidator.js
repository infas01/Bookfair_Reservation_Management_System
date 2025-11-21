const Joi = require('joi');
const { validate } = require('./validator');

const createReservationSchema = Joi.object({
  stall_id: Joi.number().integer().positive().required(),
  genre_id: Joi.number().integer().positive().optional(),
  start_date: Joi.date().iso().min('now').required(),
  end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
});

const validateCreateReservation = validate(createReservationSchema);

module.exports = { validateCreateReservation };
