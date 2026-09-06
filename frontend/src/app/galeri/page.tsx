"use client";

import React from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { ArrowTopRightOnSquareIcon, ArrowRightIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function GaleriPage() {
  const reduce = useReducedMotion();
  const [galleries, setGalleries] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchGalleries = async () => {
      const { data } = await supabase
        .from('galleries')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setGalleries(data);
    };
    fetchGalleries();
  }, []);

  const getColSpan = (index: number) => {
    // Asymmetrical Bento Grid logic
    const pos = index % 4;
    if (pos === 0) return "md:col-span-7";
    if (pos === 1) return "md:col-span-5";
    if (pos === 2) return "md:col-span-12";
    if (pos === 3) return "md:col-span-6";
    return "md:col-span-6";
  };

  const getAspect = (index: number) => {
    const pos = index % 4;
    if (pos === 2) return "aspect-square md:aspect-[3/1]"; // Taller on mobile to fit content
    return "aspect-square md:aspect-[4/3]"; // Consistent square height on mobile
  };

  return (
    <div className="flex flex-col min-h-dvh font-sans selection:bg-primary selection:text-white bg-background">
      
      {/* 1. THE HERO SECTION (FIXED BACKGROUND) */}
      <div className="fixed top-0 left-0 w-full h-dvh z-0 bg-slate-900 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        
        {/* Hero Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          poster="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2070&auto=format&fit=crop"
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
        </video>

        {/* Hero Content aligned like homepage */}
        <div className="relative z-20 container mx-auto px-6 lg:px-12 h-full flex flex-col justify-start md:justify-center pt-32 md:pt-0 pb-24">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] text-white mb-8 -ml-1 lg:-ml-2 uppercase drop-shadow-lg">
              Galeri
              <br />
              <span className="text-white/80">Kegiatan</span>
            </h1>
            <p className="hidden md:block text-xl md:text-3xl font-medium tracking-tight max-w-2xl leading-relaxed text-white/90 drop-shadow-sm">
              Merekam jejak karya, momen bersejarah, dan keseruan seluruh agenda resmi OSIS SMAN 2 Babelan.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 2. THE MAIN CONTENT WRAPPER */}
      {/* Everything from here scrolls over the hero */}
      <div className="relative z-20 w-full bg-background pt-24 pb-32 rounded-t-[3rem] mt-[100dvh] shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
        
        {/* ASYMMETRICAL BENTO GRID (CLEAN HOVER-ONLY) */}
        <section className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
            {galleries.map((gallery, index) => (
              <motion.div 
                key={gallery.id}
                initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
                className={cn("w-full h-full", getColSpan(index))}
              >
                <div className="p-1.5 lg:p-2 rounded-4xl bg-slate-50 border border-slate-200 shadow-sm w-full h-full">
                  <div className={cn(
                    "group relative w-full h-full rounded-[1.625rem] lg:rounded-3xl overflow-hidden bg-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]",
                    getAspect(index)
                  )}>
                    
                    {/* BACKGROUND IMAGE */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center grayscale mix-blend-screen opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.2s] ease-[cubic-bezier(0.32,0.72,0,1)]" 
                      style={{ backgroundImage: `url('${gallery.cover_image}')` }}
                    />
                    
                    {/* HOVER OVERLAY GRADIENT */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* ALWAYS VISIBLE BADGE */}
                    <div className="absolute top-4 left-4 lg:top-6 lg:left-6 opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                      <div className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <span className="text-white font-bold text-[10px] lg:text-xs uppercase tracking-widest">{gallery.photo_count} FOTO</span>
                      </div>
                    </div>

                    {/* HOVER REVEALED CONTENT */}
                    <div className="absolute inset-0 p-5 sm:p-8 lg:p-12 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      
                      <span className="text-white/70 text-[9px] lg:text-[10px] font-bold tracking-[0.2em] uppercase mb-2 lg:mb-3 block">
                        {gallery.date}
                      </span>
                      
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-white mb-6 lg:mb-8 leading-tight line-clamp-3">
                        {gallery.title}
                      </h3>
                      
                      {/* BUTTONS */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-auto">
                        <Link 
                          href={`/galeri/${gallery.id}`}
                          className="group/btn relative inline-flex items-center gap-3 lg:gap-4 bg-primary text-white px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full font-bold uppercase tracking-widest text-[10px] lg:text-xs transition-all hover:bg-white hover:text-primary active:scale-[0.98] shadow-lg"
                        >
                          Lihat Detail
                          <span className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-white/20 group-hover/btn:bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover/btn:translate-x-1">
                            <ArrowRightIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                          </span>
                        </Link>

                        {gallery.drive_link && (
                          <a 
                            href={gallery.drive_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full font-bold uppercase tracking-widest text-[10px] lg:text-xs text-white border border-white/20 hover:bg-white/10 transition-all active:scale-[0.98] backdrop-blur-sm"
                          >
                            Drive <ArrowTopRightOnSquareIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
