import Image from "next/image";
import { FadeUp } from "@/components/ui/fade-up";
import { ArrowRight } from "lucide-react";
import { SlantedHeader } from "@/components/layout/slanted-header";

export default function ProfilPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <SlantedHeader 
        title="PROFIL"
        subtitle="SEKOLAH KITA"
        description="Mengenal lebih dekat visi, misi, jajaran pendidik, hingga fasilitas yang mendukung terciptanya lingkungan belajar unggul di SMAN 2 Babelan."
      >
        <div className="bg-background pt-16 lg:pt-32">

      {/* VISI & MISI (BLUE BLOCK) */}
      <section id="visi-misi" className="bg-primary text-white py-24 lg:py-40">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <FadeUp>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-8">
                VISI &<br />MISI
              </h2>
            </FadeUp>
          </div>
          <div className="lg:col-span-7 flex flex-col gap-16">
            <FadeUp delay={0.1}>
              <h3 className="text-[11px] font-black tracking-widest mb-4 border-b border-white/20 pb-4">VISI KAMI</h3>
              <p className="text-2xl lg:text-3xl font-bold tracking-tight leading-tight uppercase">
                "SEKOLAH UNGGUL BERAKHLAKKUL KHARIMAH, BERPRESTASI, KREATIF DAN BERKEBINEKAAN GLOBAL"
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <h3 className="text-[11px] font-black tracking-widest mb-4 border-b border-white/20 pb-4">MISI KAMI</h3>
              <ul className="flex flex-col gap-4 text-[13px] lg:text-sm font-medium normal-case tracking-normal opacity-90">
                <li className="flex gap-4"><span className="font-black shrink-0">01.</span> Meningkatkan pembiasaan praktik baik di lingkungan sekolah.</li>
                <li className="flex gap-4"><span className="font-black shrink-0">02.</span> Meningkatkan budaya lingkungan sekolah dengan menerapkan 7K.</li>
                <li className="flex gap-4"><span className="font-black shrink-0">03.</span> Menerapkan budaya tepat waktu hadir di sekolah.</li>
                <li className="flex gap-4"><span className="font-black shrink-0">04.</span> Meningkatkan potensi akademik dan non akademik melalui pembelajaran yang kreatif dan inovatif.</li>
                <li className="flex gap-4"><span className="font-black shrink-0">05.</span> Meningkatkan mutu pembelajaran yang berpusat pada siswa.</li>
                <li className="flex gap-4"><span className="font-black shrink-0">06.</span> Meningkatkan kompetensi pendidik dan tenaga kependidikan melalui program reward dan punishment.</li>
                <li className="flex gap-4"><span className="font-black shrink-0">07.</span> Menerapkan budaya 5S (Senyum, Sapa, Salam, Sopan dan Santun) antar warga sekolah.</li>
                <li className="flex gap-4"><span className="font-black shrink-0">08.</span> Menerapkan budaya literasi akademik dan non akademik.</li>
                <li className="flex gap-4"><span className="font-black shrink-0">09.</span> Meningkatkan kedisiplinan dengan sistem poin.</li>
              </ul>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* STRUKTUR ORGANISASI (WHITE BLOCK) */}
      <section id="struktur" className="bg-background text-primary py-24 lg:py-40">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeUp>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-2 border-primary pb-8 gap-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                STRUKTUR<br />ORGANISASI
              </h2>
              <p className="text-[10px] font-black tracking-widest max-w-xs text-right hidden md:block">
                PIMPINAN DAN STAF SMAN 2 BABELAN
              </p>
            </div>
          </FadeUp>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { role: "KEPALA SEKOLAH", name: "Dra. Sri Winanti, M.Pd." },
              { role: "WAKASEK KURIKULUM", name: "Budi Santoso, S.Pd., M.Si." },
              { role: "WAKASEK KESISWAAN", name: "Sarkowih, S.Pd." }
            ].map((person, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="aspect-3/4 bg-slate-200 relative mb-6 overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1887')] bg-cover bg-center grayscale mix-blend-multiply opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                </div>
                <p className="text-[10px] font-black tracking-widest mb-2 opacity-60">{person.role}</p>
                <h3 className="text-xl font-bold tracking-tighter normal-case">{person.name}</h3>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* DAFTAR GURU & TU (BLUE BLOCK) */}
      <section id="guru" className="bg-primary text-white py-24 lg:py-40">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <FadeUp>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-12">
              KEPEGAWAIAN
            </h2>
            <p className="max-w-2xl mx-auto text-[13px] font-medium normal-case tracking-normal opacity-90 mb-16">
              SMAN 2 Babelan didukung oleh 54 Tenaga Pendidik (Guru) profesional yang linier di bidangnya dan 12 Staf Tata Usaha (TU) yang berdedikasi melayani administrasi pendidikan.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="bg-white text-primary px-8 py-4 text-[11px] font-black tracking-widest hover:bg-slate-100 transition-colors">
                LIHAT DAFTAR GURU
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 text-[11px] font-black tracking-widest hover:bg-white hover:text-primary transition-colors">
                LIHAT DAFTAR TU
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SARANA PRASARANA (WHITE BLOCK) */}
      <section id="sarana" className="bg-background text-primary py-24 lg:py-40">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeUp>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-16 border-b-2 border-primary pb-8">
              FASILITAS &<br />SARANA
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { name: "LAB KOMPUTER & MULTIMEDIA", desc: "Dilengkapi dengan 40 unit PC berstandar industri dan perangkat editing." },
              { name: "PERPUSTAKAAN DIGITAL", desc: "Ribuan koleksi buku fisik dan e-book yang terintegrasi sistem barcode." },
              { name: "LAPANGAN OLAHRAGA UTAMA", desc: "Fasilitas multifungsi untuk basket, futsal, voli, dan upacara bendera." },
              { name: "MASJID RAYA SEKOLAH", desc: "Pusat kegiatan rohani berkapasitas 800 jamaah dengan fasilitas AC." }
            ].map((facility, i) => (
              <FadeUp key={i} delay={i * 0.1} className="group border-b border-primary/20 pb-8">
                <div className="aspect-video bg-slate-200 mb-6 overflow-hidden relative">
                   <div className="absolute inset-0 bg-slate-300 transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-3 group-hover:underline underline-offset-4">{facility.name}</h3>
                <p className="text-[13px] font-medium normal-case tracking-normal opacity-80">{facility.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

        </div>
      </SlantedHeader>
    </div>
  );
}
