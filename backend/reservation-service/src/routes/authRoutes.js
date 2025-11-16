const express = require('express');
const { register, login, me } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validator');

const router = express.Router();

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.get('/me', authenticate, me);

module.exports = router;
