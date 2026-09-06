"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { PlusIcon, TrashIcon, ArrowPathIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';

type Ekskul = {
  id: string;
  name: string;
  category: string;
  logo: string;
  description: string;
  jadwal: string;
  pembina: string;
  ketua: string;
  instagram: string;
};

export default function AdminEkskulPage() {
  const [ekskuls, setEkskuls] = useState<Ekskul[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Pilihan');
  const [description, setDescription] = useState('');
  const [jadwal, setJadwal] = useState('');
  const [pembina, setPembina] = useState('');
  const [ketua, setKetua] = useState('');
  const [instagram, setInstagram] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchEkskuls();
  }, []);

  const fetchEkskuls = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('ekskuls')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) {
      console.error('Error fetching Ekskuls:', error);
      alert('Gagal mengambil data ekstrakurikuler.');
    } else {
      setEkskuls(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !editingId) {
      alert('Harap pilih logo ekstrakurikuler!');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      if (editingId) {
        const updateData: any = { name, category, description, jadwal, pembina, ketua, instagram };
        if (imageUrl) updateData.logo = imageUrl;
        
        const { error } = await supabase.from('ekskuls').update(updateData).eq('id', editingId);
        if (error) throw error;
        alert('Ekstrakurikuler berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('ekskuls').insert([{
          name, category, logo: imageUrl!, description, jadwal, pembina, ketua, instagram
        }]);
        if (error) throw error;
        alert('Ekstrakurikuler berhasil ditambahkan!');
      }

      setIsFormOpen(false);
      resetForm();
      fetchEkskuls();
    } catch (error) {
      console.error('Error submitting Ekskul:', error);
      alert('Terjadi kesalahan saat menyimpan ekstrakurikuler.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      const { error } = await supabase.from('ekskuls').delete().eq('id', id);
      if (error) throw error;
      setEkskuls(ekskuls.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting Ekskul:', error);
      alert('Gagal menghapus ekstrakurikuler.');
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('Pilihan');
    setDescription('');
    setJadwal('');
    setPembina('');
    setKetua('');
    setInstagram('');
    setImageFile(null);
    setEditingId(null);
  };

  const handleEdit = (ekskul: Ekskul) => {
    setEditingId(ekskul.id);
    setName(ekskul.name);
    setCategory(ekskul.category);
    setDescription(ekskul.description || '');
    setJadwal(ekskul.jadwal || '');
    setPembina(ekskul.pembina || '');
    setKetua(ekskul.ketua || '');
    setInstagram(ekskul.instagram || '');
    setImageFile(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Manajemen Ekstrakurikuler</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola daftar ekskul wajib dan pilihan.</p>
        </div>
        <button 
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            if (isFormOpen) resetForm();
          }}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          {isFormOpen ? 'Batal' : <><PlusIcon className="w-5 h-5" /> Tambah Ekskul</>}
        </button>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); resetForm(); }} title={editingId ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'} maxWidth="max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Ekskul</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Misal: Pramuka, Paskibra" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white">
                  <option value="Wajib">Wajib</option>
                  <option value="Pilihan">Pilihan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Jadwal Latihan</label>
                <input type="text" value={jadwal} onChange={e => setJadwal(e.target.value)} placeholder="Misal: Jumat, 13.00 - 15.00" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pembina</label>
                <input type="text" value={pembina} onChange={e => setPembina(e.target.value)} placeholder="Nama Pembina Ekskul" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ketua Ekskul</label>
                <input type="text" value={ketua} onChange={e => setKetua(e.target.value)} placeholder="Nama Ketua Ekskul" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Username Instagram</label>
                <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="Misal: pramukasmandala" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Logo Ekskul {editingId ? '(Opsional)' : '(Wajib)'}</label>
                <input required={!editingId} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200 mt-4">
              <button disabled={isSubmitting} type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {isSubmitting ? <><ArrowPathIcon className="w-5 h-5 animate-spin" /> Menyimpan...</> : (editingId ? 'Perbarui Ekstrakurikuler' : 'Simpan Ekstrakurikuler')}
              </button>
            </div>
          </form>
      </Modal>

      {/* LIST EKSKUL */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 animate-spin mb-4 text-primary" />
            Memuat data...
          </div>
        ) : ekskuls.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">Belum ada ekstrakurikuler yang ditambahkan.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {ekskuls.map((ekskul) => (
              <div key={ekskul.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center hover:bg-slate-50 transition-colors">
                <img src={ekskul.logo} alt={ekskul.name} className="w-20 h-20 object-contain rounded-xl" />
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{ekskul.name}</h3>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm ${ekskul.category === 'Wajib' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                      {ekskul.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 max-w-2xl">{ekskul.description}</p>
                </div>
                <div className="flex items-center gap-2 self-center shrink-0">
                  <button 
                    onClick={() => handleEdit(ekskul)}
                    className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit Ekskul"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(ekskul.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Hapus Ekskul"
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
