const db = require("../config/db");

exports.getSettings = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM pengaturan LIMIT 1");
    if (rows.length === 0) {
      return res.json({
        nomor_wa: "6281234567890",
        nama_sistem: "Wisata Religi CMS",
        ikon_sistem: "",
      });
    }
    res.json(rows[0]);
  } catch (err) {
    res.json({
      nomor_wa: "6281234567890",
      nama_sistem: "Wisata Religi CMS",
      ikon_sistem: "",
    });
  }
};

exports.updateSettings = async (req, res) => {
  const { nomor_baru, nama_sistem, ikon_sistem } = req.body;
  try {
    await db.execute("DELETE FROM pengaturan");
    await db.execute(
      "INSERT INTO pengaturan (nomor_wa, nama_sistem, ikon_sistem) VALUES (?, ?, ?)",
      [
        String(nomor_baru || ""),
        String(nama_sistem || "Wisata Religi CMS"),
        String(ikon_sistem || ""),
      ],
    );
    res.json({ message: "Pengaturan berhasil disimpan" });
  } catch (err) {
    try {
      await db.execute("DROP TABLE IF EXISTS pengaturan");
      await db.execute(
        "CREATE TABLE pengaturan (id INT AUTO_INCREMENT PRIMARY KEY, nomor_wa VARCHAR(50), nama_sistem VARCHAR(150), ikon_sistem LONGTEXT)",
      );
      await db.execute(
        "INSERT INTO pengaturan (nomor_wa, nama_sistem, ikon_sistem) VALUES (?, ?, ?)",
        [
          String(nomor_baru || ""),
          String(nama_sistem || "Wisata Religi CMS"),
          String(ikon_sistem || ""),
        ],
      );
      res.json({ message: "Pengaturan disimpan & Tabel diperbaiki otomatis!" });
    } catch (fatalErr) {
      console.error("Fatal Error Update Settings:", fatalErr);
      res.status(500).json({ error: fatalErr.message });
    }
  }
};
