-- Initial schema for BookFair Reservation Service

CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100)        NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   TEXT                NOT NULL,
  role            VARCHAR(20)         NOT NULL DEFAULT 'user',
  created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS literary_genres (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stalls (
  id            SERIAL PRIMARY KEY,
  stall_number  VARCHAR(20) UNIQUE NOT NULL,
  location      VARCHAR(255)       NOT NULL,
  size          VARCHAR(50)        NOT NULL,
  price_per_day NUMERIC(10, 2)     NOT NULL,
  created_at    TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER        NOT NULL REFERENCES users(id)           ON DELETE CASCADE,
  stall_id    INTEGER        NOT NULL REFERENCES stalls(id)          ON DELETE RESTRICT,
  genre_id    INTEGER                 REFERENCES literary_genres(id) ON DELETE SET NULL,
  start_date  DATE           NOT NULL,
  end_date    DATE           NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  status      VARCHAR(20)    NOT NULL DEFAULT 'pending',
  qr_code     TEXT,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_dates CHECK (end_date >= start_date),
  CONSTRAINT chk_status CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_reservations_user   ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_stall  ON reservations(stall_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
