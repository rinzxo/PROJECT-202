"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { CheckCircleIcon, KeyIcon, ArrowRightIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';
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

type VoterInfo = {
  id: string;
  nama: string;
  kelas: string;
};

export default function VotePage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [voter, setVoter] = useState<VoterInfo | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [candidateToVote, setCandidateToVote] = useState<Candidate | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVotedSuccess, setHasVotedSuccess] = useState(false);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('voting_token');
    const savedVoterId = sessionStorage.getItem('voting_voter_id');
    const savedVoterNama = sessionStorage.getItem('voting_voter_nama');
    const savedVoterKelas = sessionStorage.getItem('voting_voter_kelas');
    
    if (savedToken && savedVoterId) {
      setVoter({ id: savedVoterId, nama: savedVoterNama || '', kelas: savedVoterKelas || '' });
    }
    fetchCandidates();
  }, []);

  const handleValidateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase
      .from('voters')
      .select('*')
      .eq('token', token.trim().toUpperCase())
      .single();

    if (error || !data) {
      setErrorMsg('Token tidak valid atau tidak ditemukan.');
      setLoading(false);
      return;
    }

    if (data.status === 'Sudah Memilih') {
      setErrorMsg('Token ini sudah digunakan untuk memilih!');
      setLoading(false);
      return;
    }

    setVoter({ id: data.id, nama: data.nama, kelas: data.kelas });
    sessionStorage.setItem('voting_token', token.trim().toUpperCase());
    sessionStorage.setItem('voting_voter_id', data.id);
    sessionStorage.setItem('voting_voter_nama', data.nama);
    sessionStorage.setItem('voting_voter_kelas', data.kelas);
    
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('voting_token');
    sessionStorage.removeItem('voting_voter_id');
    sessionStorage.removeItem('voting_voter_nama');
    sessionStorage.removeItem('voting_voter_kelas');
    setVoter(null);
    setToken('');
  };

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

  const handleSubmitVote = async () => {
    if (!candidateToVote) return;
    setIsSubmitting(true);
    
    try {
      const { error: voteError } = await supabase
        .from('votes')
        .insert([{
          voter_id: voter?.id,
          candidate_id: candidateToVote.id,
          waktu_voting: new Date().toISOString()
        }]);

      if (voteError) throw voteError;

      await supabase
        .from('voters')
        .update({ status: 'Sudah Memilih' })
        .eq('id', voter?.id);

      setIsSubmitting(false);
      setHasVotedSuccess(true);
      
      sessionStorage.removeItem('voting_token');
      sessionStorage.removeItem('voting_voter_id');
    } catch (error: any) {
      console.error("VOTE ERROR:", error);
      alert('Gagal mengirim suara. Silakan coba lagi. Detail: ' + (error.message || JSON.stringify(error)));
      setIsSubmitting(false);
    }
  };

  if (hasVotedSuccess) {
    return (
      <div className="min-h-screen bg-[#E53935] flex flex-col items-center justify-center p-6 text-center text-white selection:bg-white selection:text-[#E53935] font-sans">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-white text-[#E53935] p-6 rounded-full mb-8 shadow-2xl shadow-black/20"
        >
          <CheckCircleIcon className="w-24 h-24" />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img src="/images/SuaraKita.png" alt="Suara Kita Logo" className="w-32 h-32 mx-auto mb-8 object-contain brightness-0 invert opacity-90" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-black tracking-tight mb-4"
        >
          Voting Anda Berhasil!!
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-white/90 max-w-lg mx-auto mb-12"
        >
          Terimakasih telah menggunakan hak suara anda.
        </motion.p>
        <motion.button 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.4 }}
          onClick={() => window.location.href = '/e-voting/vote'}
          className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-[#E53935] transition-all"
        >
          Kembali ke Beranda
        </motion.button>
      </div>
    );
  }

  return (
    <div className={`bg-slate-50 font-sans flex flex-col h-screen overflow-hidden ${!voter ? 'items-center justify-center' : 'pt-4 md:pt-8'}`}>
      <div className={`w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col h-full ${voter ? 'flex-1' : 'justify-center items-center'}`}>
        {!voter ? (
          <div className="w-full flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl mx-auto bg-white rounded-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-125 relative"
            >
            {/* Left Side - Info */}
            <div className="md:w-5/12 bg-[#E53935] p-8 md:p-12 text-white flex flex-col justify-center relative z-10">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex items-center justify-center">
                  <img src="/images/SuaraKita.png" alt="Suara Kita Logo" className="w-48 h-48 object-contain" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=S&background=E53935&color=fff' }} />
                </div>
                <h2 className="text-xl font-bold leading-tight">
                  Sistem E-Voting<br />
                  <span className="font-black text-white text-2xl tracking-wide block mt-1">SUARA KITA</span>
                </h2>
              </div>
              
              <div className="space-y-4 text-sm text-white/90 font-medium">
                <div className="flex gap-3 items-start">
                  <span className="font-bold">1.</span>
                  <p>Login sistem menggunakan Token unik yang tertera pada tiket E-Voting.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="font-bold">2.</span>
                  <p>Pemilih merupakan Siswa/Siswi aktif SMAN 2 Babelan.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="font-bold">3.</span>
                  <p>Pilih satu paslon terbaik menurut Anda.</p>
                </div>
              </div>

              {/* Decorative wave separator for desktop */}
              <svg className="hidden md:block absolute top-0 bottom-0 -right-8 h-full w-8 text-[#E53935]" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0,0 C50,25 50,75 0,100 Z" />
              </svg>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-white relative z-0">
              <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-black text-slate-800 mb-2">Suara Kita</h1>
                <p className="text-slate-500 font-medium">Pemilihan Ketua & Wakil Ketua OSIS</p>
              </div>

              <form onSubmit={handleValidateToken} className="space-y-5">
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-slate-400 group-focus-within:text-[#E53935] transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Masukkan Token Anda" 
                      className="w-full pl-14 pr-6 py-4 bg-slate-100 border-none text-slate-900 font-bold tracking-widest uppercase rounded-full focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:normal-case placeholder:tracking-normal"
                      maxLength={6}
                      required
                    />
                  </div>
                  {errorMsg && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-[#E53935] text-sm font-medium mt-3 px-4"
                    >
                      {errorMsg}
                    </motion.p>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={loading || token.length < 5}
                  className="w-full py-4 bg-[#E53935] text-white font-bold rounded-full hover:bg-[#d32f2f] transition-all disabled:opacity-50 shadow-lg shadow-[#E53935]/30 text-lg"
                >
                  {loading ? 'Memvalidasi...' : 'Masuk'}
                </button>
              </form>

              <div className="mt-8 text-center md:text-left">
                <Link href="/e-voting" className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">
                  &larr; Kembali ke Beranda
                </Link>
              </div>
            </div>
          </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full space-y-4 md:space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 gap-4">
              <div className="bg-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-sm text-xs md:text-sm font-medium text-slate-600 border border-slate-200 flex flex-wrap items-center gap-2 md:gap-4">
                <span>Pemilih: <strong className="text-slate-800">{voter.nama}</strong></span>
                <span className="hidden md:inline text-slate-300">|</span>
                <span>Token: <strong className="text-slate-800 font-mono tracking-widest">{sessionStorage.getItem('voting_token')?.substring(0, 2)}••••</strong></span>
                <span className="hidden md:inline text-slate-300">|</span>
                <button 
                  onClick={handleLogout}
                  title="Keluar"
                  className="text-[#E53935] hover:text-[#d32f2f] transition-colors bg-red-50 hover:bg-red-100 p-1.5 md:p-2 rounded-full"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <div className="text-left md:text-right">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase">Bilik Suara</h2>
                <p className="text-xs md:text-sm text-slate-500">Pilih satu kandidat ketua & wakil ketua OSIS</p>
              </div>
            </div>

            {candidates.length === 0 ? (
              <div className="flex-1 min-h-0 flex flex-col justify-center items-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                <p className="text-xl text-slate-500">Belum ada kandidat yang tersedia.</p>
              </div>
            ) : (
              <div className={`flex-1 min-h-0 grid gap-4 md:gap-8 pb-4 ${
                candidates.length === 1 
                  ? 'grid-cols-1 max-w-md mx-auto w-full' 
                  : candidates.length === 2 
                    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto w-full' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {candidates.map(candidate => (
                  <motion.div 
                    key={candidate.id}
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      setCandidateToVote(candidate);
                      setShowConfirmModal(true);
                    }}
                    className={`bg-white rounded-3xl overflow-hidden transition-all duration-300 relative border border-slate-100 shadow-lg cursor-pointer hover:shadow-2xl hover:ring-4 hover:ring-[#E53935]/50 group flex flex-col`}
                  >
                    <div className="absolute top-4 left-4 z-10 bg-[#E53935] text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white">
                      {candidate.nomor_urut}
                    </div>

                    <div className="flex-1 min-h-0 bg-slate-100 relative">
                      <img src={candidate.foto_url} alt={candidate.nama} className="w-full h-full object-contain object-bottom" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-white font-bold flex items-center gap-2">
                          Tekan untuk memilih <ArrowRightIcon className="w-5 h-5" />
                        </span>
                      </div>
                    </div>

                    <div className="p-4 text-center shrink-0">
                      <h3 className="text-lg md:text-xl font-black text-slate-800 leading-tight mb-1 truncate px-2">{candidate.nama}</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Calon Ketua & Wakil</p>
                      
                      <button className="mt-3 w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl group-hover:bg-[#E53935] group-hover:text-white transition-colors text-sm">
                        Pilih Kandidat
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <Modal
              isOpen={showConfirmModal}
              onClose={() => !isSubmitting && setShowConfirmModal(false)}
              title="Konfirmasi Pilihan"
              maxWidth="max-w-2xl"
            >
              <div className="py-2">
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-4">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-2xl mx-auto sm:mx-0 overflow-hidden border-4 border-white shadow-md shrink-0">
                    {candidateToVote?.foto_url && (
                      <img src={candidateToVote.foto_url} alt={candidateToVote.nama} className="w-full h-full object-cover object-top" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="inline-block px-2 py-1 bg-[#E53935]/10 text-[#E53935] font-bold rounded-md mb-1 border border-[#E53935]/20 text-xs">
                      Paslon Nomor {candidateToVote?.nomor_urut}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2 truncate">
                      {candidateToVote?.nama}
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-700 mb-1 border-b border-slate-200 pb-0.5 text-sm">
                          Visi
                        </h4>
                        <div className="text-slate-600 whitespace-pre-wrap text-xs md:text-sm leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: candidateToVote?.visi || candidateToVote?.visi_misi || "Belum ada visi." }} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-700 mb-1 border-b border-slate-200 pb-0.5 mt-3 text-sm">
                          Misi
                        </h4>
                        {candidateToVote?.misi && !/<[a-z][\s\S]*>/i.test(candidateToVote.misi) ? (
                          <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-xs md:text-sm mt-1 leading-relaxed font-medium line-clamp-2">
                            {candidateToVote.misi.split('\n').filter((line: string) => line.trim() !== '').map((line: string, idx: number) => (
                              <li key={idx} className="pl-1">{line.trim()}</li>
                            ))}
                          </ol>
                        ) : (
                          <div className="text-slate-600 whitespace-pre-wrap text-xs md:text-sm leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: candidateToVote?.misi || "Belum ada misi." }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <p className="text-[#E53935] text-xs md:text-sm text-center mb-3 font-bold">
                    Apakah Anda yakin ingin memberikan suara untuk kandidat ini? Pilihan tidak dapat diubah kembali.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSubmitVote}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3.5 bg-[#E53935] text-white font-bold rounded-xl hover:bg-[#d32f2f] transition-all flex justify-center items-center gap-2 shadow-lg shadow-[#E53935]/20 text-lg"
                    >
                      {isSubmitting ? 'Mengirim...' : 'Ya, Kirim Suara!'}
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </motion.div>
        )}
      </div>
    </div>
  );
}
