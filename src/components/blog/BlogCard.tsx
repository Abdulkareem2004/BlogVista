
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function BlogCard({ blog }: { blog: any }) {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  
  const cardPlaceholder = PlaceHolderImages.find(img => img.id === 'blog-card');
  const imageUrl = cardPlaceholder?.imageUrl.replace('/seed/card/', `/seed/${blog.id || blog.slug}/`);

  useEffect(() => {
    if (blog.createdAt) {
      try {
        setFormattedDate(formatDistanceToNow(new Date(blog.createdAt)));
      } catch (e) {
        setFormattedDate('recently');
      }
    }
  }, [blog.createdAt]);

  const authorName = typeof blog.author === 'object' ? blog.author.name : (blog.author || 'Anonymous');

  return (
    <Link href={`/blog/${blog.slug}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-sm bg-card/50">
        <div className="aspect-[2/1] relative overflow-hidden">
          {imageUrl && (
            <Image 
              src={imageUrl} 
              alt={blog.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              data-ai-hint={cardPlaceholder?.imageHint}
            />
          )}
          <div className="absolute top-4 right-4">
            <Badge className="bg-background/80 backdrop-blur text-foreground border-none px-3 py-1">
              {authorName}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="space-y-2 p-6">
          <h3 className="text-2xl font-headline font-bold leading-snug group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {blog.summary || (blog.content ? blog.content.substring(0, 150) + '...' : '')}
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-0 flex items-center justify-between text-muted-foreground text-xs font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 bg-accent/5 px-2 py-1 rounded-md">
              <Heart className="w-4 h-4 text-destructive" />
              <span className="text-foreground">{blog.likeCount || 0}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-md">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-foreground">{blog.commentCount || 0}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 opacity-60">
            <Clock className="w-3 h-3" />
            {formattedDate ? `${formattedDate} ago` : 'Loading...'}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
