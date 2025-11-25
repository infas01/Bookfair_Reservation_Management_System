const QRCode = require("qrcode");

function buildReservationQrPayload(payload) {
  return JSON.stringify({
    reservationId: payload.reservationId,
    businessName: payload.businessName,
    email: payload.email,
    stalls: payload.stalls.map((s) => ({
      stallId: s.stallId,
      stallCode: s.stallCode,
      hallName: s.hallName,
      size: s.size,
    })),
    validFrom: payload.validFrom,
    validTo: payload.validTo,
    issuedAt: new Date().toISOString(),
  });
}

async function generateQrPng(data) {
  const dataUrl = await QRCode.toDataURL(data, {
    errorCorrectionLevel: "M",
    margin: 1,
    scale: 6,
  });

  const base64 = dataUrl.split(",")[1];
  return Buffer.from(base64, "base64");
}

module.exports = {
  buildReservationQrPayload,
  generateQrPng,
};
