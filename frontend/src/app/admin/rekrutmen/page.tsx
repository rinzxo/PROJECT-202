"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { TrashIcon, ArrowPathIcon, ClipboardDocumentCheckIcon, PlusIcon, CheckCircleIcon, XCircleIcon, DocumentArrowUpIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';
import * as XLSX from 'xlsx';

type Participant = {
  id: string;
  registration_number: string;
  name: string;
  class_name: string;
  score: number;
  status: string;
  created_at: string;
};

type DraftParticipant = {
  name: string;
  class_name: string;
  score: number;
  status: string;
};

export default function AdminRekrutmenPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');

  // Import/Manual state
  const [draftData, setDraftData] = useState<DraftParticipant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Manual Input State
  const [manualName, setManualName] = useState('');
  const [manualClass, setManualClass] = useState('');
  const [manualScore, setManualScore] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('recruitment_participants')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching participants:', error);
    } else {
      setParticipants(data || []);
    }
    setIsLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const parsed: DraftParticipant[] = [];
        
        // Loop melalui semua sheet yang ada di file Excel (contoh: KELAS 10, KELAS 11)
        for (const wsname of wb.SheetNames) {
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

          // Coba deteksi baris header secara dinamis (maksimal cek 10 baris pertama)
          let headerRowIndex = -1;
          let nameCol = -1;
          let classCol = -1;
          let scoreCol = -1;

          for (let i = 0; i < Math.min(10, data.length); i++) {
            const row = data[i];
            if (!row) continue;
            
            let tempNameCol = -1;
            let tempClassCol = -1;
            let tempScoreCol = -1;

            for (let j = 0; j < row.length; j++) {
              // Hapus karakter enter/newline yang sering ada di Excel (misal RATA \n RATA)
              const cellVal = String(row[j] || '').toUpperCase().replace(/\n/g, ' ').trim();
              
              if (cellVal === 'NAMA' || cellVal === 'NAMA LENGKAP' || cellVal === 'NAMA SISWA') tempNameCol = j;
              if (cellVal.includes('KELAS')) tempClassCol = j;
              if (cellVal.includes('RATA') || cellVal.includes('SKOR') || cellVal.includes('NILAI') || cellVal.includes('AKHIR')) tempScoreCol = j;
            }
            
            // Kita yakin ini baris header jika menemukan NAMA dan minimal 1 kolom pendukung (KELAS atau SKOR)
            if (tempNameCol !== -1 && (tempClassCol !== -1 || tempScoreCol !== -1)) {
              nameCol = tempNameCol;
              classCol = tempClassCol;
              scoreCol = tempScoreCol;
              headerRowIndex = i;
              
              // Jika kolom skor tidak terdeteksi via nama, asumsikan kolom paling kanan adalah skor akhir
              if (scoreCol === -1) {
                const headerRow = data[i];
                for (let j = headerRow.length - 1; j > Math.max(nameCol, classCol); j--) {
                  const val = String(headerRow[j] || '').toUpperCase().trim();
                  if (val && !val.includes('KETERANGAN') && !val.includes('KET')) {
                    scoreCol = j;
                    break;
                  }
                }
              }
              break;
            }
          }

          // Jika tidak terdeteksi, fallback ke asumsi dasar A, B, C
          if (headerRowIndex === -1 || nameCol === -1) {
            nameCol = 0;
            classCol = 1;
            scoreCol = 2;
            headerRowIndex = 0;
          }

          // Parsing data mulai dari baris setelah header
          for (let i = headerRowIndex + 1; i < data.length; i++) {
            const row = data[i];
            const nameVal = String(row[nameCol] || '').trim();
            
            if (!row || !nameVal) continue; // Lewati baris kosong
            
            // Lewati baris rekapitulasi/jumlah di bagian bawah Excel
            const nameUpper = nameVal.toUpperCase();
            if (nameUpper.includes('JUMLAH RATA') || nameUpper.startsWith('JUMLAH') || nameUpper.startsWith('TOTAL')) {
              continue;
            }
            
            const rawScore = row[scoreCol] !== undefined ? String(row[scoreCol]).replace(',', '.') : '0';
            const score = parseFloat(rawScore) || 0;
            
            // Standar kelulusan otomatis = 77
            const isLulus = score >= 77;

            parsed.push({
              name: nameVal,
              class_name: classCol !== -1 ? String(row[classCol] || '-').trim() : '-',
              score: score,
              status: isLulus ? 'Lulus' : 'Tidak Lulus'
            });
          }
        }
        
        if (parsed.length > 0) {
          setDraftData(parsed);
        } else {
          alert('Data tidak valid atau kolom NAMA tidak ditemukan.');
        }
      } catch (err) {
        console.error(err);
        alert('Gagal membaca file Excel.');
      }
    };
    reader.readAsBinaryString(file);
    
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualClass.trim()) return;
    
    setDraftData([
      ...draftData,
      {
        name: manualName,
        class_name: manualClass,
        score: parseFloat(manualScore) || 0,
        status: 'Tidak Lulus'
      }
    ]);
    
    setManualName('');
    setManualClass('');
    setManualScore('');
  };

  const toggleDraftStatus = (index: number) => {
    const newData = [...draftData];
    newData[index].status = newData[index].status === 'Lulus' ? 'Tidak Lulus' : 'Lulus';
    setDraftData(newData);
  };

  const handleSaveDraft = async () => {
    if (draftData.length === 0) return;
    setIsSubmitting(true);

    try {
      const { count } = await supabase
        .from('recruitment_participants')
        .select('*', { count: 'exact', head: true });

      let startIndex = (count || 0) + 1;

      const payload = draftData.map((d, i) => {
        const noUrut = String(startIndex + i).padStart(3, '0');
        const cleanClass = d.class_name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        return {
          registration_number: `OSIS2BBLN-${noUrut}-${cleanClass}`,
          name: d.name,
          class_name: d.class_name,
          score: d.score,
          status: d.status
        };
      });

      const { error } = await supabase.from('recruitment_participants').insert(payload);
      if (error) throw error;

      alert('Berhasil menyimpan data peserta rekrutmen!');
      setDraftData([]);
      setIsModalOpen(false);
      fetchParticipants();
    } catch (error) {
      console.error('Error saving participants:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data peserta ini?')) return;
    try {
      const { error } = await supabase.from('recruitment_participants').delete().eq('id', id);
      if (error) throw error;
      setParticipants(participants.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleTruncate = async () => {
    if (!confirm('PERINGATAN! Ini akan menghapus SELURUH data rekrutmen. Lanjutkan?')) return;
    const pwd = prompt('Ketik "HAPUS SEMUA" untuk melanjutkan:');
    if (pwd !== 'HAPUS SEMUA') return;

    try {
      const { error } = await supabase.from('recruitment_participants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      setParticipants([]);
      alert('Semua data rekrutmen berhasil direset.');
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Gagal mereset data.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <ClipboardDocumentCheckIcon className="w-8 h-8 text-primary" /> Pengumuman Rekrutmen
          </h1>
          <p className="text-slate-500 font-medium mt-1">Kelola data peserta rekrutmen dan atur status kelulusannya.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleTruncate}
            className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition-colors border border-red-200"
          >
            <TrashIcon className="w-5 h-5" /> Reset Data
          </button>
          <button 
            onClick={() => {
              setDraftData([]);
              setIsModalOpen(true);
            }}
            className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
          >
            <PlusIcon className="w-5 h-5" /> Tambah Peserta
          </button>
        </div>
      </div>

      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Pendaftar</p>
              <h3 className="text-3xl font-black text-slate-900">{participants.length}</h3>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <UserGroupIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-blue-500 p-5 rounded-2xl shadow-sm flex items-center justify-between text-white">
            <div>
              <p className="text-sm font-bold text-blue-100 uppercase tracking-wider mb-1">Dinyatakan Lulus</p>
              <h3 className="text-3xl font-black">{participants.filter(p => p.status === 'Lulus').length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-400/30 rounded-full flex items-center justify-center text-blue-100">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-red-500 p-5 rounded-2xl shadow-sm flex items-center justify-between text-white">
            <div>
              <p className="text-sm font-bold text-red-100 uppercase tracking-wider mb-1">Tidak Lulus</p>
              <h3 className="text-3xl font-black">{participants.filter(p => p.status !== 'Lulus').length}</h3>
            </div>
            <div className="w-12 h-12 bg-red-400/30 rounded-full flex items-center justify-center text-red-100">
              <XCircleIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Peserta Rekrutmen" maxWidth="max-w-4xl">
        <div className="mb-6">
          <div className="flex border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Upload Excel (.xlsx)
            </button>
            <button 
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'manual' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Input Manual
            </button>
          </div>
        </div>

        {activeTab === 'upload' && (
          <div className="mb-6 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              accept=".xlsx,.xls" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload}
            />
            <DocumentArrowUpIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">Klik untuk memilih file Excel</h3>
            <p className="text-sm text-slate-500">Format kolom: Nama | Kelas | Skor (tanpa header tabel lebih disarankan, baris pertama akan diabaikan jika berupa teks).</p>
          </div>
        )}

        {activeTab === 'manual' && (
          <form onSubmit={handleAddManual} className="mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
              <input type="text" required value={manualName} onChange={e => setManualName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kelas</label>
              <input type="text" required value={manualClass} onChange={e => setManualClass(e.target.value)} placeholder="Ex: X.1" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skor</label>
              <div className="flex gap-2">
                <input type="number" step="0.1" value={manualScore} onChange={e => setManualScore(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary text-sm" />
                <button type="submit" className="bg-slate-800 text-white p-2.5 rounded-lg hover:bg-slate-700 transition-colors shrink-0">
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        )}

        {draftData.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <p className="text-slate-600 text-sm font-medium">Terdapat <strong>{draftData.length}</strong> draf peserta. Centang yang LULUS.</p>
              <button onClick={() => setDraftData([])} className="text-xs font-bold text-red-500 hover:underline">Hapus Draf</button>
            </div>
            
            <div className="overflow-x-auto max-h-100 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 sticky top-0 shadow-sm z-10">
                  <tr>
                    <th className="p-3 font-bold">No</th>
                    <th className="p-3 font-bold">Nama</th>
                    <th className="p-3 font-bold">Kelas</th>
                    <th className="p-3 font-bold">Skor</th>
                    <th className="p-3 font-bold text-center">Status Lulus?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {draftData.map((d, i) => (
                    <tr key={i} className={d.status === 'Lulus' ? 'bg-blue-50/50' : ''}>
                      <td className="p-3 text-slate-500">{i + 1}</td>
                      <td className="p-3 font-semibold text-slate-900">{d.name}</td>
                      <td className="p-3 text-slate-600">{d.class_name}</td>
                      <td className="p-3 text-slate-600">{d.score}</td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => toggleDraftStatus(i)}
                          className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-md font-bold transition-colors text-xs ${d.status === 'Lulus' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                          {d.status === 'Lulus' ? <><CheckCircleIcon className="w-4 h-4" /> Lulus</> : <><XCircleIcon className="w-4 h-4" /> Tidak Lulus</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? <><ArrowPathIcon className="w-5 h-5 animate-spin" /> Menyimpan...</> : 'Simpan ke Database'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* LIST PESERTA */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-slate-800">Database Peserta</h2>
          <span className="text-sm font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full">{participants.length} Total</span>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 animate-spin mb-4 text-primary" />
            Memuat data...
          </div>
        ) : participants.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">Belum ada data peserta rekrutmen.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4 font-bold border-b border-slate-200">No. Registrasi</th>
                  <th className="p-4 font-bold border-b border-slate-200">Nama</th>
                  <th className="p-4 font-bold border-b border-slate-200">Kelas</th>
                  <th className="p-4 font-bold border-b border-slate-200">Skor</th>
                  <th className="p-4 font-bold border-b border-slate-200">Status</th>
                  <th className="p-4 font-bold border-b border-slate-200 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {participants.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">{p.registration_number}</td>
                    <td className="p-4 font-semibold text-slate-900">{p.name}</td>
                    <td className="p-4 text-slate-600">{p.class_name}</td>
                    <td className="p-4 font-medium text-slate-700">{p.score}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.status === 'Lulus' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
