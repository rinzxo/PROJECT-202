const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const insertData = async (table, rows) => {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(rows)
  });
  if (!res.ok) {
    const error = await res.text();
    console.error(`Error inserting into ${table}:`, error);
  } else {
    console.log(`Successfully seeded ${table}!`);
  }
};

// We'll hardcode the sekbid data we extracted from data.ts
const getGenderImage = (gender) => {
  if (gender === "L") {
    return "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&fit=crop";
  } else {
    return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&fit=crop";
  }
};

const sekbids = [
  {
    id: 1,
    title: "Keimanan dan Ketaqwaan terhadap Tuhan Yang Maha Esa",
    ketua: { name: "Anindya Nur Ramadhani", gender: "P" },
    anggota: [
      { name: "Kamilla Salsabila Ramadhani", gender: "P" },
      { name: "M. Rizki Faiz Rabbani", gender: "L" }
    ]
  },
  {
    id: 2,
    title: "Budi Pekerti Luhur atau Akhlak Mulia",
    ketua: { name: "Ais Suci Ramadhani", gender: "P" },
    anggota: [
      { name: "Keilani Callista Zega", gender: "P" }
    ]
  },
  {
    id: 3,
    title: "Kepribadian Unggul, Wawasan Kebangsaan dan Bela Negara",
    ketua: { name: "Frida Agista Wati", gender: "P" },
    anggota: [
      { name: "Suci Natania", gender: "P" },
      { name: "Diva Eka Octavia", gender: "P" }
    ]
  },
  {
    id: 4,
    title: "Prestasi Akademik, Seni, dan Olahraga",
    ketua: { name: "Quaneisha Zata S.P", gender: "P" },
    anggota: [
      { name: "Athallah Dhiwa Aditya", gender: "L" },
      { name: "Alvi Khorin Nisa", gender: "P" }
    ]
  },
  {
    id: 5,
    title: "Demokrasi, Hak Asasi Manusia, Lingkungan Hidup, dan Toleransi Sosial",
    ketua: { name: "Aura Khoirunisha", gender: "P" },
    anggota: [
      { name: "Nazwa Amalia Putri", gender: "P" },
      { name: "Nayla Agistira Putri", gender: "P" }
    ]
  },
  {
    id: 6,
    title: "Kreativitas, Keterampilan, dan Kewirausahaan",
    ketua: { name: "Adelia Salwa Kirana", gender: "P" },
    anggota: [
      { name: "Najwa Aulia Nisa", gender: "P" },
      { name: "Anindira Kirana Setiawan", gender: "P" }
    ]
  },
  {
    id: 7,
    title: "Kualitas Jasmani, Kesehatan, dan Gizi",
    ketua: { name: "Salsabila Firdausya", gender: "P" },
    anggota: [
      { name: "Meisya Dwi Andini", gender: "P" },
      { name: "Muhammad Zhafrano Al Faridzy", gender: "L" }
    ]
  },
  {
    id: 8,
    title: "Sastra dan Budaya",
    ketua: { name: "Vanya Azaria Anindita", gender: "P" },
    anggota: [
      { name: "Mellani Khairunisa", gender: "P" },
      { name: "Keisha Putri Pradana", gender: "P" }
    ]
  },
  {
    id: 9,
    title: "Teknologi Informasi dan Komunikasi (TIK)",
    ketua: { name: "Raja Nadhief Alif Putra Ramadhan", gender: "L" },
    anggota: [
      { name: "Adnan Bayhaqi", gender: "L" },
      { name: "Iffah Kanzah H", gender: "P" }
    ]
  },
  {
    id: 10,
    title: "Komunikasi dalam Bahasa Inggris",
    ketua: { name: "Syifa Adelia K", gender: "P" },
    anggota: [
      { name: "Hanna Aqeela Fatiha", gender: "P" },
      { name: "Annisya Amalia", gender: "P" }
    ]
  }
];

const bphMembers = [
  { name: "Fulan bin Fulan", role: "Ketua OSIS", gender: "L" },
  { name: "Fulanah binti Fulan", role: "Wakil Ketua", gender: "P" },
  { name: "Si A", role: "Sekretaris 1", gender: "P" },
  { name: "Si B", role: "Sekretaris 2", gender: "P" },
  { name: "Si C", role: "Bendahara 1", gender: "P" },
  { name: "Si D", role: "Bendahara 2", gender: "P" }
];

async function seed() {
  console.log('Seeding Sekbid Members...');
  const sekbidRows = [];
  
  for (const s of sekbids) {
    let order = 0;
    sekbidRows.push({
      sekbid_id: s.id.toString(),
      name: s.ketua.name,
      role: 'Ketua Sekbid',
      image: getGenderImage(s.ketua.gender),
      order_index: order++
    });
    
    for (const a of s.anggota) {
      sekbidRows.push({
        sekbid_id: s.id.toString(),
        name: a.name,
        role: 'Anggota',
        image: getGenderImage(a.gender),
        order_index: order++
      });
    }
  }

  await insertData('sekbid_members', sekbidRows);

  console.log('Seeding BPH...');
  const bphRows = bphMembers.map((b, i) => ({
    name: b.name,
    role: b.role,
    image: getGenderImage(b.gender),
    quote: "Teruslah melangkah, karena setiap langkah membawa kita lebih dekat dengan impian.",
    order_index: i
  }));

  await insertData('bph', bphRows);
}

seed();
