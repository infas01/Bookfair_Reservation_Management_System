const db = require('../config/database');

const TABLE = 'users';

const UserRepository = {
  async findById(id) {
    const { rows } = await db.query(
      `SELECT id, email, role, name, created_at FROM ${TABLE} WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email) {
    const { rows } = await db.query(
      `SELECT * FROM ${TABLE} WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  },

  async create({ name, email, password_hash, role = 'user' }) {
    const { rows } = await db.query(
      `INSERT INTO ${TABLE} (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, password_hash, role]
    );
    return rows[0];
  },

  async existsByEmail(email) {
    const { rows } = await db.query(
      `SELECT 1 FROM ${TABLE} WHERE email = $1`,
      [email]
    );
    return rows.length > 0;
  },
};

module.exports = UserRepository;
