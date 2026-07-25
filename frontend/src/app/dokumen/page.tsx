import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, ArrowRight } from "lucide-react";
import { SlantedHeader } from "@/components/layout/slanted-header";

export default function DokumenPage() {
  const documents = [
    { id: 1, title: "Kalender Akademik 2025/2026", date: "15 Jul 2025", size: "1.2 MB" },
    { id: 2, title: "Tata Tertib Siswa SMAN 2 Babelan", date: "10 Jul 2025", size: "850 KB" },
    { id: 3, title: "Formulir Izin Ketidakhadiran", date: "01 Jan 2025", size: "120 KB" },
    { id: 4, title: "Brosur Profil Sekolah", date: "20 Agu 2025", size: "3.5 MB" },
    { id: 5, title: "Surat Edaran Pelaksanaan P5", date: "10 Okt 2025", size: "450 KB" }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <SlantedHeader 
        title="DOKUMEN"
        subtitle="PUSAT UNDUHAN"
        description="Unduh dokumen resmi, surat edaran, dan formulir sekolah di sini."
      >
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl pt-16 lg:pt-32 pb-32">


      <Card className="border border-slate-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <div key={doc.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group">
              <div className="flex gap-4 items-start sm:items-center">
                <div className="w-12 h-12 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{doc.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span>Diunggah: {doc.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{doc.size} PDF</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full sm:w-auto gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors font-semibold">
                <Download className="w-4 h-4" />
                Unduh
              </Button>
            </div>
          ))}
        </div>
      </Card>
        </div>
      </SlantedHeader>
    </div>
  );
}
