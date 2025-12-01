const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token tidak valid' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Akses ditolak' });
    }
    next();
};

module.exports = {
    authMiddleware,
    adminOnly
};
