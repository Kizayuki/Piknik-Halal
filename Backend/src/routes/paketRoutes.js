const express = require("express");
const router = express.Router();
const paketController = require("../controllers/paketController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Publik
router.get("/", paketController.getAllPaket);
router.get("/:id", paketController.getPaketById);

// Admin
router.post("/", verifyToken, paketController.createPaket);
router.delete("/:id", verifyToken, paketController.deletePaket);
router.put("/:id", verifyToken, paketController.updatePaket);

module.exports = router;
