const crypto = require("crypto");
const axios = require("axios");
const db = require("../db");
const { TRIPAY_API_KEY, TRIPAY_PRIVATE_KEY } = require("../config");

exports.getAll = (req, res) => {
    db.query("SELECT * FROM payments", (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error" });
        }
        res.json({ success: true, data: result });
    });
};

exports.createQRIS = async (req, res) => {
    try {
        const { user_id, product_id, amount } = req.body;

        if (!user_id || !product_id || !amount) {
            return res.status(400).json({ success: false, message: "Data tidak lengkap" });
        }

        const payload = {
            method: "QRIS",
            merchant_ref: "INV" + Date.now(),
            amount,
            customer_name: "User",
            customer_email: "user@mail.com"
        };

        const signature = crypto
            .createHmac("sha256", TRIPAY_PRIVATE_KEY)
            .update(JSON.stringify(payload))
            .digest("hex");

        const result = await axios.post(
            "https://tripay.co.id/api/transaction/create",
            payload,
            { 
                headers: { 
                    Authorization: `Bearer ${TRIPAY_API_KEY}`, 
                    "X-Signature": signature 
                } 
            }
        );

        db.query(
            "INSERT INTO payments (user_id, product_id, amount, status, payment_url) VALUES (?,?,?,?,?)",
            [user_id, product_id, amount, "pending", result.data.data.pay_url],
            (err, dbResult) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Database error" });
                }
                res.status(201).json({ 
                    success: true,
                    message: "Payment dibuat",
                    paymentId: dbResult.insertId,
                    pay_url: result.data.data.pay_url 
                });
            }
        );
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || "Payment creation failed" 
        });
    }
};

exports.updatePaymentStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: "Status harus diisi" });
    }

    db.query(
        "UPDATE payments SET status=? WHERE id=?",
        [status, id],
        (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Database error" });
            }
            res.json({ success: true, message: "Status payment diperbarui" });
        }
    );
};
