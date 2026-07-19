# Sinkronisasi Final HP ↔ Website

Aplikasi menyimpan seluruh data kelas dalam satu dokumen JSON pada tabel Supabase `class_app_data`.
Dengan demikian seluruh modul berikut menggunakan sumber data yang sama:

- Data siswa
- Absensi dan riwayat perubahan
- Penilaian harian
- Tujuan pembelajaran
- Nilai rapor dan deskripsi
- Kelengkapan rapor
- Jadwal
- Pengumuman
- Portal orang tua
- Pengaturan aplikasi

## Variabel Vercel

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CLASS_ID`

## Perilaku offline

Perubahan tetap disimpan di perangkat. Saat koneksi internet kembali, aplikasi otomatis mengirim data terbaru ke Supabase.
Status sinkronisasi tampil sebagai: Menghubungkan, Menunggu simpan, Menyimpan, Tersinkron, Offline, atau Gagal sinkron.

## Catatan keamanan

Versi ini memakai kebijakan RLS terbuka untuk satu kelas agar mudah digunakan. Untuk penggunaan sekolah yang lebih luas, tambahkan Supabase Auth dan kebijakan akses per pengguna.
