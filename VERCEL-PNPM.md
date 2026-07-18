# Deployment Vercel dengan pnpm

Proyek ini sengaja menggunakan pnpm untuk menghindari bug npm `Exit handler never called!`.

## Environment Variable wajib di Vercel

Tambahkan:

- `ENABLE_EXPERIMENTAL_COREPACK` = `1`

Pertahankan juga:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CLASS_ID`

## Build Settings

- Node.js Version: `24.x`
- Framework Preset: `Vite`
- Install Command: `pnpm install --no-frozen-lockfile`
- Build Command: `pnpm run build`
- Output Directory: `dist`

Hapus override Install Command lama yang menjalankan npm, atau ganti persis dengan perintah pnpm di atas.
Redeploy tanpa menggunakan Build Cache.
