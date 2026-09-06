"use client";

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { supabase } from '@/lib/supabase';

// Taste Skill Dials
// DESIGN_VARIANCE: 7 (Asymmetric Bento Grid)
// MOTION_INTENSITY: 5 (Smooth reveals)
// VISUAL_DENSITY: 4 (Edge-to-edge typography, varied cell sizes)

export default function EkskulPage() {
  const reduce = useReducedMotion();

  const [ekskulList, setEkskulList] = useState<any[]>([]);

  useEffect(() => {
    const fetchEkskuls = async () => {
      const { data } = await supabase
        .from('ekskuls')
        .select('*')
        .order('name', { ascending: true });
      if (data) setEkskulList(data);
    };
    fetchEkskuls();
  }, []);

  const getSize = (idx: number) => {
    const pos = idx % 7;
    if (pos === 0 || pos === 6) return 'large';
    if (pos === 1 || pos === 4) return 'medium';
    return 'small';
  };

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
            EKSKUL
          </h1>
          <p className="text-xl md:text-2xl font-medium tracking-wide opacity-80 max-w-2xl leading-relaxed text-foreground">
            Temukan wadah untuk mengembangkan minat, bakat, dan potensimu melalui ekstrakurikuler di bawah naungan OSIS SMAN 2 Babelan.
          </p>
        </motion.div>
      </section>

      {/* EKSKUL GRID (Bento Desktop, Horizontal Snap Mobile) */}
      <section className="container mx-auto px-6 lg:px-12">
        
        {/* Mobile Swipe Container (Snap-x) or Desktop Bento (Grid) */}
        <div className="w-screen -mx-6 px-6 lg:w-auto lg:mx-0 lg:px-0 flex lg:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {ekskulList.map((ekskul, idx) => {
            
            // Asymmetric sizing for desktop grid based on dynamic size
            const size = getSize(idx);
            let colSpan = 'lg:col-span-1';
            let rowSpan = 'lg:row-span-1';
            let aspect = 'aspect-square';
            
            if (size === 'large') {
              colSpan = 'lg:col-span-2';
              rowSpan = 'lg:row-span-2';
              aspect = 'aspect-square lg:aspect-auto h-[400px] lg:h-full';
            } else if (size === 'medium') {
              colSpan = 'lg:col-span-2';
              rowSpan = 'lg:row-span-1';
              aspect = 'aspect-square lg:aspect-[2/1] h-[400px] lg:h-[300px]';
            } else {
              aspect = 'aspect-square lg:aspect-square h-[400px] lg:h-auto';
            }

            return (
              <motion.div 
                key={idx}
                initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
                className={`min-w-[80vw] sm:min-w-75 lg:min-w-0 snap-center shrink-0 ${colSpan} ${rowSpan} group active:scale-[0.98] transition-transform cursor-pointer`}
              >
                <div className={`relative ${aspect} w-full bg-slate-200 rounded-3xl overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-all flex flex-col justify-end p-6 lg:p-8`}>
                  <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" style={{ backgroundImage: `url('${ekskul.logo}')` }} />
                  <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Content over background */}
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                       <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/70 backdrop-blur-sm">
                         {ekskul.category}
                       </span>
                       <ArrowRightIcon className="w-6 h-6 text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mt-auto leading-none">
                      {ekskul.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
