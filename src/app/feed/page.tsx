'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { BlogCard } from '@/components/blog/BlogCard';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function FeedPage() {
  const db = useFirestore();
  const [searchQuery, setSearchQuery] = useState('');

  const blogsQuery = useMemoFirebase(() => {
    return query(collection(db, 'public_blogs'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: blogs, isLoading } = useCollection(blogsQuery);

  const filteredBlogs = blogs?.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Explore Feed</h1>
            <p className="text-muted-foreground">Discover the latest thoughts from our global community.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search stories..." 
              className="pl-10 bg-card border-none shadow-sm h-11"
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
          <div className="grid gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed">
            <h3 className="text-xl font-bold font-headline mb-2">No stories found</h3>
            <p className="text-muted-foreground">Try adjusting your search or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
