import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { FadeUp } from "@/components/ui/fade-up";
import { cn } from "@/lib/utils";

import { SlantedHeader } from "@/components/layout/slanted-header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* HERO SECTION */}
      <SlantedHeader
        title={<>SEKOLAH<br />BERKARAKTER<br />UNGGUL<br />GLOBAL</>}
        titleClassName="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9] mb-4 md:mb-8"
        description="LEMBAGA PENDIDIKAN TERBAIK DI KABUPATEN BEKASI YANG MENGEDEPANKAN INOVASI DAN KREATIVITAS."
        imageSrc="/images/smandala-fest-1.jpg"
        videoSrc="/videos/hero.webm"
        watermark="2"
      >
        {/* WELCOME BLOCK (BLUE) */}
        <section className="w-full bg-primary text-white py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-3">
              <FadeUp>
                <div className="w-12 h-1 bg-white mb-6" />
                <p className="text-sm tracking-widest font-bold leading-loose">
                  SMAN 2 BABELAN<br />
                  KABUPATEN BEKASI
                </p>
              </FadeUp>
            </div>
            <div className="lg:col-span-6">
              <FadeUp delay={0.1}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[0.9]">
                  SELAMAT DATANG DI PUSAT KREATIVITAS DAN PRESTASI SISWA
                </h2>
              </FadeUp>
            </div>
            <div className="lg:col-span-3 lg:text-right flex flex-col gap-6">
              <FadeUp delay={0.2}>
                <p className="text-sm tracking-widest font-bold border-b border-white/20 pb-4 mb-4">
                  HARI INI BUKA: 07:00 - 15:00
                </p>
                <Link href="/events" className="inline-flex items-center gap-4 text-sm font-bold tracking-widest bg-white text-primary px-6 py-4 rounded-full hover:bg-slate-200 transition-colors w-fit lg:ml-auto">
                  LIHAT AGENDA <ArrowRight className="w-4 h-4" />
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* EXHIBITIONS / KARYA & EKSKUL (COLOR BLOCKS) */}
      <section className="w-full">
        {/* Block 1 (Blue continuation) */}
        <div className="bg-primary pt-12 pb-24 text-white">
          <div className="container mx-auto px-6 lg:px-12 relative">
            <FadeUp>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] max-w-4xl z-10 relative">
                KARYA &<br />
                PRESTASI<br />
                SISWA
              </h2>
            </FadeUp>
            <FadeUp delay={0.2} className="relative z-20 mt-12 md:-mt-24 md:ml-auto w-full md:w-[60%] lg:w-[45%]">
              <div className="aspect-4/3 bg-slate-200 w-full relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('/images/pentas-seni.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <div className="mt-4 flex gap-4">
                <span className="text-xs font-bold tracking-widest bg-white text-primary px-3 py-1">SENI PERTUNJUKAN</span>
                <p className="text-sm font-bold tracking-widest mt-1">PENTAS SENI SMAN 2 BABELAN</p>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Block 2 (White) */}
        <div className="bg-background py-24 text-primary relative">
          <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <FadeUp className="md:mt-32">
              <div className="aspect-square bg-slate-200 w-full md:w-3/4 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('/images/smandala-cup.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <div className="mt-4 flex gap-4">
                <span className="text-xs font-bold tracking-widest bg-primary text-white px-3 py-1">OLAHRAGA</span>
                <p className="text-sm font-bold tracking-widest mt-1">TURNAMEN SMANDALA CUP</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.2} className="md:-mt-20">
              <div className="aspect-3/2 bg-slate-200 w-full relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('/images/prestasi-siswa-1.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <div className="mt-4 flex gap-4">
                <span className="text-xs font-bold tracking-widest bg-primary text-white px-3 py-1">PRESTASI</span>
                <p className="text-sm font-bold tracking-widest mt-1">PENGHARGAAN JUARA KOMPETISI SISWA</p>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Block 3 (Blue) */}
        <div className="bg-primary py-24 text-white">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeUp>
              <div className="aspect-21/9 bg-slate-200 w-full relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('/images/organisasi.jpeg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-primary/20 transition-colors group-hover:bg-transparent" />
              </div>
              <div className="mt-4 flex gap-4">
                <span className="text-xs font-bold tracking-widest bg-white text-primary px-3 py-1">ORGANISASI</span>
                <p className="text-sm font-bold tracking-widest mt-1">OSIS & MPK SMAN 2 BABELAN</p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ACTIVITIES TO COME (AGENDA TERDEKAT) */}
      <section className="bg-background py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-12 border-b-2 border-primary pb-6">
            <FadeUp>
              <h2 className="text-5xl md:text-6xl lg:text-[80px] font-bold tracking-tighter leading-none text-primary">
                AGENDA TERDEKAT
              </h2>
            </FadeUp>
            <FadeUp delay={0.2} className="hidden md:block">
              <Link href="/events" className="text-primary hover:opacity-70 transition-opacity">
                <ArrowRight className="w-16 h-16" strokeWidth={1.5} />
              </Link>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[
              { 
                cat: "EVENT SPESIAL", 
                title: "GELAR KARYA P5: GAYA HIDUP BERKELANJUTAN", 
                subtitle: "Lapangan Utama — Gedung B",
                date: "24 Oktober 2026 s/d 25 Oktober 2026",
                info: "Siswa : Gratis | Umum : Rp 15.000 | Alumni : mulai Rp 25.000 (tarif Presale hingga 10 Oktober)",
                badges: [{ text: "KUOTA TERBATAS", type: "yellow" }, { text: "PRESALE ALUMNI", type: "gray" }]
              },
              { 
                cat: "KUNJUNGAN", 
                title: "OPEN HOUSE & EDU FAIR SMAN 2 BABELAN", 
                subtitle: "Tur fasilitas & Pameran Universitas",
                time: "08:30 WIB",
                date: "Sampai 30 Agustus 2026",
                info: "Termasuk seminar karir pendidikan",
                badges: [{ text: "KUOTA TERBATAS", type: "yellow" }, { text: "KELUARGA", type: "gray" }]
              },
              { 
                cat: "LOKAKARYA", 
                title: "WORKSHOP JURNALISTIK & DIGITAL MADING", 
                time: "09:00 WIB",
                date: "Sampai 05 November 2026",
                info: "Termasuk sertifikat dan konsumsi\nTidak perlu reservasi untuk anggota ekskul",
                badges: [{ text: "SISWA", type: "gray" }]
              },
              { 
                cat: "KOMPETISI", 
                title: "CLASSMEETING SEMESTER GENAP. AJANG KREATIVITAS", 
                time: "07:00, 13:00, 15:00 (Rabu)",
                date: "Sampai 7 Desember 2026",
                info: "Reguler : Rp 15.000 | Anggota OSIS : Gratis | Guru : Gratis\nWajib registrasi saat pendaftaran lomba",
                badges: [{ text: "KUOTA TERBATAS", type: "yellow" }]
              }
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.1} className="group flex flex-col h-full">
                {/* Category top */}
                <div className="mb-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    &bull; {item.cat}
                  </span>
                </div>
                {/* Image */}
                <div className="aspect-square bg-slate-200 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-slate-300 transition-transform duration-700 group-hover:scale-105" />
                </div>
                {/* Text Content */}
                <div className="flex-1 flex flex-col">
                  {/* Title */}
                  <Link href="#" className="inline-block group-hover:underline underline-offset-4 decoration-2 text-primary">
                    <h3 className="text-2xl lg:text-[26px] font-bold tracking-tighter leading-[1.1] mb-2 uppercase">
                      {item.title}
                    </h3>
                  </Link>
                  
                  {/* Subtitle / normal text */}
                  {item.subtitle && (
                    <p className="text-[13px] normal-case tracking-normal font-medium text-primary mb-4">{item.subtitle}</p>
                  )}

                  {/* Time and Date */}
                  <div className="flex flex-col gap-1.5 mb-4 normal-case text-[13px] font-bold tracking-tight text-primary">
                    {item.time && (
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{item.time}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  
                  {/* Price/Info */}
                  {item.info && (
                    <p className="text-[11px] normal-case font-medium text-primary mb-6 max-w-[95%] leading-snug whitespace-pre-line">
                      {item.info}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {item.badges?.map((badge, idx) => (
                      <span key={idx} className={cn(
                        "text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full uppercase border",
                        badge.type === 'yellow' ? "bg-primary border-primary text-white" : "bg-transparent border-primary text-primary"
                      )}>
                        {badge.text}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* GRAND OPENING / NEWS FEATURE */}
      <section className="bg-background pb-24 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <FadeUp>
                <p className="text-xs font-bold tracking-widest mb-4">BERITA UTAMA</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-6 text-primary">
                  PENGANUGERAHAN<br />
                  JUARA SMANDALA<br />
                  CUP & FESTIVAL
                </h2>
                <p className="text-sm leading-relaxed mb-8 normal-case tracking-normal text-primary font-medium max-w-md">
                  <span className="uppercase tracking-widest font-bold text-primary block mb-2">APRESIASI PRESTASI SISWA</span>
                  SMAN 2 Babelan menganugerahkan piala dan penghargaan kepada para juara turnamen Smandala Cup & Fest, sebagai bukti komitmen sekolah dalam mendukung bakat, sportivitas, serta kreativitas siswa di bidang olahraga dan seni.
                </p>
                <Link href="/profil#prestasi" className="inline-block bg-primary text-white text-xs font-bold tracking-widest px-8 py-4 rounded-full hover:bg-blue-800 transition-colors">
                  LIHAT PRESTASI LAINNYA
                </Link>
              </FadeUp>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <FadeUp delay={0.2}>
                <div className="aspect-4/3 w-full bg-slate-200 overflow-hidden relative group">
                   <div className="absolute inset-0 bg-[url('/images/prestasi-siswa-2.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* OEUVRES ET ARTISTES (FASILITAS & GALERI) */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary mb-12">
              GALERI &<br />
              KEGIATAN SEKOLAH
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              { title: "KEMERIAHAN SMANDALA FESTIVAL", img: "/images/smandala-fest-1.jpg" },
              { title: "FESTIVAL BUDAYA & KREATIVITAS", img: "/images/smandala-fest-2.jpg" },
              { title: "AKSI PANGGUNG MUSIK SISWA", img: "/images/smandala-fest-3.jpg" },
              { title: "PENGANUGERAHAN JUARA KOMPETISI", img: "/images/prestasi-siswa-2.jpg" },
              { title: "PENTAS SENI & PERTUNJUKAN", img: "/images/pentas-seni.jpg" },
              { title: "TURNAMEN OLAHRAGA SMANDALA CUP", img: "/images/smandala-cup.jpg" },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="aspect-4/3 bg-slate-200 relative group cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/20 transition-colors group-hover:bg-transparent z-10" />
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.img})` }} 
                  />
                  <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-bold tracking-widest drop-shadow-md">{item.title}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BLOCK */}
      <section className="bg-primary text-white py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
            <FadeUp className="max-w-2xl">
              <span className="text-xs font-black tracking-widest text-blue-200 uppercase mb-3 inline-block">PORTAL INFORMASI TERPADU</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[0.95] uppercase mb-6">
                WUJUDKAN PRESTASI &<br />
                KREATIVITAS BERSAMA!
              </h2>
              <p className="text-sm sm:text-base font-medium opacity-90 leading-relaxed max-w-xl normal-case">
                Jelajahi potensi siswa, prestasi membanggakan, dan berbagai kegiatan ekstrakurikuler serta agenda seru di lingkungan SMAN 2 Babelan.
              </p>
            </FadeUp>
            <FadeUp delay={0.2} className="w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link href="/ekskul" className="bg-white text-primary text-xs font-black tracking-widest px-8 py-5 rounded-full hover:bg-slate-100 transition-all text-center shadow-xl hover:scale-105 active:scale-95">
                  LIHAT EKSKUL & PRESTASI
                </Link>
                <Link href="/events" className="bg-white/10 border-2 border-white/30 text-white text-xs font-black tracking-widest px-8 py-5 rounded-full hover:bg-white hover:text-primary transition-all text-center shadow-xl hover:scale-105 active:scale-95">
                  AGENDA & KEGIATAN
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
      </SlantedHeader>
    </div>
  );
}
