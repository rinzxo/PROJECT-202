import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { SlantedHeader } from "@/components/layout/slanted-header";

export default function EventsPage() {
  const events = [
    { id: 1, date: "24", month: "OKT", title: "Gelar Karya P5: Gaya Hidup Berkelanjutan", loc: "Lapangan Utama", time: "07:30 - Selesai", desc: "Pameran hasil karya siswa kelas X dan XI dalam mengimplementasikan profil pelajar Pancasila." },
    { id: 2, date: "28", month: "OKT", title: "Upacara Peringatan Hari Sumpah Pemuda", loc: "Lapangan Upacara", time: "07:00 - 08:30", desc: "Upacara bendera peringatan hari Sumpah Pemuda dengan mengenakan pakaian adat Nusantara." },
    { id: 3, date: "05", month: "NOV", title: "Workshop Jurnalistik & Mading Digital", loc: "Ruang Aula Serbaguna", time: "09:00 - 14:00", desc: "Pelatihan dasar jurnalistik untuk anggota ekskul dan perwakilan kelas." },
    { id: 4, date: "12", month: "DEC", title: "Classmeeting Semester Genap", loc: "Lapangan Olahraga", time: "08:00 - 15:00", desc: "Kompetisi olahraga antarkelas (Futsal, Basket, Voli, E-Sports)." }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <SlantedHeader 
        title="EVENT HUB"
        subtitle="AGENDA SEKOLAH"
        description="Pusat informasi kegiatan, perlombaan internal, dan acara sekolah. Jangan sampai terlewat!"
      >
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl pt-16 lg:pt-32 pb-32">


      <div className="flex flex-col gap-6">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group border-slate-200">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-48 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center p-8 group-hover:bg-primary transition-colors">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-200">{event.month}</span>
                <span className="text-5xl font-black text-slate-900 group-hover:text-white mt-1">{event.date}</span>
              </div>
              <CardContent className="p-6 md:p-8 flex-1 flex flex-col justify-center space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">{event.title}</h3>
                <p className="text-slate-600">{event.desc}</p>
                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500 pt-2">
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {event.loc}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {event.time}</div>
                </div>
              </CardContent>
              <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-slate-100 flex items-center justify-center bg-slate-50/50">
                <Button className="w-full md:w-auto font-semibold">
                  Lihat Detail
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
        </div>
      </SlantedHeader>
    </div>
  );
}
