
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = await db.blogs.findBySlug(params.slug);

  if (!blog || !blog.isPublished) {
    notFound();
  }

  const comments = await db.comments.findByBlogId(blog.id);

  return (
    <article className="pb-24">
      <div className="aspect-[21/9] relative w-full overflow-hidden">
        <Image 
          src={`https://picsum.photos/seed/${blog.id}/1920/1080`} 
          alt={blog.title} 
          fill 
          className="object-cover"
          priority
          data-ai-hint="header image"
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

          <div className="bg-card rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-sm">
                  {blog.author.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold">{blog.author.name}</div>
                  <div className="text-sm text-muted-foreground">Published on {format(new Date(blog.createdAt), 'MMMM d, yyyy')}</div>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-headline font-bold leading-tight mb-4">
                {blog.title}
              </h1>
              {blog.summary && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-primary italic leading-relaxed mb-6">
                  <span className="font-bold not-italic text-xs uppercase tracking-widest block mb-1 opacity-70">AI Summary</span>
                  {blog.summary}
                </div>
              )}
            </header>

            <div className="prose prose-lg max-w-none prose-headings:font-headline prose-p:leading-relaxed text-foreground/90">
              {blog.content.split('\n').map((para, i) => (
                <p key={i} className="mb-6">{para}</p>
              ))}
            </div>

            <Separator className="my-10" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary transition-all group">
                  <Heart className="w-5 h-5 group-active:scale-125 transition-transform" />
                  <span>{blog._count?.likes || 0}</span>
                </Button>
                <Button variant="ghost" className="gap-2 rounded-full">
                  <MessageSquare className="w-5 h-5" />
                  <span>{comments.length}</span>
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <section id="comments">
            <h3 className="text-2xl font-headline font-bold mb-8 flex items-center gap-3">
              Comments <span className="text-muted-foreground font-normal">({comments.length})</span>
            </h3>
            
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-card p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {comment.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{comment.author.name}</div>
                      <div className="text-[10px] text-muted-foreground">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}

              <div className="bg-card p-6 rounded-2xl border-2 border-dashed border-muted">
                <p className="text-center text-muted-foreground text-sm">
                  Sign in to join the conversation
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
