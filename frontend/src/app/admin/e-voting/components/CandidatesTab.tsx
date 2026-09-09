"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { TrashIcon, PlusIcon, PhotoIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';

type Candidate = {
  id: string;
  nama: string;
  nomor_urut: number;
  visi?: string;
  misi?: string;
  visi_misi: string;
  foto_url: string;
  banner_url?: string;
  votes: number;
};

export default function CandidatesTab() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: '',
    nomor_urut: 1,
    visi: '',
    misi: '',
    visi_misi: '',
    foto_url: '',
    banner_url: ''
  });
  const [editId, setEditId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('nomor_urut', { ascending: true });
    
    if (!error && data) {
      setCandidates(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, field: 'foto_url' | 'banner_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'osissman2babelan');
    
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, [field]: data.secure_url }));
      } else {
        alert('Gagal mengunggah gambar');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal mengunggah gambar');
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.foto_url) {
      alert("Nama dan Foto wajib diisi!");
      return;
    }

    if (editId) {
      const { error } = await supabase.from('candidates').update(formData).eq('id', editId);
      if (error) {
        alert("Gagal memperbarui kandidat. Pesan: " + (error.message || ""));
        console.error(error);
      } else {
        setFormData({ nama: '', nomor_urut: candidates.length + 1, visi: '', misi: '', visi_misi: '', foto_url: '', banner_url: '' });
        setEditId(null);
        fetchCandidates();
      }
    } else {
      const { error } = await supabase.from('candidates').insert([formData]);
      if (error) {
        alert("Gagal menambahkan kandidat. Pesan: " + (error.message || ""));
        console.error(error);
      } else {
        setFormData({ nama: '', nomor_urut: candidates.length + 2, visi: '', misi: '', visi_misi: '', foto_url: '', banner_url: '' });
        fetchCandidates();
      }
    }
  };

  const handleEdit = (candidate: Candidate) => {
    setEditId(candidate.id);
    setFormData({
      nama: candidate.nama,
      nomor_urut: candidate.nomor_urut,
      visi: candidate.visi || '',
      misi: candidate.misi || '',
      visi_misi: candidate.visi_misi,
      foto_url: candidate.foto_url,
      banner_url: candidate.banner_url || ''
    });
    // scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ nama: '', nomor_urut: candidates.length + 1, visi: '', misi: '', visi_misi: '', foto_url: '', banner_url: '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kandidat ini?')) return;
    const { error } = await supabase.from('candidates').delete().eq('id', id);
    if (!error) fetchCandidates();
  };

  return (
    <div className="space-y-6">
      {/* Form Tambah/Edit Kandidat */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-lg text-slate-800 mb-4">
          {editId ? 'Edit Kandidat' : 'Tambah Kandidat Baru'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kandidat</label>
              <input 
                type="text" 
                required
                value={formData.nama}
                onChange={e => setFormData({...formData, nama: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="Misal: Budi Santoso"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Urut</label>
              <input 
                type="number" 
                required
                min="1"
                value={formData.nomor_urut}
                onChange={e => setFormData({...formData, nomor_urut: parseInt(e.target.value)})}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:col-span-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Visi (Bisa HTML dasar)</label>
                <textarea
                  value={formData.visi}
                  onChange={e => setFormData({...formData, visi: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-32"
                  placeholder="Tulis visi kandidat di sini..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Misi (Bisa HTML dasar)</label>
                <textarea
                  value={formData.misi}
                  onChange={e => setFormData({...formData, misi: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-32"
                  placeholder="Tulis misi kandidat di sini..."
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Foto Kandidat</label>
              <div 
                className="w-full h-48 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-slate-50 cursor-pointer overflow-hidden relative hover:bg-slate-100 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.foto_url ? (
                  <img src={formData.foto_url} alt="Preview Foto" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center text-slate-500">
                    <PhotoIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">{isUploading ? 'Mengunggah...' : 'Klik untuk pilih foto'}</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={e => handleUploadImage(e, 'foto_url')} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Banner Kandidat (Opsional)</label>
              <div 
                className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-slate-50 cursor-pointer overflow-hidden relative hover:bg-slate-100 transition-colors"
                onClick={() => bannerInputRef.current?.click()}
              >
                {formData.banner_url ? (
                  <img src={formData.banner_url} alt="Preview Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-slate-500">
                    <PhotoIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">{isUploading ? 'Mengunggah...' : 'Klik untuk pilih banner'}</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" ref={bannerInputRef} onChange={e => handleUploadImage(e, 'banner_url')} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-end gap-3">
            {editId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 flex items-center gap-2 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
                Batal
              </button>
            )}
            <button
              type="submit"
              disabled={isUploading || !formData.foto_url}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {editId ? <PencilIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
              {editId ? 'Update Kandidat' : 'Simpan Kandidat'}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Kandidat */}
      <div>
        <h3 className="font-bold text-lg text-slate-800 mb-4">Daftar Kandidat ({candidates.length})</h3>
        {loading ? (
          <p className="text-sm text-slate-500">Memuat...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                <div className="aspect-3/4 relative bg-slate-100">
                  <img src={c.foto_url} alt={c.nama} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary font-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-xl">
                    {c.nomor_urut}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-bold text-lg text-slate-800 line-clamp-1">{c.nama}</h4>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{c.visi_misi || 'Belum ada visi misi'}</p>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      {c.votes} Suara
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(c)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
