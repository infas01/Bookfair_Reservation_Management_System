const express = require('express');
const { listGenres, getGenre, createGenre, updateGenre, deleteGenre } = require('../controllers/genreController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', listGenres);
router.get('/:id', getGenre);
router.post('/', authorize('admin'), createGenre);
router.patch('/:id', authorize('admin'), updateGenre);
router.delete('/:id', authorize('admin'), deleteGenre);

module.exports = router;
