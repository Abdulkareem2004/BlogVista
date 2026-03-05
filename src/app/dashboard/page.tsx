'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Eye, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-1">Your Dashboard</h1>
            <p className="text-muted-foreground">Manage your articles and view analytics.</p>
          </div>
          <Link href="/dashboard/new">
            <Button className="h-12 px-6 gap-2 rounded-full">
              <Plus className="w-5 h-5" /> New Story
            </Button>
          </Link>
        </header>

        <div className="grid gap-4">
          {isBlogsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary opacity-30" />
            </div>
          ) : userBlogs && userBlogs.length > 0 ? (
            userBlogs.map((blog) => (
              <Card key={blog.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow bg-card/50 border-none shadow-sm">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {blog.isPublished ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Published</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">Last updated {format(new Date(blog.updatedAt), 'MMM d, yyyy')}</span>
                  </div>
                  <h3 className="text-xl font-bold font-headline truncate mb-1">{blog.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-1">{blog.summary || blog.content}</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/blog/${blog.slug}`}>
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10 text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed">
              <p className="text-muted-foreground mb-6">You haven't written any stories yet.</p>
              <Link href="/dashboard/new">
                <Button variant="outline" className="gap-2 rounded-full">
                  <Plus className="w-4 h-4" /> Create your first blog
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
