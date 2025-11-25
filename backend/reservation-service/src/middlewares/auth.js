require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn(
    'JWT_SECRET is not set for reservation-service. Auth will fail.'
  );
}

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }

  const token = header.substring(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // From iam-service JwtTokenProvider:
    // subject = email, claim "roles" = user.getRole()
    const roles = payload.roles
      ? Array.isArray(payload.roles)
        ? payload.roles
        : [payload.roles]
      : [];

    req.user = {
      email: payload.sub,
      roles,
      token, // keep the raw token so we can call /api/profile/me as the user
    };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
