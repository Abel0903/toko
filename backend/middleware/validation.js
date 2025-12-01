// Input validation middleware
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 3) {
        return res.status(400).json({ success: false, message: 'Nama minimal 3 karakter' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Email tidak valid' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email dan password harus diisi' });
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateEmail,
    validatePassword
};
