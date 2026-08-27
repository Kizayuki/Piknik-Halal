const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { verifyToken, isSuperAdmin } = require("../middlewares/authMiddleware");

router.get("/wa", settingsController.getSettings);
router.put("/wa", verifyToken, isSuperAdmin, settingsController.updateSettings);

module.exports = router;
