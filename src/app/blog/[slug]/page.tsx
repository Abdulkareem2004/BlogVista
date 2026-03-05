'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageSquare, Share2, ArrowLeft, Loader2, Calendar } from 'lucide-react';
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
      setPublishDate(format(new Date(blog.createdAt), 'MMMM d, yyyy'));
    }
  }, [blog?.createdAt]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  if (!blog) {
    notFound();
  }

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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-3xl mx-auto">
          <Link href="/feed">
            <Button variant="ghost" size="sm" className="mb-6 gap-2 text-white hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" /> Back to Feed
            </Button>
          </Link>

          <div className="bg-card rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-border/50">
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {blog.author?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <div className="font-bold text-lg">{blog.author?.name || 'Anonymous Author'}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {publishDate || 'Loading date...'}
                  </div>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-headline font-bold leading-tight mb-6">
                {blog.title}
              </h1>
              {blog.summary && (
                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 text-primary italic leading-relaxed mb-8">
                  <span className="font-bold not-italic text-xs uppercase tracking-widest block mb-2 opacity-70">AI Summary</span>
                  {blog.summary}
                </div>
              )}
            </header>

            <div className="prose prose-lg max-w-none prose-headings:font-headline prose-p:leading-relaxed text-foreground/90">
              {blog.content.split('\n').map((para: string, i: number) => (
                <p key={i} className="mb-6">{para}</p>
              ))}
            </div>

            <Separator className="my-10" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary transition-all group">
                  <Heart className="w-5 h-5 group-active:scale-125 transition-transform" />
                  <span>{blog.likeCount || 0}</span>
                </Button>
                <Button variant="ghost" className="gap-2 rounded-full">
                  <MessageSquare className="w-5 h-5" />
                  <span>{blog.commentCount || 0}</span>
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
