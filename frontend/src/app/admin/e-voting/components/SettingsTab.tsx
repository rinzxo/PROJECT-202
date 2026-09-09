import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SettingsTab() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('evoting_settings')
        .select('hero_video_url')
        .eq('id', 1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "Results contain 0 rows"
        console.error(error);
      } else if (data) {
        setVideoUrl(data.hero_video_url || '');
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Coba update dulu
      const { data: updateData, error: updateError } = await supabase
        .from('evoting_settings')
        .update({ hero_video_url: videoUrl })
        .eq('id', 1)
        .select();

      // Kalau tidak ada row (belum ada id 1), kita insert
      if (!updateError && (!updateData || updateData.length === 0)) {
        const { error: insertError } = await supabase
          .from('evoting_settings')
          .insert([{ id: 1, hero_video_url: videoUrl }]);
          
        if (insertError) throw insertError;
      } else if (updateError) {
        throw updateError;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyimpan pengaturan: ' + (err.message || 'Error tidak diketahui'));
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Memuat pengaturan...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
      <h3 className="font-bold text-lg text-slate-800 mb-6">Pengaturan Tampilan E-Voting</h3>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">URL Video Hero</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Contoh: https://www.youtube.com/embed/XXXXX atau /videos/hero.mp4"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <p className="mt-2 text-sm text-slate-500">
            Video ini akan ditampilkan di halaman depan E-Voting. Untuk performa terbaik, gunakan link embed YouTube atau path lokal video.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
          
          {saveSuccess && (
            <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircleIcon className="w-5 h-5" />
              Tersimpan!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
