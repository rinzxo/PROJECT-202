"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MagnifyingGlassIcon, ArrowLeftIcon, CheckBadgeIcon, ArrowPathIcon, ArrowDownTrayIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

type Participant = {
  id: string;
  registration_number: string;
  name: string;
  class_name: string;
  score: number;
  status: string;
  created_at: string;
};

export default function RekrutmenPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [results, setResults] = useState<Participant[]>([]);
  const [selectedResult, setSelectedResult] = useState<Participant | null>(null);
  
  const [confirmResult, setConfirmResult] = useState<Participant | null>(null);
  const [showNotFound, setShowNotFound] = useState(false);
  
  // Video loader state
  const [pendingResult, setPendingResult] = useState<Participant | null>(null);
  const [showRecruitmentLoader, setShowRecruitmentLoader] = useState(false);
  const [isLoaderFading, setIsLoaderFading] = useState(false);
  const videoEnded = useRef(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Allow direct link verification (e.g. from QR code scan)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyId = params.get('verify');
    if (verifyId) {
      verifyParticipant(verifyId);
    }
  }, []);

  const verifyParticipant = async (regNumber: string) => {
    setIsSearching(true);
    const { data } = await supabase
      .from('recruitment_participants')
      .select('*')
      .eq('registration_number', regNumber)
      .single();
    
    if (data) {
      setSelectedResult(data);
      setHasSearched(true);
    }
    setIsSearching(false);
  };

  const handleRecruitmentVideoEnd = () => {
    if (videoEnded.current) return;
    videoEnded.current = true;
    setIsLoaderFading(true);
    setTimeout(() => {
      setShowRecruitmentLoader(false);
      setIsLoaderFading(false);
      if (pendingResult) {
        setSelectedResult(pendingResult);
        setPendingResult(null);
      }
    }, 1000);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setSelectedResult(null);

    const { data, error } = await supabase
      .from('recruitment_participants')
      .select('*')
      .or(`name.ilike.%${searchQuery}%,registration_number.ilike.%${searchQuery}%`)
      .limit(5);

    setResults([]);
    setShowNotFound(false);

    try {
      const { data, error } = await supabase
        .from('recruitment_participants')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,registration_number.ilike.%${searchQuery}%`)
        .limit(5);

      if (error) throw error;
      
      if (data && data.length === 0) {
        setResults([]);
        setShowNotFound(true);
      } else if (data && data.length === 1) {
        setResults(data);
        setConfirmResult(data[0]);
      } else {
        setResults(data || []);
      }
    } catch (error) {
      console.error(error);
      setResults([]);
    }
    setIsSearching(false);
  };

  const getQrUrl = (regNumber: string) => {
    // Generate a URL pointing back to this page with verify param
    const verifyUrl = `${window.location.origin}/rekrutmen?verify=${regNumber}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;
  };

  const handleDownloadPNG = async () => {
    if (!cardRef.current || !selectedResult) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Pengumuman_OSIS_${selectedResult.name.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (error) {
      console.error('Error downloading PNG:', error);
      alert('Gagal mengunduh gambar');
    }
    setIsDownloading(false);
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current || !selectedResult) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const img = new window.Image();
      img.src = dataUrl;
      await new Promise(resolve => img.onload = resolve);
      
      const pdfHeight = (img.height * pdfWidth) / img.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Pengumuman_OSIS_${selectedResult.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Gagal mengunduh PDF');
    }
    setIsDownloading(false);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary selection:text-white bg-slate-50 flex flex-col">
      {/* Jika belum ada hasil yang dipilih, tampilkan form pencarian */}
      {!selectedResult ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 py-20 relative overflow-hidden">
          
          {/* Subtle background gradients for premium feel */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl opacity-50" />
          </div>

          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 p-8 sm:p-14 text-center relative overflow-hidden backdrop-blur-sm">
            {/* Background decoration */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-[#004A8B] via-blue-500 to-[#004A8B]" />
            
            <img src="/images/logo_osis2.png" alt="Logo OSIS" className="w-24 h-24 mx-auto mb-8 object-contain drop-shadow-sm" />
            <h1 className="text-2xl sm:text-[28px] leading-tight font-black tracking-tight text-slate-900 mb-3">
              PENGUMUMAN HASIL SELEKSI
            </h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base mb-10">
              Pengurus OSIS SMAN 2 Babelan Masa Bakti 2026/2027
            </p>

            <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mb-8">
              <div className="relative group">
                <input
                  type="text"
                  required
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Masukkan Nama Lengkap atau No. Registrasi"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-4.5 pl-6 pr-16 text-slate-900 font-semibold focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={isSearching}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-white rounded-xl flex items-center justify-center hover:bg-[#003B70] disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isSearching ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <MagnifyingGlassIcon className="w-5 h-5 font-bold" />}
                </button>
              </div>
            </form>

            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Ketik dengan benar nama lengkap Anda atau gunakan nomor registrasi untuk hasil yang lebih akurat.
            </p>

            {results.length > 1 && !selectedResult && (
              <div className="mt-8 text-left animate-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Hasil Pencarian ({results.length})</h3>
                <div className="space-y-3">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => setConfirmResult(result)}
                      className="w-full bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left group"
                    >
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors text-lg">{result.name}</p>
                        <p className="text-sm text-slate-500 font-mono mt-1">{result.registration_number}</p>
                      </div>
                      <div className="bg-slate-50 text-slate-500 px-4 py-2 rounded-lg text-sm font-bold shrink-0">
                        Pilih & Lihat Hasil &rarr;
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* KARTU HASIL SNBP STYLE */
        <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 bg-slate-50 relative pb-24">
          {/* Confetti or background elements can be added here if desired */}
          
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-500 mt-6 sm:mt-10">
            
            <div ref={cardRef} className="bg-white">
              {/* Logo & Header Instansi */}
              <div className="p-6 sm:p-8 flex flex-col items-center justify-center border-b border-slate-100">
               <img src="/images/logo_osis2.png" alt="Logo OSIS" className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-4 drop-shadow-sm" />
               <h3 className="font-black text-slate-900 text-center text-lg sm:text-xl tracking-tight mb-1">
                 PENGUMUMAN HASIL SELEKSI PENGURUS OSIS
               </h3>
               <p className="text-sm font-medium text-slate-500 text-center">
                 SMAN 2 Babelan Masa Bakti 2026/2027
               </p>
            </div>

            {/* Header Status (LULUS = BIRU, TIDAK LULUS = MERAH) */}
            <div className={`px-6 py-5 sm:py-6 text-center text-white ${selectedResult.status === 'Lulus' ? 'bg-[#004A8B]' : 'bg-[#D32F2F]'}`}>
              <h2 className="text-lg sm:text-2xl font-black tracking-wide">
                {selectedResult.status === 'Lulus' ? 'SELAMAT! ANDA DINYATAKAN LULUS' : 'MOHON MAAF, ANDA DINYATAKAN TIDAK LULUS'}
              </h2>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-10 relative">
              <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center md:items-start">
                
                {/* QR Code */}
                <div className="w-40 sm:w-48 shrink-0 bg-white p-3 border-2 border-slate-100 rounded-2xl shadow-sm text-center">
                  <img 
                    src={getQrUrl(selectedResult.registration_number)} 
                    alt="QR Code Validasi"
                    className="w-full h-auto rounded-xl mb-3"
                  />
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider">SCAN TO VERIFY</p>
                </div>

                {/* Details */}
                <div className="flex-1 w-full space-y-6 sm:space-y-7 text-center md:text-left">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nomor Registrasi</p>
                    <p className="text-sm sm:text-base font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 inline-block px-4 py-2 rounded-lg">
                      {selectedResult.registration_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</p>
                    <p className="text-xl sm:text-3xl font-black text-slate-900 uppercase leading-tight">
                      {selectedResult.name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Kelas Asal</p>
                      <p className="text-lg sm:text-xl font-bold text-slate-700">
                        {selectedResult.class_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Skor Akhir</p>
                      <p className={`text-xl sm:text-2xl font-black ${selectedResult.status === 'Lulus' ? 'text-primary' : 'text-slate-500'}`}>
                        {selectedResult.status === 'Lulus' ? selectedResult.score.toFixed(1) : '-'}
                      </p>
                    </div>
                  </div>
                </div>
                
              </div>

              {/* Watermark / Official stamp */}
              {selectedResult.status === 'Lulus' && (
                <div className="mt-10 p-5 bg-blue-50/80 border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <CheckBadgeIcon className="w-10 h-10 text-blue-500 shrink-0" />
                  <div>
                    <p className="font-bold text-blue-900 mb-1.5">Status Terverifikasi</p>
                    <p className="text-sm text-blue-700/80 leading-relaxed">
                      Bukti ini adalah sah dan dicetak langsung dari sistem resmi OSIS SMAN 2 Babelan. Harap simpan atau <i className="font-medium">screenshot</i> halaman ini sebagai bukti kelulusan untuk tahap selanjutnya.
                    </p>
                  </div>
                </div>
              )}

              {selectedResult.status !== 'Lulus' && (
                <div className="mt-10 p-5 bg-red-50/80 border border-red-100 rounded-2xl text-center">
                  <p className="text-sm text-red-700 font-medium leading-relaxed">Jangan putus asa dan tetap semangat! Masih banyak kesempatan lain untuk berkontribusi bagi sekolah tercinta.</p>
                </div>
              )}
            </div>
            </div>

            {/* Footer Action */}
            <div className="bg-slate-50 border-t border-slate-100 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={handleDownloadPNG}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none text-sm font-bold text-white bg-primary hover:bg-[#003B70] transition-colors flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl disabled:opacity-50"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" /> PNG
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl disabled:opacity-50"
                >
                  <DocumentTextIcon className="w-4 h-4" /> PDF
                </button>
              </div>
              <button 
                onClick={() => {
                  setSelectedResult(null);
                  setSearchQuery('');
                  setHasSearched(false);
                }}
                disabled={isDownloading}
                className="w-full sm:w-auto text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl hover:bg-slate-200 disabled:opacity-50"
              >
                <ArrowLeftIcon className="w-4 h-4" /> Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmResult && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 text-center">
            <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <CheckBadgeIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Data Ditemukan!</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Kami menemukan data atas nama:<br/>
              <strong className="text-slate-800 text-base">{confirmResult.name}</strong><br/>
              Kelas: <strong className="text-slate-800">{confirmResult.class_name}</strong>
              <br/><br/>
              Apakah ini benar data Anda?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmResult(null)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 transition-colors text-sm"
              >
                Bukan
              </button>
              <button 
                onClick={() => {
                  setPendingResult(confirmResult);
                  setConfirmResult(null);
                  setShowRecruitmentLoader(true);
                  videoEnded.current = false;
                  
                  // Fallback timeout in case video fails to load or play
                  setTimeout(() => {
                    handleRecruitmentVideoEnd();
                  }, 5500);
                }}
                className="flex-2 px-4 py-3 rounded-xl font-bold text-white bg-primary hover:bg-[#003B70] transition-colors shadow-lg shadow-primary/20 text-sm"
              >
                Ya, Lihat Hasil &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recruitment Video Loader */}
      {showRecruitmentLoader && (
        <div className={`fixed inset-0 z-9999 bg-slate-900 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${isLoaderFading ? 'opacity-0' : 'opacity-100'}`}>
          <video 
            autoPlay 
            muted 
            playsInline
            onEnded={handleRecruitmentVideoEnd}
            className="w-full h-full object-cover hidden sm:block"
            src="/videos/loading-landscape.mp4"
          />
          <video 
            autoPlay 
            muted 
            playsInline
            onEnded={handleRecruitmentVideoEnd}
            className="w-full h-full object-cover sm:hidden"
            src="/videos/loading-portrait.mp4"
          />
        </div>
      )}

      {/* Not Found Modal */}
      {showNotFound && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <XMarkIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Tidak Ditemukan</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Maaf, tidak ada data yang cocok. Pastikan Anda mengetik nama lengkap atau nomor registrasi dengan benar.
            </p>
            <button 
              onClick={() => setShowNotFound(false)}
              className="w-full px-4 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg text-sm"
            >
              Mengerti, Coba Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
