// TokoPro Backend Configuration
// =============================
// Panduan: Copy file ini menjadi config.js dan update nilai-nilainya

module.exports = {
    // ===== JWT SECRET KEY =====
    // Generate random string untuk production
    // Command: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    SECRET_KEY: "your-secret-key-change-this-in-production",

    // ===== DATABASE CONFIG =====
    MYSQL: {
        host: "localhost",        // Host MySQL
        user: "root",            // MySQL username
        password: "",            // MySQL password (kosongkan jika tidak ada)
        database: "toko",        // Database name
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },

    // ===== PAYMENT GATEWAY (TriPay) =====
    // Daftar di: https://tripay.co.id
    // Dapatkan API key dari dashboard
    TRIPAY_API_KEY: "DEV.xxxxxxxxxxxx",           // Dari TriPay dashboard
    TRIPAY_PRIVATE_KEY: "xxxxxxxxxxxxxxxx",       // Dari TriPay dashboard

    // ===== SERVER CONFIG =====
    PORT: process.env.PORT || 3000,               // Server port
    NODE_ENV: process.env.NODE_ENV || "development",  // Environment

    // ===== CORS CONFIG =====
    CORS_ORIGIN: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        // Tambahkan domain production di sini
        // "https://tokopro.com"
    ],

    // ===== EMAIL CONFIG (optional untuk notifications) =====
    // SMTP_HOST: "smtp.gmail.com",
    // SMTP_PORT: 587,
    // SMTP_USER: "your-email@gmail.com",
    // SMTP_PASS: "your-app-password",

    // ===== LOGGING =====
    LOG_LEVEL: "info",  // debug, info, warn, error
    LOG_FILE: "./logs/app.log",

    // ===== API CONFIG =====
    API_VERSION: "v1",
    API_BASE_PATH: "/api",

    // ===== PAGINATION =====
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,

    // ===== FILE UPLOAD =====
    // MAX_FILE_SIZE: 5 * 1024 * 1024,  // 5MB
    // UPLOAD_DIR: "./uploads",

    // ===== SESSION CONFIG =====
    JWT_EXPIRE: "7d",    // Token expiry
    REFRESH_TOKEN_EXPIRE: "30d",

    // ===== RATE LIMITING =====
    // RATE_LIMIT_WINDOW: 15 * 60 * 1000,  // 15 minutes
    // RATE_LIMIT_MAX_REQUESTS: 100,

    // ===== SECURITY =====
    BCRYPT_ROUNDS: 10,   // Password salt rounds
    MAX_LOGIN_ATTEMPTS: 5,
    LOCK_TIME: 15 * 60 * 1000,  // 15 minutes
};

/*
SETUP GUIDE:
============

1. COPY FILE INI KE config.js
   cp config.example.js config.js

2. UPDATE NILAI-NILAI:
   - SECRET_KEY: Generate random key untuk production
   - MYSQL credentials: Sesuaikan dengan setup Anda
   - TRIPAY keys: Opsional (untuk payment)

3. DATABASE SETUP:
   mysql -u root -p < database.sql

4. INSTALL DEPENDENCIES:
   npm install

5. JALANKAN SERVER:
   node server.js

PRODUCTION CHECKLIST:
====================
- [ ] Ubah SECRET_KEY ke random string
- [ ] Update CORS_ORIGIN dengan domain production
- [ ] Set NODE_ENV ke "production"
- [ ] Enable HTTPS
- [ ] Setup environment variables
- [ ] Backup database
- [ ] Enable monitoring
- [ ] Configure logging
- [ ] Setup error tracking (Sentry, etc)

ENVIRONMENT VARIABLES (untuk production):
==========================================
Export ini sebagai environment variables:

export JWT_SECRET="random-secret-key"
export DB_HOST="production-db-host"
export DB_USER="db-user"
export DB_PASS="db-password"
export DB_NAME="production_db"
export PORT="3000"
export NODE_ENV="production"
export TRIPAY_API_KEY="your-key"

Atau gunakan .env file dengan dotenv package:
npm install dotenv

require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

TROUBLESHOOTING:
================

Q: Connection ECONNREFUSED?
A: Pastikan MySQL running: services.msc

Q: Unknown database 'toko'?
A: Jalankan: mysql -u root -p < database.sql

Q: Cannot find module 'express'?
A: Jalankan: npm install

Q: CORS error?
A: Tambahkan frontend domain ke CORS_ORIGIN

Q: JWT token invalid?
A: Pastikan SECRET_KEY sama di config.js

TESTING:
========

1. Test Connection:
   node -e "require('./config'); console.log('Config loaded successfully')"

2. Test Database:
   node -e "const db = require('./db'); db.query('SELECT 1', console.log)"

3. Test Server:
   curl http://localhost:3000/api/product

MONITORING:
===========

Metrics to track:
- API response times
- Error rates
- Database query performance
- Authentication success/failure
- Payment transaction status

Setup monitoring:
npm install winston
npm install newrelic  (optional)

*/
