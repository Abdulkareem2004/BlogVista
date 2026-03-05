'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Eye, Loader2, Calendar, LayoutGrid, ArrowRight, MessageSquare, Heart, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

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

  const handleDelete = (blogId: string) => {
    if (!user) return;
    
    const blogRef = doc(db, 'users', user.uid, 'blogs', blogId);
    const publicRef = doc(db, 'public_blogs', blogId);

    deleteDoc(blogRef).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: blogRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });

    deleteDoc(publicRef).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: publicRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 bg-gradient-to-br from-card to-background p-10 rounded-[3rem] shadow-2xl shadow-primary/5 border border-border/50">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group hover:scale-110 transition-transform duration-500">
              <LayoutGrid className="w-10 h-10 group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                <Badge variant="outline" className="rounded-full bg-primary/5 border-primary/20 text-primary font-bold">WRITER DASHBOARD</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight" suppressHydrationWarning>
                Welcome, {user.displayName?.split(' ')[0] || 'Writer'}
              </h1>
              <p className="text-muted-foreground text-lg mt-2">Manage your creative journey and connect with your audience.</p>
            </div>
          </div>
          <Link href="/dashboard/new">
            <Button size="lg" className="h-16 px-10 text-lg gap-3 rounded-full shadow-2xl shadow-primary/20 hover:scale-105 transition-all" suppressHydrationWarning>
              <Plus className="w-6 h-6" /> Create New Story
            </Button>
          </Link>
        </header>

        <div className="grid gap-8">
          <div className="flex items-center justify-between px-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
                My Stories
                <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full text-muted-foreground" suppressHydrationWarning>
                  {userBlogs?.length || 0} Total
                </span>
              </h2>
            </div>
            <Link href="/feed" className="group text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-2 transition-colors">
              Community Feed <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isBlogsLoading ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-30">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-medium">Loading your stories...</p>
            </div>
          ) : userBlogs && userBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {userBlogs.map((blog) => (
                <BlogGridCard key={blog.id} blog={blog} onDelete={() => handleDelete(blog.id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-card/30 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-muted flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-8">
                <Plus className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-3xl font-headline font-bold mb-3">No stories yet</h3>
              <p className="text-muted-foreground mb-10 max-w-sm mx-auto text-lg leading-relaxed">
                Your voice matters. Start your writing journey by creating your first masterpiece today.
              </p>
              <Link href="/dashboard/new">
                <Button size="lg" variant="outline" className="gap-3 rounded-full h-14 px-8 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all" suppressHydrationWarning>
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

function BlogGridCard({ blog, onDelete }: { blog: any, onDelete: () => void }) {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    if (blog.updatedAt) {
      setFormattedDate(format(new Date(blog.updatedAt), 'MMM d, yyyy'));
    }
  }, [blog.updatedAt]);

  return (
    <Card className="flex flex-col h-full hover:shadow-2xl transition-all duration-500 bg-card border-none shadow-sm group overflow-hidden group">
      <div className="p-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          {blog.isPublished ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none px-4 py-1 rounded-full font-bold">Published</Badge>
          ) : (
            <Badge variant="outline" className="px-4 py-1 rounded-full font-bold border-muted-foreground/20 text-muted-foreground">Draft</Badge>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-bold uppercase tracking-wider" suppressHydrationWarning>
            <Calendar className="w-3 h-3" />
            {formattedDate || '...'}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold font-headline mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">{blog.title}</h3>
        
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-6">
          {blog.summary || (blog.content ? blog.content.substring(0, 150) + '...' : 'This story has no content yet.')}
        </p>

        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/60">
           <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {blog.likeCount || 0}</span>
           <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {blog.commentCount || 0}</span>
           {blog.summary && <span className="flex items-center gap-1.5 text-primary/80"><Sparkles className="w-3 h-3" /> AI Summary</span>}
        </div>
      </div>
      
      <div className="p-6 bg-muted/30 border-t flex items-center justify-end gap-3">
        {blog.isPublished && (
          <Link href={`/blog/${blog.slug}`}>
            <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-primary/10 hover:text-primary transition-all" title="View Publicly" suppressHydrationWarning>
              <Eye className="w-5 h-5" />
            </Button>
          </Link>
        )}
        <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-primary/10 hover:text-primary transition-all" title="Edit Story" suppressHydrationWarning>
          <Edit2 className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-12 w-12 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all" 
          title="Delete Story"
          onClick={() => {
            if(confirm('Are you sure you want to delete this story?')) onDelete();
          }}
          suppressHydrationWarning
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}
