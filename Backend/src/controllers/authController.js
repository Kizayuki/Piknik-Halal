const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (users.length === 0)
      return res.status(401).json({ message: "Username atau password salah!" });

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Username atau password salah!" });

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login berhasil",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        foto_profil: user.foto_profil,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { foto_profil } = req.body;
  try {
    await db.execute("UPDATE users SET foto_profil = ? WHERE id = ?", [
      foto_profil,
      req.user.id,
    ]);
    res.json({ message: "Profil berhasil diperbarui", foto_profil });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const [users] = await db.execute(
      "SELECT password FROM users WHERE id = ?",
      [req.user.id],
    );
    if (users.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(oldPassword, users[0].password);
    if (!isMatch)
      return res.status(400).json({ message: "Kata sandi lama salah!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await db.execute("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      req.user.id,
    ]);
    res.json({ message: "Kata sandi berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
