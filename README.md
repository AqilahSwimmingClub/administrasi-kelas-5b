# Administrasi Kelas 5B

Aplikasi React + Vite untuk administrasi kelas: login guru/orang tua, dashboard, data siswa, absensi, penilaian, ekspor PDF/Word/Excel, portal orang tua, pengaturan, backup-restore, sinkronisasi cloud opsional, dan PWA.

## Menjalankan di VS Code

```bash
npm install
npm run dev
```

Akun demo:
- Guru: `guru` / `kelas5b`
- Orang tua: NISN `0123456789`

## Sinkronisasi HP, website, dan portal orang tua

Tanpa konfigurasi cloud, aplikasi memakai `localStorage` dan hanya tersimpan pada perangkat yang sedang digunakan.

Agar setiap input guru di HP otomatis muncul di website dan portal orang tua:

1. Buat proyek Supabase.
2. Buka SQL Editor, lalu jalankan isi `supabase/schema.sql`.
3. Salin `.env.example` menjadi `.env`.
4. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari pengaturan API Supabase.
5. Jalankan ulang `npm run dev` atau build ulang aplikasi.

Saat aktif, indikator di bagian atas berubah menjadi **☁ Tersinkron**. Perubahan disimpan ke cloud dan diperbarui secara real-time pada perangkat lain yang memakai `VITE_CLASS_ID` sama.

> Catatan keamanan: kebijakan SQL bawaan dibuat sederhana supaya demo langsung berfungsi. Sebelum dipakai untuk data siswa sebenarnya, aktifkan Supabase Auth dan batasi Row Level Security berdasarkan akun/sekolah.

## Build produksi

```bash
npm run build
npm run preview
```

## Deployment Vercel (Node.js 24)

1. Pastikan **Root Directory** menunjuk ke folder yang berisi `package.json`.
2. Atur **Framework Preset** ke `Vite`.
3. Atur **Node.js Version** ke `24.x`.
4. Gunakan perintah berikut:
   - Install Command: `npm ci --no-audit --no-fund`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Tambahkan Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CLASS_ID=kelas-5b`
6. Jangan pernah memasukkan `sb_secret_...` ke GitHub atau Vercel frontend.

File `vercel.json` sudah menyimpan pengaturan build. Dependensi sudah dikunci ke versi tertentu dan `package-lock.json` memakai registry publik npm.
