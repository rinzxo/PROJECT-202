# 🏫 Portal Web Resmi SMAN 2 BABELAN

[![Next.js 15](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.dot.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **"SEKOLAH UNGGUL BERAKHLAKKUL KHARIMAH, BERPRESTASI, KREATIF DAN BERKEBINEKAAN GLOBAL"**

Selamat datang di repositori resmi website **SMA Negeri 2 Babelan**, Kabupaten Bekasi, Jawa Barat. Platform web modern ini dibangun menggunakan teknologi mutakhir untuk memberikan pengalaman visual kelas atas (*high-end visual design*), dinamis, dan informatif bagi seluruh warga sekolah, peserta didik, orang tua, dan masyarakat umum.

---

## ✨ Fitur Unggulan

- 🎨 **Desain Eksekutif & Modern:** Menggabungkan estetika *Glassmorphism*, transisi halus, tata letak *Slanted Header* yang unik, dan palet warna biru kebanggaan sekolah.
- ⚡ **Animasi Interaktif (Framer Motion):** Dilengkapi dengan *micro-animations*, transisi *staggered entrance* pada navigasi mobile, serta efek *hover* yang responsif.
- 🏫 **Profil & Struktur Organisasi Lengkap:** Menampilkan Visi & Misi terbaru (9 poin program strategis), sejarah sekolah, serta profil pimpinan sekolah:
  - **Kepala Sekolah:** Dra. Sri Winanti, M.Pd.
  - **Wakil Kepala Sekolah Bidang Kesiswaan:** Sarkowih, S.Pd.
- 🎭 **Portal Ekstrakurikuler:** Etalase interaktif untuk menampilkan kegiatan non-akademik, pembinaan karakter, dan prestasi siswa.
- 📅 **Event Hub & Galeri Kegiatan:** Dokumentasi visual kegiatan sekolah, festival, pentas seni, dan turnamen olahraga (*SMANDALA Cup*).
- 📂 **Pusat Unduhan & Dokumen:** Akses cepat untuk mengunduh publikasi resmi, kurikulum, dan regulasi sekolah.
- 📱 **Mobile-First & Fully Responsive:** Navigasi *Hamburger Menu* berdesain *full-screen overlay* yang elegan saat diakses melalui ponsel atau tablet.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun di dalam folder `frontend` dengan tumpukan teknologi modern:
- **[Next.js 15](https://nextjs.org/)** — Framework React dengan arsitektur App Router untuk performa optimal dan SEO terbaik.
- **[React 19](https://react.dev/)** — Library UI untuk interaktivitas komponen yang cepat dan reaktif.
- **[TypeScript](https://www.typescriptlang.org/)** — Menjamin keamanan penulisan kode (*type safety*) dan keandalan sistem.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Framework CSS modern untuk styling responsif berkinerja tinggi.
- **[Framer Motion](https://www.framer.com/motion/)** — Library animasi untuk memberikan transisi visual yang halus dan premium.
- **[Lucide React](https://lucide.dev/)** — Ikon vektor modern yang tajam dan ringan.

---

## 🚀 Cara Instalasi & Menjalankan di Lokal

### 1. Prasyarat
Pastikan Anda telah menginstal **[Node.js](https://nodejs.org/)** versi 18 atau terbaru di komputer Anda.

### 2. Kloning Repositori
```bash
git clone https://github.com/username-anda/sman2-babelan.git
cd sman2-babelan
```

### 3. Masuk ke Direktori Frontend
Seluruh kode aplikasi berada di dalam direktori `frontend`:
```bash
cd frontend
```

### 4. Instalasi Dependensi
Jalankan perintah berikut untuk menginstal seluruh paket yang dibutuhkan:
```bash
npm install
# atau
pnpm install
```

### 5. Jalankan Server Pengembangan (Development Server)
Mulai server lokal untuk melihat website:
```bash
npm run dev
# atau
pnpm dev
```

Buka peramban (browser) Anda dan kunjungi **`http://localhost:3000`** untuk melihat hasil rancangan web.

---

## 📁 Struktur Direktori Utama

```text
SMAN 2 BABELAN/
├── frontend/
│   ├── public/
│   │   └── images/          # Aset logo, foto kegiatan, dan latar belakang sekolah
│   ├── src/
│   │   ├── app/             # Halaman website (App Router Next.js)
│   │   │   ├── ekskul/      # Halaman Portal Ekstrakurikuler
│   │   │   ├── events/      # Halaman Event Hub & Agenda
│   │   │   ├── dokumen/     # Halaman Pusat Dokumen
│   │   │   ├── profil/      # Halaman Profil Sekolah & Struktur
│   │   │   ├── globals.css  # Desain sistem & kustomisasi Tailwind
│   │   │   ├── layout.tsx   # Tata letak utama aplikasi (Navbar & Footer)
│   │   │   └── page.tsx     # Halaman Beranda (Hero, Sambutan, Berita, Galeri, CTA)
│   │   ├── components/
│   │   │   ├── layout/      # Komponen navigasi (Navbar, Footer, SlantedHeader)
│   │   │   └── ui/          # Komponen UI interaktif (Card, FadeUp, Button, dll.)
│   │   └── lib/             # Fungsi utilitas pendukung
│   ├── package.json
│   └── tsconfig.json
└── README.md                # Dokumentasi proyek ini
```

---

## 📍 Kontak & Lokasi

**SMA NEGERI 2 BABELAN**
- **Alamat:** Perumahan Babelan MAS Permai No. 366-367, Kec. Babelan, Kabupaten Bekasi - Jawa Barat.
- **Jam Operasional:** Senin – Jumat (07:00 - 16:00 WIB)
- **Email & Layanan:** Admin Sekolah / PPDB

---

### 🛡️ Lisensi & Hak Cipta

© **{new Date().getFullYear()} SMAN 2 BABELAN**. All Rights Reserved.  
Dirancang dan dikembangkan dengan standar keunggulan desain visual modern untuk kemajuan pendidikan Indonesia.
