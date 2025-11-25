require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const reservationNotificationRoutes = require("./routes/reservationNotificationRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Simple health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "notification-service" });
});

// Notification routes
app.use("/api/notifications", reservationNotificationRoutes);

// Start server
if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 4003;
    app.listen(PORT, () => {
        console.log(`Notification service listening on port ${PORT}`);
    });
}

module.exports = app;
