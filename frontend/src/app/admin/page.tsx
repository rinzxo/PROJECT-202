import React from 'react';
import { 
  PhotoIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  BriefcaseIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const cards = [
    { title: 'Galeri', href: '/admin/galeri', icon: PhotoIcon, color: 'bg-blue-500', count: 'Kelola Foto' },
    { title: 'Event Hub', href: '/admin/events', icon: CalendarIcon, color: 'bg-rose-500', count: 'Kelola Acara' },
    { title: 'BPH', href: '/admin/bph', icon: UserGroupIcon, color: 'bg-emerald-500', count: 'Kelola Pengurus' },
    { title: 'Sekbid', href: '/admin/sekbid', icon: BriefcaseIcon, color: 'bg-amber-500', count: 'Kelola Bidang' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Selamat Datang di CMS!</h1>
        <p className="text-slate-500 font-medium">Kelola seluruh konten website OSIS SMAN 2 Babelan dari sini.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link 
            key={card.title} 
            href={card.href}
            className="block p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1 group"
          >
            <div className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center mb-6 shadow-sm`}>
              <card.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{card.title}</h3>
            <p className="text-sm font-medium text-slate-500 group-hover:text-primary transition-colors">{card.count} &rarr;</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-slate-900 rounded-3xl p-8 lg:p-12 text-white overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-4 leading-tight">Database & Media Aktif</h2>
          <p className="text-slate-400 font-medium leading-relaxed mb-8">
            Website ini terhubung langsung secara real-time dengan Supabase untuk penyimpanan data dan Cloudinary untuk optimasi aset visual. Segala perubahan yang Anda lakukan akan langsung tayang ke website publik.
          </p>
          <div className="flex gap-4">
            <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full border border-emerald-500/30">Supabase Connected</span>
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-500/30">Cloudinary Ready</span>
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-125 h-125 bg-linear-to-br from-primary/30 to-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      </div>
    </div>
  );
}
