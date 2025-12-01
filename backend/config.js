module.exports = {
    // JWT Secret - Change this in production!
    SECRET_KEY: process.env.SECRET_KEY || "tokopro-secret-key-change-in-production",
    
    // TriPay Payment Gateway (optional)
    TRIPAY_API_KEY: process.env.TRIPAY_API_KEY || "",
    TRIPAY_PRIVATE_KEY: process.env.TRIPAY_PRIVATE_KEY || "",
    
    // MySQL Database Configuration
    MYSQL: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || "",
        database: process.env.DB_NAME || "toko",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },
    
    // Server Configuration
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    
    // CORS Configuration
    CORS_ORIGIN: [
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
};
