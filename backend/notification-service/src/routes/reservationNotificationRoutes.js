const express = require("express");
const router = express.Router();
const controller = require("../controllers/reservationNotificationController");

// Internal endpoint called by reservation-service
router.post(
  "/reservation-confirmation",
  // Optional: simple internal API key check
  (req, res, next) => {
    const expected = process.env.INTERNAL_API_KEY;
    if (!expected) return next(); // no check configured

    const provided = req.headers["x-internal-api-key"];
    if (!provided || provided !== expected) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  },
  controller.sendReservationConfirmation
);

module.exports = router;
