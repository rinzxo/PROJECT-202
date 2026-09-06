"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export default function AdminLoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '123456') {
      document.cookie = "admin_pin=123456; path=/; max-age=86400"; // 1 day expiration
      router.push('/admin');
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <LockClosedIcon className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-3xl font-black text-center tracking-tighter mb-2">Admin Akses</h1>
        <p className="text-center text-slate-400 mb-8 font-medium">Masukkan PIN rahasia untuk masuk ke Dashboard CMS.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-primary transition-colors"
            />
            {error && <p className="text-red-500 text-sm font-bold text-center mt-3">PIN Salah! Coba lagi.</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-colors active:scale-[0.98]"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
