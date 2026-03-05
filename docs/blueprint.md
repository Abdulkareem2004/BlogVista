# **App Name**: BlogVista

## Core Features:

- User Authentication & Authorization: Allow users to register, log in using JWT, and access protected dashboard routes with secure password hashing. Implement proper DTO validation and guard authenticated routes.
- Private Blog Management Dashboard: Authenticated users can create, edit, and delete their own blog posts, specifying title, content, and publication status. Ensure only the owner can modify posts.
- Public Blog Post Viewing: Provide public-facing URLs (/public/blogs/:slug) for published blog posts, ensuring only published content is accessible and proper 404 handling.
- Public Feed Display: Display a paginated, scrollable public feed of all published blogs, sorted by newest first, including author info, like, and comment counts.
- Like System: Allow authenticated users to like and unlike blog posts. Ensure users can only like a post once and that the updated like count is displayed.
- Comment System: Enable authenticated users to post and view comments on blog posts. Comments should be sorted by newest first and author information included.
- AI-Powered Blog Summary Tool: When a blog is published, a background job is triggered to use an AI tool to generate a concise summary for the blog post.

## Style Guidelines:

- Light color scheme emphasizing professionalism and readability for content consumption. The primary color will be a muted, stable blue (#2983CC), conveying trust and modernity. The background will be a very light blue-gray (#ECF3F7) for a clean canvas. An accent color of cyan (#44DBDB) will be used to highlight interactive elements and provide a modern pop.
- Headlines will use 'Space Grotesk' (sans-serif) for a modern, tech-inspired feel. Body text, where readability for extended content is paramount, will use 'Inter' (sans-serif), a neutral and highly readable font. For any code snippets, 'Source Code Pro' (monospace) will be used.
- Utilize a consistent set of minimal, outline-style vector icons (e.g., SVG icons) to maintain a clean and contemporary visual language across all interactive elements and content categories.
- A responsive, component-based layout will be implemented, focusing on clear content hierarchy and ample whitespace. Grid systems will ensure organized presentation of blogs, while fluid containers adapt to various screen sizes. Focus on reusable UI components (e.g., BlogCard, CommentItem, LikeButton) and intuitive navigation for both public and private sections.
- Subtle and performant animations for state changes such as loading states, success/error notifications, and interactive element hovers. Transitions will be kept minimal to ensure a smooth user experience without hindering performance or creating unnecessary re-renders.