"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { MagnifyingGlassIcon, IdentificationIcon } from "@heroicons/react/24/outline";

export default function CekKTAPage() {
  const reduce = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsSearching(true);
    // Simulate API search
    setTimeout(() => {
      setIsSearching(false);
      alert("Fitur pencarian database KTA sedang dalam tahap pengembangan. \n\nNIS/Nama yang dicari: " + searchQuery);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-dvh font-sans selection:bg-primary selection:text-white bg-background pt-24 lg:pt-32 pb-32">
      <section className="container mx-auto px-6 lg:px-12 flex-1 flex flex-col items-center justify-center text-center mt-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl w-full"
        >
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/10">
            <IdentificationIcon className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-primary mb-6 uppercase">
            Cek KTA
            <br />
            <span className="text-foreground">Anggota</span>
          </h1>
          
          <p className="text-lg md:text-xl font-medium text-foreground/70 mb-12 max-w-xl mx-auto leading-relaxed">
            Masukkan Nomor Induk Siswa (NIS) atau Nama Lengkap untuk memvalidasi keanggotaan dan melihat Kartu Tanda Anggota (KTA) digital.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Ketik NIS atau Nama..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-full py-5 pl-8 pr-32 text-lg font-medium text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400 shadow-sm"
            />
            <button 
              type="submit" 
              disabled={isSearching}
              className="absolute right-2 top-2 bottom-2 bg-primary text-white px-6 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {isSearching ? (
                "Mencari..."
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-5 h-5" /> Cari
                </>
              )}
            </button>
          </form>
          
          <div className="mt-12 opacity-50 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground">
            <span className="w-8 h-px bg-foreground/20"></span>
            Database Validasi Resmi OSIS
            <span className="w-8 h-px bg-foreground/20"></span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
