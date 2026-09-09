'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProfilKandidat() {
  const params = useParams();
  const id = params.id as string;
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (data && !error) {
        setCandidate(data);
      }
      setLoading(false);
    };
    if (id) fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E53935]/30 border-t-[#E53935] rounded-full animate-spin" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Kandidat Tidak Ditemukan</h1>
        <Link href="/e-voting" className="text-[#E53935] hover:underline flex items-center gap-2 font-medium">
          <ArrowLeftIcon className="w-4 h-4" /> Kembali ke E-Voting
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      {/* Navbar / Header (Simple) */}
      <header className="w-full bg-white border-b border-slate-200 py-4 px-6 md:px-12 sticky top-0 z-50 shadow-sm flex items-center">
        <Link href="/e-voting" className="text-slate-500 hover:text-[#E53935] flex items-center gap-2 font-medium transition-colors">
          <ArrowLeftIcon className="w-5 h-5" /> Kembali
        </Link>
        <div className="mx-auto flex items-center gap-2">
          <img src="/images/logo_osis2.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-slate-800 tracking-tight hidden sm:inline">E-Voting Pemilu</span>
        </div>
        <div className="w-20" /> {/* Spacer for centering */}
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
        >
          {/* Header Cover / Banner */}
          <div className="h-48 md:h-64 relative bg-slate-900 overflow-hidden">
            {/* Banner Image */}
            <img 
              src={candidate.banner_url || "/images/smandala-fest-1.jpg"} 
              alt="Banner Kandidat" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Soft Bottom Gradient Overlay for Readability (Only at the very bottom edge) */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent" />
          </div>
          
          {/* Content */}
          <div className="px-6 md:px-12 pb-12 relative">
            {/* Foto Avatar Floating */}
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden border-8 border-white shadow-xl -mt-20 md:-mt-28 mb-6 bg-slate-100 mx-auto md:mx-0">
              <img src={candidate.foto_url} alt={candidate.nama} className="w-full h-full object-cover object-top" />
            </div>

            <div className="text-center md:text-left mb-10">
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-2 flex items-center justify-center md:justify-start gap-3">
                {candidate.nama}
                <CheckBadgeIcon className="w-8 h-8 md:w-10 md:h-10 text-blue-500 shrink-0" title="Kandidat Resmi diverifikasi" />
              </h1>
              <p className="text-sm md:text-base text-slate-500 font-bold uppercase tracking-[0.2em]">Calon Ketua & Wakil Ketua OSIS</p>
            </div>

            <div className="space-y-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
                  Visi
                </h2>
                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-inner">
                  <div className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm md:text-base" dangerouslySetInnerHTML={{ __html: candidate.visi || candidate.visi_misi || "Belum ada visi." }} />
                </div>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
                  Misi
                </h2>
                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-inner">
                  {candidate.misi && !/<[a-z][\s\S]*>/i.test(candidate.misi) ? (
                    <ol className="list-decimal pl-5 space-y-3 text-slate-600 text-sm md:text-base leading-relaxed">
                      {candidate.misi.split('\n').filter((line: string) => line.trim() !== '').map((line: string, idx: number) => (
                        <li key={idx} className="pl-2">{line.trim()}</li>
                      ))}
                    </ol>
                  ) : (
                    <div className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm md:text-base" dangerouslySetInnerHTML={{ __html: candidate.misi || "Belum ada misi." }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
