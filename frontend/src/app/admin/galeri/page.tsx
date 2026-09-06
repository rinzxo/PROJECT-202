"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { PlusIcon, TrashIcon, PhotoIcon, ArrowPathIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';

type Gallery = {
  id: string;
  title: string;
  date: string;
  cover_image: string;
  drive_link: string;
  photo_count: string;
  images: string[];
};

export default function AdminGaleriPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [photoCount, setPhotoCount] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching galleries:', error);
      alert('Gagal mengambil data galeri.');
    } else {
      setGalleries(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile && !editingId) {
      alert('Harap pilih cover image!');
      return;
    }

    setIsSubmitting(true);
    try {
      let coverUrl = null;
      if (coverFile) {
        coverUrl = await uploadToCloudinary(coverFile);
      }

      const imageUrls: string[] = [];
      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const url = await uploadToCloudinary(imageFiles[i]);
          imageUrls.push(url);
        }
      }

      if (editingId) {
        const updateData: any = { title, date, drive_link: driveLink, photo_count: photoCount };
        if (coverUrl) updateData.cover_image = coverUrl;
        if (imageUrls.length > 0) updateData.images = imageUrls;
        
        const { error } = await supabase.from('galleries').update(updateData).eq('id', editingId);
        if (error) throw error;
        alert('Galeri berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('galleries').insert([{
          title, date, drive_link: driveLink, photo_count: photoCount, cover_image: coverUrl!, images: imageUrls
        }]);
        if (error) throw error;
        alert('Galeri berhasil ditambahkan!');
      }

      setIsFormOpen(false);
      resetForm();
      fetchGalleries();
    } catch (error) {
      console.error('Error submitting gallery:', error);
      alert('Terjadi kesalahan saat menyimpan galeri.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus galeri ini?')) return;
    
    try {
      const { error } = await supabase.from('galleries').delete().eq('id', id);
      if (error) throw error;
      setGalleries(galleries.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error deleting gallery:', error);
      alert('Gagal menghapus galeri.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setDriveLink('');
    setPhotoCount('');
    setCoverFile(null);
    setImageFiles(null);
    setEditingId(null);
  };

  const handleEdit = (gallery: Gallery) => {
    setEditingId(gallery.id);
    setTitle(gallery.title);
    setDate(gallery.date);
    setDriveLink(gallery.drive_link || '');
    setPhotoCount(gallery.photo_count || '');
    setCoverFile(null);
    setImageFiles(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Manajemen Galeri</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola foto dan dokumentasi kegiatan OSIS.</p>
        </div>
        <button 
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            if (isFormOpen) resetForm();
          }}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          {isFormOpen ? 'Batal' : <><PlusIcon className="w-5 h-5" /> Tambah Galeri</>}
        </button>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); resetForm(); }} title={editingId ? 'Edit Galeri' : 'Tambah Galeri Baru'} maxWidth="max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Judul Acara</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white" placeholder="Contoh: Pentas Seni 2026" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal (Teks)</label>
                <input required type="text" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white" placeholder="Contoh: Agustus 2026" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Link Google Drive</label>
                <input type="url" value={driveLink} onChange={e => setDriveLink(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white" placeholder="https://drive.google.com/..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Jumlah Foto</label>
                <input required type="text" value={photoCount} onChange={e => setPhotoCount(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white" placeholder="Contoh: 320" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image {editingId ? '(Opsional)' : '(Wajib)'}</label>
                <input required={!editingId} type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Foto Tambahan (Opsional)</label>
                <input type="file" accept="image/*" multiple onChange={e => setImageFiles(e.target.files)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200 mt-4">
              <button disabled={isSubmitting} type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {isSubmitting ? <><ArrowPathIcon className="w-5 h-5 animate-spin" /> Menyimpan...</> : (editingId ? 'Perbarui Galeri' : 'Simpan Galeri')}
              </button>
            </div>
          </form>
      </Modal>

      {/* LIST GALERI */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 animate-spin mb-4 text-primary" />
            Memuat data...
          </div>
        ) : galleries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">Belum ada galeri yang ditambahkan.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {galleries.map((gallery) => (
              <div key={gallery.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center hover:bg-slate-50 transition-colors">
                <img src={gallery.cover_image} alt={gallery.title} className="w-full sm:w-48 h-32 object-cover rounded-xl shadow-sm" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{gallery.title}</h3>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-3">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md">{gallery.date}</span>
                    <span className="flex items-center gap-1"><PhotoIcon className="w-4 h-4" /> {gallery.photo_count} Foto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={gallery.drive_link} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline">Lihat Drive</a>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button 
                    onClick={() => handleEdit(gallery)}
                    className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit Galeri"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(gallery.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Hapus Galeri"
                  >
                    <TrashIcon className="w-6 h-6" />
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
