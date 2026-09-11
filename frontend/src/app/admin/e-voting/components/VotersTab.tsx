"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlusIcon, 
  DocumentArrowUpIcon, 
  TicketIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import Modal from '@/components/ui/Modal';
import { supabase } from '@/lib/supabase';

type Voter = {
  id: string;
  nama: string;
  kelas: string;
  token?: string;
  status: 'Belum Memilih' | 'Sudah Memilih';
};

export default function EVotingPage() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVoter, setNewVoter] = useState({ nama: '', kelas: '' });
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered voters
  const filteredVoters = voters.filter(v => 
    v.nama.toLowerCase().includes(search.toLowerCase()) || 
    v.kelas.toLowerCase().includes(search.toLowerCase()) ||
    (v.token && v.token.toLowerCase().includes(search.toLowerCase()))
  );

  // Load from Supabase on mount
  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    setLoading(true);
    let allVoters: Voter[] = [];
    let hasMore = true;
    let page = 0;
    const pageSize = 1000;

    while (hasMore) {
      const { data, error } = await supabase
        .from('voters')
        .select('*')
        .order('kelas', { ascending: true })
        .order('nama', { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1);
        
      if (error) {
        console.error('Error fetching voters:', error);
        alert('Gagal mengambil data dari database. Pastikan tabel "voters" sudah dibuat di Supabase.');
        hasMore = false;
        break;
      }

      if (data) {
        allVoters = [...allVoters, ...data];
        if (data.length < pageSize) {
          hasMore = false;
        } else {
          page++;
        }
      } else {
        hasMore = false;
      }
    }
    
    setVoters(allVoters);
    setLoading(false);
  };

  const handleAddVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoter.nama || !newVoter.kelas) return;
    
    const voterData = {
      nama: newVoter.nama,
      kelas: newVoter.kelas,
      status: 'Belum Memilih'
    };

    const { data, error } = await supabase
      .from('voters')
      .insert([voterData])
      .select();

    if (error) {
      console.error('Error adding voter:', error);
      alert('Gagal menambahkan pemilih.');
    } else if (data) {
      setVoters(prev => [...prev, data[0]]);
      setNewVoter({ nama: '', kelas: '' });
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm('Yakin ingin menghapus data pemilih ini?')) {
      const { error } = await supabase
        .from('voters')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting voter:', error);
        alert('Gagal menghapus pemilih.');
      } else {
        setVoters(prev => prev.filter(v => v.id !== id));
      }
    }
  };

  const handleClearAll = async () => {
    if(confirm('PERINGATAN: Anda yakin ingin menghapus SEMUA data pemilih? Aksi ini tidak dapat dibatalkan.')) {
      const { error } = await supabase
        .from('voters')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.error('Error clearing voters:', error);
        alert('Gagal menghapus semua data pemilih.');
      } else {
        setVoters([]);
        alert('Semua data berhasil dihapus.');
      }
    }
  };

  const handleResetVote = async (id: string, nama: string) => {
    if(confirm(`Yakin ingin mereset status voting untuk ${nama}? Suara yang sudah masuk dari pemilih ini akan DIBATALKAN.`)) {
      // 1. Hapus suara dari tabel votes
      const { error: deleteVoteError } = await supabase
        .from('votes')
        .delete()
        .eq('voter_id', id);

      if (deleteVoteError) {
        console.error('Error deleting vote:', deleteVoteError);
        alert('Gagal membatalkan suara pemilih.');
        return;
      }

      // 2. Update status voter menjadi 'Belum Memilih'
      const { error: updateError } = await supabase
        .from('voters')
        .update({ status: 'Belum Memilih' })
        .eq('id', id);

      if (updateError) {
        console.error('Error resetting voter status:', updateError);
        alert('Gagal mereset status pemilih.');
      } else {
        setVoters(prev => prev.map(v => v.id === id ? { ...v, status: 'Belum Memilih' } : v));
        alert(`Status pemilih ${nama} berhasil direset.`);
      }
    }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const importedVoters: Omit<Voter, 'id'>[] = [];

        // Loop through all sheets in the workbook
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          // Use header: 1 to get array of arrays (rows and columns)
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          let namaIndex = -1;
          let startRow = -1;

          // Find the header row that contains "NAMA"
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (Array.isArray(row)) {
              const foundIdx = row.findIndex(cell => {
                if (typeof cell !== 'string') return false;
                const text = cell.trim().toUpperCase();
                return text === 'NAMA' || text === 'NAMA LENGKAP' || text === 'NAMA GURU/TU' || text === 'NAMA GURU';
              });
              if (foundIdx !== -1) {
                namaIndex = foundIdx;
                startRow = i + 1;
                
                // If the header itself says "NAMA GURU", we know it's a teacher sheet
                const headerName = String(row[foundIdx]).toUpperCase();
                if (headerName.includes('GURU')) {
                   // This flag will be used below
                   rows[i].push('FLAG_IS_GURU_SHEET'); 
                }
                break;
              }
            }
          }

          // If "NAMA" column is found, process the subsequent rows
          if (namaIndex !== -1 && startRow !== -1) {
            
            // Determine default category based on sheet content
            let currentCategory = sheetName.trim();
            
            // Check top rows for 'GURU' (Before the 'NAMA' header)
            const topRowsText = rows.slice(0, startRow > 0 ? startRow : 10).flat().join(' ').toUpperCase();
            const hasGuruHeaderFlag = rows[startRow - 1]?.includes('FLAG_IS_GURU_SHEET');
            
            if (topRowsText.includes('GURU') || topRowsText.includes('STAF') || topRowsText.includes('TU DAN CARAKA') || hasGuruHeaderFlag) {
              currentCategory = 'GURU';
            }

            for (let i = startRow; i < rows.length; i++) {
              const row = rows[i];
              if (!Array.isArray(row)) continue;
              
              const nama = row[namaIndex];
              
              // Skip empty rows or sub-headers (nama must be a string and reasonably long)
              if (typeof nama === 'string' && nama.trim().length > 1) {
                const namaUpper = nama.trim().toUpperCase();
                
                // If we reach the summary footer of the excel sheet, stop processing this sheet
                if (namaUpper === 'KETERANGAN' || namaUpper === 'JUMLAH' || namaUpper.startsWith('LAKI-LAKI') || namaUpper.startsWith('PEREMPUAN')) {
                  break;
                }
                
                // Switch category if we hit the TU subheader
                if (namaUpper === 'TU DAN CARAKA') {
                  currentCategory = 'TU';
                }
                
                // Skip students who have left or specific subheaders like "TU DAN CARAKA"
                const isKeluar = row.some(cell => typeof cell === 'string' && cell.toLowerCase().includes('keluar'));
                const isSubHeader = namaUpper === 'TU DAN CARAKA' || namaUpper === 'GURU' || namaUpper === 'STAF' || namaUpper.includes('DAFTAR HADIR');
                
                if (!isKeluar && !isSubHeader) {
                  const cleanNama = nama.trim();
                  // Prevent duplicates across sheets in the same file
                  const isDuplicateInFile = importedVoters.some(v => v.nama.toUpperCase() === cleanNama.toUpperCase());
                  // Prevent duplicates with already imported data in the database
                  const isDuplicateInDB = voters.some(v => v.nama.toUpperCase() === cleanNama.toUpperCase());

                  if (!isDuplicateInFile && !isDuplicateInDB) {
                    importedVoters.push({
                      nama: cleanNama,
                      kelas: currentCategory, // Use dynamic category instead of raw sheet name
                      status: 'Belum Memilih'
                    });
                  }
                }
              }
            }
          }
        });

        if (importedVoters.length > 0) {
          // Supabase bulk insert limit is typically large enough for 1000 rows
          const { data: insertedData, error } = await supabase
            .from('voters')
            .insert(importedVoters)
            .select();

          if (error) {
            console.error('Error importing voters:', error, JSON.stringify(error));
            alert('Gagal mengimpor data ke Supabase. Detail: ' + (error.message || JSON.stringify(error)));
          } else if (insertedData) {
            setVoters(prev => [...prev, ...insertedData]);
            alert(`Berhasil mengimpor ${insertedData.length} data pemilih dari ${workbook.SheetNames.length} sheet.`);
          }
        } else {
          alert('Gagal mengimpor. Sistem tidak dapat menemukan data untuk diimpor atau semua nama sudah ada di database/ganda.');
        }
      } catch (err: any) {
        console.error("Parse error", err);
        alert('Terjadi kesalahan saat membaca file Excel: ' + (err.message || 'Error tidak diketahui'));
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset file input
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateRandomToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing chars like I, 1, O, 0
    let token = '';
    for (let i = 0; i < 6; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  };

  const handleGenerateTickets = async () => {
    const votersWithoutTokens = voters.filter(v => !v.token);
    
    if (votersWithoutTokens.length === 0) {
      alert('Semua pemilih sudah memiliki tiket.');
      return;
    }

    let successCount = 0;
    
    // For large datasets (1000 rows), a bulk upsert or RPC is much faster.
    // We'll prepare an array of updated objects to do a bulk upsert.
    const updatedVoters = votersWithoutTokens.map(v => ({
      id: v.id,
      nama: v.nama,
      kelas: v.kelas,
      status: v.status,
      token: generateRandomToken()
    }));

    const { data, error } = await supabase
      .from('voters')
      .upsert(updatedVoters, { onConflict: 'id' })
      .select();

    if (!error && data) {
      successCount = data.length;
      
      // Update local state efficiently
      const tokenMap = new Map(data.map((d: any) => [d.id, d.token]));
      setVoters(prev => prev.map(v => tokenMap.has(v.id) ? { ...v, token: tokenMap.get(v.id) } : v));
      
      alert(`Berhasil membuat tiket untuk ${successCount} pemilih.`);
    } else {
      console.error(error);
      alert('Gagal membuat tiket secara masal. Terjadi kesalahan pada database.');
    }
  };

  const handleExportData = () => {
    if (voters.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    const dataToExport = voters.map((v, i) => ({
      No: i + 1,
      Nama: v.nama,
      Kelas: v.kelas,
      Token: v.token || 'BELUM DIGENERATE',
      Status: v.status
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Pemilih");
    XLSX.writeFile(wb, "Data_Pemilih_EVoting.xlsx");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Screen View (Hidden on Print) */}
      <div className="space-y-6 print:hidden">
          
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm font-medium"
              >
                <DocumentArrowUpIcon className="w-5 h-5" />
                Import Excel
              </button>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImportExcel}
              />

              <button 
                onClick={handleGenerateTickets}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all font-medium"
              >
                <TicketIcon className="w-5 h-5" />
                Generate Tiket
              </button>

              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all font-medium"
              >
                <PrinterIcon className="w-5 h-5" />
                Print Tiket
              </button>

              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all font-medium"
              >
                <UserPlusIcon className="w-5 h-5" />
                Tambah Data
              </button>
            </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-medium mb-1">Total Pemilih</p>
              <p className="text-3xl font-bold text-slate-900">{voters.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-medium mb-1">Sudah Memilih</p>
              <p className="text-3xl font-bold text-green-600">
                {voters.filter(v => v.status === 'Sudah Memilih').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-medium mb-1">Belum Memilih</p>
              <p className="text-3xl font-bold text-amber-500">
                {voters.filter(v => v.status === 'Belum Memilih').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-medium mb-1">Tiket Tergenerate</p>
              <p className="text-3xl font-bold text-blue-600">
                {voters.filter(v => v.token).length}
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div className="relative max-w-md w-full">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari nama, kelas, atau token..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  Export Excel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                  Hapus Semua
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-100">
              {loading ? (
                <div className="flex justify-center items-center h-64 text-slate-500">
                  Memuat data pemilih...
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600 w-16">No</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nama Lengkap</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kelas</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">Token Akses</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence>
                      {filteredVoters.length > 0 ? (
                        filteredVoters.map((voter, index) => (
                          <motion.tr 
                            key={voter.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            <td className="px-6 py-4 text-sm text-slate-500">{index + 1}</td>
                            <td className="px-6 py-4 font-medium text-slate-900">{voter.nama}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{voter.kelas}</td>
                            <td className="px-6 py-4">
                              {voter.token ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-mono text-sm font-medium border border-blue-100">
                                  <TicketIcon className="w-4 h-4" />
                                  {voter.token}
                                </span>
                              ) : (
                                <span className="text-sm text-slate-400 italic">Belum digenerate</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                voter.status === 'Sudah Memilih' 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {voter.status === 'Sudah Memilih' && <CheckCircleIcon className="w-3.5 h-3.5" />}
                                {voter.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              {voter.status === 'Sudah Memilih' && (
                                <button 
                                  onClick={() => handleResetVote(voter.id, voter.nama)}
                                  className="text-slate-400 hover:text-amber-600 p-2 rounded-lg hover:bg-amber-50 opacity-0 group-hover:opacity-100 transition-all mr-1"
                                  title="Reset Status Memilih"
                                >
                                  <ArrowUturnLeftIcon className="w-5 h-5" />
                                </button>
                              )}
                              <button 
                                onClick={() => handleDelete(voter.id)}
                                className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                title="Hapus Pemilih"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-400">
                              <UserPlusIcon className="w-12 h-12 mb-3 text-slate-300" />
                              <p className="text-lg font-medium text-slate-600">Belum ada data pemilih</p>
                              <p className="text-sm">Mulai dengan menambahkan data atau import dari Excel.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              )}
            </div>
          </div>

        {/* Add Voter Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Tambah Data Pemilih"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAddVoter} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                required
                value={newVoter.nama}
                onChange={e => setNewVoter({...newVoter, nama: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Contoh: Budi Santoso"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Kelas</label>
              <input 
                type="text" 
                required
                value={newVoter.kelas}
                onChange={e => setNewVoter({...newVoter, kelas: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Contoh: X IPA 1"
              />
            </div>
            <div className="pt-4 flex gap-3">
              <button 
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all font-medium"
              >
                Simpan Data
              </button>
            </div>
          </form>
        </Modal>
      </div>

      {/* Print View (Only visible on print) */}
      <div className="hidden print:block p-4 w-full h-full bg-white text-black">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold uppercase">Dokumen Tiket E-Voting</h1>
          <p className="text-sm">OSIS SMAN 2 BABELAN - TAHUN PELAJARAN 2026/2027</p>
        </div>
        
        {/* We use a grid layout to print multiple tickets per page */}
        <div className="grid grid-cols-2 gap-4 gap-y-6">
          {voters
            .filter(v => v.token)
            .sort((a, b) => {
              const classCompare = a.kelas.localeCompare(b.kelas);
              return classCompare !== 0 ? classCompare : a.nama.localeCompare(b.nama);
            })
            .map((voter) => (
            <div key={voter.id} className="border-2 border-black p-4 rounded-xl break-inside-avoid shadow-sm flex flex-col h-full relative overflow-hidden">
              <div className="flex items-center border-b-2 border-black pb-2 mb-3 relative z-10">
                <img src="/images/SuaraKita.png" alt="Logo" className="w-10 h-10 object-contain grayscale brightness-0" />
                <div className="flex-1 text-center font-bold text-lg pr-10">
                  TIKET E-VOTING OSIS
                </div>
              </div>
              <div className="flex justify-between items-center grow relative z-10">
                <div className="max-w-[55%]">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Nama Peserta</p>
                  <p className="font-bold text-base line-clamp-2">{voter.nama}</p>
                  
                  <p className="text-xs text-gray-500 uppercase font-semibold mt-3">Kelas</p>
                  <p className="font-bold text-base">{voter.kelas}</p>
                </div>
                <div className="text-right flex flex-col items-end justify-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Token Akses</p>
                  <div className="bg-slate-100 border border-slate-300 px-3 py-2 rounded-lg mt-1">
                    <p className="font-mono font-black text-2xl tracking-[0.2em]">{voter.token}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5 italic font-medium">Powered by KitaAtur</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
