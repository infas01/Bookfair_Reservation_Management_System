-- BookFair Database Schema (PostgreSQL)

-- ============================================
-- IAM Service Tables
-- ============================================

CREATE TABLE IF NOT EXISTS users (
                                     id BIGSERIAL PRIMARY KEY,
                                     email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN','EMPLOYEE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- Stall Service Tables
-- ============================================

CREATE TABLE IF NOT EXISTS stalls (
                                      id BIGSERIAL PRIMARY KEY,
                                      name VARCHAR(50) UNIQUE NOT NULL,
    size VARCHAR(20) NOT NULL CHECK (size IN ('SMALL', 'MEDIUM', 'LARGE')),
    location VARCHAR(100),
    dimensions VARCHAR(50),
    price DECIMAL(10,2),
    is_reserved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_stalls_name ON stalls(name);
CREATE INDEX idx_stalls_is_reserved ON stalls(is_reserved);
CREATE INDEX idx_stalls_size ON stalls(size);

CREATE TABLE IF NOT EXISTS literary_genres (
                                               id BIGSERIAL PRIMARY KEY,
                                               user_id BIGINT NOT NULL,
                                               genre_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_genres_user_id ON literary_genres(user_id);
CREATE INDEX idx_genres_name ON literary_genres(genre_name);

-- ============================================
-- Reservation Service Tables
-- ============================================

CREATE TABLE IF NOT EXISTS reservations (
                                            id BIGSERIAL PRIMARY KEY,
                                            user_id BIGINT NOT NULL,
                                            stall_id BIGINT NOT NULL,
                                            qr_code VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CANCELLED')),
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL
    );

CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_stall_id ON reservations(stall_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_qr_code ON reservations(qr_code);

-- ============================================
-- Sample Data
-- ============================================

-- Insert sample stalls
INSERT INTO stalls (name, size, location, dimensions, price, is_reserved) VALUES
                                                                              ('A1', 'SMALL', 'Hall A - Section 1', '2m x 2m', 500.00, FALSE),
                                                                              ('A2', 'SMALL', 'Hall A - Section 1', '2m x 2m', 500.00, FALSE),
                                                                              ('A3', 'MEDIUM', 'Hall A - Section 2', '3m x 3m', 800.00, FALSE),
                                                                              ('A4', 'MEDIUM', 'Hall A - Section 2', '3m x 3m', 800.00, FALSE),
                                                                              ('A5', 'LARGE', 'Hall A - Section 3', '4m x 4m', 1200.00, FALSE),
                                                                              ('B1', 'SMALL', 'Hall B - Section 1', '2m x 2m', 500.00, FALSE),
                                                                              ('B2', 'MEDIUM', 'Hall B - Section 2', '3m x 3m', 800.00, FALSE),
                                                                              ('B3', 'LARGE', 'Hall B - Section 3', '4m x 4m', 1200.00, FALSE),
                                                                              ('C1', 'SMALL', 'Hall C - Section 1', '2m x 2m', 500.00, FALSE),
                                                                              ('C2', 'LARGE', 'Hall C - Section 2', '4m x 4m', 1200.00, FALSE);

-- Insert admin user (password: admin123 - BCrypt hashed)
INSERT INTO users (email, password, name, business_name, phone, role) VALUES
                                                                          ('admin@bookfair.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
                                                                           'Admin User', NULL, '+94771234567', 'ADMIN'),
                                                                          ('employee@bookfair.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
                                                                           'Employee User', NULL, '+94771234568', 'EMPLOYEE')
ON CONFLICT (email) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stalls_updated_at BEFORE UPDATE ON stalls
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
