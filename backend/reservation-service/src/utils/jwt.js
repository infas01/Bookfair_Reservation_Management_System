const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

const verifyToken = (token) => jwt.verify(token, SECRET);

module.exports = { signToken, verifyToken };
