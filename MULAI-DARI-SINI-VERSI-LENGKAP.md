# Fahmi Djawas Administrasi Kelas 5B — Versi Lengkap Cloud + Android

Project ini memakai satu sumber data Supabase untuk website dan aplikasi Android.

## Konfigurasi yang sudah terpasang

- Nama aplikasi: **Fahmi Djawas Administrasi Kelas 5B**
- Android Application ID: `id.fahmidjawas.administrasikelas5b`
- Supabase URL: sudah dimasukkan ke `.env.production`
- Class ID bersama: `kelas-5b-sdn-satria-jaya-01`
- Tabel: `public.class_app_data`
- Realtime: aktif melalui `supabase/schema.sql`

Publishable key Supabase memang digunakan di frontend. Jangan pernah memasukkan service-role key atau password database ke project.

## Menjalankan website

Gunakan Node.js 20, 21, atau 22. Node.js 22 LTS disarankan.

```bat
npm install
npm run dev
```

Build produksi:

```bat
npm run build
```

## Membuka project Android

Folder `android` sudah tersedia. Tidak perlu menjalankan `npx cap init` atau `npx cap add android` lagi.

```bat
npm install
npm run android:open
```

Perintah tersebut akan melakukan build web, menyalin hasilnya ke Android, dan membuka Android Studio.

Bila Android Studio tidak terbuka otomatis:

1. Buka Android Studio secara manual.
2. Pilih **Open**.
3. Pilih folder `android` di dalam project ini.

## Membuat APK debug

Di Windows:

```bat
npm run android:apk
```

APK berada di:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

Atau di Android Studio pilih:

```text
Build > Build Bundle(s) / APK(s) > Build APK(s)
```

## Deploy website ke GitHub dan Vercel

Unggah isi folder project ini ke repository yang terhubung dengan Vercel. Gunakan commit:

```text
feat: rilis versi lengkap sinkron HP website dan Android
```

Di Vercel, pastikan hanya tiga variabel berikut yang ada:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_CLASS_ID
```

Nilai `VITE_CLASS_ID` harus sama persis dengan:

```text
kelas-5b-sdn-satria-jaya-01
```

Setelah push ke branch `main`, tunggu deployment terbaru berstatus **Ready**.

## Cara memastikan sinkronisasi berjalan

1. Buka Supabase > Table Editor > `class_app_data`.
2. Input satu data percobaan dari aplikasi Android.
3. Pastikan muncul baris dengan `class_id` = `kelas-5b-sdn-satria-jaya-01`.
4. Buka website dan refresh sekali setelah deployment pertama.
5. Perubahan berikutnya akan diterima melalui Realtime.

Jika data tidak masuk ke Supabase, aplikasi Android belum dibangun ulang dari project ini. Jalankan:

```bat
npm run build
npx cap sync android
```

Kemudian hapus aplikasi lama di HP dan instal ulang build terbaru.

## Catatan penyimpanan offline

Aplikasi tetap menyimpan salinan lokal saat internet terputus. Ketika koneksi kembali, perubahan akan dikirim ke Supabase. Status sinkronisasi terlihat di aplikasi.
