"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from '@/lib/supabase';

// Taste Skill Dials
// DESIGN_VARIANCE: 6 (Editorial split-screen layout)
// MOTION_INTENSITY: 5 (Smooth scroll reveals)
// VISUAL_DENSITY: 3 (Airy, typographic rows instead of heavy cards)

export default function EventsPage() {
  const reduce = useReducedMotion();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setEvents(data);
    };
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col min-h-dvh font-sans selection:bg-primary selection:text-white bg-background pt-24 lg:pt-32">
      <div className="container mx-auto px-6 lg:px-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start pb-32">
          
          {/* LEFT COLUMN: Sticky Header & Filters */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-primary mb-6">
                Event<br />Hub
              </h1>
              <p className="text-lg md:text-xl font-medium tracking-wide opacity-80 max-w-sm mb-12 leading-relaxed">
                Pusat informasi kegiatan, perlombaan internal, dan acara sekolah.
              </p>
              
              {/* Optional: Minimalist Filters / Years */}
              <div className="hidden lg:flex flex-col gap-4">
                <span className="text-xs font-bold tracking-widest uppercase text-primary/50">Tahun Akademik</span>
                <ul className="flex flex-col gap-2">
                  <li>
                    <button className="text-xl font-bold text-primary hover:translate-x-2 transition-transform">
                      2026
                    </button>
                  </li>
                  <li>
                    <button className="text-xl font-medium text-foreground/40 hover:text-primary hover:translate-x-2 transition-all">
                      2025
                    </button>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Scrolling Event List */}
          <div className="lg:col-span-8 flex flex-col pt-8 lg:pt-0">
            {events.map((event, index) => {
              const dateParts = event.date ? event.date.split(' ') : ['-','-','-'];
              const d = dateParts[0] || '-';
              const m = dateParts[1] || '';
              const y = dateParts[2] || '';

              return (
              <Link href={event.registration_link || `#`} key={event.id} target={event.registration_link ? "_blank" : "_self"} className="group block">
                <motion.div 
                  className="flex flex-col md:flex-row gap-8 md:gap-12 py-10 md:py-16 border-t border-primary/20 transition-colors group-hover:bg-primary/3 -mx-6 px-6 lg:mx-0 lg:px-6 rounded-3xl relative overflow-hidden"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  
                  {/* Event Date (Large Display Typography) */}
                  <div className="md:w-32 flex flex-col shrink-0 relative z-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/50 mb-2">
                      {m} {y}
                    </span>
                    <span className="text-6xl md:text-7xl font-bold tracking-tighter text-primary leading-none group-hover:scale-105 transition-transform origin-left">
                      {d}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 flex flex-col justify-center relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-primary/10 text-primary">{event.category}</span>
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${event.status === 'completed' ? 'bg-slate-100 text-slate-500' : event.status === 'ongoing' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                        {event.status}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground mb-4 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-base text-foreground/70 mb-8 max-w-2xl leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-bold tracking-widest uppercase text-primary/70">
                      <span>{event.time}</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  {/* Hover Arrow Indicator */}
                  <div className="hidden md:flex flex-col items-center justify-center pl-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 relative z-10">
                    <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <ArrowRightIcon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    {event.registration_link && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-4 text-center">Daftar<br/>Sekarang</span>
                    )}
                  </div>

                  {/* Background Cover Image on Hover */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-10 transition-opacity duration-700 mix-blend-multiply pointer-events-none"
                    style={{ backgroundImage: `url('${event.image}')` }}
                  />

                </motion.div>
              </Link>
            )})}
            
            {/* End of list marker */}
            <motion.div 
              className="py-12 border-t border-primary/20 flex justify-center opacity-50"
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
