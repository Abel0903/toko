const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

exports.register = (req, res) => {
    let { name, email, password } = req.body;

    // Check if email already exists
    db.query("SELECT * FROM users WHERE email=?", [email], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (rows.length > 0) {
            return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error hashing password" });
            }

            db.query(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                [name, email, hash],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: "Database error" });
                    }

                    res.status(201).json({ 
                        success: true, 
                        message: "Register berhasil",
                        userId: result.insertId 
                    });
                }
            );
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email=?", [email], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (!rows.length) {
            return res.status(401).json({ success: false, message: "Email atau password salah" });
        }

        const user = rows[0];

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error comparing password" });
            }

            if (!result) {
                return res.status(401).json({ success: false, message: "Email atau password salah" });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                SECRET_KEY,
                { expiresIn: "7d" }
            );

            res.json({ 
                success: true,
                message: "Login berhasil",
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        });
    });
};
