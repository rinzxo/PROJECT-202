"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Candidate = {
  id: string;
  nama: string;
  nomor_urut: number;
  visi?: string;
  misi?: string;
  visi_misi: string;
  foto_url: string;
  votes: number;
};

export default function EVotingApp() {
  const router = useRouter();
  
  const [heroVideo, setHeroVideo] = useState('/videos/hero.mp4');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetchCandidates();
    fetchHeroVideo();
    
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

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('nomor_urut', { ascending: true });
        
      if (error) throw error;
      setCandidates(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHeroVideo = async () => {
    try {
      const { data, error } = await supabase
        .from('evoting_settings')
        .select('hero_video_url')
        .eq('id', 1)
        .single();
      
      if (data && data.hero_video_url) {
        setHeroVideo(data.hero_video_url);
      }
    } catch (err) {
      console.error("Gagal memuat pengaturan video:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start font-sans">
      {/* GUEST HERO SECTION (16:9 Aspect Ratio, Set from Admin) */}
      <div className="w-full relative aspect-video bg-black">
        {heroVideo.includes('youtube.com') || heroVideo.includes('youtu.be') ? (
          <iframe 
            src={heroVideo.includes('watch?v=') ? heroVideo.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1&loop=1' : heroVideo + '?autoplay=1&mute=1&loop=1'}
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-50 via-transparent to-transparent" />
      </div>

      <div className={`w-full max-w-6xl mx-auto p-4 md:p-8 -mt-24 relative z-10`}>
        
        {/* CANDIDATES SCREEN (ALWAYS SHOWN) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Header Banner */}
          <div className="flex flex-col items-center mb-16">
            {/* Countdown under Hero */}
            <div className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-4xl shadow-2xl flex gap-4 md:gap-8 justify-center items-center mb-12 transform hover:scale-[1.02] transition-transform duration-500">
              {[
                { label: 'HARI', value: timeLeft.days },
                { label: 'JAM', value: timeLeft.hours },
                { label: 'MENIT', value: timeLeft.minutes },
                { label: 'DETIK', value: timeLeft.seconds }
              ].map((unit, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-16 h-20 md:w-20 md:h-24 bg-slate-100 rounded-2xl flex items-center justify-center mb-2 shadow-inner border border-slate-200">
                    <span className="text-4xl md:text-5xl font-black text-slate-800 font-mono tracking-tighter">{unit.value.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-500 tracking-[0.2em]">{unit.label}</span>
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2 uppercase">Calon Ketua & Wakil Ketua OSIS</h2>
            <p className="text-slate-500">Kenali calon pemimpin masa depan SMAN 2 Babelan</p>
          </div>

          {candidates.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
              <p className="text-xl text-slate-500">Belum ada kandidat yang tersedia.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              candidates.length === 1 
                ? 'grid-cols-1 max-w-md mx-auto' 
                : candidates.length === 2 
                  ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {candidates.map(candidate => (
                <Link href={`/kandidat/${candidate.id}`} key={candidate.id}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 relative border border-slate-100 shadow-sm cursor-pointer hover:shadow-xl hover:ring-4 hover:ring-[#E53935]/50 group`}
                  >
                    {/* Badge Nomor */}
                    <div className="absolute top-4 left-4 z-10 bg-[#E53935] text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shadow-md">
                      {candidate.nomor_urut}
                    </div>

                    {/* Foto Container */}
                    <div className="aspect-square bg-slate-100 relative">
                      <img src={candidate.foto_url} alt={candidate.nama} className="w-full h-full object-cover object-top" />
                    </div>

                    {/* Info Container */}
                    <div className="p-5 text-center flex flex-col items-center">
                      <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1">{candidate.nama}</h3>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mb-2">Calon Ketua & Wakil Ketua OSIS</p>
                      <p className="text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity mt-2 flex items-center gap-1">
                        Lihat Profil <ArrowRightIcon className="w-4 h-4" />
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}

          {/* VOTE SEKARANG BUTTON */}
          {candidates.length > 0 && (
            <div className="flex justify-center mt-20 mb-12">
              <Link href="/e-voting/vote">
                <motion.button 
                  className="relative group overflow-hidden bg-linear-to-r from-[#E53935] to-[#c62828] text-white px-12 py-5 rounded-full shadow-2xl flex items-center gap-4 hover:shadow-[#E53935]/40 transition-all active:scale-95"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="font-black text-xl tracking-[0.2em] relative z-10">VOTE SEKARANG</span>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative z-10 group-hover:bg-white text-white group-hover:text-[#E53935] transition-colors">
                    <ArrowRightIcon className="w-6 h-6" />
                  </div>
                </motion.button>
              </Link>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
