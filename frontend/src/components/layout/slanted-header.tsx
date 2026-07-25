"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface SlantedHeaderProps {
  title: React.ReactNode;
  titleClassName?: string;
  subtitle?: string;
  description: string;
  imageSrc?: string;
  videoSrc?: string;
  watermark?: string;
  children?: React.ReactNode;
}

export function SlantedHeader({ title, titleClassName, subtitle, description, imageSrc, videoSrc, watermark, children }: SlantedHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Animasi Mundur & Gelap (Scale Down & Fade) hanya untuk teks
  const scaleText = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacityText = useTransform(scrollYProgress, [0, 1], [1, 0.1]);

  return (
    <div ref={containerRef} className="relative w-full bg-primary">
      {/* 
        STICKY HERO CONTAINER
        Tetap menempel di atas layar, dan berada di belakang konten utama.
      */}
      <div className="sticky top-0 w-full h-screen overflow-hidden z-0">
        
        {/* HEADER BACKGROUND (Blue or Image or Video) */}
        <div className="absolute inset-0 bg-primary flex flex-col pt-24 lg:pt-32 pb-16 lg:pb-24">
          
          {/* VIDEO BACKGROUND (Highest Priority) */}
          {videoSrc && (
            <>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={videoSrc} />
              </video>
              <div className="absolute inset-0 bg-black/50" />
            </>
          )}

          {/* IMAGE BACKGROUND (Highest Priority for LCP) */}
          {!videoSrc && imageSrc && (
            <>
              <img 
                src={imageSrc} 
                alt="Latar Belakang SMAN 2 Babelan" 
                fetchPriority="high" 
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover object-center" 
              />
              <div className="absolute inset-0 bg-black/40" />
            </>
          )}

          {/* TEXT CONTENT (Scales down and fades out to create depth) */}
          <motion.div 
            style={{ scale: scaleText, opacity: opacityText }}
            className="container mx-auto px-6 lg:px-12 flex flex-col text-white h-full justify-start origin-top relative z-10"
          >
            <h1 className={titleClassName || "text-7xl md:text-[100px] lg:text-[150px] font-normal tracking-tighter leading-[0.8] uppercase wrap-break-word mb-16 lg:mb-24"}>
              {title}
            </h1>
            
            <div className="flex justify-between items-end mt-auto">
              <div className="max-w-3xl">
                {subtitle && (
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-tight uppercase mb-6">
                    {subtitle}
                  </h2>
                )}
                <p className="text-base lg:text-lg font-normal tracking-wide opacity-90 leading-relaxed">
                  {description}
                </p>
              </div>
              <div className="hidden md:block pb-2">
                 <ArrowRight className="w-16 h-16" strokeWidth={1} />
              </div>
            </div>
          </motion.div>

          {/* GIANT WATERMARK */}
          {watermark && (
            <div className="absolute -bottom-6 md:-bottom-12 right-4 md:right-16 z-0 pointer-events-none select-none">
              <span className="text-[200px] md:text-[380px] lg:text-[480px] font-black text-white/35 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] leading-none tracking-tighter">
                {watermark}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 
        MAIN CONTENT WRAPPER
        Konten halaman putih yang akan menimpa hero section dari bawah.
      */}
      <div className="relative z-10 w-full min-h-screen bg-background">
        {children}
      </div>
    </div>
  );
}
