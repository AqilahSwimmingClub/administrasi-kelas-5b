# Cara Mengganti Proyek di GitHub

Unggah seluruh isi folder `administrasi-kelas-5b` ini ke folder proyek yang sama di repository GitHub.

File penting yang harus terganti:

- `package.json`
- `package-lock.json`
- `vercel.json`
- `.npmrc`
- `.gitignore`

Setelah commit selesai, Vercel akan membuat deployment baru otomatis.

Pengaturan Vercel:

- Node.js: `24.x`
- Install: `npm ci --no-audit --no-fund`
- Build: `npm run build`
- Output: `dist`
- Framework: `Vite`

Saat redeploy, jangan gunakan build cache lama.
