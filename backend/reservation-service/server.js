/**
 * Server Entry Point
 * Starts the Express server
 */

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Placeholder - will be fully implemented in infrastructure phase
app.listen(PORT, () => {
  console.log(`Reservation Service running on port ${PORT}`);
});
