const GenreRepository = require('../models/LiteraryGenre');
const { asyncHandler } = require('../middlewares/errorHandler');

/**
 * @openapi
 * /genres:
 *   get:
 *     tags: [Genres]
 *     summary: List all literary genres
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of genres
 */
const listGenres = asyncHandler(async (req, res) => {
  const genres = await GenreRepository.findAll();
  res.status(200).json({ genres });
});

/**
 * @openapi
 * /genres/{id}:
 *   get:
 *     tags: [Genres]
 *     summary: Get a genre by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Genre object
 *       404:
 *         description: Genre not found
 */
const getGenre = asyncHandler(async (req, res) => {
  const genre = await GenreRepository.findById(req.params.id);
  if (!genre) return res.status(404).json({ message: 'Genre not found' });
  res.status(200).json({ genre });
});

/**
 * @openapi
 * /genres:
 *   post:
 *     tags: [Genres]
 *     summary: Create a new genre
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Genre created
 */
const createGenre = asyncHandler(async (req, res) => {
  const genre = await GenreRepository.create(req.body);
  res.status(201).json({ genre });
});

/**
 * @openapi
 * /genres/{id}:
 *   patch:
 *     tags: [Genres]
 *     summary: Update a genre
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated genre
 *       404:
 *         description: Genre not found
 */
const updateGenre = asyncHandler(async (req, res) => {
  const genre = await GenreRepository.update(req.params.id, req.body);
  if (!genre) return res.status(404).json({ message: 'Genre not found' });
  res.status(200).json({ genre });
});

/**
 * @openapi
 * /genres/{id}:
 *   delete:
 *     tags: [Genres]
 *     summary: Delete a genre
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Genre not found
 */
const deleteGenre = asyncHandler(async (req, res) => {
  const deleted = await GenreRepository.delete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Genre not found' });
  res.status(204).send();
});

module.exports = { listGenres, getGenre, createGenre, updateGenre, deleteGenre };
