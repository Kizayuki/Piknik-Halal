const db = require("../config/db");

exports.getAllPaket = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.*, GROUP_CONCAT(dp.wisata_id) AS wisata_ids
      FROM paket_wisata p
      LEFT JOIN detail_paket dp ON p.id = dp.paket_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    const formattedRows = rows.map((row) => ({
      ...row,
      wisata_ids: row.wisata_ids ? row.wisata_ids.split(",").map(Number) : [],
    }));

    res.json(formattedRows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaketById = async (req, res) => {
  const paketId = req.params.id;
  try {
    const [paket] = await db.execute(
      "SELECT * FROM paket_wisata WHERE id = ?",
      [paketId],
    );
    if (paket.length === 0)
      return res.status(404).json({ message: "Paket tidak ditemukan" });

    const [wisataList] = await db.execute(
      `
            SELECT w.* FROM wisata w
            JOIN detail_paket dp ON w.id = dp.wisata_id
            WHERE dp.paket_id = ?
        `,
      [paketId],
    );

    const responseData = paket[0];
    responseData.daftar_wisata = wisataList;

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPaket = async (req, res) => {
  const {
    nama_paket,
    durasi,
    deskripsi_singkat,
    fasilitas,
    harga,
    gambar_url,
    wisata_ids,
  } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      "INSERT INTO paket_wisata (nama_paket, durasi, deskripsi_singkat, fasilitas, harga, gambar_url) VALUES (?, ?, ?, ?, ?, ?)",
      [nama_paket, durasi, deskripsi_singkat, fasilitas, harga, gambar_url],
    );
    const paketId = result.insertId;

    if (wisata_ids && Array.isArray(wisata_ids) && wisata_ids.length > 0) {
      for (const wisataId of wisata_ids) {
        await connection.execute(
          "INSERT INTO detail_paket (paket_id, wisata_id) VALUES (?, ?)",
          [paketId, wisataId],
        );
      }
    }

    await connection.commit();
    res.status(201).json({ message: "Paket berhasil ditambahkan" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

exports.deletePaket = async (req, res) => {
  try {
    await db.execute("DELETE FROM paket_wisata WHERE id = ?", [req.params.id]);
    res.json({ message: "Paket berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePaket = async (req, res) => {
  const {
    nama_paket,
    durasi,
    deskripsi_singkat,
    fasilitas,
    harga,
    gambar_url,
    wisata_ids,
  } = req.body;
  const paketId = req.params.id;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      "UPDATE paket_wisata SET nama_paket = ?, durasi = ?, deskripsi_singkat = ?, fasilitas = ?, harga = ?, gambar_url = ? WHERE id = ?",
      [
        nama_paket,
        durasi,
        deskripsi_singkat,
        fasilitas,
        harga,
        gambar_url,
        paketId,
      ],
    );

    await connection.execute("DELETE FROM detail_paket WHERE paket_id = ?", [
      paketId,
    ]);

    if (wisata_ids && Array.isArray(wisata_ids) && wisata_ids.length > 0) {
      for (const wisataId of wisata_ids) {
        await connection.execute(
          "INSERT INTO detail_paket (paket_id, wisata_id) VALUES (?, ?)",
          [paketId, wisataId],
        );
      }
    }

    await connection.commit();
    res.json({ message: "Paket berhasil diperbarui" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};
