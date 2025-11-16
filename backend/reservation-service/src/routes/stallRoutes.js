const express = require('express');
const { listStalls, getStall, createStall, updateStall, deleteStall } = require('../controllers/stallController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', listStalls);
router.get('/:id', getStall);
router.post('/', authorize('admin'), createStall);
router.patch('/:id', authorize('admin'), updateStall);
router.delete('/:id', authorize('admin'), deleteStall);

module.exports = router;
