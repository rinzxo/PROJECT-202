"use client";

import React, { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from '@/lib/supabase';

// Taste Skill Dials
// DESIGN_VARIANCE: 7 (Clean Editorial)
// MOTION_INTENSITY: 5
// VISUAL_DENSITY: 3

export default function DokumenPage() {
  const reduce = useReducedMotion();

  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setDocuments(data);
    };
    fetchDocuments();
  }, []);

  return (
    <div className="flex flex-col min-h-dvh font-sans selection:bg-primary selection:text-white bg-background pt-24 lg:pt-32 pb-32">
      
      {/* NATIVE HERO */}
      <section className="container mx-auto px-6 lg:px-12 mb-20 lg:mb-32">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] text-primary mb-8 -ml-1 lg:-ml-2">
            DOKUMEN
          </h1>
          <p className="text-xl md:text-2xl font-medium tracking-wide opacity-80 max-w-2xl leading-relaxed text-foreground">
            Pusat unduhan dokumen resmi, surat edaran, dan formulir kegiatan OSIS SMAN 2 Babelan.
          </p>
        </motion.div>
      </section>

      {/* DOKUMEN LIST (Typographic rows) */}
      <section className="container mx-auto px-6 lg:px-12">
        <div className="border-t border-primary/20">
          {documents.map((doc, index) => (
            <motion.div 
              key={doc.id}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="py-8 md:py-12 border-b border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-primary/2 -mx-6 px-6 lg:mx-0 lg:px-6 transition-colors rounded-3xl"
            >
              
              <div className="flex items-start md:items-center gap-6 md:gap-8">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary transition-colors group-hover:text-white">
                  <DocumentTextIcon className="w-8 h-8 opacity-50 group-hover:opacity-100" />
                </div>
                
                <div className="flex flex-col">
                   <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-slate-900 group-hover:text-primary transition-colors mb-2">
                     {doc.title}
                   </h3>
                   <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500">
                     <span>{new Date(doc.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                     <span className="w-1 h-1 rounded-full bg-slate-300" />
                     <span className="bg-slate-100 px-2 py-1 rounded">{doc.category}</span>
                   </div>
                </div>
              </div>
              
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full md:w-auto mt-4 md:mt-0 py-4 px-8 rounded-full border border-primary/20 font-bold text-[10px] text-primary tracking-[0.2em] uppercase hover:bg-primary hover:text-white active:scale-95 transition-all">
                <ArrowDownTrayIcon className="w-4 h-4" /> Unduh
              </a>
              
            </motion.div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
