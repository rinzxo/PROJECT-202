"use client";

import React, { use, useEffect, useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function GaleriDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const reduce = useReducedMotion();
  const { id } = use(params);
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        notFound();
      }
      setGallery(data);
      setLoading(false);
    }
    fetchGallery();
  }, [id]);

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-dvh font-sans selection:bg-primary selection:text-white bg-[#FDFBF7] pt-24 lg:pt-32 pb-32 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-20 filter grayscale" style={{ backgroundImage: `url('${gallery.cover_image}')` }} />
      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')" }} />

      <section className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
          className="max-w-5xl mb-24"
        >
          <Link href="/galeri" className="group inline-flex items-center gap-3 text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-16 hover:text-black transition-colors">
            <span className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center group-hover:-translate-x-1 group-hover:border-primary transition-all duration-300">
              <ArrowLeftIcon className="w-4 h-4" />
            </span>
            Kembali ke Galeri
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/10">
              {gallery.date}
            </span>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Arsip</span>
              <span className="font-medium text-slate-800">{gallery.photo_count} Foto</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter leading-[0.9] text-slate-900 mb-12 uppercase">
            {gallery.title}
          </h1>
          
          <p className="text-xl md:text-2xl font-medium tracking-tight leading-relaxed text-slate-600 max-w-3xl">
            {gallery.description}
          </p>
        </motion.div>

        {gallery.images && gallery.images.length > 0 && (
          <div className="container mx-auto px-6 lg:px-12 py-24 border-t border-slate-200">
            <h2 className="text-2xl font-black tracking-tight mb-12 uppercase">Arsip Pilihan</h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {gallery.images.map((img: string, index: number) => (
                <motion.div 
                  key={index}
                  initial={reduce ? false : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
                  className="break-inside-avoid"
                >
                  <div className="p-2 rounded-4xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-700">
                    <div className="rounded-3xl overflow-hidden relative bg-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] group">
                      <img 
                        src={img} 
                        alt={`Dokumentasi ${gallery.title} ${index + 1}`} 
                        className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.32,0.72,0,1)] grayscale-20 hover:grayscale-0"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {gallery.drive_link && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-col items-center text-center max-w-2xl mx-auto py-32"
          >
            <h2 className="text-3xl lg:text-5xl font-black tracking-tighter text-slate-900 mb-8">
              Ingin melihat seluruh momen?
            </h2>
            
            <a 
              href={gallery.drive_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group/cta relative inline-flex items-center gap-6 bg-primary text-white pl-8 pr-4 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all hover:bg-primary/95 active:scale-[0.98] shadow-2xl hover:shadow-primary/20"
            >
              Buka Album Google Drive
              <span className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 group-hover/cta:translate-x-2 group-hover/cta:-translate-y-px group-hover/cta:scale-110">
                <ArrowTopRightOnSquareIcon className="w-5 h-5 text-white" />
              </span>
            </a>
            <p className="mt-8 text-sm font-medium text-slate-400">
              Album ini berisi total {gallery.photo_count} foto dengan resolusi tinggi.
            </p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
