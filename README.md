# Loker - Portal Lowongan Kerja Lamongan Terbaru

Aplikasi web agregasi dan pencarian lowongan kerja Kabupaten Lamongan dan sekitarnya dengan antarmuka bergaya **Google Jobs** yang modern, responsif, dan dilengkapi fitur **Pembaruan Otomatis (Auto Scraping API)**.

---

## 🚀 Fitur Utama

- **Tampilan Google Jobs Otentik**: Header pencarian, chip pencarian cepat, filter wilayah (Lamongan, Babat, Paciran, Brondong, dll.), kategori pekerjaan, dan rentang waktu.
- **Split-View Desktop & Mobile Drawer**: Panel daftar lowongan di sebelah kiri dan detail lengkap (gaji, benefit, kualifikasi, kontak HRD/WA) di sebelah kanan.
- **Pembaruan Otomatis (Auto-Scraping Engine)**: Endpoint API `/api/jobs/scrape` untuk menyinkronkan lowongan baru secara berkala.
- **Bookmark & Following**: Simpan lowongan favorit ke penyimpanan lokal serta ikuti kata kunci tertentu.
- **Bagi Lowongan**: Bagikan informasi lowongan ke WhatsApp, Telegram, atau salin tautan dalam satu klik.
- **Mode Gelap & Terang**: Sesuai preferensi tampilan pengguna.

---

## 🛠️ Panduan Push ke GitHub

Jika Anda ingin push project ini ke repository GitHub Anda:
`https://github.com/selerakucs1/Loker`

Jalankan perintah berikut di terminal komputer lokal Anda:

```bash
# 1. Masuk ke direktori proyek
git init
git branch -M main

# 2. Tambahkan semua file ke staging
git add .

# 3. Buat commit pertama
git commit -m "feat: inisialisasi aplikasi lowongan kerja lamongan terbaru"

# 4. Hubungkan remote repository GitHub Anda
git remote add origin https://github.com/selerakucs1/Loker.git

# 5. Push ke GitHub (pastikan Anda sudah login akun GitHub selerakucs1)
git push -u origin main --force
```

---
