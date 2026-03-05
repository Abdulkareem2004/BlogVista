
import { Blog, User, Comment, Like } from './types';

// Mock DB initial state
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Rivera', email: 'alex@example.com', avatarUrl: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'u2', name: 'Sam Chen', email: 'sam@example.com', avatarUrl: 'https://picsum.photos/seed/user2/100/100' },
];

let blogs: Blog[] = [
  {
    id: 'b1',
    userId: 'u1',
    title: 'The Future of AI in Modern Development',
    slug: 'future-of-ai-modern-dev',
    content: 'Artificial Intelligence is reshaping how we build software...',
    summary: 'Exploration of how AI agents and LLMs are becoming integral parts of the developer workflow.',
    isPublished: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    author: MOCK_USERS[0],
    _count: { likes: 12, comments: 3 }
  },
  {
    id: 'b2',
    userId: 'u2',
    title: 'Building Scalable Next.js Applications',
    slug: 'building-scalable-nextjs',
    content: 'Next.js 15 brings powerful new features for scaling...',
    summary: 'A deep dive into server components, streaming, and caching strategies in Next.js 15.',
    isPublished: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    author: MOCK_USERS[1],
    _count: { likes: 8, comments: 1 }
  }
];

let comments: Comment[] = [
  { id: 'c1', blogId: 'b1', userId: 'u2', content: 'Great insights, Alex!', createdAt: new Date().toISOString(), author: MOCK_USERS[1] }
];

let likes: Like[] = [];

// Helper to simulate "DB" operations
export const db = {
  users: {
    findMany: async () => MOCK_USERS,
    findById: async (id: string) => MOCK_USERS.find(u => u.id === id),
  },
  blogs: {
    findMany: async () => [...blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    findBySlug: async (slug: string) => blogs.find(b => b.slug === slug),
    findById: async (id: string) => blogs.find(b => b.id === id),
    create: async (data: any) => {
      const newBlog = { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      blogs.push(newBlog);
      return newBlog;
    },
    update: async (id: string, data: any) => {
      blogs = blogs.map(b => b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b);
      return blogs.find(b => b.id === id);
    },
    delete: async (id: string) => {
      blogs = blogs.filter(b => b.id !== id);
    }
  },
  comments: {
    findByBlogId: async (blogId: string) => comments.filter(c => c.blogId === blogId),
    create: async (data: any) => {
      const newComment = { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
      comments.push(newComment);
      return newComment;
    }
  },
  likes: {
    toggle: async (userId: string, blogId: string) => {
      const existing = likes.find(l => l.userId === userId && l.blogId === blogId);
      if (existing) {
        likes = likes.filter(l => l.id !== existing.id);
        return false;
      } else {
        likes.push({ id: Math.random().toString(36).substr(2, 9), userId, blogId, createdAt: new Date().toISOString() });
        return true;
      }
    },
    count: async (blogId: string) => likes.filter(l => l.blogId === blogId).length
  }
};
