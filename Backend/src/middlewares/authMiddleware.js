const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Token tidak ditemukan, akses ditolak!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token tidak valid atau sudah kadaluarsa!" });
  }
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Super Admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Akses ditolak! Hanya Super Admin yang diizinkan." });
  }
};
