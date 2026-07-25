import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SlantedHeader } from "@/components/layout/slanted-header";

export default function EkskulPage() {
  const ekskulList = [
    'OSIS', 'Pramuka', 'Paskibra', 'Rohis', 'Rohkris', 'Futsal', 'Basket', 
    'Voli', 'Bulu Tangkis', 'PMR', 'KIR', 'Teater', 'Tari Tradisional', 
    'Paduan Suara', 'Sinematografi', 'Jurnalistik', 'English Club', 'Japanese Club'
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <SlantedHeader 
        title="EKSKUL"
        subtitle="EKSTRAKURIKULER"
        description="Temukan wadah untuk mengembangkan minat, bakat, dan potensimu melalui lebih dari 20 ekstrakurikuler aktif di SMAN 2 Babelan."
      >
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl pt-16 lg:pt-32 pb-32">


      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ekskulList.map((ekskul, idx) => (
          <Card key={idx} className="hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-slate-200 group bg-white">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-5">
              <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                {ekskul.substring(0, 2).toUpperCase()}
              </div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{ekskul}</h3>
              <Button variant="ghost" className="w-full mt-2 text-sm text-slate-400 group-hover:text-primary group-hover:bg-blue-50">Lihat Profil</Button>
            </CardContent>
          </Card>
        ))}
      </div>
        </div>
      </SlantedHeader>
    </div>
  );
}
