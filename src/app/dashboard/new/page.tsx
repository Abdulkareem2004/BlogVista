
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createBlog } from '@/lib/actions/blog';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function NewBlogPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(event.currentTarget);
    formData.append('isPublished', String(isPublished));
    formData.append('userId', 'u1'); // Simulated current user

    try {
      await createBlog(formData, 'u1');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <Card className="border-none shadow-xl bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-headline font-bold">New Story</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="Enter a catchy title..." 
                  required 
                  className="text-lg h-12 bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  placeholder="Tell your story..." 
                  required 
                  className="min-h-[400px] text-lg leading-relaxed bg-background resize-none p-6"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-accent/5 rounded-2xl border border-accent/20 gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
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
                <Button type="submit" size="lg" disabled={isPending} className="px-10 h-12 gap-2">
                  {isPending ? 'Publishing...' : <><Send className="w-4 h-4" /> Publish Story</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
