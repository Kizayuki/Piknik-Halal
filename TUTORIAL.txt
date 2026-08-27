=================================================================
  TUTORIAL INSTALASI APLIKASI WISATA RELIGI (PIKNIK HALAL)
=================================================================

Selamat datang! Aplikasi ini adalah platform sistem manajemen 
wisata dan paket perjalanan religi berbasis web (Frontend React/Ionic 
dan Backend Node.js/MySQL).

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi 
ini di komputer/laptop Anda.

-----------------------------------------------------------------
 PERSIAPAN (PRASYARAT UTAMA)
-----------------------------------------------------------------
Sebelum memulai, pastikan komputer Anda sudah terinstal:
1. XAMPP (atau server MySQL lainnya) untuk Database.
2. Node.js (direkomendasikan versi 18 LTS atau terbaru).
3. Text Editor seperti Visual Studio Code (VS Code).

-----------------------------------------------------------------
 LANGKAH 1: KONFIGURASI DATABASE (MySQL)
-----------------------------------------------------------------
1. Buka aplikasi XAMPP, lalu klik "Start" pada Apache dan MySQL.
2. Buka browser dan akses: http://localhost/phpmyadmin
3. Buat database baru (misalnya beri nama: wisata_religi).
4. Klik database tersebut, lalu pilih tab "Import" (Impor).
5. Masukkan file database ".sql" yang ada di dalam folder Backend proyek ini.
6. Klik "Go" / "Kirim" dan tunggu hingga semua tabel berhasil dibuat.

-----------------------------------------------------------------
 LANGKAH 2: MENJALANKAN SERVER BACKEND (Node.js)
-----------------------------------------------------------------
1. Buka folder proyek ini di VS Code.
2. Buka terminal (Terminal -> New Terminal), arahkan ke folder Backend:
   cd Backend
3. Instal semua paket dan library yang dibutuhkan dengan mengetik:
   npm install
4. Buat file baru di dalam folder Backend dengan nama ".env" 
   (Titik di awal sangat penting). Isi file .env tersebut dengan:

   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=wisata_religi
   JWT_SECRET=rahasia_super_aman_123
   PORT=5000

   (Catatan: Sesuaikan DB_NAME dengan nama database yang Anda buat di Langkah 1. Kosongkan DB_PASS jika XAMPP Anda tidak dipassword).

5. Jalankan server Backend dengan mengetik:
   node server.js atau npm run dev
6. Jika berhasil, akan muncul tulisan "Server berjalan di port 5000" dan "Database Terhubung!". Biarkan terminal ini tetap menyala.

-----------------------------------------------------------------
 LANGKAH 3: MENJALANKAN FRONTEND (React/Ionic)
-----------------------------------------------------------------
1. Buka terminal BARU di VS Code (biarkan terminal Backend tetap hidup).
2. Arahkan terminal baru ini ke folder Frontend:
   cd Frontend
3. Instal library Frontend dengan mengetik:
   npm install
4. Jalankan aplikasi web dengan mengetik:
   npm run dev
5. Terminal akan memberikan sebuah link (misalnya: http://localhost:8100 atau http://localhost:5173). 
6. Tekan tombol CTRL + Klik pada link tersebut untuk membukanya di browser Anda.

-----------------------------------------------------------------
 LANGKAH 4: CARA PENGGUNAAN APLIKASI
-----------------------------------------------------------------
- HALAMAN KONSUMEN: 
  Begitu link terbuka, Anda akan langsung disajikan halaman Home Konsumen untuk melihat paket dan destinasi.

- HALAMAN ADMIN:
  Untuk masuk ke dashboard pengelolaan, tambahkan "/admin/login" pada URL di browser Anda.
  Contoh: http://localhost:8100/admin/login

  Gunakan akun yang sudah ada di database untuk login, atau daftar melalui database langsung jika belum ada.


=================================================================
Terima kasih telah mencoba proyek ini! Jika ada kendala, pastikan
kembali koneksi database di file .env sudah benar.
=================================================================