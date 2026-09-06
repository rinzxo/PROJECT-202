"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

type SiteSettings = {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  visi: string;
  misi: string;
  contact_email: string;
  contact_instagram: string;
};

export default function AdminPengaturanPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [visi, setVisi] = useState('');
  const [misi, setMisi] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactInstagram, setContactInstagram] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();
      
    if (error) {
      if (error.code !== 'PGRST116') { // not found
        console.error('Error fetching settings:', error);
        alert('Gagal mengambil data pengaturan.');
      }
    } else if (data) {
      setSettings(data);
      setHeroTitle(data.hero_title || '');
      setHeroSubtitle(data.hero_subtitle || '');
      setVisi(data.visi || '');
      setMisi(data.misi || '');
      setContactEmail(data.contact_email || '');
      setContactInstagram(data.contact_instagram || '');
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        visi,
        misi,
        contact_email: contactEmail,
        contact_instagram: contactInstagram,
        updated_at: new Date().toISOString(),
      };

      if (settings?.id) {
        const { error } = await supabase
          .from('site_settings')
          .update(updateData)
          .eq('id', settings.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([updateData]);
        if (error) throw error;
      }

      alert('Pengaturan berhasil diperbarui!');
      fetchSettings();
    } catch (error) {
      console.error('Error submitting settings:', error);
      alert('Terjadi kesalahan saat menyimpan pengaturan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Pengaturan Website</h1>
        <p className="text-slate-500 font-medium mt-1">Ubah teks utama yang tampil di beranda dan halaman profil.</p>
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
          <ArrowPathIcon className="w-8 h-8 animate-spin mb-4 text-primary" />
          Memuat pengaturan...
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 mb-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Bagian Hero */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Hero Section (Beranda)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Judul Utama (Hero Title)</label>
                  <input 
                    required 
                    type="text" 
                    value={heroTitle} 
                    onChange={e => setHeroTitle(e.target.value)} 
                    placeholder="Misal: OSIS SMAN 2 BABELAN" 
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary" 
                  />
                  <p className="text-xs text-slate-500 mt-1">Gunakan tag &lt;br /&gt; jika ingin membuat baris baru.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Subjudul (Hero Subtitle)</label>
                  <textarea 
                    required 
                    rows={2} 
                    value={heroSubtitle} 
                    onChange={e => setHeroSubtitle(e.target.value)} 
                    placeholder="Deskripsi singkat di bawah judul utama..." 
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Bagian Visi Misi */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Visi & Misi (Profil)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Visi</label>
                  <textarea 
                    required 
                    rows={3} 
                    value={visi} 
                    onChange={e => setVisi(e.target.value)} 
                    placeholder="Tulis visi OSIS..." 
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary resize-y"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Misi</label>
                  <textarea 
                    required 
                    rows={8} 
                    value={misi} 
                    onChange={e => setMisi(e.target.value)} 
                    placeholder="Tulis misi OSIS, pisahkan setiap poin misi dengan baris baru (ENTER)..." 
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary resize-y leading-relaxed"
                  ></textarea>
                  <p className="text-xs text-slate-500 mt-1">Setiap baris baru (ENTER) akan otomatis diubah menjadi 1 poin misi pada halaman Profil.</p>
                </div>
              </div>
            </div>

            {/* Bagian Kontak */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Kontak & Footer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={contactEmail} 
                    onChange={e => setContactEmail(e.target.value)} 
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Instagram Username</label>
                  <input 
                    type="text" 
                    value={contactInstagram} 
                    onChange={e => setContactInstagram(e.target.value)} 
                    placeholder="@osismandua"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button disabled={isSubmitting} type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {isSubmitting ? <><ArrowPathIcon className="w-5 h-5 animate-spin" /> Menyimpan...</> : 'Simpan Pengaturan'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
