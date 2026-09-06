"use client";

import React from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeftIcon, BriefcaseIcon, UsersIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function KetuaWakilPage() {
  const reduce = useReducedMotion();
  const [bphs, setBphs] = React.useState<any[]>([]);
  const [programs, setPrograms] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const [bphRes, prokerRes] = await Promise.all([
        supabase.from('bph').select('*').order('order_index', { ascending: true }),
        supabase.from('prokers').select('*').in('category', ['Ketua OSIS', 'Wakil Ketua OSIS', 'Wakil Ketua']).order('order_index', { ascending: true })
      ]);
      if (bphRes.data) setBphs(bphRes.data.filter(b => b.role.toLowerCase().includes('ketua')));
      if (prokerRes.data) setPrograms(prokerRes.data);
    };
    fetchData();
  }, []);

  // Data is fetched in the combined useEffect above
  
  return (
    <div className="flex flex-col min-h-dvh font-sans selection:bg-primary selection:text-white bg-background pt-24 lg:pt-32 pb-32">
      
      {/* NATIVE HERO */}
      <section className="container mx-auto px-6 lg:px-12 mb-16 lg:mb-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <Link href="/profil" className="inline-flex items-center gap-3 text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-12 hover:-translate-x-1 transition-transform">
            <ArrowLeftIcon className="w-4 h-4" /> Kembali ke Profil
          </Link>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-primary mb-8 -ml-1 lg:-ml-2 uppercase">
            Ketua &<br/>Wakil Ketua
          </h1>
          <p className="text-xl md:text-2xl font-bold tracking-wide opacity-50 max-w-2xl leading-relaxed text-foreground uppercase">
            BADAN PENGURUS HARIAN
          </p>
        </motion.div>
      </section>

      {/* PENGURUS (Horizontal Snap Mobile) */}
      <section className="container mx-auto px-6 lg:px-12 mb-24 lg:mb-32">
        <motion.div 
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tighter text-foreground">Susunan Pengurus</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8 w-full text-center">
            {bphs.map((pengurus, i) => (
              <div key={i} className="flex flex-col items-center group w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-70">
                <div className="aspect-4/5 w-full bg-slate-200 relative mb-6 overflow-hidden rounded-3xl group-hover:border-primary/20 border-2 border-transparent transition-all">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 ease-out" 
                    style={{ backgroundImage: `url('${pengurus.image}')` }}
                  />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-3 group-hover:text-primary transition-colors">{pengurus.role}</p>
                <h3 className="text-xl md:text-2xl font-bold tracking-tighter group-hover:text-primary transition-colors">{pengurus.name}</h3>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PROGRAM KERJA (Table) */}
      <section className="container mx-auto px-6 lg:px-12 mb-24 lg:mb-32">
        <motion.div 
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <BriefcaseIcon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tighter text-foreground">Program Kerja</h2>
          </div>
          
          {/* MOBILE CAROUSEL (Visible < md) */}
          <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {programs.map((program, idx) => (
              <div key={program.id} className="snap-center shrink-0 w-[85vw] sm:w-[320px] border border-slate-200 rounded-3xl bg-white shadow-sm p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div className="flex-1">
                    <span className="text-slate-400 font-bold text-sm mb-1 block">#{idx + 1} ({program.category})</span>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{program.nama}</h3>
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full whitespace-nowrap",
                    program.keterangan === "TERLAKSANA" && "bg-green-100 text-green-700",
                    program.keterangan === "BELUM TERLAKSANA" && "bg-yellow-100 text-yellow-700",
                    program.keterangan.includes("TIDAK") && "bg-red-100 text-red-700"
                  )}>
                    {program.keterangan}
                  </span>
                </div>
                
                <div className="mb-6 flex-1">
                  <p className="text-slate-600 text-sm leading-relaxed">{program.tujuan}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Jangka</p>
                    <p className="text-sm font-medium text-slate-700">{program.jangka}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Waktu</p>
                    <p className="text-sm font-medium text-slate-700">{program.waktu}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE (Visible md+) */}
          <div className="hidden md:block w-screen -mx-6 px-6 lg:w-full lg:mx-0 lg:px-0 overflow-x-auto hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="min-w-200 border border-slate-200 rounded-3xl bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-[10px] uppercase bg-slate-50 text-slate-500 font-bold tracking-[0.2em] border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-6 whitespace-nowrap">No</th>
                    <th className="px-8 py-6">Program Kerja</th>
                    <th className="px-8 py-6">Tujuan</th>
                    <th className="px-8 py-6 whitespace-nowrap">Jangka</th>
                    <th className="px-8 py-6 whitespace-nowrap">Waktu</th>
                    <th className="px-8 py-6 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-base">
                  {programs.map((program, idx) => (
                    <tr key={program.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-900 align-top">{idx + 1}</td>
                      <td className="px-8 py-6 font-bold text-slate-900 min-w-62.5 align-top">{program.nama}</td>
                      <td className="px-8 py-6 min-w-75 leading-relaxed align-top">{program.tujuan}</td>
                      <td className="px-8 py-6 whitespace-nowrap font-medium align-top">{program.jangka}</td>
                      <td className="px-8 py-6 font-medium align-top">{program.waktu}</td>
                      <td className="px-8 py-6 whitespace-nowrap align-top">
                        <span className={cn(
                          "text-[10px] font-bold tracking-[0.2em] uppercase",
                          program.keterangan === "TERLAKSANA" && "bg-green-100 text-green-700",
                          program.keterangan === "BELUM TERLAKSANA" && "bg-yellow-100 text-yellow-700",
                          program.keterangan.includes("TIDAK") && "bg-red-100 text-red-700"
                        )}>
                          {program.keterangan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
