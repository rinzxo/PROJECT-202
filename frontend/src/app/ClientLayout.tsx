"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  
  const [showGlobalLoader, setShowGlobalLoader] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const videoEnded = useRef(false);

  const handleVideoEnd = () => {
    if (videoEnded.current) return;
    videoEnded.current = true;
    setIsFading(true);
    setTimeout(() => setShowGlobalLoader(false), 1000);
  };

  useEffect(() => {
    // Hanya tampilkan loading screen video sekali per sesi di halaman publik
    if (!isAdmin && !sessionStorage.getItem('hasSeenIntro')) {
      setShowGlobalLoader(true);
      sessionStorage.setItem('hasSeenIntro', 'true');
      
      // Fallback jika video gagal load/bermasalah
      const timer = setTimeout(() => handleVideoEnd(), 5500);
      return () => clearTimeout(timer);
    }
  }, [isAdmin]);

  return (
    <>
      {showGlobalLoader && (
        <div className={`fixed inset-0 z-9999 bg-slate-900 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          <video 
            autoPlay 
            muted 
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover hidden sm:block"
            src="/videos/loading-landscape.mp4"
          />
          <video 
            autoPlay 
            muted 
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover sm:hidden"
            src="/videos/loading-portrait.mp4"
          />
        </div>
      )}
      {!isAdmin && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
