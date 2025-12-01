const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const errorHandler = require("./middleware/errorHandler");
const { PORT, CORS_ORIGIN } = require("./config");

// Middleware
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/product", require("./routes/product"));
app.use("/api/payment", require("./routes/payment"));

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Server is running" });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
