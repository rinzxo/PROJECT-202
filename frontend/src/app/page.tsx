"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Taste Skill Dials
// DESIGN_VARIANCE: 6 (Clean, slightly asymmetric, no generic slop)
// MOTION_INTENSITY: 5 (Smooth scroll reveals, no chaotic physics)
// VISUAL_DENSITY: 4 (Airy and editorial)

export default function Home() {
  const reduce = useReducedMotion();
  const [settings, setSettings] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [karya, setKarya] = useState<any[]>([]);
  const [berita, setBerita] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const { data: s } = await supabase.from('site_settings').select('*').limit(1).single();
      if (s) setSettings(s);
      
      const { data: kr } = await supabase.from('articles').select('*').eq('category', 'Karya & Prestasi').order('created_at', { ascending: false }).limit(2);
      if (kr) setKarya(kr);

      const { data: br } = await supabase.from('articles').select('*').eq('category', 'Berita Utama').order('created_at', { ascending: false }).limit(1);
      if (br) setBerita(br);

      const { data: ev } = await supabase.from('events').select('*').order('created_at', { ascending: false }).limit(4);
      if (ev) setEvents(ev);

      const { data: gal } = await supabase.from('galleries').select('*').order('created_at', { ascending: false }).limit(6);
      if (gal) setGalleries(gal);

      const { data: cand } = await supabase.from('candidates').select('*').order('nomor_urut', { ascending: true });
      if (cand) setCandidates(cand);
    };
    fetchData();

    // Countdown logic
    const targetDate = new Date('2026-09-11T08:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // We are building a bespoke sticky hero inside this file, 
  // ensuring min-h-dvh and perfect viewport fit per Taste Skill rules.
  return (
    <div className="flex flex-col min-h-dvh font-sans selection:bg-primary selection:text-white">

      {/* 1. HERO SECTION */}
      {/* min-h-dvh, sticky stack effect, strict copy rules */}
      <div className="relative z-0 w-full bg-background isolate">
        <div className="sticky top-0 z-0 w-full min-h-dvh overflow-hidden flex flex-col justify-between pt-24 lg:pt-32 pb-16 lg:pb-24">

          <div className="absolute inset-0 bg-black z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            >
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
          </div>

          <div className="container mx-auto px-6 lg:px-12 flex flex-col h-full relative z-10 text-white">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              {/* Max 2 line headline */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] mb-8"
                  dangerouslySetInnerHTML={{ __html: settings?.hero_title || 'OSIS SMAN 2<br />BABELAN' }}
              />

              {/* Max 20 words subtext */}
              <p className="hidden md:block text-xl md:text-3xl font-medium text-white/90 max-w-2xl leading-snug drop-shadow-sm">
                {settings?.hero_subtitle || 'Wadah kreativitas, aspirasi, dan prestasi siswa. Membangun pemimpin masa depan melalui kolaborasi.'}
              </p>

              {/* CTAs (No wrap, high contrast) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-[35vh] md:pt-8">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-3 bg-white text-primary text-sm font-bold px-8 py-4 rounded-full transition-transform hover:scale-[0.98]"
                >
                  Lihat Agenda <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-3 bg-transparent text-white border border-white/30 text-sm font-bold px-8 py-4 rounded-full transition-colors hover:bg-white/10"
                >
                  Profil Organisasi
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Subtle watermark, non-intrusive */}
          <div className="absolute -bottom-12 right-12 z-0 pointer-events-none opacity-10">
            <span className="text-[300px] font-black leading-none">2</span>
          </div>
        </div>

        {/* 2. THE MAIN CONTENT WRAPPER */}
        {/* Everything from here scrolls over the hero */}
        <div className="relative z-20 w-full bg-background pt-24 pb-32">

          {/* 3. WELCOME & VALUE PROP */}
          {/* Clean, editorial column layout instead of generic blue block */}
          <section className="container mx-auto px-6 lg:px-12 mb-32">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4">
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-[10px] font-bold tracking-[0.2em] text-primary mb-4 uppercase">
                    Pusat Aspirasi
                  </p>
                  <div className="h-1 w-12 bg-primary/20 mb-8" />
                </motion.div>
              </div>
              <div className="md:col-span-8">
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.05] text-primary mb-8">
                    Menghubungkan suara siswa dengan aksi nyata.
                  </h2>
                </motion.div>
              </div>
            </div>
          </section>

          {/* 3.5 PEMILU RAYA SECTION (HIGH-END VISUAL DESIGN) */}
          <section className="container mx-auto px-6 lg:px-12 mb-32 relative z-10">
            <motion.div
              className="bg-[#050505] rounded-[2.5rem] p-8 md:p-12 lg:p-20 overflow-hidden relative shadow-2xl"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Ethereal Glow Background */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-150 h-150 bg-[#E53935]/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-125 h-125 bg-purple-900/15 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
              </div>

              {/* Header / Countdown */}
              <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 mb-20">
                <div className="max-w-2xl text-white">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-[#E53935] animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">Agenda Mendesak</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] mb-6">
                    Masa Depan <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-white/40 block mt-2">Ada di Tanganmu.</span>
                  </h2>
                  <p className="text-lg text-white/60 font-medium leading-relaxed">
                    Pemilu Raya OSIS SMAN 2 Babelan segera tiba. Kenali sosok pemimpin masa depan Anda dan bersiaplah untuk memberikan suara.
                  </p>
                </div>

                {/* The Countdown Block */}
                <div className="flex gap-3 sm:gap-6 shrink-0 mt-8 xl:mt-0">
                  {[
                    { label: 'HARI', value: timeLeft.days },
                    { label: 'JAM', value: timeLeft.hours },
                    { label: 'MENIT', value: timeLeft.minutes },
                    { label: 'DETIK', value: timeLeft.seconds }
                  ].map((unit, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-16 h-20 sm:w-20 sm:h-24 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                        <span className="text-3xl sm:text-5xl font-black text-white font-mono">{unit.value.toString().padStart(2, '0')}</span>
                      </div>
                      <span className="text-[10px] font-bold text-white/40 tracking-[0.2em]">{unit.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profiles Asymmetrical Bento */}
              <div className="relative z-10 mb-24">
                {candidates.length > 0 ? (
                  <div className={`grid gap-6 ${candidates.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : candidates.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                    {candidates.map((cand, i) => (
                      <motion.div 
                        key={cand.id}
                        className="bg-white/5 border border-white/10 p-2 rounded-4xl group cursor-default relative overflow-hidden"
                        whileHover={{ scale: 0.98 }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                      >
                        {/* Outer Shell -> Inner Core (Double Bezel) */}
                        <div className="bg-[#111] rounded-3xl h-full overflow-hidden relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col">
                          <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-md text-white border border-white/10 w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">
                            {cand.nomor_urut}
                          </div>
                          <div className="aspect-square w-full relative bg-[#1a1a1a]">
                            <img src={cand.foto_url} alt={cand.nama} className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-linear-to-t from-[#111] via-transparent to-transparent opacity-90" />
                          </div>
                          <div className="p-6 text-center z-10 -mt-16">
                            <h3 className="text-2xl font-bold text-white tracking-tight mb-1">{cand.nama}</h3>
                            <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-medium mt-2">Calon Ketua & Wakil Ketua OSIS</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-white/50 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
                    Kandidat sedang disiapkan.
                  </div>
                )}
              </div>

              {/* Looping Animated CTA Button (Button in Button) */}
              <div className="relative z-10 flex justify-center">
                <Link href="/e-voting" className="group relative inline-block">
                  {/* Outer Pulsing Glow */}
                  <motion.div 
                    className="absolute -inset-3 rounded-full bg-[#E53935]/30 blur-2xl opacity-60"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Actual Button */}
                  <div className="relative bg-[#E53935] hover:bg-[#d32f2f] text-white pl-10 pr-3 py-3 rounded-full flex items-center gap-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all active:scale-95 duration-300">
                    <span className="font-bold uppercase tracking-[0.15em] text-sm">Masuk Bilik Suara</span>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors relative overflow-hidden">
                      <motion.div 
                        className="flex items-center justify-center"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRightIcon className="w-5 h-5 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          </section>

          {/* 4. KARYA & PRESTASI (Bento Grid) */}
          <section className="container mx-auto px-6 lg:px-12 mb-32">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary">
                Karya & Prestasi
              </h2>
            </motion.div>

            {/* Asymmetric 3-cell bento, strict cell count rule */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 auto-rows-75 md:auto-rows-100">
              {karya.length === 0 && (
                <div className="col-span-1 md:col-span-3 text-center py-12 text-slate-500">Belum ada karya atau prestasi.</div>
              )}
              {karya[0] && (
                <motion.div
                  className="md:col-span-2 relative rounded-2xl overflow-hidden group bg-slate-200"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Link href={`/artikel/${karya[0].slug}`} className="absolute inset-0 z-10" />
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${karya[0].cover_image}')` }} />
                  <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                    <p className="text-[10px] font-bold tracking-[0.2em] mb-2 uppercase opacity-90">Karya & Prestasi</p>
                    <h3 className="text-2xl font-bold tracking-tighter">{karya[0].title}</h3>
                  </div>
                </motion.div>
              )}

              {karya[1] && (
                <motion.div
                  className="relative rounded-2xl overflow-hidden group bg-primary"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Link href={`/artikel/${karya[1].slug}`} className="absolute inset-0 z-10" />
                  <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-50 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${karya[1].cover_image}')` }} />
                  <div className="absolute inset-0 bg-primary/60" />
                  <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                    <p className="text-[10px] font-bold tracking-[0.2em] mb-2 uppercase opacity-90">Karya & Prestasi</p>
                    <h3 className="text-2xl font-bold tracking-tighter">{karya[1].title}</h3>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* 5. AGENDA TERDEKAT */}
          {/* 2-col staggered layout to avoid repetitive cards and add variety */}
          <section className="bg-primary text-white py-24 lg:py-32 mb-32 rounded-3xl mx-4 lg:mx-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
              >
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none max-w-lg">
                  Agenda<br />Terdekat
                </h2>
                <Link href="/events" className="inline-flex items-center gap-3 text-sm font-bold border-b border-white/30 pb-1 hover:border-white transition-colors uppercase tracking-widest">
                  Semua Agenda <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                {events.length > 0 ? events.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="flex flex-col border-t border-white/20 pt-6"
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">
                        {item.category || 'Event'}
                      </span>
                      <span className="text-sm font-medium opacity-90 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" /> {item.date}
                      </span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold tracking-tighter leading-tight mb-4 pr-8">
                      {item.title}
                    </h3>
                    <p className="text-sm opacity-80 mt-auto">
                      {item.location || 'Lokasi belum ditentukan'}
                    </p>
                  </motion.div>
                )) : (
                  <div className="col-span-1 md:col-span-2 py-12 text-white/70">Belum ada agenda terdekat.</div>
                )}
              </div>
            </div>
          </section>

          {/* 6. BERITA UTAMA / GRAND OPENING */}
          {/* Avoid split header ban. Use strong editorial stack. */}
          <section className="container mx-auto px-6 lg:px-12 mb-32">
            {berita[0] ? (
              <>
                <div className="max-w-4xl">
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <Link href={`/artikel/${berita[0].slug}`} className="hover:text-primary transition-colors block">
                      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary leading-[1.05] mb-8">
                        {berita[0].title}
                      </h2>
                    </Link>
                    <p className="text-lg md:text-xl font-medium text-foreground/80 max-w-2xl leading-relaxed mb-10 line-clamp-3">
                      {berita[0].excerpt}
                    </p>
                  </motion.div>
                </div>
                <motion.div
                  className="w-full aspect-21/9 md:aspect-3/1 bg-slate-200 rounded-3xl overflow-hidden relative"
                  initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Link href={`/artikel/${berita[0].slug}`} className="absolute inset-0 z-10" />
                  <div className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url('${berita[0].cover_image}')` }} />
                </motion.div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-500">Belum ada berita utama.</div>
            )}
          </section>

          {/* 7. GALERI (Scroll Stagger) */}
          <section className="container mx-auto px-6 lg:px-12 mb-32">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-primary">
                Galeri Program
              </h2>
            </motion.div>

            {/* Asymmetric masonry-ish layout for the gallery */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {galleries.length > 0 ? galleries.map((item, i) => {
                const aspects = ['aspect-4/5', 'aspect-square', 'aspect-4/3', 'aspect-square', 'aspect-3/4', 'aspect-4/3'];
                const aspect = aspects[i % aspects.length];
                return (
                  <Link href={`/galeri/${item.id}`} key={item.id} className="block break-inside-avoid">
                    <motion.div
                      className={`relative w-full ${aspect} bg-slate-200 rounded-2xl overflow-hidden group`}
                      initial={reduce ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url('${item.cover_image}')` }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                        <h3 className="text-white font-bold text-xl">{item.title}</h3>
                        <p className="text-white/80 text-sm">{item.date}</p>
                      </div>
                    </motion.div>
                  </Link>
                );
              }) : (
                <div className="col-span-3 text-center py-12 text-slate-500">Belum ada galeri.</div>
              )}
            </div>
          </section>

          {/* 8. CTA BLOCK */}
          <section className="container mx-auto px-6 lg:px-12">
            <motion.div
              className="bg-primary text-white rounded-[2.5rem] px-8 py-20 lg:p-24 text-center relative overflow-hidden"
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-none mb-8">
                  Wujudkan Prestasi & Kreativitas Bersama
                </h2>
                <p className="text-lg opacity-90 mb-12 max-w-xl">
                  Jelajahi potensi siswa, prestasi membanggakan, dan berbagai kegiatan ekstrakurikuler serta agenda seru yang diinisiasi oleh OSIS.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link
                    href="/ekskul"
                    className="bg-white text-primary text-sm font-bold px-10 py-5 rounded-full transition-transform hover:scale-[0.98] w-full sm:w-auto flex justify-center items-center"
                  >
                    Ekskul & Prestasi
                  </Link>
                  <Link
                    href="/events"
                    className="bg-transparent text-white border-2 border-white/30 text-sm font-bold px-10 py-5 rounded-full transition-colors hover:bg-white/10 w-full sm:w-auto flex justify-center items-center"
                  >
                    Agenda Kegiatan
                  </Link>
                </div>
              </div>
            </motion.div>
          </section>

        </div>
      </div>
    </div>
  );
}
