
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { generateBlogSummary } from '@/ai/flows/generate-blog-summary';

export async function createBlog(formData: FormData, userId: string) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const isPublished = formData.get('isPublished') === 'true';
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const user = await db.users.findById(userId);
  if (!user) throw new Error('User not found');

  // Trigger summary generation if published
  let summary = '';
  if (isPublished) {
    try {
      const res = await generateBlogSummary({ content });
      summary = res.summary;
    } catch (e) {
      console.error("AI summary failed", e);
    }
  }

  const blog = await db.blogs.create({
    userId,
    title,
    content,
    isPublished,
    slug,
    summary,
    author: user,
    _count: { likes: 0, comments: 0 }
  });

  revalidatePath('/feed');
  revalidatePath('/dashboard');
  return blog;
}

export async function toggleLike(blogId: string, userId: string) {
  await db.likes.toggle(userId, blogId);
  revalidatePath(`/feed`);
  revalidatePath(`/blog/${blogId}`);
}

export async function addComment(blogId: string, userId: string, content: string) {
  const user = await db.users.findById(userId);
  if (!user) throw new Error('User not found');

  await db.comments.create({
    blogId,
    userId,
    content,
    author: user
  });

  revalidatePath(`/blog/${blogId}`);
}
