"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { PlusIcon, TrashIcon, ArrowPathIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  description: string;
  status: string;
  registration_link: string;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [registrationLink, setRegistrationLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching events:', error);
      alert('Gagal mengambil data event.');
    } else {
      setEvents(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !editingId) {
      alert('Harap pilih gambar poster/cover event!');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      if (editingId) {
        const updateData: any = { title, date, time, location, category, description, status, registration_link: registrationLink };
        if (imageUrl) updateData.image = imageUrl;
        
        const { error } = await supabase.from('events').update(updateData).eq('id', editingId);
        if (error) throw error;
        alert('Event berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('events').insert([{
          title, date, time, location, category, image: imageUrl!, description, status, registration_link: registrationLink
        }]);
        if (error) throw error;
        alert('Event berhasil ditambahkan!');
      }

      setIsFormOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Terjadi kesalahan saat menyimpan event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return;
    
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Gagal menghapus event.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setCategory('');
    setDescription('');
    setStatus('upcoming');
    setRegistrationLink('');
    setImageFile(null);
    setEditingId(null);
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setTitle(event.title);
    setDate(event.date);
    setTime(event.time || '');
    setLocation(event.location);
    setCategory(event.category);
    setDescription(event.description || '');
    setStatus(event.status);
    setRegistrationLink(event.registration_link || '');
    setImageFile(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Manajemen Event Hub</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola agenda dan acara OSIS.</p>
        </div>
        <button 
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            if (isFormOpen) resetForm();
          }}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          {isFormOpen ? 'Batal' : <><PlusIcon className="w-5 h-5" /> Tambah Event</>}
        </button>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); resetForm(); }} title={editingId ? 'Edit Event' : 'Tambah Event Baru'} maxWidth="max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Acara</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal</label>
                  <input required type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="Misal: 17 Agustus 2026" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Waktu (Jam)</label>
                  <input type="text" value={time} onChange={e => setTime(e.target.value)} placeholder="08.00 - Selesai" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kategori / Label</label>
                <input required type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Misal: Porseni, Lomba, Seminar" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi</label>
                <input required type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Lapangan SMAN 2 Babelan" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Status Event</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white">
                  <option value="upcoming">Akan Datang (Upcoming)</option>
                  <option value="ongoing">Sedang Berlangsung (Ongoing)</option>
                  <option value="completed">Selesai (Completed)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Link Registrasi / Buku Panduan</label>
                <input type="url" value={registrationLink} onChange={e => setRegistrationLink(e.target.value)} placeholder="https://forms.gle/..." className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Poster / Cover Image {editingId ? '(Opsional)' : '(Wajib)'}</label>
                <input required={!editingId} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Singkat</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200 mt-4">
              <button disabled={isSubmitting} type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {isSubmitting ? <><ArrowPathIcon className="w-5 h-5 animate-spin" /> Menyimpan...</> : (editingId ? 'Perbarui Event' : 'Simpan Event')}
              </button>
            </div>
          </form>
      </Modal>

      {/* LIST EVENT */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 animate-spin mb-4 text-primary" />
            Memuat data...
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">Belum ada event yang ditambahkan.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map((evt) => (
              <div key={evt.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center hover:bg-slate-50 transition-colors">
                <img src={evt.image} alt={evt.title} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shadow-sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-primary/10 text-primary">{evt.category}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm ${evt.status === 'completed' ? 'bg-slate-100 text-slate-500' : evt.status === 'ongoing' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                      {evt.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{evt.title}</h3>
                  <div className="text-sm font-medium text-slate-500 mb-1">
                    {evt.date} • {evt.location}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button 
                    onClick={() => handleEdit(evt)}
                    className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit Event"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(evt.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Hapus Event"
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
