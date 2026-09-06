const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Bypass RLS

const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// Data dari src/app/bph/ketua-wakil/page.tsx dan src/app/bph/sekretaris-bendahara/page.tsx
const bphPrograms = [
  // Ketua OSIS
  { category: "Ketua OSIS", nama: "Mengadakan Rapat dengan MPK dan Ketua Ekskul.", tujuan: "Membahas perencanaan program kerja yang akan dilakukan dan meningkatkan koordinasi antar anggota, serta ketua ekskul.", jangka: "Pendek", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 1 },
  { category: "Ketua OSIS", nama: "Membuat Format Laporan Mingguan Ketua Sekbid 1-10.", tujuan: "Agar Ketua dapat mengetahui perkembangan seluruh Sekbid 1–10 secara teratur dan memastikan setiap program kerja berjalan sesuai rencana.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 2 },
  { category: "Ketua OSIS", nama: "Mengadakan Kotak Surat Aspirasi Siswa.", tujuan: "Menjadi sarana bagi siswa untuk menyampaikan aspirasi, saran, dan kritik demi terciptanya lingkungan sekolah yang lebih baik.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 3 },
  { category: "Ketua OSIS", nama: "Mengadakan Event SPARK CLASS", tujuan: "Mengembangkan bakat dan kreativitas siswa sekaligus meningkatkan jiwa kompetitif dan sportivitas.", jangka: "Pendek", waktu: "15-17 Desember 2025", keterangan: "TERLAKSANA", order_index: 4 },
  { category: "Ketua OSIS", nama: "Mengadakan event SMANDALA FEST 2.0", tujuan: "Memberikan wawasan dan gambaran kepada siswa mengenai kehidupan setelah SMA.", jangka: "Pendek", waktu: "Desember 2026", keterangan: "TIDAK TERLAKSANA", order_index: 5 },
  // Wakil Ketua OSIS
  { category: "Wakil Ketua OSIS", nama: "Digitalisasi Sistem Pencatatan Kehadiran / KitaAtur.", tujuan: "Memaksimalkan penggunaan teknologi pada lingkup organisasi.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 6 },
  { category: "Wakil Ketua OSIS", nama: "Pengembangan platform digital organisasi / Website.", tujuan: "Menghadirkan ruang digital untuk tujuan publikasi dan branding organisasi.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 7 },
  // Sekretaris
  { category: "Sekretaris", nama: "Membuat pengarsipan data pengurus OSIS.", tujuan: "Untuk menyimpan informasi penting yang dapat digunakan sebagai bahan pengambilan keputusan, alat bukti, dan sumber informasi.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 8 },
  { category: "Sekretaris", nama: "Membuat dan mengatur pengelolaan proposal.", tujuan: "Memperoleh persetujuan dari suatu pihak mengenai rencana yang akan dilakukan.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 9 },
  { category: "Sekretaris", nama: "Menyusun rundown acara.", tujuan: "Memastikan acara berjalan dengan terstruktur, lancar, dan sesuai rencana.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 10 },
  { category: "Sekretaris", nama: "Membuat Daftar Absen.", tujuan: "Mengetahui kehadiran Pengurus OSIS, Mengukur performa, Mendeteksi pelanggaran disiplin.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 11 },
  { category: "Sekretaris", nama: "Membuat notulen rapat kegiatan OSIS.", tujuan: "Menjadi pedoman bagi peserta rapat untuk melakukan tindakan, Mengarsipkan keputusan rapat untuk referensi.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 12 },
  // Bendahara
  { category: "Bendahara", nama: "Mengurus administrasi pembuatan almamater, lanyard, dan topi OSIS.", tujuan: "Memastikan administrasi tersusun secara terstruktur dan sistematis.", jangka: "Pendek", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 13 },
  { category: "Bendahara", nama: "Mengumpulkan dan mengeola uang kas.", tujuan: "Menunjang kebutuhan kegiatan OSIS serta menjaga ketersediaan dana organisasi.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 14 },
  { category: "Bendahara", nama: "Mengatur anggaran setiap program kerja OSIS.", tujuan: "Memastikan penggunaan dana sesuai dengan kebutuhan dan rencana kegiatan.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 15 },
  { category: "Bendahara", nama: "Mengelola sisa dana kegiatan.", tujuan: "Mengalokasikan sisa dana kegiatan dalam kas OSIS untuk kebutuhan dan pelaksanaan kegiatan selanjutnya.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 16 },
  { category: "Bendahara", nama: "Mencatat pemasukan dan pengeluaran kebutuhan OSIS.", tujuan: "Memastikan transaksi keuangan tercatat secara sistematis.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 17 },
  { category: "Bendahara", nama: "Menyampaikan laporan keuangan OSIS kepada BPH OSIS", tujuan: "Memastikan keuangan OSIS bersifat transparan kepada semua BPH OSIS.", jangka: "Panjang", waktu: "Selama Masa Bakti", keterangan: "TERLAKSANA", order_index: 18 },
];

async function seed() {
  console.log("Mulai migrasi data proker...");
  
  // Hapus semua data
  await fetch(`${supabaseUrl}/rest/v1/prokers?id=not.eq.00000000-0000-0000-0000-000000000000`, {
    method: 'DELETE',
    headers
  });

  // Insert BPH
  const bphRes = await fetch(`${supabaseUrl}/rest/v1/prokers`, {
    method: 'POST',
    headers,
    body: JSON.stringify(bphPrograms)
  });
  if (!bphRes.ok) console.error("Error inserting BPH:", await bphRes.text());
  else console.log("✅ BPH Prokers inserted!");

  // Import sekbid
  const { sekbidData } = await import('./src/app/sekbid/data');
  let sekbidProkers: any[] = [];
  
  sekbidData.forEach((sekbid: any) => {
    sekbid.programs.forEach((prog: any, idx: number) => {
      sekbidProkers.push({
        category: `Sekbid ${sekbid.id}`,
        nama: prog.nama,
        tujuan: prog.tujuan,
        jangka: prog.jangka,
        waktu: prog.waktu,
        keterangan: prog.keterangan,
        order_index: idx + 1
      });
    });
  });

  const sekbidRes = await fetch(`${supabaseUrl}/rest/v1/prokers`, {
    method: 'POST',
    headers,
    body: JSON.stringify(sekbidProkers)
  });
  if (!sekbidRes.ok) console.error("Error inserting Sekbid:", await sekbidRes.text());
  else console.log(`✅ ${sekbidProkers.length} Sekbid Prokers inserted!`);

  console.log("Selesai!");
  process.exit(0);
}

seed();
