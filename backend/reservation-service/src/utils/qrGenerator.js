const QRCode = require('qrcode');

const generateQRDataURL = (data) =>
  QRCode.toDataURL(typeof data === 'string' ? data : JSON.stringify(data), {
    errorCorrectionLevel: 'H',
    margin: 1,
  });

module.exports = { generateQRDataURL };
