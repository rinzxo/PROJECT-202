export type ProgramKerja = {
  nama: string;
  tujuan: string;
  jangka: string;
  waktu: string;
  keterangan: "TERLAKSANA" | "TIDAK TERLAKSANA" | "BELUM TERLAKSANA";
};

export type Anggota = {
  name: string;
  gender: "L" | "P";
};

export type SekbidData = {
  id: number;
  title: string;
  ketua: { name: string; gender: "L" | "P" };
  anggota: Anggota[];
  programs: ProgramKerja[];
};

export const getGenderImage = (gender: "L" | "P") => {
  if (gender === "L") {
    // Placeholder Laki-laki
    return "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&fit=crop";
  } else {
    // Placeholder Perempuan
    return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&fit=crop";
  }
};

export const sekbidData: SekbidData[] = [
  {
    id: 1,
    title: "Keimanan dan Ketaqwaan terhadap Tuhan Yang Maha Esa",
    ketua: { name: "Anindya Nur Ramadhani", gender: "P" },
    anggota: [
      { name: "Kamilla Salsabila Ramadhani", gender: "P" },
      { name: "M. Rizki Faiz Rabbani", gender: "L" }
    ],
    programs: [
      { nama: "Melaksanakan Acara dan Lomba Hari Santri Nasional.", tujuan: "Memperingati dan memeriahkan perjuangan para santri terdahulu serta menumbuhkan semangat, kebersamaan dan kreativitas siswa siswi SMAN 2 Babelan.", jangka: "Pendek", waktu: "22 Oktober 2025", keterangan: "TERLAKSANA" },
      { nama: "Infaq.", tujuan: "Menunjukkan rasa syukur kepada Allah dan membantu sesama yang membutuhkan.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA" },
      { nama: "Mengadakan Kegiatan Smandala Berbagi", tujuan: "Mengajarkan pentingnya berbagi kepada orang yang lebih membutuhkan serta menumbuhkan rasa syukur terhadap Allah SWT.", jangka: "Pendek", waktu: "6 Maret 2026", keterangan: "TERLAKSANA" },
      { nama: "Melaksanakan Kegiatan Isro’miraj berkolaborasi dengan ekskul ROHIS.", tujuan: "Menumbuhkan akhlak mulia dan karakter religus serta memperdalam pemahaman tentang ilmu agama bagi siswa/siswi SMAN 2 Babelan.", jangka: "Pendek", waktu: "Januari 2026", keterangan: "TERLAKSANA" },
      { nama: "Mendokumentasikan dan Mengunggah Kegiatan Natal melalui Instagram OSISMANDUA.", tujuan: "Mengabadikan momen kelahiran Yesus Kristus serta menyebarkan semangat sukacita, toleransi dan keberagaman di lingkungan SMAN 2 Babelan.", jangka: "Pendek", waktu: "Setahun Sekali", keterangan: "TIDAK TERLAKSANA" },
      { nama: "Pojok Harmoni dan Toleransi.", tujuan: "Menumbuhkan sikap toleransi, menghargai keberagaman, serta menciptakan lingkungan sekolah yang harmonis dan saling menghormati.", jangka: "Panjang", waktu: "6 Bulan Sekali", keterangan: "TERLAKSANA" },
      { nama: "Berkontribusi dalam Pelaksanaan Kegiatan Maulid Nabi.", tujuan: "Menumbuhkan akhlak mulia dan karakter religus serta memperdalam pemahaman tentang ilmu agama bagi siswa siswi SMAN 2 Babelan.", jangka: "Pendek", waktu: "September 2026", keterangan: "BELUM TERLAKSANA" },
    ]
  },
  {
    id: 2,
    title: "Budi Pekerti Luhur atau Akhlak Mulia",
    ketua: { name: "Ais Suci Ramadhani", gender: "P" },
    anggota: [
      { name: "Keilani Callista Zega", gender: "P" }
    ],
    programs: [
      { nama: "Memeriksa atribut siswa/i setiap upacara.", tujuan: "Untuk menjaga kedisiplinan dan memberikan pembinaan bagi siswa/ i tentang pentingnya mengenakan atribut dengan benar.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA" },
      { nama: "Melaksanakan tata tertib, kultur sekolah dan kebersihan lingkungan.", tujuan: "Meningatkan ketertiban kepada siswa/ i SMAN 2 Babelan agar menaati peraturan maupun sanksi yang berlaku. Serta menjaga kebersihan lingkungan sekolah.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA" },
      { nama: "Melakukan razia dadakan.", tujuan: "Membantu menciptakan lingkungan sekolah agar lebih tertib dan kondusif untuk belajar dan memastikan bahwa siswa/ i mematuhi aturan yang berlaku di sekolah.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA" },
      { nama: "Membuat video edukatif.", tujuan: "Untuk membentuk kepribadian siswa/ i sesuai dengan norma yang berlaku di sekolah.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA" },
      { nama: "Gerakan Berbagi (gebar).", tujuan: "Untuk membantu siswa/ i yang belum memiliki atribut sekolah yang belum/ tidak lengkap.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TIDAK TERLAKSANA" },
      { nama: "Melaksanakan Hari Guru.", tujuan: "Untuk mengapresiasi jasa dan dedikasi guru, mempererat silaturahmi warga sekolah, menumbuhkan rasa hormat siswa kepada guru di sekolah, serta menjadi wadah kreativitas dan kebersamaan panitia.", jangka: "Pendek", waktu: "25 November 2025", keterangan: "TERLAKSANA" },
      { nama: "Berbagi Takjil Ketika Bulan Ramadhan.", tujuan: "Untuk meningkatkan rasa solidaritas seperti mendorong siswa untuk saling berbagi dan peduli terhadap sesama, terutama selama bulan suci dan membantu menyediakan makanan & minuman untuk berbuka puasa.", jangka: "Pendek", waktu: "Bulan Ramadhan", keterangan: "TERLAKSANA" },
    ]
  },
  {
    id: 3,
    title: "Kepribadian Unggul, Wawasan Kebangsaan dan Bela Negara",
    ketua: { name: "Frida Agista Wati", gender: "P" },
    anggota: [
      { name: "Suci Natania", gender: "P" },
      { name: "Diva Eka Octavia", gender: "P" }
    ],
    programs: [
      { nama: "Melatih Siswa/i SMAN 2 Babelan untuk melaksanakan Upacara setiap Senin.", tujuan: "Membantu meningkatkan kedisiplinan dan rasa tanggung jawab melalui pembiasaan dalam melaksanakan upacara bendera", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA" },
      { nama: "Melaksanakan upacara/apel pada hari Nasional (Hari Kartini, Hari Kebangkitan Nasional, Hari Lahir Pancasila, dll).", tujuan: "Menghormati dan memperingati hari besar nasional", jangka: "Panjang", waktu: "Sesuai Hari Besar", keterangan: "TERLAKSANA" },
      { nama: "Upacara Hari Kemerdekaan RI.", tujuan: "Untuk menumbuhkan rasa Nasionalisme siswa/siswi SMAN 2 BABELAN dan cinta tanah air", jangka: "Pendek", waktu: "17 Agustus 2026", keterangan: "TERLAKSANA" },
      { nama: "Melaksanakan lomba 17 Agustus.", tujuan: "Untuk meningkatkan kekompakan dan sportivitas antar siswa/siswi melalui berbagai macam perlombaan", jangka: "Pendek", waktu: "13 - 14 Agustus 2026", keterangan: "TERLAKSANA" },
    ]
  },
  {
    id: 4,
    title: "Prestasi Akademik, Seni, dan Olahraga",
    ketua: { name: "Quaneisha Zata S.P", gender: "P" },
    anggota: [
      { name: "Athallah Dhiwa Aditya", gender: "L" },
      { name: "Alvi Khorin Nisa", gender: "P" }
    ],
    programs: [
      { nama: "Classmeeting.", tujuan: "Untuk mengembangkan bakat minat dan bakat di bidang non akademis.", jangka: "Pendek", waktu: "Desember 2025 dan Juni 2026", keterangan: "TERLAKSANA" },
      { nama: "Berkolaborasi dengan sekbid 3 diacara hardiknas.", tujuan: "Menguji dan meningkatkan kemampuan berfikir kritis siswa-siswi SMAN 2 Babelan.", jangka: "Pendek", waktu: "5-6 Mei 2025", keterangan: "TERLAKSANA" },
      { nama: "Mencetak poster / menyebarkan informasi perlombaan antar sekolah.", tujuan: "Mengoptimalkan mading sekolah sebagai sarana informasi lomba online untuk mendorong partisipasi dan minat siswa dalam mendaftar.", jangka: "Panjang", waktu: "4 bulan sekali.", keterangan: "TERLAKSANA" },
    ]
  },
  {
    id: 5,
    title: "Demokrasi, Hak Asasi Manusia, Lingkungan Hidup, dan Toleransi Sosial",
    ketua: { name: "Aura Khoirunisha", gender: "P" },
    anggota: [
      { name: "Hasna Kamila Khairunnisa", gender: "P" },
      { name: "Joelya Callysta Putricia Ndoen", gender: "P" }
    ],
    programs: [
      { nama: "Mading Bergilir", tujuan: "Wadah kreativitas siswa, sarana penyebaran informasi bertema demokrasi/HAM/lingkungan, serta menumbuhkan minat baca (literasi) siswa di sekolah", jangka: "Panjang", waktu: "2 Minggu Sekali", keterangan: "TIDAK TERLAKSANA" },
      { nama: "Video Edukasi", tujuan: "Mengedukasi siswa secara modern dan interaktif melalui media sosial mengenai nilai-nilai toleransi, hak asasi manusia, pencegahan bullying, dan kepedulian lingkungan.", jangka: "Panjang", waktu: "Kondisional / Insidental", keterangan: "TERLAKSANA" },
      { nama: "Lomba Konten Video dengan Tema 'Hak Mendapatkan Pendidikan yang Layak'", tujuan: "Meningkatkan kesadaran siswa mengenai pentingnya pemerataan pendidikan, mengasah bakat sinematografi.", jangka: "Pendek", waktu: "Kondisional / Insidental", keterangan: "BELUM TERLAKSANA" },
      { nama: "Mengadakan Kegiatan Masa Pengenalan Lingkungan Sekolah (MPLS)", tujuan: "Menyambut siswa baru, mengenalkan budaya positif, tata tertib, organisasi sekolah.", jangka: "Pendek", waktu: "14-21 Juli 2026", keterangan: "TERLAKSANA" },
      { nama: "Mengadakan kegiatan Pemilihan Ketua dan Wakil Ketua OSIS", tujuan: "Mengimplementasikan sistem demokrasi secara nyata di sekolah, melatih siswa menggunakan hak suaranya dengan bijak.", jangka: "Pendek", waktu: "11 September 2026", keterangan: "BELUM TERLAKSANA" },
    ]
  },
  {
    id: 6,
    title: "Kreativitas, Keterampilan dan Kewirausahaan",
    ketua: { name: "Revia Dyra Ayu Lestari", gender: "P" },
    anggota: [
      { name: "Aisyah Nur Azzahra", gender: "P" },
      { name: "Ersa Cahaya Ramadhani", gender: "P" }
    ],
    programs: [
      { nama: "Mengadakan Bazar atau Market.", tujuan: "Mengajarkan kepada seluruh siswa siswi SMAN 2 BABELAN untuk melatih keterampilan kewirausahaan, kreativitas, dan tanggung jawab.", jangka: "Panjang", waktu: "26 Juni 2025", keterangan: "TERLAKSANA" },
      { nama: "Berjualan Takjil.", tujuan: "Menambah pemasukan kas OSIS guna mendukung kegiataan organisasi lainnya.", jangka: "Pendek", waktu: "Bulan Ramadhan", keterangan: "TERLAKSANA" },
      { nama: "Menyiapkan konsumsi panitia.", tujuan: "Memenuhi kebutuhan konsumsi anggota OSIS dan MPK agar tetap berenergi dan fokus dalam menjalankan tugas.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA" },
      { nama: "Berjualan pada saat Event Sekolah.", tujuan: "Mendukung kelancaran acara dengan menyediakan jajanan sehingga warga dapat lebih menikmati kegiatan.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA" },
    ]
  },
  {
    id: 7,
    title: "Kualitas Jasmani, Kesehatan, dan Gizi",
    ketua: { name: "Dika Alfiyansyah", gender: "L" },
    anggota: [
      { name: "Lovely Marta Julieta", gender: "P" },
      { name: "Khairunnisa Intan Nurullina", gender: "P" }
    ],
    programs: [
      { nama: "SMANDALA EDUKASI & HEALTH POSTER.", tujuan: "Mengedukasi siswa-siswi SMAN 2 BABELAN dalam hal terkait dengan kesehatan.", jangka: "Panjang", waktu: "Satu Bulan Sekali", keterangan: "TIDAK TERLAKSANA" },
      { nama: "Menyelenggarakan kegiatan senam bersama.", tujuan: "Mengajak siswa-siswi bergerak aktif dan menjaga Kesehatan.", jangka: "Panjang", waktu: "Satu Bulan Sekali", keterangan: "TERLAKSANA" },
      { nama: "Pembagian tablet tambah darah.", tujuan: "Mengedukasi dan memastikan pengonsumsian TTD secara rutin.", jangka: "Panjang", waktu: "Satu Bulan Sekali", keterangan: "TERLAKSANA" },
      { nama: "Mengkoordinasikan PMR setiap upacara/apel/event.", tujuan: "Menjaga siswa-siswi yang sedang sakit/cedera saat kegiatan.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA" },
      { nama: "Menyediakan serta mengecek persediaan obat-obatan.", tujuan: "Memastikan persediaan obat-obatan serta memastikan kelayakan konsumsi.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA" },
      { nama: "Mendata siswa-siswi yang memiliki Riwayat penyakit.", tujuan: "Memantau kondisi Kesehatan siswa-siswi serta memudahkan pemberian penanganan yang diperlukan.", jangka: "Pendek", waktu: "Satu Bulan Sekali", keterangan: "TERLAKSANA" },
    ]
  },
  {
    id: 8,
    title: "Sastra dan Budaya",
    ketua: { name: "Unaisa", gender: "P" },
    anggota: [
      { name: "Khansa Amabel Surya", gender: "P" },
      { name: "Lutfiah Khairunnisa", gender: "P" }
    ],
    programs: [
      { nama: "Mading.", tujuan: "Sebagai wadah anggota OSIS & MPK untuk mengekspresikan karya-karyanya.", jangka: "Pendek", waktu: "18 Oktober 2026", keterangan: "TERLAKSANA" },
      { nama: "Batik Days.", tujuan: "Memperingati hari batik nasional.", jangka: "Pendek", waktu: "20 Oktober 2026", keterangan: "TERLAKSANA" },
      { nama: "Teacher Awards.", tujuan: "Memberikan penghargaan kepada guru-guru di SMAN 2 Babelan.", jangka: "Pendek", waktu: "25 November 2026", keterangan: "TERLAKSANA" },
      { nama: "Berkolaborasi dengan Sekbid 3 dalam Acara HARDIKNAS.", tujuan: "Mengadakan lomba-lomba di hari pendidikan nasional.", jangka: "Pendek", waktu: "5-6 Mei 2026", keterangan: "TERLAKSANA" },
      { nama: "Hari Kartini.", tujuan: "Membuka ruang apresiasi kreasi siswa yang bergerak dibidang kesenian.", jangka: "Pendek", waktu: "5-6 Mei 2026", keterangan: "TERLAKSANA" },
    ]
  },
  {
    id: 9,
    title: "Teknologi Informasi dan Komunikasi",
    ketua: { name: "Ali Darmawan", gender: "L" },
    anggota: [
      { name: "Agil Daffa Aryasatya", gender: "L" },
      { name: "Maryamah", gender: "P" }
    ],
    programs: [
      { nama: "Mendokumentasikan Kegiatan Acara Sekolah.", tujuan: "Seluruh momen kegiatan terekam jelas saat kegiatan sekolah.", jangka: "Panjang", waktu: "Setiap Event", keterangan: "TERLAKSANA" },
      { nama: "Mengelola Akun OSIS.", tujuan: "Mengupload cuplikan kegiatan yang sudah di dokumentasikan dan menunjukkan kinerja OSIS.", jangka: "Pendek", waktu: "Setiap Event", keterangan: "TERLAKSANA" },
      { nama: "Membangun Arsip Digital Sekolah.", tujuan: "Menyusun system penyimpan terpusat.", jangka: "Panjang", waktu: "Setiap Event", keterangan: "TERLAKSANA" },
      { nama: "Membuat Konten Setiap Kegiatan.", tujuan: "Menyajikan cuplikan kegiatan yang akan di laksanakan/diberitahukan saat event.", jangka: "Panjang", waktu: "Setiap Event", keterangan: "TERLAKSANA" },
      { nama: "Eventarisasi & Pengecekan Kelengkapan Alat Dokumentasi.", tujuan: "Mengetahui alat yang ada, atau rusak atau yang masih di butuhkan selama event.", jangka: "Panjang", waktu: "2 Minggu Sekali", keterangan: "TERLAKSANA" },
      { nama: "Membuat Feeds, Frame Ig, Unggahan ringkas hasil dokumentasi.", tujuan: "Warga sekolah bisa melihat momen kegiatan hasil dokumentasi di media social.", jangka: "Panjang", waktu: "Setiap Event", keterangan: "TERLAKSANA" },
      { nama: "Kerjasama dengan Eskul Sintesa dan Media Sekolah", tujuan: "Membuka peluang dan akses lebih banyak dan lengkap.", jangka: "Panjang", waktu: "Setiap Event", keterangan: "TERLAKSANA" },
      { nama: "Membuat Poster Hari Raya dan Hari Penting Lainnya.", tujuan: "Menyemarakkan suasana sekolah pada perayaan hari besar.", jangka: "Panjang", waktu: "Setiap Event", keterangan: "TERLAKSANA" },
    ]
  },
  {
    id: 10,
    title: "Komunikasi dalam Bahasa Inggris",
    ketua: { name: "Christian Dhimas Prasetyo", gender: "L" },
    anggota: [
      { name: "Alvaro Widiano", gender: "L" },
      { name: "Dzikrina Alfi Maulida", gender: "P" }
    ],
    programs: [
      { nama: "English Weekend.", tujuan: "Menarik minat siswa/i SMAN 2 Babelan untuk dapat belajar berbahasa inggris dengan mudah, praktis dan seru.", jangka: "Panjang", waktu: "Setiap Minggu", keterangan: "TIDAK TERLAKSANA" },
      { nama: "English Shorts.", tujuan: "Menarik minat siswa-siswi SMAN 2 Babelan untuk belajar bahasa inggris dengan cara ringan.", jangka: "Panjang", waktu: "Dua Minggu Sekali", keterangan: "TIDAK TERLAKSANA" },
      { nama: "Lomba Eja Kata Bahasa Inggris.", tujuan: "Sebagai ajang kompetisi mengukur seberapa jauh kosa kata siswa siswi SMAN 2 Babelan.", jangka: "Pendek", waktu: "Event Hardiknas", keterangan: "TIDAK TERLAKSANA" },
    ]
  }
];
