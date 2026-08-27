const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const authRoutes = require("./src/routes/authRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");
const wisataRoutes = require("./src/routes/wisataRoutes");
const paketRoutes = require("./src/routes/paketRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/pengaturan", settingsRoutes);
app.use("/api/wisata", wisataRoutes);
app.use("/api/paket", paketRoutes);
app.use("/api/admins", adminRoutes);

app.get("/", (req, res) => {
  res.send("API Wisata Religi Berjalan Normal");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
