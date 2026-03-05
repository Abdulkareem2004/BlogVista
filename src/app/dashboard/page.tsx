'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Eye, Loader2, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const userBlogsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'users', user.uid, 'blogs'), orderBy('updatedAt', 'desc'));
  }, [db, user]);

  const { data: userBlogs, isLoading: isBlogsLoading } = useCollection(userBlogsQuery);

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 bg-card p-8 rounded-3xl shadow-sm border border-border/50">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Writer's Hub</h1>
            <p className="text-muted-foreground">Welcome back, {user.displayName || 'Writer'}. Manage your creative pieces here.</p>
          </div>
          <Link href="/dashboard/new">
            <Button size="lg" className="h-14 px-8 gap-2 rounded-full shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5" /> Create New Story
            </Button>
          </Link>
        </header>

        <div className="grid gap-6">
          {isBlogsLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary opacity-30" />
            </div>
          ) : userBlogs && userBlogs.length > 0 ? (
            userBlogs.map((blog) => (
              <BlogRow key={blog.id} blog={blog} />
            ))
          ) : (
            <div className="text-center py-24 bg-card/50 rounded-3xl border-2 border-dashed border-muted flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-2">Your shelf is empty</h3>
              <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Start your writing journey today and share your unique perspective with the world.</p>
              <Link href="/dashboard/new">
                <Button variant="outline" className="gap-2 rounded-full h-12 px-6">
                  <Plus className="w-5 h-5" /> Write Your First Story
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BlogRow({ blog }: { blog: any }) {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    if (blog.updatedAt) {
      setFormattedDate(format(new Date(blog.updatedAt), 'MMM d, yyyy'));
    }
  }, [blog.updatedAt]);

  return (
    <Card className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all duration-300 bg-card border-none shadow-sm group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-3">
          {blog.isPublished ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none px-3 py-1">Published</Badge>
          ) : (
            <Badge variant="outline" className="px-3 py-1">Draft</Badge>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <Calendar className="w-3 h-3" />
            {formattedDate || '...'}
          </span>
        </div>
        <h3 className="text-xl font-bold font-headline truncate mb-2 group-hover:text-primary transition-colors">{blog.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-1 leading-relaxed">{blog.summary || blog.content}</p>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <Link href={`/blog/${blog.slug}`}>
          <Button variant="outline" size="icon" className="rounded-full h-11 w-11 hover:bg-primary/5 hover:text-primary border-muted transition-colors" title="View Story">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
        <Button variant="outline" size="icon" className="rounded-full h-11 w-11 hover:bg-primary/5 hover:text-primary border-muted transition-colors" title="Edit Story">
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full h-11 w-11 text-destructive hover:bg-destructive/5 hover:text-destructive border-muted transition-colors" title="Delete Story">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
