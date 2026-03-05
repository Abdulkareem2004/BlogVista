
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function BlogCard({ blog }: { blog: Blog }) {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const imageUrl = `https://picsum.photos/seed/${blog.id}/800/400`;

  useEffect(() => {
    // Calculate distance to now only after mounting on the client
    setFormattedDate(formatDistanceToNow(new Date(blog.createdAt)));
  }, [blog.createdAt]);

  return (
    <Link href={`/blog/${blog.slug}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-sm bg-card/50">
        <div className="aspect-[2/1] relative overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={blog.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            data-ai-hint="blog image"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-background/80 backdrop-blur text-foreground border-none">
              {blog.author.name}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="space-y-2 p-6">
          <h3 className="text-xl font-headline font-bold leading-snug group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {blog.summary || blog.content.substring(0, 150) + '...'}
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-0 flex items-center justify-between text-muted-foreground text-xs font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-destructive" />
              {blog._count?.likes || 0}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              {blog._count?.comments || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {formattedDate ? `${formattedDate} ago` : 'Loading...'}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
