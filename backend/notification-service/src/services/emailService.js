const { transporter, fromAddress } = require("../config/emailConfig");

async function sendReservationEmail({
  email,
  contactName,
  businessName,
  reservationId,
  stalls,
  validFrom,
  validTo,
  qrPngBuffer,
}) {
  const subject = `Colombo International Bookfair – Stall Reservation Confirmation #${reservationId}`;

  const stallList = stalls
    .map((s) => `${s.stallCode} (${s.size}, ${s.hallName})`)
    .join(", ");

  const html = `
    <p>Dear ${contactName},</p>

    <p>Thank you for reserving stall(s) at the <strong>Colombo International Bookfair</strong>.</p>

    <p><strong>Reservation ID:</strong> ${reservationId}<br/>
       <strong>Business:</strong> ${businessName}<br/>
       <strong>Stall(s):</strong> ${stallList}<br/>
       <strong>Valid for entrance:</strong> ${validFrom} – ${validTo}</p>

    <p>The QR code below acts as the pass to enter the exhibition premises.
       Please keep this email and present the QR at the entrance.</p>

    <p><img src="cid:reservation-qr"/></p>

    <p>Best regards,<br/>
       Sri Lanka Book Publishers’ Association</p>
  `;

  const text = `
Dear ${contactName},

Thank you for reserving stall(s) at the Colombo International Bookfair.

Reservation ID: ${reservationId}
Business: ${businessName}
Stall(s): ${stallList}
Valid for entrance: ${validFrom} – ${validTo}

The attached QR code acts as the pass to enter the exhibition premises.
Please keep this email and present the QR at the entrance.

Best regards,
Sri Lanka Book Publishers’ Association
  `.trim();

  const mailOptions = {
    from: fromAddress,
    to: email,
    subject,
    text,
    html,
    attachments: [
      {
        filename: `reservation-${reservationId}-qr.png`,
        content: qrPngBuffer,
        cid: "reservation-qr", // for inline <img src="cid:reservation-qr">
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendReservationEmail,
};
