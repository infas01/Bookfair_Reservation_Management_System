const {
  validateReservationNotificationPayload,
} = require("../utils/validation");
const qrService = require("../services/qrService");
const emailService = require("../services/emailService");

async function sendReservationConfirmation(req, res) {
  const { error, value } = validateReservationNotificationPayload(req.body);
  if (error) {
    return res.status(400).json({
      message: "Invalid payload",
      details: error.details.map((d) => d.message),
    });
  }

  try {
    // Build QR payload and generate PNG buffer
    const qrData = qrService.buildReservationQrPayload(value);
    const qrPngBuffer = await qrService.generateQrPng(qrData);

    await emailService.sendReservationEmail({
      ...value,
      qrPngBuffer,
    });

    return res.status(202).json({
      message: "Reservation confirmation email sent (or queued)",
    });
  } catch (err) {
    console.error("Failed to send reservation confirmation email:", err);
    return res.status(500).json({
      message: "Failed to send notification",
    });
  }
}

module.exports = {
  sendReservationConfirmation,
};
