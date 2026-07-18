# Administrasi Kelas 5B - SDN Satria Jaya 01

Aplikasi React + Vite untuk administrasi Kelas V tahun pelajaran 2026/2027.

## Isi versi ini

- 33 data siswa dari file Excel pengguna sebagai data awal.
- Tambah, edit, hapus, cari, dan ekspor data siswa.
- Absensi harian: Hadir, Sakit, Izin, Alpa, dan Terlambat.
- Rekap absensi dan cetak/PDF.
- Daftar nilai Kurikulum Merdeka Semester 1 dan Semester 2.
- Format nilai: TP1-TP4 pada LM1-LM5, Sumatif Lingkup Materi, dan Sumatif Akhir Semester.
- Cetak buku nilai lengkap: cover, identitas wali kelas, dan lembar nilai per mata pelajaran.
- Bagian Kepala Sekolah dan Nomor Statistik Sekolah dihapus sesuai permintaan.
- Tanggal dan tempat tanda tangan otomatis ketika dicetak.
- Portal orang tua menggunakan NISN.
- Sinkronisasi Supabase opsional.

## Login awal

- Username guru: `guru`
- Password guru: `kelas5b`
- Portal orang tua: gunakan NISN siswa.

## Vercel

- Framework: Vite
- Root Directory: `./`
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm run build`
- Output Directory: `dist`

## Pembaruan tampilan login

- Halaman login menggunakan gambar kelas 5B yang diberikan pengguna sebagai latar penuh.
- Form login tetap tersedia untuk Guru dan Orang Tua.
- Dashboard guru dan portal orang tua menampilkan footer:
  `Dashboard didesain oleh FAHMI DJAWAS. © 2026 Semua hak dilindungi`
