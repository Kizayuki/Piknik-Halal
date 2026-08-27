const express = require("express");
const router = express.Router();
const wisataController = require("../controllers/wisataController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Publik
router.get("/", wisataController.getAllWisata);
router.get("/:id", wisataController.getWisataById);

// Admin
router.post("/", verifyToken, wisataController.createWisata);
router.put("/:id", verifyToken, wisataController.updateWisata);
router.delete("/:id", verifyToken, wisataController.deleteWisata);

module.exports = router;
