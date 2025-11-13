/**
 * Server Entry Point
 * Starts the Express server
 */

require('dotenv').config();

const app = require('./src/app');
const { pool } = require('./src/config/database');
const logger = require('./src/config/logger');
const { setupSwagger } = require('./src/config/swagger');

const PORT = process.env.PORT || 3000;

setupSwagger(app);

const server = app.listen(PORT, () => {
  logger.info(`Reservation Service running on port ${PORT}`);
});

const shutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully.`);

  server.close(async () => {
    try {
      await pool.end();
      logger.info('Database pool closed successfully.');
      process.exit(0);
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
