const db = require('../config/database');

const TABLE = 'stalls';

const StallRepository = {
  async findAll() {
    const { rows } = await db.query(
      `SELECT * FROM ${TABLE} ORDER BY stall_number ASC`
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query(
      `SELECT * FROM ${TABLE} WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ stall_number, location, size, price_per_day }) {
    const { rows } = await db.query(
      `INSERT INTO ${TABLE} (stall_number, location, size, price_per_day)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [stall_number, location, size, price_per_day]
    );
    return rows[0];
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const { rows } = await db.query(
      `UPDATE ${TABLE} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rowCount } = await db.query(
      `DELETE FROM ${TABLE} WHERE id = $1`,
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = StallRepository;
