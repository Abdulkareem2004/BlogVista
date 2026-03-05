'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ArrowLeft, Send, Sparkles, Loader2, Eye, PenLine, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { generateBlogSummary } from '@/ai/flows/generate-blog-summary';
import { format } from 'date-fns';

export default function NewBlogPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [isPending, setIsPending] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('write');

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
        // AI failure shouldn't block the write, but we handle it gracefully
      }
    }

    const now = new Date().toISOString();
    const blogData = {
      id: blogId,
      userId: user.uid,
      title,
      slug,
      content,
      summary,
      isPublished,
      createdAt: now,
      updatedAt: now,
    };

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
        },
        likeCount: 0,
        commentCount: 0,
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
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-headline font-bold mb-2">Create Story</h1>
              <p className="text-muted-foreground">Share your unique perspective with the BlogVista community.</p>
            </div>
            <TabsList className="grid w-64 grid-cols-2 rounded-full p-1 bg-muted/50">
              <TabsTrigger value="write" className="rounded-full gap-2">
                <PenLine className="w-4 h-4" /> Write
              </TabsTrigger>
              <TabsTrigger value="preview" className="rounded-full gap-2">
                <Eye className="w-4 h-4" /> Preview
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="write" className="animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-base font-bold">Story Title</Label>
                    <Input 
                      id="title" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What's on your mind?" 
                      required 
                      className="text-2xl h-14 bg-background/50 border-none shadow-sm font-headline font-bold focus-visible:ring-primary/20"
                      suppressHydrationWarning
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="content" className="text-base font-bold">Content</Label>
                    <Textarea 
                      id="content" 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start writing your masterpiece..." 
                      required 
                      className="min-h-[500px] text-lg leading-relaxed bg-background/50 resize-none p-8 border-none shadow-sm focus-visible:ring-primary/20"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-primary/5 rounded-3xl border border-primary/10 gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <Label htmlFor="isPublished" className="text-lg font-bold cursor-pointer">Ready to publish?</Label>
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                      </div>
                      <p className="text-sm text-muted-foreground">Publishing will make this story public and generate an AI summary.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Status</span>
                        <span className="text-sm font-medium">{isPublished ? 'Public' : 'Draft'}</span>
                      </div>
                      <Switch 
                        id="isPublished" 
                        checked={isPublished} 
                        onCheckedChange={setIsPublished}
                        className="scale-125"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" disabled={isPending || !title || !content} className="px-12 h-14 gap-3 rounded-full text-lg shadow-xl shadow-primary/20" suppressHydrationWarning>
                      {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> {isPublished ? 'Publish Story' : 'Save as Draft'}</>}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-2xl overflow-hidden bg-card">
              <div className="aspect-[21/9] bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 flex-col gap-2">
                   <Eye className="w-12 h-12" />
                   <span className="font-bold">Cover Preview</span>
                </div>
              </div>
              <CardContent className="p-8 md:p-16">
                <div className="max-w-2xl mx-auto space-y-8">
                  <header className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {user.displayName?.charAt(0) || 'A'}
                      </div>
                      <div className="text-sm">
                        <div className="font-bold">{user.displayName || 'Author Name'}</div>
                        <div className="text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" /> {format(new Date(), 'MMMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
                      {title || 'Untitled Story'}
                    </h1>
                  </header>
                  <div className="prose prose-lg max-w-none text-foreground/80 whitespace-pre-wrap">
                    {content || 'Your story content will appear here...'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
