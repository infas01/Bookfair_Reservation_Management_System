const axios = require('axios');

const NOTIF_BASE_URL =
  process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4003';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

/**
 * Send reservation confirmation email to vendor.
 * notification-service will generate QR and send email.
 */
async function sendReservationConfirmation({
  reservationId,
  businessName,
  contactName,
  email,
  stalls,
}) {
  const validFrom = process.env.EXHIBITION_START || new Date().toISOString();
  const validTo = process.env.EXHIBITION_END || new Date().toISOString();

  await axios.post(
    `${NOTIF_BASE_URL}/api/notifications/reservation-confirmation`,
    {
      reservationId,
      businessName,
      contactName,
      email,
      stalls,
      validFrom,
      validTo,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-internal-api-key': INTERNAL_API_KEY,
      },
    }
  );
}

module.exports = {
  sendReservationConfirmation,
};
