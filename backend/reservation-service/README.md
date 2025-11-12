# Reservation Microservice

A Node.js-based microservice for managing book fair stall reservations with QR code generation, authentication, and role-based access control.

## 🚀 Features

- **User Management**: Registration, authentication, and JWT-based authorization
- **Stall Management**: CRUD operations for stall inventory
- **Reservation System**: Create, view, and cancel reservations with atomic transactions
- **QR Code Generation**: Unique QR codes for each reservation
- **Role-Based Access Control**: Support for USER, EMPLOYEE, and ADMIN roles
- **Literary Genres**: Track publisher literary genres
- **PostgreSQL Database**: Robust relational database with proper indexing
- **API Documentation**: Swagger/OpenAPI documentation
- **Comprehensive Testing**: Unit and integration tests

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14.0

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (pg driver)
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **QR Codes**: qrcode library
- **Testing**: Jest + Supertest
- **Logging**: Winston
- **Code Quality**: ESLint + Prettier

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd backend/reservation-service

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

## 🔧 Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookfair_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start with nodemon (auto-reload)

# Production
npm start            # Start production server

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode

# Code Quality
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
```

## 🗂️ Project Structure

```
reservation-service/
├── src/
│   ├── config/          # Configuration files (database, swagger, logger)
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Express middlewares (auth, validation, error handling)
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions (QR, JWT, hashing)
│   └── app.js           # Express app setup
├── tests/
│   ├── unit/            # Unit tests
│   └── integration/     # Integration tests
├── migrations/          # Database migrations
├── .env.example         # Environment variables template
├── server.js            # Server entry point
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Stalls
- `GET /api/stalls` - Get all stalls (with filters)
- `GET /api/stalls/available` - Get available stalls
- `GET /api/stalls/:id` - Get stall by ID
- `POST /api/stalls` - Create stall (ADMIN)
- `PUT /api/stalls/:id` - Update stall (ADMIN)
- `DELETE /api/stalls/:id` - Delete stall (ADMIN)

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations` - Get all reservations (ADMIN/EMPLOYEE)
- `GET /api/reservations/user/:userId` - Get user reservations
- `GET /api/reservations/:id` - Get reservation by ID
- `DELETE /api/reservations/:id` - Cancel reservation
- `POST /api/reservations/verify` - Verify QR code (EMPLOYEE/ADMIN)

### Literary Genres
- `POST /api/genres` - Add genre for user
- `GET /api/genres/user/:userId` - Get user genres
- `DELETE /api/genres/:id` - Delete genre

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

## 🚢 Deployment

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the service
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# View logs
pm2 logs reservation-service
```

### Using Docker

```bash
# Build image
docker build -t reservation-service .

# Run container
docker-compose up -d
```

## 📊 Database Schema

- **users**: User accounts with authentication
- **stalls**: Book fair stall inventory
- **reservations**: Stall reservations with QR codes
- **literary_genres**: Publisher literary genres

## 🔐 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT-based authentication
- Helmet for security headers
- CORS configuration
- Input validation with Joi
- SQL injection prevention with parameterized queries

## 📝 License

MIT License

## 👥 Authors

BookFair Development Team

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@bookfair.com or create an issue in the repository.

---

**Current Status**: Commit 1 - Project Initialized ✅
