export type GalleryEntry = {
  id: string;
  title: string;
  date: string;
  description: string;
  longDescription: string;
  coverImage: string;
  driveLink: string;
  photoCount: number;
  photos: string[];
};

export const galleries: GalleryEntry[] = [
  {
    id: "mpls-2026",
    title: "Masa Pengenalan Lingkungan Sekolah (MPLS) 2026",
    date: "15-17 Juli 2026",
    description: "Keseruan rangkaian kegiatan MPLS bagi peserta didik baru angkatan ke-16 SMAN 2 Babelan.",
    longDescription: "Masa Pengenalan Lingkungan Sekolah (MPLS) adalah gerbang awal bagi para siswa baru angkatan ke-16 untuk mengenal budaya, tata tertib, dan kehangatan keluarga besar SMAN 2 Babelan. Diselenggarakan selama 3 hari penuh keceriaan, kegiatan ini diisi dengan seminar motivasi, pengenalan ekstrakurikuler (Demo Ekskul), hingga dinamika kelompok yang mempererat solidaritas.",
    coverImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop",
    driveLink: "https://drive.google.com",
    photoCount: 145,
    photos: [
      "https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
    ]
  },
  {
    id: "ldks-2026",
    title: "Latihan Dasar Kepemimpinan Siswa (LDKS)",
    date: "12-14 Agustus 2026",
    description: "Pembekalan materi kepemimpinan dan pembentukan karakter calon pengurus OSIS periode baru.",
    longDescription: "LDKS dirancang khusus untuk menanamkan jiwa kepemimpinan, disiplin, dan tanggung jawab kepada calon pengurus OSIS. Melalui pelatihan fisik, sesi debat, dan simulasi manajemen masalah, setiap individu ditempa untuk menjadi pemimpin yang berkarakter kuat dan siap melayani organisasi.",
    coverImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop",
    driveLink: "https://drive.google.com",
    photoCount: 320,
    photos: [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: "hut-ri-81",
    title: "Perayaan Hari Kemerdekaan RI ke-81",
    date: "17 Agustus 2026",
    description: "Upacara pengibaran bendera merah putih dan berbagai perlombaan antar kelas yang meriah.",
    longDescription: "Semarak kemerdekaan bergema di lapangan SMAN 2 Babelan. Dimulai dengan upacara pengibaran bendera yang khidmat oleh Paskibraka sekolah, acara dilanjutkan dengan berbagai lomba tradisional antar kelas seperti tarik tambang, panjat pinang, dan balap karung yang memancing gelak tawa dan sportivitas.",
    coverImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop",
    driveLink: "https://drive.google.com",
    photoCount: 210,
    photos: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=2011&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: "sumpah-pemuda-2026",
    title: "Peringatan Bulan Bahasa & Sumpah Pemuda",
    date: "28 Oktober 2026",
    description: "Pentas seni panggung gembira, lomba baca puisi, cipta cerpen, dan kompetisi mading 3D.",
    longDescription: "Bulan Oktober adalah milik para seniman dan pemuda. OSIS menyelenggarakan Bulan Bahasa yang diisi dengan kompetisi literasi dan ditutup dengan pentas seni Sumpah Pemuda yang spektakuler. Di sini, bakat-bakat terpendam siswa dalam bermusik, teater, dan menari ditampilkan di atas panggung.",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
    driveLink: "https://drive.google.com",
    photoCount: 185,
    photos: [
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?q=80&w=2070&auto=format&fit=crop"
    ]
  }
];
