const mysql = require("mysql2");
const config = require("./config");

const db = mysql.createConnection(config.MYSQL);

db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Error:", err.message);
        console.error("Config:", {
            host: config.MYSQL.host,
            user: config.MYSQL.user,
            database: config.MYSQL.database
        });
        throw err;
    }
    console.log("✅ MySQL connected successfully!");
});

// Handle connection errors
db.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection was closed.');
    }
    if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        console.log('Database had a fatal error.');
    }
    if (err.code === 'PROTOCOL_ENQUEUE_AFTER_NETWORK_ERROR') {
        console.log('Database had a network error.');
    }
});

module.exports = db;
