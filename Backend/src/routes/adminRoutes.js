const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, isSuperAdmin } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, isSuperAdmin, adminController.getAllAdmins);
router.post("/", verifyToken, isSuperAdmin, adminController.createAdmin);
router.delete("/:id", verifyToken, isSuperAdmin, adminController.deleteAdmin);
router.put("/:id", verifyToken, isSuperAdmin, adminController.updateAdmin);
router.put(
  "/:id/reset-password",
  verifyToken,
  isSuperAdmin,
  adminController.resetPassword,
);

module.exports = router;
