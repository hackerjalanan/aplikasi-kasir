# Ruang Kopi

Landing page coffee shop modern yang dibangun dengan Next.js dan Tailwind CSS.

## Deskripsi

Project ini merupakan halaman landing page untuk brand coffee shop bernama Ruang Kopi. Tampilan dibuat dengan pendekatan cinematic dan premium, dengan fokus pada:

- hero section beranimasi
- storytelling coffee journey
- menu favorit
- area ruang kopi
- informasi lokasi dan jam operasional
- call-to-action akhir

## Teknologi

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide React

## Struktur Project

```bash
app/
  globals.css
  layout.tsx
  page.tsx
public/
  images/
lib/
  api-client.ts
  api-error.ts
  api-response.ts
  with-error-handler.ts
types/
  api.ts
```

## Persyaratan

Pastikan perangkat Anda sudah memiliki:

- Node.js 20+
- npm atau pnpm

## Instalasi

```bash
npm install
```

## Menjalankan Project

Untuk menjalankan aplikasi di mode development:

```bash
npm run dev
```

Untuk build production:

```bash
npm run build
```

Untuk menjalankan hasil build:

```bash
npm run start
```

## Catatan

Semua gambar utama menggunakan asset lokal di folder `public/images` agar lebih stabil dan tidak bergantung pada URL eksternal.
