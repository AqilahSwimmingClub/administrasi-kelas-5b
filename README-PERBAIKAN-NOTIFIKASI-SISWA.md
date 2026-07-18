# Perbaikan Notifikasi dan Tambah Siswa

Pembaruan ini memperbaiki:

- Tambah siswa baru yang sebelumnya gagal karena ID `new` dianggap sebagai ID siswa lama.
- Validasi Nama, NIS, dan NISN.
- Pemeriksaan NIS/NISN ganda.
- Siswa baru langsung muncul pada Data Siswa, Absensi, Penilaian, dan Portal Orang Tua.
- Pusat notifikasi pada ikon lonceng.
- Badge jumlah notifikasi belum dibaca.
- Tombol **Tandai Semua Dibaca**.
- Tombol **Hapus yang Dibaca**.
- Klik notifikasi membuka halaman terkait dan menandainya sebagai sudah dibaca.
- Notifikasi baru dibuat saat siswa ditambah/diperbarui/dihapus, pengumuman diterbitkan, dan agenda ditambahkan.
- Notifikasi ikut tersimpan di localStorage dan Supabase melalui dokumen data kelas yang sama.
