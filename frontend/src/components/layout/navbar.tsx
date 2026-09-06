"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, ArrowRightIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
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
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const isHomepage = pathname === '/';
  const isLightText = isHomepage && !isScrolled;

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
        "fixed top-0 left-0 right-0 z-100 w-full transition-all duration-300",
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8 flex flex-col gap-2">
        {/* Main Nav */}
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/logo_osis2.png"
              alt="Logo OSIS SMAN 2 Babelan"
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain shrink-0 transition-transform group-hover:scale-105"
            />
            <div className={cn(
              "flex flex-col text-[10px] lg:text-xs font-medium tracking-tight uppercase leading-[1.1] transition-colors",
              isLightText ? "text-white" : "text-primary"
            )}>
              <span className="font-black text-xs lg:text-sm">OSIS SMAN 2 BABELAN</span>
              <span>KABUPATEN BEKASI</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className={cn(
            "hidden xl:flex items-center gap-8 text-[15px] font-medium transition-colors",
            isLightText ? "text-white" : "text-primary"
          )}>
            <Link href="/" className="hover:underline underline-offset-8">Beranda</Link>

            {/* PROFIL MEGA MENU */}
            <div className="group relative">
              <Link href="/profil" className="hover:underline underline-offset-4 flex items-center gap-1 py-4">
                Profil
              </Link>

              {/* Dropdown Box */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-8 w-max flex flex-col gap-8 text-primary">
                  <div className="grid grid-cols-2 gap-12">
                    {/* Column 1 */}
                    <div>
                      <h4 className="text-[11px] font-black tracking-widest uppercase mb-5 text-primary">TENTANG KAMI</h4>
                      <ul className="flex flex-col gap-4 normal-case font-medium text-[13px]">
                        <li><Link href="/profil#visi-misi" className="hover:underline">Visi & Misi</Link></li>
                      </ul>
                    </div>
                    {/* Column 2 */}
                    <div>
                      <h4 className="text-[11px] font-black tracking-widest uppercase mb-5 text-primary">KEPENGURUSAN</h4>
                      <ul className="flex flex-col gap-4 normal-case font-medium text-[13px]">
                        <li><Link href="/profil#struktur" className="hover:underline">Struktur Organisasi</Link></li>
                        <li><Link href="/bph/ketua-wakil" className="hover:underline">Badan Pengurus Harian</Link></li>
                        <li><Link href="/sekbid" className="hover:underline">Seksi Bidang (Sekbid)</Link></li>
                        <li><Link href="/ekskul" className="hover:underline">Ekstrakurikuler</Link></li>
                      </ul>
                    </div>
                  </div>
                  {/* Bottom Link */}
                  <div className="pt-6 border-t border-slate-200 mt-2">
                    <Link href="/profil" className="text-[11px] font-black tracking-widest uppercase hover:underline inline-flex items-center gap-2">
                      LIHAT SELURUH PROFIL <ArrowRightIcon className="w-4 h-4 translate-y-px rotate-45" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/events" className="hover:underline underline-offset-8">Event Hub</Link>
            
            {/* PUSAT DOKUMEN MEGA MENU */}
            <div className="group relative">
              <Link href="/dokumen" className="hover:underline underline-offset-4 flex items-center gap-1 py-4">
                Pusat Dokumen
              </Link>
              
              {/* Dropdown Box */}
              <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-8 w-max flex flex-col gap-8 text-primary">
                  <div className="grid grid-cols-2 gap-12">
                    {/* Column 1 */}
                    <div>
                      <h4 className="text-[11px] font-black tracking-widest uppercase mb-5 text-primary">DOKUMENTASI</h4>
                      <ul className="flex flex-col gap-4 normal-case font-medium text-[13px]">
                        <li><Link href="/dokumen" className="hover:underline">Unduhan & Surat</Link></li>
                        <li><Link href="/galeri" className="hover:underline">Galeri Kegiatan</Link></li>
                      </ul>
                    </div>
                    {/* Column 2 */}
                    <div>
                      <h4 className="text-[11px] font-black tracking-widest uppercase mb-5 text-primary">LAYANAN ANGGOTA</h4>
                      <ul className="flex flex-col gap-4 normal-case font-medium text-[13px]">
                        <li><Link href="/cek-kta" className="hover:underline">Cek KTA Anggota</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={cn(
              "xl:hidden p-2 transition-colors",
              isLightText ? "text-white" : "text-primary"
            )}
            aria-label="Open Mobile Menu"
          >
            <Bars3Icon className="w-8 h-8" />
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
                <img src="/images/logo_osis2.png" alt="Logo OSIS SMAN 2 Babelan" className="w-10 h-10 object-contain shrink-0" />
                <div className="flex flex-col text-xs font-medium tracking-tight uppercase leading-[1.1]">
                  <span className="font-black text-sm">OSIS SMAN 2 BABELAN</span>
                  <span>KABUPATEN BEKASI</span>
                </div>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Close Mobile Menu"
              >
                <XMarkIcon className="w-10 h-10 text-white" />
              </button>
            </motion.div>

            {/* Center Navigation Links */}
            <motion.nav variants={itemVariants} className="flex flex-col gap-6 my-8">
              
              <motion.div variants={itemVariants}>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl sm:text-4xl font-black tracking-tighter hover:text-blue-200 transition-colors block">
                  BERANDA
                </Link>
              </motion.div>

              {/* PROFIL ACCORDION */}
              <motion.div variants={itemVariants}>
                <button 
                  onClick={() => setExpandedMenu(expandedMenu === 'profil' ? null : 'profil')} 
                  className="flex items-center justify-between w-full text-3xl sm:text-4xl font-black tracking-tighter hover:text-blue-200 transition-colors text-left"
                >
                  <span>PROFIL</span>
                  <ChevronDownIcon className={cn("w-8 h-8 transition-transform duration-300", expandedMenu === 'profil' && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {expandedMenu === 'profil' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-6 pt-6 pl-4 border-l-2 border-white/20 mt-4">
                        <div>
                          <h4 className="text-[11px] font-black tracking-widest uppercase mb-4 text-white/50">TENTANG KAMI</h4>
                          <Link href="/profil#visi-misi" onClick={() => setIsMobileMenuOpen(false)} className="text-xl sm:text-2xl font-bold text-white/90 hover:text-white block">
                            Visi & Misi
                          </Link>
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black tracking-widest uppercase mb-4 text-white/50">KEPENGURUSAN</h4>
                          <div className="flex flex-col gap-4">
                            <Link href="/profil#struktur" onClick={() => setIsMobileMenuOpen(false)} className="text-xl sm:text-2xl font-bold text-white/90 hover:text-white block">Struktur Organisasi</Link>
                            <Link href="/bph/ketua-wakil" onClick={() => setIsMobileMenuOpen(false)} className="text-xl sm:text-2xl font-bold text-white/90 hover:text-white block">Badan Pengurus Harian</Link>
                            <Link href="/sekbid" onClick={() => setIsMobileMenuOpen(false)} className="text-xl sm:text-2xl font-bold text-white/90 hover:text-white block">Seksi Bidang (Sekbid)</Link>
                            <Link href="/ekskul" onClick={() => setIsMobileMenuOpen(false)} className="text-xl sm:text-2xl font-bold text-white/90 hover:text-white block">Ekstrakurikuler</Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Link href="/events" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl sm:text-4xl font-black tracking-tighter hover:text-blue-200 transition-colors block">
                  EVENT HUB & AGENDA
                </Link>
              </motion.div>

              {/* PUSAT DOKUMEN ACCORDION */}
              <motion.div variants={itemVariants}>
                <button 
                  onClick={() => setExpandedMenu(expandedMenu === 'dokumen' ? null : 'dokumen')} 
                  className="flex items-center justify-between w-full text-3xl sm:text-4xl font-black tracking-tighter hover:text-blue-200 transition-colors text-left"
                >
                  <span>PUSAT DOKUMEN</span>
                  <ChevronDownIcon className={cn("w-8 h-8 transition-transform duration-300", expandedMenu === 'dokumen' && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {expandedMenu === 'dokumen' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-6 pt-6 pl-4 border-l-2 border-white/20 mt-4">
                        <div>
                          <h4 className="text-[11px] font-black tracking-widest uppercase mb-4 text-white/50">DOKUMENTASI</h4>
                          <div className="flex flex-col gap-4">
                            <Link href="/dokumen" onClick={() => setIsMobileMenuOpen(false)} className="text-xl sm:text-2xl font-bold text-white/90 hover:text-white block">Unduhan & Surat</Link>
                            <Link href="/galeri" onClick={() => setIsMobileMenuOpen(false)} className="text-xl sm:text-2xl font-bold text-white/90 hover:text-white block">Galeri Kegiatan</Link>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black tracking-widest uppercase mb-4 text-white/50">LAYANAN ANGGOTA</h4>
                          <Link href="/cek-kta" onClick={() => setIsMobileMenuOpen(false)} className="text-xl sm:text-2xl font-bold text-white/90 hover:text-white block">
                            Cek KTA Anggota
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            </motion.nav>

            {/* Bottom Info */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2 border-t border-white/20 pt-6 text-center">
              <p className="text-xs font-bold text-white/90">OSIS SMAN 2 BABELAN - KABUPATEN BEKASI</p>
              <p className="text-[11px] text-white/70 font-medium">
                © {new Date().getFullYear()} OSIS SMAN 2 BABELAN. ALL RIGHTS RESERVED.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
