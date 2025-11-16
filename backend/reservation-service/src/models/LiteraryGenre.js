const db = require('../config/database');

const TABLE = 'literary_genres';

const GenreRepository = {
  async findAll() {
    const { rows } = await db.query(
      `SELECT * FROM ${TABLE} ORDER BY name ASC`
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

  async create({ name, description }) {
    const { rows } = await db.query(
      `INSERT INTO ${TABLE} (name, description) VALUES ($1, $2) RETURNING *`,
      [name, description]
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

module.exports = GenreRepository;
