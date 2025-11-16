const db = require('../config/database');

const TABLE = 'reservations';

const ReservationRepository = {
  async findAll({ userId, status } = {}) {
    let query = `SELECT * FROM ${TABLE} WHERE 1=1`;
    const params = [];
    if (userId) { params.push(userId); query += ` AND user_id = $${params.length}`; }
    if (status) { params.push(status); query += ` AND status = $${params.length}`; }
    query += ' ORDER BY created_at DESC';
    const { rows } = await db.query(query, params);
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query(
      `SELECT * FROM ${TABLE} WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findByStallAndDateRange(stallId, startDate, endDate) {
    const { rows } = await db.query(
      `SELECT * FROM ${TABLE}
       WHERE stall_id = $1
         AND status NOT IN ('cancelled')
         AND NOT (end_date < $2 OR start_date > $3)`,
      [stallId, startDate, endDate]
    );
    return rows;
  },

  async create({ user_id, stall_id, start_date, end_date, total_price, genre_id }) {
    const { rows } = await db.query(
      `INSERT INTO ${TABLE} (user_id, stall_id, start_date, end_date, total_price, genre_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [user_id, stall_id, start_date, end_date, total_price, genre_id]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    const { rows } = await db.query(
      `UPDATE ${TABLE} SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return rows[0] || null;
  },

  async updateQrCode(id, qr_code) {
    const { rows } = await db.query(
      `UPDATE ${TABLE} SET qr_code = $1 WHERE id = $2 RETURNING *`,
      [qr_code, id]
    );
    return rows[0] || null;
  },
};

module.exports = ReservationRepository;
