"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  PhotoIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  SparklesIcon, 
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  NewspaperIcon,
  TrophyIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If we are on the login page, don't show the sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Galeri', href: '/admin/galeri', icon: PhotoIcon },
    { name: 'Event Hub', href: '/admin/events', icon: CalendarIcon },
    { name: 'BPH', href: '/admin/bph', icon: UserGroupIcon },
    { name: 'Sekbid', href: '/admin/sekbid', icon: BriefcaseIcon },
    { name: 'Program Kerja', href: '/admin/proker', icon: ClipboardDocumentListIcon },
    { name: 'Ekstrakurikuler', href: '/admin/ekskul', icon: SparklesIcon },
    { name: 'Dokumen', href: '/admin/dokumen', icon: DocumentTextIcon },
    { name: 'Karya & Prestasi', href: '/admin/karya', icon: TrophyIcon },
    { name: 'Berita Utama', href: '/admin/berita', icon: NewspaperIcon },
    { name: 'Rekrutmen', href: '/admin/rekrutmen', icon: IdentificationIcon },
    { name: 'E-Voting', href: '/admin/e-voting', icon: UserGroupIcon },
    { name: 'Pengaturan', href: '/admin/pengaturan', icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    document.cookie = "admin_pin=; path=/; max-age=0";
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-primary selection:text-white text-slate-800">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden print:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block flex flex-col print:hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <Link href="/admin" className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-sm">OS</div>
            <span className="font-bold tracking-tight text-lg">OSIS CMS</span>
          </Link>
          <button className="lg:hidden p-2 hover:bg-slate-800 rounded-md" onClick={() => setIsSidebarOpen(false)}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-3 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 mt-2">Manajemen Konten</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-white" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-red-400 transition-colors text-left"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 text-slate-500" />
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 print:block">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-6 lg:px-10 shrink-0 sticky top-0 z-30 print:hidden">
          <button 
            className="lg:hidden p-2 -ml-2 mr-4 hover:bg-slate-100 rounded-md"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6 text-slate-600" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/" target="_blank" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors underline underline-offset-4">
              Lihat Website
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden print:p-0 print:overflow-visible">
          {children}
        </main>
      </div>

    </div>
  );
}
