const db = require('../config/database');

/**
 * Create a reservation row (user/business meta only).
 * stall links are stored separately.
 */
async function createReservation(client, { userId, businessName, contactName, email }) {
  const result = await client.query(
    `
      INSERT INTO reservations (user_id, business_name, contact_name, email)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, business_name, contact_name, email, status, reservation_date, cancelled_at
    `,
    [userId, businessName, contactName, email]
  );

  return result.rows[0];
}

/**
 * Link stalls to reservation (one row per stall).
 */
async function addStalls(client, reservationId, stalls) {
  if (!stalls || stalls.length === 0) return;

  const values = [];
  const params = [];

  stalls.forEach((s, index) => {
    const baseIndex = index * 5;
    params.push(
      `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`
    );
    values.push(
      reservationId,
      s.id,
      s.code,
      s.hallCode,
      s.size
    );
  });

  const sql = `
    INSERT INTO reservation_stalls (reservation_id, stall_id, stall_code, hall_code, size)
    VALUES ${params.join(', ')}
  `;

  await client.query(sql, values);
}

/**
 * Find reservations for a given user.
 */
async function findByUserId(userId) {
  const res = await db.query(
    `
    SELECT r.*, json_agg(
             json_build_object(
               'stallId', rs.stall_id,
               'stallCode', rs.stall_code,
               'hallCode', rs.hall_code,
               'size', rs.size
             )
           ) AS stalls
    FROM reservations r
    LEFT JOIN reservation_stalls rs ON r.id = rs.reservation_id
    WHERE r.user_id = $1
    GROUP BY r.id
    ORDER BY r.reservation_date DESC
    `,
    [userId]
  );

  return res.rows;
}

async function findByIdAndUser(id, userId) {
  const res = await db.query(
    `
    SELECT r.*, json_agg(
             json_build_object(
               'stallId', rs.stall_id,
               'stallCode', rs.stall_code,
               'hallCode', rs.hall_code,
               'size', rs.size
             )
           ) AS stalls
    FROM reservations r
    LEFT JOIN reservation_stalls rs ON r.id = rs.reservation_id
    WHERE r.id = $1 AND r.user_id = $2
    GROUP BY r.id
    `,
    [id, userId]
  );

  return res.rows[0] || null;
}

async function cancelReservation(client, id, userId) {
  const res = await client.query(
    `
    UPDATE reservations
    SET status = 'CANCELLED',
        cancelled_at = NOW()
    WHERE id = $1 AND user_id = $2 AND status = 'CONFIRMED'
    RETURNING *
    `,
    [id, userId]
  );

  return res.rows[0] || null;
}

async function getStallsForReservation(id) {
  const res = await db.query(
    `
    SELECT stall_id
    FROM reservation_stalls
    WHERE reservation_id = $1
    `,
    [id]
  );
  return res.rows.map((r) => r.stall_id);
}

module.exports = {
  createReservation,
  addStalls,
  findByUserId,
  findByIdAndUser,
  cancelReservation,
  getStallsForReservation,
};
