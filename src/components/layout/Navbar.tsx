
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Newspaper, LayoutDashboard, LogIn, PenSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const isLoggedIn = true; // Simulated auth state

  const navItems = [
    { label: 'Feed', href: '/feed', icon: Newspaper },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, authRequired: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-headline font-bold text-xl group-hover:scale-110 transition-transform">
            B
          </div>
          <span className="font-headline font-bold text-xl tracking-tight hidden sm:block">
            Blog<span className="text-primary">Vista</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          {navItems.map((item) => (
            (!item.authRequired || isLoggedIn) && (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "gap-2",
                    pathname === item.href && "bg-accent/10 text-primary"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            )
          ))}

          <div className="w-px h-6 bg-border mx-2" />

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard/new">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <PenSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Write</span>
                </Button>
              </Link>
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold border">
                AR
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
