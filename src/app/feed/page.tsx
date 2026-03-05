'use client';

import { collection, query, orderBy, doc, setDoc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { BlogCard } from '@/components/blog/BlogCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Newspaper, Sparkles, Database } from 'lucide-react';
import { useState } from 'react';
import { SAMPLE_BLOGS } from '@/lib/seed-data';
import { toast } from '@/hooks/use-toast';

export default function FeedPage() {
  const db = useFirestore();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  const blogsQuery = useMemoFirebase(() => {
    return query(collection(db, 'public_blogs'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: blogs, isLoading } = useCollection(blogsQuery);

  const filteredBlogs = blogs?.filter(blog => 
    blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleSeedData() {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to seed the feed.",
      });
      return;
    }

    setIsSeeding(true);
    
    // Iterate through sample blogs and initiate non-blocking writes to BOTH locations
    SAMPLE_BLOGS.forEach((blog) => {
      const blogId = Math.random().toString(36).substr(2, 9);
      
      const blogData = {
        ...blog,
        id: blogId,
        userId: user.uid,
        updatedAt: blog.createdAt,
        author: {
          id: user.uid,
          name: user.displayName || 'Demo Writer',
          email: user.email,
        }
      };

      // 1. Write to private dashboard
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

      // 2. Write to public feed
      const publicDocRef = doc(db, 'public_blogs', blogId);
      setDoc(publicDocRef, blogData)
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: publicDocRef.path,
            operation: 'create',
            requestResourceData: blogData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    });

    toast({
      title: "Seeding initiated",
      description: "Sample blog posts are being added to your dashboard and the public feed.",
    });
    
    setIsSeeding(false);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              < Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-headline font-bold">Community Feed</h1>
              <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Discover expert perspectives on AI, JS, and Cloud.
              </p>
            </div>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search stories..." 
              className="pl-10 bg-card border-none shadow-sm h-12 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suppressHydrationWarning
            />
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
          </div>
        ) : filteredBlogs && filteredBlogs.length > 0 ? (
          <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card/50 rounded-3xl border-2 border-dashed border-muted flex flex-col items-center">
            <Database className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-2xl font-bold font-headline mb-2 text-muted-foreground">No stories found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-8">
              The public feed is currently empty. You can seed it with sample data to see how it looks.
            </p>
            <Button 
              onClick={handleSeedData} 
              disabled={isSeeding}
              className="rounded-full gap-2 px-8 h-12 shadow-lg shadow-primary/20"
              suppressHydrationWarning
            >
              {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              Seed Sample Feed
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}