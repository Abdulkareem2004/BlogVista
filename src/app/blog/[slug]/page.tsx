'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageSquare, Share2, ArrowLeft, Loader2, Calendar, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const db = useFirestore();
  const [publishDate, setPublishDate] = useState<string>('');

  const blogQuery = useMemoFirebase(() => {
    return query(collection(db, 'public_blogs'), where('slug', '==', slug), limit(1));
  }, [db, slug]);

  const { data: blogs, isLoading } = useCollection(blogQuery);
  const blog = blogs?.[0];

  useEffect(() => {
    if (blog?.createdAt) {
      try {
        setPublishDate(format(new Date(blog.createdAt), 'MMMM d, yyyy'));
      } catch (e) {
        setPublishDate('Recently');
      }
    }
  }, [blog?.createdAt]);

  // Show loader while initial fetch is happening
  if (isLoading || blogs === null) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  // If loading is done and we still have no data
  if (!blog) {
    notFound();
  }

  // Handle both object and string formats for author
  const authorName = typeof blog.author === 'object' ? blog.author.name : (blog.author || 'Anonymous');

  return (
    <article className="pb-24">
      <div className="aspect-[21/9] relative w-full overflow-hidden">
        <Image 
          src={`https://picsum.photos/seed/${blog.id}/1920/1080`} 
          alt={blog.title} 
          fill 
          className="object-cover"
          priority
          data-ai-hint="blog header"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Link href="/feed">
            <Button variant="ghost" size="sm" className="mb-6 gap-2 text-white hover:text-white hover:bg-white/10 rounded-full backdrop-blur-md px-6">
              <ArrowLeft className="w-4 h-4" /> Back to Feed
            </Button>
          </Link>

          <div className="bg-card rounded-[2.5rem] shadow-2xl p-8 md:p-16 mb-12 border border-border/50">
            <header className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary text-xl">
                    {authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{authorName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {publishDate || 'Loading...'}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 5 min read</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-headline font-bold leading-tight mb-8">
                {blog.title}
              </h1>
              
              {blog.summary && (
                <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 text-primary italic text-lg leading-relaxed relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-12 h-12" />
                  </div>
                  <span className="font-bold not-italic text-xs uppercase tracking-[0.2em] block mb-3 opacity-70">AI Perspective</span>
                  {blog.summary}
                </div>
              )}
            </header>

            <div className="prose prose-lg max-w-none prose-headings:font-headline prose-p:leading-relaxed text-foreground/90 prose-p:mb-8">
              {blog.content.split('\n').map((para: string, i: number) => (
                para.trim() && <p key={i}>{para}</p>
              ))}
            </div>

            <Separator className="my-12" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" className="h-14 px-8 gap-3 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary transition-all group">
                  <Heart className="w-6 h-6 group-active:scale-125 transition-transform" />
                  <span className="font-bold text-lg">{blog.likeCount || 0}</span>
                </Button>
                <Button variant="ghost" className="h-14 px-8 gap-3 rounded-full hover:bg-accent/5">
                  <MessageSquare className="w-6 h-6" />
                  <span className="font-bold text-lg">{blog.commentCount || 0}</span>
                </Button>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm font-medium">Shared from BlogVista</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
