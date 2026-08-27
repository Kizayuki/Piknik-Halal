const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/login", authController.login);
router.put("/ganti-password", verifyToken, authController.changePassword);
router.put("/profil", verifyToken, authController.updateProfile);

module.exports = router;
