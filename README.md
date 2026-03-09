BlogVista - Elevate Your Thoughts

BlogVista is a modern, high-performance blogging platform designed for writers who value security, aesthetics, and the power of AI. Built with the latest web technologies, it provides a seamless experience for both content creators and readers.

🚀 Features
AI-Powered Summaries**: Automatically generate concise summaries for your blog posts using Genkit and Gemini AI.
Secure Authentication**: Robust user sign-up and login powered by Firebase Authentication.
Personalized Dashboard**: A dedicated space for writers to manage their drafts and published stories.
Community Feed**: A high-performance public feed where readers can discover and engage with new content.
Real-time Engagement**: Built-in system for likes and comments, facilitating community building.
Modern UI/UX**: Clean, responsive design built with Shadcn UI and Tailwind CSS.
Dark Mode Support**: Aesthetic toggle for light and dark themes, persisting your preference.

🛠 Tech Stack

Framework: [Next.js 15 (App Router)](https://nextjs.org/)
Backend: [Firebase](https://firebase.google.com/) (Firestore, Auth)
AI Integration: [Genkit](https://firebase.google.com/docs/genkit) + Google Gemini
Styling: [Tailwind CSS](https://tailwindcss.com/)
UI Components: [Shadcn UI](https://ui.shadcn.com/)
Icons: [Lucide React](https://lucide.dev/)

🏁 Getting Started

Prerequisites

- Node.js installed on your machine.
- A Firebase project set up in the [Firebase Console](https://console.firebase.google.com/).

Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd blogvista
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   Update `src/firebase/config.ts` with your Firebase project credentials.

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

📄 License

This project is licensed under the MIT License.
