const express = require("express");
const app = express();

// Simple check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Notification service listening on port ${PORT}`);
});

module.exports = app;
