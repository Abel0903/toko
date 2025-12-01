const db = require("../db");

exports.getAll = (req, res) => {
    db.query("SELECT * FROM products", (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error" });
        }
        res.json({ success: true, data: result });
    });
};

exports.getById = (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM products WHERE id=?", [id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
        }
        res.json({ success: true, data: result[0] });
    });
};

exports.addProduct = (req, res) => {
    const { name, description, price, stock } = req.body;

    if (!name || !price || stock === undefined) {
        return res.status(400).json({ success: false, message: "Data tidak lengkap" });
    }

    db.query(
        "INSERT INTO products (name, description, price, stock) VALUES (?,?,?,?)",
        [name, description || "", price, stock],
        (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Database error" });
            }
            res.status(201).json({ 
                success: true, 
                message: "Produk ditambahkan",
                productId: result.insertId
            });
        }
    );
};

exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    db.query(
        "UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?",
        [name, description, price, stock, id],
        (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Database error" });
            }
            res.json({ success: true, message: "Produk diperbarui" });
        }
    );
};

exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM products WHERE id=?", [id], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error" });
        }
        res.json({ success: true, message: "Produk dihapus" });
    });
};

exports.addSub = (req, res) => {
    const { product_id, name, price } = req.body;

    if (!product_id || !name || !price) {
        return res.status(400).json({ success: false, message: "Data tidak lengkap" });
    }

    db.query(
        "INSERT INTO subproducts (product_id, name, price) VALUES (?,?,?)",
        [product_id, name, price],
        (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Database error" });
            }
            res.status(201).json({ 
                success: true, 
                message: "Sub produk ditambahkan",
                subProductId: result.insertId
            });
        }
    );
};

exports.updateStock = (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
        return res.status(400).json({ success: false, message: "Stok harus diisi" });
    }

    db.query(
        "UPDATE products SET stock=? WHERE id=?",
        [stock, id],
        (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Database error" });
            }
            res.json({ success: true, message: "Stok diperbarui" });
        }
    );
};
