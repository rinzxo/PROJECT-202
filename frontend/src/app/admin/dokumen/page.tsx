"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { PlusIcon, TrashIcon, ArrowPathIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';

type Document = {
  id: string;
  title: string;
  category: string;
  file_url: string;
  created_at: string;
};

export default function AdminDokumenPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Panduan');
  const [docFile, setDocFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching documents:', error);
      alert('Gagal mengambil data dokumen.');
    } else {
      setDocuments(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile && !editingId) {
      alert('Harap pilih file dokumen!');
      return;
    }

    setIsSubmitting(true);
    try {
      let fileUrl = null;
      if (docFile) {
        fileUrl = await uploadToCloudinary(docFile);
      }

      if (editingId) {
        const updateData: any = { title, category };
        if (fileUrl) updateData.file_url = fileUrl;
        
        const { error } = await supabase.from('documents').update(updateData).eq('id', editingId);
        if (error) throw error;
        alert('Dokumen berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('documents').insert([{
          title, category, file_url: fileUrl!
        }]);
        if (error) throw error;
        alert('Dokumen berhasil ditambahkan!');
      }

      setIsFormOpen(false);
      resetForm();
      fetchDocuments();
    } catch (error) {
      console.error('Error submitting document:', error);
      alert('Terjadi kesalahan saat menyimpan dokumen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;
    
    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
      setDocuments(documents.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Gagal menghapus dokumen.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Panduan');
    setDocFile(null);
    setEditingId(null);
  };

  const handleEdit = (doc: Document) => {
    setEditingId(doc.id);
    setTitle(doc.title);
    setCategory(doc.category);
    setDocFile(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Manajemen Dokumen</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola arsip dokumen resmi OSIS.</p>
        </div>
        <button 
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            if (isFormOpen) resetForm();
          }}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          {isFormOpen ? 'Batal' : <><PlusIcon className="w-5 h-5" /> Tambah Dokumen</>}
        </button>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); resetForm(); }} title={editingId ? 'Edit Dokumen' : 'Tambah Dokumen Baru'} maxWidth="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Judul Dokumen</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Misal: Proposal Kegiatan Porseni" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white">
                  <option value="Proposal">Proposal</option>
                  <option value="LPJ">LPJ</option>
                  <option value="Panduan">Panduan</option>
                  <option value="Formulir">Formulir</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">File Dokumen {editingId ? '(Opsional)' : '(Wajib)'}</label>
                <input required={!editingId} type="file" onChange={e => setDocFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200 mt-4">
              <button disabled={isSubmitting} type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {isSubmitting ? <><ArrowPathIcon className="w-5 h-5 animate-spin" /> Menyimpan...</> : (editingId ? 'Perbarui Dokumen' : 'Simpan Dokumen')}
              </button>
            </div>
          </form>
      </Modal>

      {/* LIST DOKUMEN */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 animate-spin mb-4 text-primary" />
            Memuat data...
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">Belum ada dokumen yang ditambahkan.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center hover:bg-slate-50 transition-colors">
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-primary/10 text-primary">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(doc.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{doc.title}</h3>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-500 hover:underline">
                    Lihat/Unduh File
                  </a>
                </div>
                <div className="flex items-center gap-2 self-center shrink-0">
                  <button 
                    onClick={() => handleEdit(doc)}
                    className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit Dokumen"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Hapus Dokumen"
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
