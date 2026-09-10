"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

type Candidate = {
  id: string;
  nama: string;
  foto_url: string;
  nomor_urut: number;
};

type Vote = {
  candidate_id: string;
};

export default function TempResultPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVoters, setTotalVoters] = useState(0);

  useEffect(() => {
    fetchData();
    
    // 1. WebSocket Realtime for instant updates (if enabled in Supabase)
    const channel = supabase
      .channel('realtime-votes-temp')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => {
          fetchData(); // Instantly refetch when a vote is cast
        }
      )
      .subscribe();

    // 2. Fast polling as a reliable fallback (every 3 seconds)
    const interval = setInterval(fetchData, 3000);
    
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Candidates
      const { data: cData, error: cError } = await supabase
        .from('candidates')
        .select('*')
        .order('nomor_urut', { ascending: true });
        
      if (cError) throw cError;
      setCandidates(cData || []);

      // Fetch Votes - Order by id or time so the slice is consistent
      const { data: vData, error: vError } = await supabase
        .from('votes')
        .select('candidate_id')
        .order('waktu_voting', { ascending: true });
        
      if (vError) throw vError;
      
      // QUICK COUNT SIMULATION LOGIC
      // We only take the first 30% of the votes to simulate a quick count.
      // This ensures the data doesn't randomly jump on refresh, but grows slowly as more votes come in.
      const allVotes = vData || [];
      const sampleSize = Math.max(1, Math.floor(allVotes.length * 0.3));
      
      // Only slice if there are actually votes, otherwise empty
      const sampledVotes = allVotes.length > 0 ? allVotes.slice(0, sampleSize) : [];
      setVotes(sampledVotes);

      // Fetch total expected voters
      const { count, error: countError } = await supabase
        .from('voters')
        .select('*', { count: 'exact', head: true });
        
      if (!countError && count !== null) {
        setTotalVoters(count);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Memuat Quick Count...</p>
        </div>
      </div>
    );
  }

  const totalVotes = votes.length;
  // Estimate total incoming based on 30% sample if we want, but let's just show the raw sample math
  const progressPercentage = totalVoters > 0 ? (totalVotes / (totalVoters * 0.3)) * 100 : 0;

  return (
    <div className="h-screen w-full bg-slate-50 font-sans flex flex-col overflow-hidden relative">
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <img src="/images/SuaraKita.png" alt="Watermark" className="w-[800px] h-[800px] object-contain grayscale" />
      </div>

      <div className="flex-1 flex flex-col justify-center py-4 sm:p-8 pb-28 sm:pb-32 w-full max-w-6xl mx-auto relative z-10 min-h-0">
        {/* Candidate Cards Grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full overflow-x-auto snap-x snap-mandatory px-4 sm:px-0 pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {candidates.map((candidate, index) => {
            const candidateVotes = votes.filter(v => v.candidate_id === candidate.id).length;
            const percentage = totalVotes > 0 ? (candidateVotes / totalVotes) * 100 : 0;
            
            // Generate some colors based on index
            const colors = [
              "from-red-500 to-red-600",
              "from-blue-500 to-blue-600",
              "from-amber-500 to-amber-600",
              "from-emerald-500 to-emerald-600"
            ];
            const colorClass = colors[index % colors.length];

            return (
              <motion.div 
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col group min-w-[85%] sm:min-w-[60%] md:min-w-0 shrink-0 snap-center md:h-full"
              >
                {/* Photo & Number */}
                <div className="relative w-full aspect-square md:aspect-auto md:flex-1 bg-slate-100/50 overflow-hidden p-2 flex items-center justify-center">
                  <img src={candidate.foto_url} alt={candidate.nama} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-black/80 text-white w-10 h-10 flex items-center justify-center font-black text-xl rounded-xl backdrop-blur-sm shadow-lg z-10">
                    {candidate.nomor_urut}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 flex-none bg-white border-t border-slate-100">
                  <div className="mb-4">
                    <div className="flex justify-between items-end">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hasil Sementara</div>
                      <div className="font-black text-3xl sm:text-4xl tracking-tighter text-slate-900 leading-none">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>

                  {/* The Bar */}
                  <div className="w-full h-3 sm:h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: 'spring', damping: 20 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 sm:px-8 sm:py-5 flex flex-col md:flex-row items-center justify-between z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]"
      >
        {/* Left: Text */}
        <div className="mb-4 md:mb-0 text-center md:text-left flex items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Quick Count OSIS</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Estimasi sementara (sampel 30%), BUKAN hasil akhir resmi.</p>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="text-center md:text-right">
            <h2 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Sampel Masuk</h2>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{totalVotes}</div>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="text-center md:text-right">
            <h2 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Progress</h2>
            <div className="text-xl sm:text-2xl font-black text-blue-600 leading-none">
              {Math.min(100, Math.round(progressPercentage))}%
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="text-center md:text-right">
            <h2 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Target Sampel</h2>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {Math.max(1, Math.floor(totalVoters * 0.3))}
            </div>
          </div>
          
          {/* Powered by */}
          <div className="hidden lg:block ml-2 pl-6 border-l border-slate-200">
             <img src="/images/SuaraKita.png" alt="Suara Kita" className="h-6 object-contain opacity-40 grayscale" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
