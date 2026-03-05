/**
 * @fileOverview Sample blog data provided by the user to seed the initial feed.
 */

export const SAMPLE_BLOGS = [
  {
    title: "The Future of AI in Software Development",
    slug: "future-of-ai-software-development",
    summary: "How AI tools are transforming coding and productivity.",
    content: "Artificial Intelligence is rapidly transforming the way developers build software. From automated code generation to intelligent debugging tools, AI is becoming a powerful assistant for engineers. Platforms like GitHub Copilot help developers write code faster by suggesting entire functions in seconds. In the future, AI will not replace developers but will augment their capabilities. Developers will spend more time designing systems and less time writing repetitive code. Understanding AI tools will become an essential skill for modern software engineers.",
    author: "Abdul Kareem",
    isPublished: true,
    likeCount: 12,
    commentCount: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    title: "10 JavaScript Tips Every Developer Should Know",
    slug: "javascript-tips-developers",
    summary: "Improve your JavaScript skills with these useful tips.",
    content: "JavaScript remains one of the most widely used programming languages in the world. To become a better developer, it's important to understand modern features such as arrow functions, destructuring, and async/await. Writing clean and readable code improves maintainability and team collaboration. Developers should also focus on understanding closures and event loops because they are core concepts in JavaScript. By mastering these fundamentals, developers can write more efficient and scalable applications.",
    author: "Sarah Johnson",
    isPublished: true,
    likeCount: 9,
    commentCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    title: "Why Every Developer Should Learn Linux",
    slug: "why-developers-should-learn-linux",
    summary: "Linux skills are essential for modern developers.",
    content: "Linux powers most servers across the internet. Understanding Linux commands such as ls, grep, chmod, and top can dramatically improve a developer's productivity. Many development environments, containers, and cloud servers rely on Linux systems. Developers who learn Linux gain better control over their environment and can troubleshoot issues more effectively. Learning Linux is not just for system administrators; it is a powerful skill for developers as well.",
    author: "David Kim",
    isPublished: true,
    likeCount: 15,
    commentCount: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    title: "Getting Started with Cloud Computing",
    slug: "cloud-computing-basics",
    summary: "A beginner's guide to understanding the cloud.",
    content: "Cloud computing allows developers to deploy applications without managing physical servers. Platforms such as AWS, Azure, and Google Cloud offer scalable infrastructure that grows with your application. Developers can quickly launch servers, databases, and storage services in minutes. Learning cloud technologies enables developers to build modern scalable systems and reach global users efficiently.",
    author: "Emily Chen",
    isPublished: true,
    likeCount: 7,
    commentCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
  {
    title: "Open Source: Why Contributing Matters",
    slug: "importance-of-open-source",
    summary: "How contributing to open source helps your career.",
    content: "Open source projects allow developers from around the world to collaborate and improve software together. Contributing to open source helps developers gain experience, improve coding skills, and build a strong portfolio. It also allows developers to learn from experienced engineers and become part of global communities. Many successful developers started their careers by contributing to open source projects.",
    author: "Michael Lee",
    isPublished: true,
    likeCount: 11,
    commentCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
  }
];
