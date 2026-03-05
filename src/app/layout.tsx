
import type {Metadata} from 'next';
import './globals.css';
import {Navbar} from '@/components/layout/Navbar';
import {Toaster} from '@/components/ui/toaster';
import {FirebaseClientProvider} from '@/firebase';

export const metadata: Metadata = {
  title: 'BlogVista - Elevate Your Thoughts',
  description: 'A modern, secure platform for public and private blogging.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <FirebaseClientProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Toaster />
          <footer className="border-t bg-card py-8 mt-auto">
            <div 
              className="container mx-auto px-4 text-center text-muted-foreground text-sm"
              suppressHydrationWarning
            >
              © {new Date().getFullYear()} BlogVista. All rights reserved.
            </div>
          </footer>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
