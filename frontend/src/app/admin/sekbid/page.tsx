"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { PlusIcon, TrashIcon, ArrowPathIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';

type SekbidMember = {
  id: string;
  sekbid_id: string;
  name: string;
  role: string;
  image: string;
  order_index: number;
};

const SEKBID_LIST = [
  { id: "1", title: "Sekbid 1: Keimanan & Ketaqwaan" },
  { id: "2", title: "Sekbid 2: Budi Pekerti Luhur" },
  { id: "3", title: "Sekbid 3: Kepribadian Unggul" },
  { id: "4", title: "Sekbid 4: Prestasi Akademik" },
  { id: "5", title: "Sekbid 5: Demokrasi & HAM" },
  { id: "6", title: "Sekbid 6: Kreativitas & Kewirausahaan" },
  { id: "7", title: "Sekbid 7: Kualitas Jasmani & Gizi" },
  { id: "8", title: "Sekbid 8: Sastra & Budaya" },
  { id: "9", title: "Sekbid 9: TIK" },
  { id: "10", title: "Sekbid 10: Komunikasi Bahasa Inggris" },
];

export default function AdminSekbidPage() {
  const [members, setMembers] = useState<SekbidMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("1"); // Default sekbid 1
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [sekbidId, setSekbidId] = useState("1");
  const [name, setName] = useState('');
  const [role, setRole] = useState('Anggota');
  const [orderIndex, setOrderIndex] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMembers(selectedFilter);
  }, [selectedFilter]);

  const fetchMembers = async (sId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('sekbid_members')
      .select('*')
      .eq('sekbid_id', sId)
      .order('order_index', { ascending: true });
      
    if (error) {
      console.error('Error fetching Sekbid Members:', error);
      alert('Gagal mengambil data pengurus Sekbid. Pastikan tabel sekbid_members sudah ada.');
    } else {
      setMembers(data || []);
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
        const updateData: any = { sekbid_id: sekbidId, name, role, order_index: orderIndex };
        if (imageUrl) updateData.image = imageUrl;
        
        const { error } = await supabase.from('sekbid_members').update(updateData).eq('id', editingId);
        if (error) throw error;
        alert('Anggota berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('sekbid_members').insert([{
          sekbid_id: sekbidId, name, role, order_index: orderIndex, image: imageUrl!
        }]);
        if (error) throw error;
        alert('Anggota berhasil ditambahkan!');
      }

      setIsFormOpen(false);
      resetForm();
      if (selectedFilter === sekbidId) fetchMembers(sekbidId);
    } catch (error) {
      console.error('Error submitting Sekbid member:', error);
      alert('Terjadi kesalahan saat menyimpan pengurus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      const { error } = await supabase.from('sekbid_members').delete().eq('id', id);
      if (error) throw error;
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting Sekbid member:', error);
      alert('Gagal menghapus pengurus.');
    }
  };

  const resetForm = () => {
    setName('');
    setRole('Anggota');
    setOrderIndex(0);
    setImageFile(null);
    setEditingId(null);
  };

  const handleEdit = (member: SekbidMember) => {
    setEditingId(member.id);
    setSekbidId(member.sekbid_id);
    setName(member.name);
    setRole(member.role);
    setOrderIndex(member.order_index);
    setImageFile(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Manajemen Sekbid</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola anggota Seksi Bidang 1 - 10.</p>
        </div>
        <button 
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            if (isFormOpen) resetForm();
          }}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          {isFormOpen ? 'Batal' : <><PlusIcon className="w-5 h-5" /> Tambah Anggota</>}
        </button>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); resetForm(); }} title={editingId ? 'Edit Anggota Sekbid' : 'Tambah Anggota Sekbid Baru'} maxWidth="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Sekbid</label>
                <select value={sekbidId} onChange={e => setSekbidId(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white">
                  {SEKBID_LIST.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Jabatan</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white">
                  <option value="Ketua Sekbid">Ketua Sekbid</option>
                  <option value="Anggota">Anggota</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Urutan (Angka)</label>
                <input required type="number" value={orderIndex} onChange={e => setOrderIndex(parseInt(e.target.value))} placeholder="1 untuk Ketua, 2 dst untuk Anggota" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-primary bg-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Foto Resmi {editingId ? '(Opsional)' : '(Wajib)'}</label>
                <input required={!editingId} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200 mt-4">
              <button disabled={isSubmitting} type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {isSubmitting ? <><ArrowPathIcon className="w-5 h-5 animate-spin" /> Menyimpan...</> : (editingId ? 'Perbarui Anggota' : 'Simpan Anggota')}
              </button>
            </div>
          </form>
      </Modal>

      {/* FILTER & LIST SEKBID */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Lihat Daftar Anggota Untuk:</label>
          <select value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)} className="w-full md:w-1/2 border border-slate-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary font-medium bg-white">
            {SEKBID_LIST.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 animate-spin mb-4 text-primary" />
            Memuat data...
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">Belum ada anggota yang ditambahkan untuk Sekbid ini.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {members.map((member) => (
              <div key={member.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center hover:bg-slate-50 transition-colors">
                <div className="relative">
                  <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover shadow-sm border border-slate-200" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-xs font-bold text-primary tracking-widest uppercase mb-1">{member.role}</p>
                </div>
                <div className="flex items-center gap-2 self-center shrink-0">
                  <button 
                    onClick={() => handleEdit(member)}
                    className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit Anggota"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(member.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Hapus Anggota"
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
