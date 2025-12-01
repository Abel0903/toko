const express = require("express");
const router = express.Router();
const { addProduct, addSub, updateStock, getAll, getById, updateProduct, deleteProduct } = require("../controllers/productController");
const { authMiddleware, adminOnly } = require("../middleware/auth");

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authMiddleware, adminOnly, addProduct);
router.put("/:id", authMiddleware, adminOnly, updateProduct);
router.delete("/:id", authMiddleware, adminOnly, deleteProduct);
router.post("/sub", authMiddleware, adminOnly, addSub);
router.put("/:id/stock", authMiddleware, adminOnly, updateStock);

module.exports = router;
