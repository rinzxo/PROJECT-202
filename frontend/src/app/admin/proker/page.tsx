"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusIcon, TrashIcon, ArrowPathIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/Modal';

type Proker = {
  id: string;
  category: string;
  nama: string;
  tujuan: string;
  jangka: string;
  waktu: string;
  keterangan: string;
  order_index: number;
};

export default function AdminProkerPage() {
  const [prokers, setProkers] = useState<Proker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Form state
  const [category, setCategory] = useState('Ketua OSIS');
  const [nama, setNama] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [jangka, setJangka] = useState('Pendek');
  const [waktu, setWaktu] = useState('');
  const [keterangan, setKeterangan] = useState('BELUM TERLAKSANA');
  const [orderIndex, setOrderIndex] = useState(0);

  useEffect(() => {
    fetchProkers();
  }, []);

  const fetchProkers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('prokers')
      .select('*')
      .order('category', { ascending: true })
      .order('order_index', { ascending: true });
      
    if (error) {
      console.error('Error fetching prokers:', error);
      alert('Gagal mengambil data program kerja.');
    } else {
      setProkers(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase.from('prokers').update({
          category, nama, tujuan, jangka, waktu, keterangan, order_index: orderIndex
        }).eq('id', editingId);
        
        if (error) throw error;
        alert('Program Kerja berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('prokers').insert([{
          category, nama, tujuan, jangka, waktu, keterangan, order_index: orderIndex
        }]);
        if (error) throw error;
        alert('Program Kerja berhasil ditambahkan!');
      }

      setIsFormOpen(false);
      resetForm();
      fetchProkers();
    } catch (error) {
      console.error('Error submitting proker:', error);
      alert('Terjadi kesalahan saat menyimpan program kerja.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus program kerja ini?')) return;
    
    try {
      const { error } = await supabase.from('prokers').delete().eq('id', id);
      if (error) throw error;
      setProkers(prokers.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting proker:', error);
      alert('Gagal menghapus program kerja.');
    }
  };

  const resetForm = () => {
    setCategory('Ketua OSIS');
    setNama('');
    setTujuan('');
    setJangka('Pendek');
    setWaktu('');
    setKeterangan('BELUM TERLAKSANA');
    setOrderIndex(0);
    setEditingId(null);
  };

  const handleEdit = (proker: Proker) => {
    setEditingId(proker.id);
    setCategory(proker.category);
    setNama(proker.nama);
    setTujuan(proker.tujuan || '');
    setJangka(proker.jangka || 'Pendek');
    setWaktu(proker.waktu || '');
    setKeterangan(proker.keterangan || 'BELUM TERLAKSANA');
    setOrderIndex(proker.order_index);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = Array.from(new Set(prokers.map(p => p.category))).sort();
  const filteredProkers = filterCategory === 'All' ? prokers : prokers.filter(p => p.category === filterCategory);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Program Kerja</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola program kerja BPH dan Sekbid.</p>
        </div>
        <button 
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            if (isFormOpen) resetForm();
          }}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          {isFormOpen ? 'Batal' : <><PlusIcon className="w-5 h-5" /> Tambah Proker</>}
        </button>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); resetForm(); }} title={editingId ? 'Edit Program Kerja' : 'Tambah Program Kerja Baru'} maxWidth="max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ditujukan Untuk (Kategori)</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white">
                  <option value="Ketua OSIS">Ketua OSIS</option>
                  <option value="Wakil Ketua OSIS">Wakil Ketua OSIS</option>
                  <option value="Sekretaris">Sekretaris</option>
                  <option value="Bendahara">Bendahara</option>
                  {Array.from({length: 10}).map((_, i) => (
                    <option key={i} value={`Sekbid ${i+1}`}>Sekbid {i+1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Program</label>
                <input required type="text" value={nama} onChange={e => setNama(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Tujuan</label>
                <textarea required rows={3} value={tujuan} onChange={e => setTujuan(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary resize-none bg-white"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Jangka (Pendek/Panjang)</label>
                <select value={jangka} onChange={e => setJangka(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white">
                  <option value="Pendek">Pendek</option>
                  <option value="Panjang">Panjang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Waktu Pelaksanaan</label>
                <input required type="text" value={waktu} onChange={e => setWaktu(e.target.value)} placeholder="Contoh: Selama Masa Bakti" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Keterangan / Status</label>
                <select value={keterangan} onChange={e => setKeterangan(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white">
                  <option value="BELUM TERLAKSANA">BELUM TERLAKSANA</option>
                  <option value="TERLAKSANA">TERLAKSANA</option>
                  <option value="TIDAK TERLAKSANA">TIDAK TERLAKSANA</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Urutan (Opsional)</label>
                <input type="number" value={orderIndex} onChange={e => setOrderIndex(parseInt(e.target.value) || 0)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200 mt-4">
              <button disabled={isSubmitting} type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {isSubmitting ? <><ArrowPathIcon className="w-5 h-5 animate-spin" /> Menyimpan...</> : (editingId ? 'Perbarui Proker' : 'Simpan Proker')}
              </button>
            </div>
          </form>
      </Modal>

      {/* FILTER & LIST */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4 overflow-x-auto">
          <span className="text-sm font-bold text-slate-500 whitespace-nowrap">Filter:</span>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary bg-white min-w-50"
          >
            <option value="All">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 animate-spin mb-4 text-primary" />
            Memuat data...
          </div>
        ) : filteredProkers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">Belum ada program kerja.</div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Kategori</th>
                  <th className="px-6 py-4 font-bold min-w-62.5">Nama Program & Tujuan</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">Jangka & Waktu</th>
                  <th className="px-6 py-4 font-bold text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProkers.map((proker) => (
                  <tr key={proker.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary whitespace-nowrap">
                        {proker.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 mb-1">{proker.nama}</p>
                      <p className="text-sm text-slate-500 line-clamp-2" title={proker.tujuan}>{proker.tujuan}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-bold text-slate-700">{proker.jangka}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{proker.waktu}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full whitespace-nowrap",
                        proker.keterangan === "TERLAKSANA" && "bg-green-100 text-green-700",
                        proker.keterangan === "BELUM TERLAKSANA" && "bg-yellow-100 text-yellow-700",
                        proker.keterangan.includes("TIDAK") && "bg-red-100 text-red-700"
                      )}>
                        {proker.keterangan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(proker)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Proker"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(proker.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Proker"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
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
