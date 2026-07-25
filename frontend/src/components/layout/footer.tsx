import React from 'react';
import Link from 'next/link';

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export function Footer() {
  return (
    <footer className="w-full bg-background pt-20 lg:pt-32 pb-12 border-t-2 border-primary/10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* LEFT SIDE: LOGO, MOTTO & ADDRESS */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <img 
              src="/images/logo_babelan2.png" 
              alt="Logo SMAN 2 Babelan" 
              className="w-32 h-32 lg:w-44 lg:h-44 object-contain mb-8" 
            />
            <p className="text-primary text-2xl lg:text-3xl leading-[1.15] font-bold tracking-tight uppercase mb-8 max-w-xl">
              SEKOLAH UNGGUL BERAKHLAKKUL KHARIMAH, BERPRESTASI, KREATIF DAN BERKEBINEKAAN GLOBAL.
            </p>
            <div className="text-primary/90 text-sm font-medium leading-relaxed max-w-md border-l-2 border-primary pl-4 py-1">
              <p className="font-bold uppercase tracking-wider mb-1">Alamat Sekolah:</p>
              <p>Perumahan Babelan Mas Permai No. 366-367, Kec. Babelan, Kabupaten Bekasi, Jawa Barat</p>
            </div>
          </div>

          {/* RIGHT SIDE: LINKS & SOCIAL */}
          <div className="lg:col-span-7 flex flex-col pt-4 lg:pt-8">
            
            {/* LINKS COLUMNS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 mb-24">
              {/* Column 1 */}
              <div>
                <h3 className="text-foreground text-sm font-bold uppercase tracking-widest mb-8">
                  Tentang Kami
                </h3>
                <ul className="space-y-4">
                  <li><Link href="/profil" className="text-foreground text-[15px] hover:text-primary transition-colors">Profil Sekolah</Link></li>
                  <li><Link href="/profil#visi-misi" className="text-foreground text-[15px] hover:text-primary transition-colors">Visi & Misi</Link></li>
                  <li><Link href="#" className="text-foreground text-[15px] hover:text-primary transition-colors">Fasilitas</Link></li>
                  <li><Link href="#" className="text-foreground text-[15px] hover:text-primary transition-colors">Tenaga Pendidik</Link></li>
                  <li><Link href="#" className="text-foreground text-[15px] hover:text-primary transition-colors">Hubungi Kami</Link></li>
                </ul>
              </div>

              {/* Column 2 */}
              <div>
                <h3 className="text-foreground text-sm font-bold uppercase tracking-widest mb-8">
                  Program & Ekskul
                </h3>
                <ul className="space-y-4">
                  <li><Link href="#" className="text-foreground text-[15px] hover:text-primary transition-colors">Kurikulum Merdeka</Link></li>
                  <li><Link href="/ekskul" className="text-foreground text-[15px] hover:text-primary transition-colors">Ekstrakurikuler</Link></li>
                  <li><Link href="#" className="text-foreground text-[15px] hover:text-primary transition-colors">Organisasi Siswa</Link></li>
                  <li><Link href="#" className="text-foreground text-[15px] hover:text-primary transition-colors">Prestasi</Link></li>
                </ul>
              </div>

              {/* Column 3 */}
              <div>
                <h3 className="text-foreground text-sm font-bold uppercase tracking-widest mb-8">
                  Layanan Publik
                </h3>
                <ul className="space-y-4">
                  <li><Link href="/events" className="text-foreground text-[15px] hover:text-primary transition-colors">Event Hub & Agenda</Link></li>
                  <li><Link href="/dokumen" className="text-foreground text-[15px] hover:text-primary transition-colors">Pusat Unduhan</Link></li>
                  <li><Link href="#" className="text-foreground text-[15px] hover:text-primary transition-colors">Portal Akademik</Link></li>
                  <li><Link href="/#galeri" className="text-foreground text-[15px] hover:text-primary transition-colors">Galeri Kegiatan</Link></li>
                </ul>
              </div>
            </div>

            {/* SOCIAL MEDIA & BOTTOM LINKS */}
            <div className="mt-auto">
              <div className="flex gap-4 mb-8">
                <a href="#" aria-label="Facebook" className="w-12 h-12 rounded-full border border-foreground/30 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all hover:scale-110 shadow-sm">
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Instagram" className="w-12 h-12 rounded-full border border-foreground/30 flex items-center justify-center hover:bg-linear-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:text-white transition-all hover:scale-110 shadow-sm">
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a href="#" aria-label="LinkedIn" className="w-12 h-12 rounded-full border border-foreground/30 flex items-center justify-center hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white transition-all hover:scale-110 shadow-sm">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a href="#" aria-label="YouTube" className="w-12 h-12 rounded-full border border-foreground/30 flex items-center justify-center hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white transition-all hover:scale-110 shadow-sm">
                  <YoutubeIcon className="w-5 h-5" />
                </a>
              </div>
              
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                <Link href="#" className="text-[13px] font-bold tracking-tight hover:text-primary">Kebijakan Privasi</Link>
                <Link href="#" className="text-[13px] font-bold tracking-tight hover:text-primary">Syarat & Ketentuan</Link>
                <Link href="#" className="text-[13px] font-bold tracking-tight hover:text-primary">Peta Situs</Link>
                <Link href="#" className="text-[13px] font-bold tracking-tight hover:text-primary">Login Admin</Link>
              </div>
            </div>

          </div>
        </div>

        {/* COPYRIGHT LINE */}
        <div className="mt-20 pt-8 border-t border-foreground/20">
          <p className="text-[13px] font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} SMAN 2 BABELAN. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
