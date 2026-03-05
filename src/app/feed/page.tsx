
'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { BlogCard } from '@/components/blog/BlogCard';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Newspaper, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function FeedPage() {
  const db = useFirestore();
  const [searchQuery, setSearchQuery] = useState('');

  const blogsQuery = useMemoFirebase(() => {
    return query(collection(db, 'public_blogs'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: blogs, isLoading } = useCollection(blogsQuery);

  const filteredBlogs = blogs?.filter(blog => 
    blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Newspaper className="w-6 h-6" />
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
          <div className="text-center py-24 bg-card/50 rounded-3xl border-2 border-dashed border-muted">
            <h3 className="text-2xl font-bold font-headline mb-2 text-muted-foreground">No stories found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">Try a different search term or check back later for new updates from our writers.</p>
          </div>
        )}
      </div>
    </div>
  );
}
