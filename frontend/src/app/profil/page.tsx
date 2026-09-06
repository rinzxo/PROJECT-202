"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Taste Skill Dials
// DESIGN_VARIANCE: 7 (Editorial Magazine Layout)
// MOTION_INTENSITY: 5 (Smooth scroll reveals)
// VISUAL_DENSITY: 3 (Airy, edge-to-edge images on mobile)

export default function ProfilPage() {
  const reduce = useReducedMotion();
  const [settings, setSettings] = useState<any>(null);
  const [bphs, setBphs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [settingsRes, bphsRes] = await Promise.all([
        supabase.from('site_settings').select('*').limit(1).single(),
        supabase.from('bph').select('*').order('order_index', { ascending: true })
      ]);
      
      if (settingsRes.data) setSettings(settingsRes.data);
      if (bphsRes.data) setBphs(bphsRes.data);
    };
    fetchData();
  }, []);

  const pembinas = bphs.filter(b => b.role.toLowerCase().includes('pembina'));
  const intis = bphs.filter(b => b.role.toLowerCase().includes('ketua'));
  const sekbens = bphs.filter(b => b.role.toLowerCase().includes('sekretaris') || b.role.toLowerCase().includes('bendahara'));

  const misiPoints = settings?.misi ? settings.misi.split('\n').filter((m: string) => m.trim().length > 0) : [];

  return (
    <div className="flex flex-col min-h-dvh font-sans selection:bg-primary selection:text-white bg-background pt-24 lg:pt-32 pb-32">
      
      {/* NATIVE HERO (Replacing SlantedHeader) */}
      <section className="container mx-auto px-6 lg:px-12 mb-24 lg:mb-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] text-primary mb-8 -ml-1 lg:-ml-2">
            PROFIL
          </h1>
          <p className="text-xl md:text-2xl font-medium tracking-wide opacity-80 max-w-2xl leading-relaxed text-foreground">
            Mengenal lebih dekat visi, misi, jajaran pengurus, hingga program kerja unggulan OSIS SMAN 2 Babelan.
          </p>
        </motion.div>
      </section>

      {/* VISI & MISI */}
      <section id="visi-misi" className="bg-primary text-white py-24 lg:py-40">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-8">
                VISI &<br />MISI
              </h2>
            </motion.div>
          </div>
          <div className="lg:col-span-7 flex flex-col gap-16">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-white/50">Visi Kami</h3>
              <p className="text-3xl lg:text-5xl font-bold tracking-tighter leading-[1.1]">
                {settings?.visi || '"Menjadikan OSIS sebagai wadah aspirasi, kreativitas, dan prestasi siswa yang berakhlak mulia dan berwawasan global"'}
              </p>
            </motion.div>
            
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-white/50">Misi Kami</h3>
              <ul className="flex flex-col gap-6 text-lg lg:text-xl font-medium opacity-90">
                {misiPoints.length > 0 ? misiPoints.map((m: string, i: number) => (
                  <li key={i} className="flex gap-6"><span className="font-bold opacity-50 shrink-0">{String(i + 1).padStart(2, '0')}</span> {m}</li>
                )) : (
                  <>
                    <li className="flex gap-6"><span className="font-bold opacity-50 shrink-0">01</span> Meningkatkan keimanan dan ketakwaan terhadap Tuhan Yang Maha Esa.</li>
                    <li className="flex gap-6"><span className="font-bold opacity-50 shrink-0">02</span> Menyelenggarakan kegiatan yang dapat mengembangkan bakat dan minat siswa.</li>
                    <li className="flex gap-6"><span className="font-bold opacity-50 shrink-0">03</span> Menjadi jembatan komunikasi yang baik antara siswa dan pihak sekolah.</li>
                    <li className="flex gap-6"><span className="font-bold opacity-50 shrink-0">04</span> Menanamkan sikap disiplin, tanggung jawab, dan gotong royong antar siswa.</li>
                    <li className="flex gap-6"><span className="font-bold opacity-50 shrink-0">05</span> Berperan aktif dalam menjaga ketertiban, kebersihan, dan keindahan lingkungan sekolah.</li>
                  </>
                )}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STRUKTUR ORGANISASI (Edge-to-Edge on Mobile via w-screen -mx-6) */}
      <section id="struktur" className="bg-background text-primary py-24 lg:py-40 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          
          <motion.div
             initial={reduce ? false : { opacity: 0, y: 24 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="mb-20 lg:mb-32"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-6">
              Struktur<br />Pengurus
            </h2>
          </motion.div>
          
          {/* PEMBINA LEVEL (Mobile swipe/snap layout) */}
          <div className="mb-32 flex flex-col items-center text-center">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-8 text-primary/80 px-3 py-1.5 border border-primary/30 rounded-full inline-block">Pembina OSIS</h3>
            {/* Mobile grid instead of swipe container */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-12 max-w-3xl w-full">
              {pembinas.map((person, i) => (
                <motion.div 
                  key={`pembina-${person.id || i}`}
                  className="flex flex-col"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="aspect-4/5 bg-slate-200 relative mb-6 overflow-hidden rounded-3xl group">
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 ease-out" 
                      style={{ backgroundImage: `url('${person.image}')` }}
                    />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tighter mb-2">{person.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>

          {/* INTI LEVEL: KETUA & WAKIL */}
          <div className="mb-32 flex flex-col items-center text-center">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-8 text-primary/80 px-3 py-1.5 border border-primary/30 rounded-full inline-block">Badan Pengurus Harian (Inti)</h3>
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-12 max-w-3xl w-full">
              {intis.map((person, i) => (
                <Link href="/bph/ketua-wakil" key={`inti-${person.id || i}`} className="flex flex-col group active:scale-[0.98] transition-transform">
                  <motion.div 
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <div className="aspect-4/5 bg-slate-200 relative mb-6 overflow-hidden rounded-3xl group-hover:border-primary/20 border-2 border-transparent transition-all">
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 ease-out" 
                        style={{ backgroundImage: `url('${person.image}')` }}
                      />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-3 group-hover:text-primary transition-colors">{person.role}</p>
                    <h3 className="text-3xl font-bold tracking-tighter mb-2 group-hover:text-primary transition-colors">{person.name}</h3>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* SEKRETARIS & BENDAHARA LEVEL */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-8 text-primary/80 px-3 py-1.5 border border-primary/30 rounded-full inline-block">Sekretaris & Bendahara</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full text-left">
              {sekbens.map((person, i) => (
                <Link href="/bph/sekretaris-bendahara" key={`sekben-${person.id || i}`} className="flex flex-col group active:scale-[0.98] transition-transform">
                  <motion.div 
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <div className="aspect-3/4 bg-slate-200 relative mb-6 overflow-hidden rounded-3xl group-hover:border-primary/20 border-2 border-transparent transition-all">
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 ease-out" 
                        style={{ backgroundImage: `url('${person.image}')` }}
                      />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-3 group-hover:text-primary transition-colors">{person.role}</p>
                    <h3 className="text-2xl font-bold tracking-tighter group-hover:text-primary transition-colors">{person.name}</h3>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DAFTAR SEKBID (Minimalist Split) */}
      <section id="sekbid" className="bg-primary text-white py-24 lg:py-40">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
             initial={reduce ? false : { opacity: 0, y: 24 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-8">
                SEKSI<br />BIDANG
              </h2>
              <p className="text-xl opacity-90 max-w-lg leading-relaxed mb-12">
                Terdiri dari 10 Seksi Bidang (Sekbid) yang membawahi berbagai ekstrakurikuler dan program kerja pengembangan siswa di berbagai aspek.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/sekbid" 
                  className="bg-white text-primary text-sm font-bold px-8 py-4 rounded-full active:scale-95 transition-transform duration-150 ease-out inline-flex items-center justify-center gap-3"
                >
                  Lihat Program <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Abstract representation of sekbid */}
            <div className="hidden lg:grid grid-cols-3 gap-4 opacity-30">
               {[...Array(9)].map((_, i) => (
                 <div key={i} className={`bg-white rounded-2xl ${i === 4 ? 'aspect-square' : 'aspect-video'} w-full`} />
               ))}
            </div>
          </motion.div>
        </div>
      </section>



    </div>
  );
}
