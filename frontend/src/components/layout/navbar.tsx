"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

const menuVariants: Variants = {
  hidden: { opacity: 0, y: "-100%" },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.08
    }
  },
  exit: { 
    opacity: 0, 
    y: "-100%", 
    transition: { 
      duration: 0.4, 
      ease: "easeIn" 
    } 
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" } 
  }
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8 flex flex-col gap-2">
        {/* Main Nav */}
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/images/logo_babelan2.png" 
              alt="Logo SMAN 2 Babelan" 
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain shrink-0 transition-transform group-hover:scale-105" 
            />
            <div className={cn(
              "flex flex-col text-[10px] lg:text-xs font-medium tracking-tight uppercase leading-[1.1] transition-colors",
              isScrolled ? "text-primary" : "text-white"
            )}>
              <span className="font-black text-xs lg:text-sm">SMAN 2 BABELAN</span>
              <span>KABUPATEN BEKASI</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className={cn(
            "hidden xl:flex items-center gap-8 text-[15px] font-medium transition-colors",
            isScrolled ? "text-primary" : "text-white"
          )}>
            <Link href="/" className="hover:underline underline-offset-8">Beranda</Link>
            
            {/* PROFIL MEGA MENU */}
            <div className="group relative">
              <Link href="/profil" className="hover:underline underline-offset-4 flex items-center gap-1 py-4">
                Profil
              </Link>
              
              {/* Dropdown Box */}
              <div className="absolute top-full -left-8 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-10 w-187.5 flex flex-col gap-8 text-primary">
                  <div className="grid grid-cols-3 gap-8">
                    {/* Column 1 */}
                    <div>
                      <h4 className="text-[11px] font-black tracking-widest uppercase mb-5 text-primary">TENTANG KAMI</h4>
                      <ul className="flex flex-col gap-4 normal-case font-medium text-[13px]">
                        <li><Link href="/profil#visi-misi" className="hover:underline">Visi & Misi</Link></li>
                        <li><Link href="/profil#sejarah" className="hover:underline">Sejarah Singkat</Link></li>
                        <li><Link href="/profil#prestasi" className="hover:underline">Prestasi Sekolah</Link></li>
                      </ul>
                    </div>
                    {/* Column 2 */}
                    <div>
                      <h4 className="text-[11px] font-black tracking-widest uppercase mb-5 text-primary">KEPEGAWAIAN</h4>
                      <ul className="flex flex-col gap-4 normal-case font-medium text-[13px]">
                        <li><Link href="/profil#struktur" className="hover:underline">Struktur Organisasi</Link></li>
                        <li><Link href="/profil#guru" className="hover:underline">Daftar Guru</Link></li>
                        <li><Link href="/profil#tu" className="hover:underline">Daftar TU</Link></li>
                      </ul>
                    </div>
                    {/* Column 3 */}
                    <div>
                      <h4 className="text-[11px] font-black tracking-widest uppercase mb-5 text-primary">FASILITAS</h4>
                      <ul className="flex flex-col gap-4 normal-case font-medium text-[13px]">
                        <li><Link href="/profil#sarana" className="hover:underline">Sarana Prasarana</Link></li>
                        <li><Link href="/profil#laboratorium" className="hover:underline">Laboratorium</Link></li>
                        <li><Link href="/profil#perpustakaan" className="hover:underline">Perpustakaan</Link></li>
                      </ul>
                    </div>
                  </div>
                  {/* Bottom Link */}
                  <div className="pt-6 border-t border-slate-200 mt-2">
                    <Link href="/profil" className="text-[11px] font-black tracking-widest uppercase hover:underline inline-flex items-center gap-2">
                      LIHAT SELURUH PROFIL <ArrowRight className="w-4 h-4 translate-y-px rotate-45" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/events" className="hover:underline underline-offset-8">Event Hub</Link>
            <Link href="/ekskul" className="hover:underline underline-offset-8">Portal Ekskul</Link>
            <Link href="/dokumen" className="hover:underline underline-offset-8">Pusat Dokumen</Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className={cn(
              "xl:hidden p-2 transition-colors",
              isScrolled ? "text-primary" : "text-white"
            )}
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-8 h-8" />
          </button>

        </div>
      </div>

      {/* FULL SCREEN MOBILE MENU OVERLAY WITH FRAMER MOTION ANIMATION */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-2xl text-white flex flex-col justify-between p-6 sm:p-8 xl:hidden overflow-y-auto shadow-2xl"
          >
            {/* Top Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-white/20 pb-6">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                <img src="/images/logo_babelan2.png" alt="Logo SMAN 2 Babelan" className="w-10 h-10 object-contain shrink-0" />
                <div className="flex flex-col text-xs font-medium tracking-tight uppercase leading-[1.1]">
                  <span className="font-black text-sm">SMAN 2 BABELAN</span>
                  <span>KABUPATEN BEKASI</span>
                </div>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Close Mobile Menu"
              >
                <X className="w-7 h-7" />
              </button>
            </motion.div>

            {/* Center Navigation Links */}
            <motion.nav variants={itemVariants} className="flex flex-col gap-6 my-8">
              <motion.div variants={itemVariants}>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl sm:text-4xl font-black tracking-tighter hover:text-blue-200 transition-colors block">
                  BERANDA
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/profil" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl sm:text-4xl font-black tracking-tighter hover:text-blue-200 transition-colors block">
                  PROFIL SEKOLAH
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/profil#visi-misi" onClick={() => setIsMobileMenuOpen(false)} className="text-xl sm:text-2xl font-bold text-white/80 tracking-tight hover:text-white pl-4 border-l-2 border-white/30 block">
                  Visi & Misi
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/profil#struktur" onClick={() => setIsMobileMenuOpen(false)} className="text-xl sm:text-2xl font-bold text-white/80 tracking-tight hover:text-white pl-4 border-l-2 border-white/30 block">
                  Struktur Organisasi
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/events" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl sm:text-4xl font-black tracking-tighter hover:text-blue-200 transition-colors block">
                  EVENT HUB & AGENDA
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/ekskul" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl sm:text-4xl font-black tracking-tighter hover:text-blue-200 transition-colors block">
                  PORTAL EKSKUL
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/dokumen" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl sm:text-4xl font-black tracking-tighter hover:text-blue-200 transition-colors block">
                  PUSAT DOKUMEN
                </Link>
              </motion.div>
            </motion.nav>

            {/* Bottom Info */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2 border-t border-white/20 pt-6 text-center">
              <p className="text-xs font-bold text-white/90">SMAN 2 BABELAN - KABUPATEN BEKASI</p>
              <p className="text-[11px] text-white/70 font-medium">
                © {new Date().getFullYear()} SMAN 2 BABELAN. ALL RIGHTS RESERVED.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
