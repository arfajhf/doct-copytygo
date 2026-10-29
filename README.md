# CopyTyGo documentation website

Website dokumentasi **Vite + TypeScript**, terpisah dari framework CopyTyGo. Halaman dihasilkan sebagai HTML statis dari Markdown sebelum Vite membundel CSS dan JavaScript. Tidak memerlukan Astro, Starlight, atau server Go.

## Persyaratan

- Node.js **20.19+ atau 22.12+**. Node **22.23.1** didukung dan diuji di CI.
- npm; gunakan `npm ci` agar versi dependency mengikuti lockfile.

## Menjalankan website

```bash
npm ci
npm run dev
```

Buka URL lokal yang dicetak Vite, default `http://localhost:4321`. Perubahan Markdown, metadata rilis, dan asset publik menghasilkan ulang HTML dan memuat ulang halaman. Setelah mengubah generator/config, restart dev server.

```bash
npm run build
npm test
node scripts/check-links.mjs
npm run preview
```

Output produksi ada di **`dist/`**. Seluruh artikel, navigasi, heading, dan metadata sudah ada pada HTML, sehingga tetap dapat dibaca tanpa JavaScript. JavaScript menambahkan pencarian lokal, salin kode, tema, dan menu mobile.

## Struktur

```text
src/content/docs/      Artikel Markdown dengan title/description
src/data/releases.json Snapshot GitHub Releases
src/site/             Layout HTML, landing page, navigasi, metadata
src/client/           Interaksi TypeScript dan algoritme pencarian
src/styles/site.css   Tema dan layout responsive
scripts/generate.ts   Markdown → HTML, highlighting, search, SEO
vite.config.ts        Build multipage dan content reload
public/               Logo asli dan asset statis
.generated/           Halaman hasil generator (diabaikan Git)
dist/                 Hasil build produksi (diabaikan Git)
```

`npm run dev` dan `npm run build` menjalankan generator otomatis. Tidak perlu menjalankan perintah setup tambahan. Artikel biasa menggunakan `.md`, bukan MDX. Tambah artikel ke `src/content/docs/` dan navigasi di `src/site/content.ts`. Heading menghasilkan permalink; blok kode Go/TypeScript menggunakan Shiki dengan tombol salin. Pencarian tidak memakai layanan eksternal dan bekerja pada dev maupun produksi.

## URL produksi dan SEO

Tetapkan **`SITE_URL`** ke origin HTTPS resmi saat build, misalnya melalui environment variable hosting. Default development adalah `http://localhost:4321`; ganti sebelum publikasi. Generator menghasilkan canonical URL, Open Graph/Twitter metadata, `sitemap.xml`, `robots.txt`, dan `404.html`.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node version: `22.23.1` atau versi baru yang kompatibel
- Environment: `SITE_URL` = origin resmi

Tanpa adapter atau runtime server. Route `/docs/` memiliki halaman redirect HTML menuju `/docs/v5/`.

## VPS / Nginx

Salin isi `dist/` ke document root. Gunakan URL direktori untuk halaman dokumentasi:

```nginx
location = /docs { return 301 /docs/v5/; }
location = /docs/ { return 301 /docs/v5/; }
location / { try_files $uri $uri/ =404; }
error_page 404 /404.html;
```

Jangan menambahkan SPA fallback ke `/index.html`: website ini multipage dan sudah memiliki HTML per route.

## Rilis dan sumber konten

Baseline framework: `arfajhf/copytygo`, tag **v5.0.0**, commit `203ce2554bb99fe41000c368a0213c22ec587711`. Logo disalin dari `branding/logo.png`. Panduan authentication, resource security, deployment, dan changelog mempertahankan teks upstream; panduan lain adalah ringkasan Indonesia dengan referensi yang dipin ke source.

```bash
npm run releases:sync
```

Perintah ini mengambil GitHub Releases, mengecualikan draft/prerelease dan milestone internal v4 dari rekomendasi. Optional `GITHUB_TOKEN` hanya dipakai script Node; jangan memasukkannya ke environment `VITE_*`. Snapshot direview dan di-commit; website tidak membutuhkan token atau akses GitHub saat dibuka.

Metadata rekomendasi dapat berubah tanpa mengubah command instalasi yang dipin. Review konten tag baru sebelum memperbarui command dan alias `/docs/`. Pertahankan URL major lama saat menambah `/docs/vN/`.

Contoh framework belum dieksekusi terhadap Go/database oleh website ini. Migrasi ke Vite tidak mengubah source framework atau klaim kemampuan v5.
