"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { PlusIcon, TrashIcon, ArrowPathIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';

type BPH = {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  order_index: number;
};

export default function AdminBPHPage() {
  const [bphs, setBphs] = useState<BPH[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBPH();
  }, []);

  const fetchBPH = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('bph')
      .select('*')
      .order('order_index', { ascending: true });
      
    if (error) {
      console.error('Error fetching BPH:', error);
      alert('Gagal mengambil data pengurus.');
    } else {
      setBphs(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !editingId) {
      alert('Harap pilih foto pengurus!');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      if (editingId) {
        const updateData: any = { name, role, quote, order_index: orderIndex };
        if (imageUrl) updateData.image = imageUrl;
        
        const { error } = await supabase.from('bph').update(updateData).eq('id', editingId);
        if (error) throw error;
        alert('Pengurus berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('bph').insert([{
          name, role, quote, order_index: orderIndex, image: imageUrl!
        }]);
        if (error) throw error;
        alert('Pengurus berhasil ditambahkan!');
      }

      setIsFormOpen(false);
      resetForm();
      fetchBPH();
    } catch (error) {
      console.error('Error submitting BPH:', error);
      alert('Terjadi kesalahan saat menyimpan pengurus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      const { error } = await supabase.from('bph').delete().eq('id', id);
      if (error) throw error;
      setBphs(bphs.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting BPH:', error);
      alert('Gagal menghapus pengurus.');
    }
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setQuote('');
    setOrderIndex(0);
    setImageFile(null);
    setEditingId(null);
  };

  const handleEdit = (bph: BPH) => {
    setEditingId(bph.id);
    setName(bph.name);
    setRole(bph.role);
    setQuote(bph.quote || '');
    setOrderIndex(bph.order_index);
    setImageFile(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Manajemen BPH</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola data Badan Pengurus Harian (Ketua, Wakil, Sekretaris, Bendahara).</p>
        </div>
        <button 
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            if (isFormOpen) resetForm();
          }}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          {isFormOpen ? 'Batal' : <><PlusIcon className="w-5 h-5" /> Tambah Pengurus</>}
        </button>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); resetForm(); }} title={editingId ? 'Edit Pengurus' : 'Tambah Pengurus Baru'} maxWidth="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Jabatan</label>
                <input required type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Contoh: Ketua OSIS" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Quote / Kutipan</label>
                <textarea rows={2} value={quote} onChange={e => setQuote(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Urutan (Angka)</label>
                <input required type="number" value={orderIndex} onChange={e => setOrderIndex(e.target.value === '' ? 0 : parseInt(e.target.value))} placeholder="1 untuk Ketua, 2 untuk Wakil, dst." className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Foto Resmi {editingId ? '(Opsional - Biarkan kosong jika tidak ingin mengubah)' : '(Wajib)'}</label>
                <input required={!editingId} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200 mt-4">
              <button disabled={isSubmitting} type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {isSubmitting ? <><ArrowPathIcon className="w-5 h-5 animate-spin" /> Menyimpan...</> : (editingId ? 'Perbarui Pengurus' : 'Simpan Pengurus')}
              </button>
            </div>
          </form>
      </Modal>

      {/* LIST BPH */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 animate-spin mb-4 text-primary" />
            Memuat data...
          </div>
        ) : bphs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">Belum ada pengurus yang ditambahkan.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bphs.map((bph) => (
              <div key={bph.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center hover:bg-slate-50 transition-colors">
                <div className="relative">
                  <img src={bph.image} alt={bph.name} className="w-24 h-24 rounded-full object-cover shadow-sm border border-slate-200" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm">
                    {bph.order_index}
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{bph.name}</h3>
                  <p className="text-sm font-bold text-primary tracking-widest uppercase mb-2">{bph.role}</p>
                  {bph.quote && <p className="text-sm text-slate-500 italic max-w-xl">&quot;{bph.quote}&quot;</p>}
                </div>
                <div className="flex items-center gap-2 self-center shrink-0">
                  <button 
                    onClick={() => handleEdit(bph)}
                    className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit Pengurus"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(bph.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Hapus Pengurus"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
