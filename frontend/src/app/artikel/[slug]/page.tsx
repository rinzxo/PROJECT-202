"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeftIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Article = {
  id: string;
  category: string;
  title: string;
  slug: string;
  cover_image: string;
  excerpt: string;
  content: string;
  created_at: string;
};

export default function ArtikelDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error || !data) {
        console.error('Error fetching article:', error);
        router.push('/');
      } else {
        setArticle(data);
      }
      setIsLoading(false);
    };

    if (slug) fetchArticle();
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) return null;

  // Format date
  const dateObj = new Date(article.created_at);
  const formattedDate = dateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary selection:text-white pt-24 pb-32">
      <div className="container mx-auto px-6 lg:px-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium mb-12">
          <ArrowLeftIcon className="w-5 h-5" /> Kembali ke Beranda
        </Link>
        
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-sm font-bold tracking-widest uppercase">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full flex items-center gap-2">
                <TagIcon className="w-4 h-4" /> {article.category}
              </span>
              <span className="text-slate-400 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> {formattedDate}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1] mb-6">
              {article.title}
            </h1>
            
            {article.excerpt && (
              <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl md:mx-0 mx-auto">
                {article.excerpt}
              </p>
            )}
          </header>

          {/* Cover Image */}
          <div className="w-full aspect-21/9 md:aspect-video rounded-3xl overflow-hidden bg-slate-200 mb-16 relative">
            <img 
              src={article.cover_image} 
              alt={article.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg md:prose-xl prose-slate max-w-none text-slate-800 leading-relaxed font-serif">
            {/* Since we don't have tailwind typography, we simulate it with whitespace-pre-wrap and some basic spacing */}
            <div className="whitespace-pre-wrap font-sans text-lg md:text-xl text-slate-700 leading-[1.8]">
              {article.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
