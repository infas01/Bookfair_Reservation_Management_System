const Joi = require("joi");

const stallSchema = Joi.object({
    stallId: Joi.number().integer().required(),
    stallCode: Joi.string().required(), // e.g. "A12"
    size: Joi.string().valid("SMALL", "MEDIUM", "LARGE").required(),
    hallName: Joi.string().required(), // e.g. "Hall A"
});

const reservationNotificationSchema = Joi.object({
    reservationId: Joi.number().integer().required(),
    businessName: Joi.string().min(1).required(),
    contactName: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    stalls: Joi.array().items(stallSchema).min(1).max(3).required(),
    validFrom: Joi.string().isoDate().required(), // exhibition start or reservation date
    validTo: Joi.string().isoDate().required(), // exhibition end
});

function validateReservationNotificationPayload(payload) {
    return reservationNotificationSchema.validate(payload, {
        abortEarly: false,
    });
}

module.exports = {
    validateReservationNotificationPayload,
};
