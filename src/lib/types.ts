
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Blog {
  id: string;
  userId: string;
  title: string;
  slug: string;
  content: string;
  summary?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author: User;
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface Comment {
  id: string;
  blogId: string;
  userId: string;
  content: string;
  createdAt: string;
  author: User;
}

export interface Like {
  id: string;
  userId: string;
  blogId: string;
  createdAt: string;
}
