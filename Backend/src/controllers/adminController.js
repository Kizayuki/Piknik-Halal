const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getAllAdmins = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, username, role, created_at FROM users",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Semua field harus diisi!" });
  }

  try {
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE username = ?",
      [username],
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Username sudah digunakan!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.execute(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role],
    );

    res.status(201).json({ message: "Akun Admin berhasil dibuat" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.user.id) {
    return res
      .status(400)
      .json({ message: "Anda tidak bisa menghapus akun Anda sendiri!" });
  }

  try {
    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "Admin berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password baru minimal 6 karakter!" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.execute("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      id,
    ]);
    res.json({ message: "Password admin berhasil direset" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, role } = req.body;
  try {
    await db.execute("UPDATE users SET username = ?, role = ? WHERE id = ?", [
      username,
      role,
      id,
    ]);
    res.json({ message: "Data admin berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
