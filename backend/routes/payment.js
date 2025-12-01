const express = require("express");
const router = express.Router();
const { createQRIS, getAll, updatePaymentStatus } = require("../controllers/paymentController");
const { authMiddleware, adminOnly } = require("../middleware/auth");

router.get("/", authMiddleware, adminOnly, getAll);
router.post("/qris", authMiddleware, createQRIS);
router.put("/:id/status", authMiddleware, adminOnly, updatePaymentStatus);

module.exports = router;
