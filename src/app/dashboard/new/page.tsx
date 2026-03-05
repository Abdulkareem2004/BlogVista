'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ArrowLeft, Send, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { generateBlogSummary } from '@/ai/flows/generate-blog-summary';

export default function NewBlogPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [isPending, setIsPending] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;
    
    setIsPending(true);
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const blogId = Math.random().toString(36).substr(2, 9);
    
    let summary = '';
    if (isPublished) {
      try {
        const res = await generateBlogSummary({ content });
        summary = res.summary;
      } catch (e) {
        console.warn("AI summary failed", e);
      }
    }

    const blogData = {
      id: blogId,
      userId: user.uid,
      title,
      slug,
      content,
      summary,
      isPublished,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Initiate non-blocking Firestore writes
    const privateDocRef = doc(db, 'users', user.uid, 'blogs', blogId);
    setDoc(privateDocRef, blogData)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: privateDocRef.path,
          operation: 'create',
          requestResourceData: blogData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    
    if (isPublished) {
      const publicBlogData = {
        ...blogData,
        author: {
          id: user.uid,
          name: user.displayName || 'Author',
          email: user.email,
        }
      };
      const publicDocRef = doc(db, 'public_blogs', blogId);
      setDoc(publicDocRef, publicBlogData)
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: publicDocRef.path,
            operation: 'create',
            requestResourceData: publicBlogData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    }
    
    // Proceed immediately to dashboard leveraging local optimistic cache
    router.push('/dashboard');
  }

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-headline font-bold">New Story</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a catchy title..." 
                  required 
                  className="text-lg h-12 bg-background border-none shadow-sm"
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell your story..." 
                  required 
                  className="min-h-[400px] text-lg leading-relaxed bg-background resize-none p-6 border-none shadow-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-accent/5 rounded-2xl border border-accent/20 gap-4">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Label htmlFor="isPublished" className="text-base cursor-pointer">Publish immediately</Label>
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">This will generate an AI summary for your post.</p>
                </div>
                <Switch 
                  id="isPublished" 
                  checked={isPublished} 
                  onCheckedChange={setIsPublished} 
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" disabled={isPending} className="px-10 h-12 gap-2 rounded-full" suppressHydrationWarning>
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Publish Story</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
