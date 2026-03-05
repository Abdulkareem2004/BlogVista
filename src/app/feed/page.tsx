
import { db } from '@/lib/db';
import { BlogCard } from '@/components/blog/BlogCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default async function FeedPage() {
  const blogs = await db.blogs.findMany();
  const publishedBlogs = blogs.filter(b => b.isPublished);

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
            />
          </div>
        </header>

        {publishedBlogs.length > 0 ? (
          <div className="grid gap-8">
            {publishedBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed">
            <h3 className="text-xl font-bold font-headline mb-2">No stories yet</h3>
            <p className="text-muted-foreground">Check back soon for new content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
