const db = require("../config/db");

exports.getAllWisata = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM wisata ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWisataById = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM wisata WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Wisata tidak ditemukan" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createWisata = async (req, res) => {
  const { nama_tempat, deskripsi, lokasi, gambar_url } = req.body;
  try {
    await db.execute(
      "INSERT INTO wisata (nama_tempat, deskripsi, lokasi, gambar_url) VALUES (?, ?, ?, ?)",
      [nama_tempat, deskripsi, lokasi, gambar_url],
    );
    res.status(201).json({ message: "Wisata berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWisata = async (req, res) => {
  const { nama_tempat, deskripsi, lokasi, gambar_url } = req.body;
  try {
    await db.execute(
      "UPDATE wisata SET nama_tempat = ?, deskripsi = ?, lokasi = ?, gambar_url = ? WHERE id = ?",
      [nama_tempat, deskripsi, lokasi, gambar_url, req.params.id],
    );
    res.json({ message: "Wisata berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWisata = async (req, res) => {
  try {
    await db.execute("DELETE FROM wisata WHERE id = ?", [req.params.id]);
    res.json({ message: "Wisata berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
