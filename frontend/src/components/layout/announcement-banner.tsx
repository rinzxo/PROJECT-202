import React from 'react';
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export function AnnouncementBanner() {
  return (
    <div className="bg-primary text-primary-foreground px-4 py-2 text-sm flex justify-center items-center gap-2">
      <ExclamationCircleIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
      <span>
        <strong>PENGUMUMAN:</strong> Pendaftaran Classmeeting Semester Genap telah dibuka. <a href="/event/classmeeting-genap" className="underline font-semibold hover:text-slate-200">Daftar sekarang</a>
      </span>
    </div>
  );
}
