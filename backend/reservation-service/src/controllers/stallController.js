const StallRepository = require('../models/Stall');
const { asyncHandler } = require('../middlewares/errorHandler');

/**
 * @openapi
 * /stalls:
 *   get:
 *     tags: [Stalls]
 *     summary: List all stalls
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of stalls
 */
const listStalls = asyncHandler(async (req, res) => {
  const stalls = await StallRepository.findAll();
  res.status(200).json({ stalls });
});

/**
 * @openapi
 * /stalls/{id}:
 *   get:
 *     tags: [Stalls]
 *     summary: Get a stall by ID
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
 *         description: Stall object
 *       404:
 *         description: Stall not found
 */
const getStall = asyncHandler(async (req, res) => {
  const stall = await StallRepository.findById(req.params.id);
  if (!stall) return res.status(404).json({ message: 'Stall not found' });
  res.status(200).json({ stall });
});

/**
 * @openapi
 * /stalls:
 *   post:
 *     tags: [Stalls]
 *     summary: Create a new stall
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stall_number, location, size, price_per_day]
 *             properties:
 *               stall_number:
 *                 type: string
 *               location:
 *                 type: string
 *               size:
 *                 type: string
 *               price_per_day:
 *                 type: number
 *     responses:
 *       201:
 *         description: Stall created
 */
const createStall = asyncHandler(async (req, res) => {
  const stall = await StallRepository.create(req.body);
  res.status(201).json({ stall });
});

/**
 * @openapi
 * /stalls/{id}:
 *   patch:
 *     tags: [Stalls]
 *     summary: Update a stall
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
 *         description: Updated stall
 *       404:
 *         description: Stall not found
 */
const updateStall = asyncHandler(async (req, res) => {
  const stall = await StallRepository.update(req.params.id, req.body);
  if (!stall) return res.status(404).json({ message: 'Stall not found' });
  res.status(200).json({ stall });
});

/**
 * @openapi
 * /stalls/{id}:
 *   delete:
 *     tags: [Stalls]
 *     summary: Delete a stall
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
 *         description: Stall not found
 */
const deleteStall = asyncHandler(async (req, res) => {
  const deleted = await StallRepository.delete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Stall not found' });
  res.status(204).send();
});

module.exports = { listStalls, getStall, createStall, updateStall, deleteStall };
