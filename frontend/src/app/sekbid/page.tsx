"use client";

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { sekbidData } from './data';
import { cn } from '@/lib/utils';

export default function SekbidPage() {
  const reduce = useReducedMotion();

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
            SEKBID
          </h1>
          <p className="text-xl md:text-2xl font-medium tracking-wide opacity-80 max-w-2xl leading-relaxed text-foreground">
            Jelajahi 10 Seksi Bidang (Sekbid) penggerak program kreativitas dan prestasi siswa OSIS SMAN 2 Babelan.
          </p>
        </motion.div>
      </section>

      {/* SEKBID ZIG-ZAG LIST */}
      <section className="w-full">
        <div className="flex flex-col border-t border-primary/10">
          {sekbidData.map((sekbid, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <motion.div 
                key={sekbid.id}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <Link href={`/sekbid/${sekbid.id}`} className="block group relative w-full border-b border-primary/10 bg-background hover:bg-primary active:scale-[0.99] transition-all duration-200 ease-out overflow-hidden">
                  
                  {/* Hover Background Image (Optional) */}
                  <div className="absolute inset-0 bg-slate-100 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ease-out mix-blend-multiply" />

                  <div className={cn(
                    "container mx-auto px-6 lg:px-12 py-10 lg:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10",
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  )}>
                    
                    {/* Number */}
                    <div className={cn(
                      "text-7xl md:text-9xl lg:text-[180px] leading-none font-thin tracking-tighter text-primary/10 group-hover:text-primary/20 transition-colors duration-200 ease-out shrink-0",
                      !isEven && "md:text-right"
                    )}>
                      {sekbid.id}.
                    </div>

                    {/* Title & Arrow */}
                    <div className={cn(
                      "flex flex-col gap-4 w-full max-w-3xl",
                      isEven ? "md:text-right md:items-end" : "md:text-left md:items-start"
                    )}>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase text-primary group-hover:text-white transition-colors duration-200 ease-out leading-[1.1]">
                        {sekbid.title}
                      </h2>
                      
                      <div className="flex items-center gap-3 text-primary group-hover:text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ease-out translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                        <span>EKSPLORASI SEKBID</span>
                        <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center backdrop-blur-sm">
                          <ArrowUpRightIcon className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
