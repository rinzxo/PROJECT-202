"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { PlusIcon, TrashIcon, ArrowPathIcon, PencilSquareIcon, TrophyIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';

type Article = {
  id: string;
  category: string;
  title: string;
  slug: string;
  cover_image: string;
  excerpt: string;
  content: string;
  created_at: string;
};

export default function AdminKaryaPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingId && title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [title, editingId]);

  const fetchArticles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category', 'Karya & Prestasi')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching articles:', error);
      alert('Gagal mengambil data.');
    } else {
      setArticles(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile && !editingId) {
      alert('Harap pilih foto cover!');
      return;
    }

    setIsSubmitting(true);
    try {
      let coverUrl = null;
      if (coverFile) {
        coverUrl = await uploadToCloudinary(coverFile);
      }

      if (editingId) {
        const updateData: any = { title, slug, excerpt, content };
        if (coverUrl) updateData.cover_image = coverUrl;
        
        const { error } = await supabase.from('articles').update(updateData).eq('id', editingId);
        if (error) throw error;
        alert('Data berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('articles').insert([{
          category: 'Karya & Prestasi', title, slug, excerpt, content, cover_image: coverUrl!
        }]);
        if (error) {
          if (error.code === '23505') alert('Slug sudah digunakan, gunakan judul yang berbeda.');
          else throw error;
        } else {
          alert('Data berhasil ditambahkan!');
        }
      }

      setIsFormOpen(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Error submitting article:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      setArticles(articles.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Gagal menghapus data.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverFile(null);
    setEditingId(null);
  };

  const handleEdit = (article: Article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setSlug(article.slug);
    setExcerpt(article.excerpt || '');
    setContent(article.content || '');
    setCoverFile(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <TrophyIcon className="w-8 h-8 text-primary" /> Karya & Prestasi
          </h1>
          <p className="text-slate-500 font-medium mt-1">Kelola portofolio karya dan prestasi untuk ditampilkan di Beranda.</p>
        </div>
        <button 
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            if (isFormOpen) resetForm();
          }}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          {isFormOpen ? 'Batal' : <><PlusIcon className="w-5 h-5" /> Tambah Karya/Prestasi</>}
        </button>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); resetForm(); }} title={editingId ? 'Edit Karya/Prestasi' : 'Tambah Karya/Prestasi Baru'} maxWidth="max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Judul</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Juara 1 Futsal Nasional" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Slug (URL)</label>
                <input required type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="contoh-juara-1-futsal" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary font-mono text-sm bg-white" />
                <p className="text-xs text-slate-400 mt-1">URL otomatis untuk artikel ini (jangan gunakan spasi).</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Foto Cover {editingId ? '(Opsional - Biarkan kosong jika tidak ingin mengubah)' : '(Wajib)'}</label>
                <input required={!editingId} type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Singkat (Excerpt)</label>
                <textarea rows={2} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Singkat saja untuk ditampilkan di halaman depan" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Isi Artikel Lengkap</label>
                <textarea rows={8} value={content} onChange={e => setContent(e.target.value)} placeholder="Ceritakan detail karya atau prestasi di sini..." className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200 mt-4">
              <button disabled={isSubmitting} type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {isSubmitting ? <><ArrowPathIcon className="w-5 h-5 animate-spin" /> Menyimpan...</> : (editingId ? 'Perbarui Data' : 'Simpan Data')}
              </button>
            </div>
          </form>
      </Modal>

      {/* LIST KARYA */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 animate-spin mb-4 text-primary" />
            Memuat data...
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">Belum ada karya atau prestasi yang ditambahkan.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {articles.map((article) => (
              <div key={article.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center hover:bg-slate-50 transition-colors">
                <div className="relative">
                  <img src={article.cover_image} alt={article.title} className="w-32 h-20 rounded-lg object-cover shadow-sm border border-slate-200" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{article.title}</h3>
                  <p className="text-sm text-slate-500 mb-2">/{article.slug}</p>
                  {article.excerpt && <p className="text-sm text-slate-600 line-clamp-2">{article.excerpt}</p>}
                </div>
                <div className="flex items-center gap-2 self-center shrink-0">
                  <button 
                    onClick={() => handleEdit(article)}
                    className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit Artikel"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(article.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Hapus Artikel"
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
