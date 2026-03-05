
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Newspaper, LayoutDashboard, LogIn, PenSquare, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const navItems = [
    { label: 'Feed', href: '/feed', icon: Newspaper },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, authRequired: true },
  ];

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  const avatarPlaceholder = PlaceHolderImages.find(img => img.id === 'user-avatar');
  const avatarUrl = user ? avatarPlaceholder?.imageUrl.replace('/seed/user/', `/seed/${user.uid}/`) : avatarPlaceholder?.imageUrl;

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
            (!item.authRequired || user) && (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "gap-2",
                    pathname === item.href && "bg-accent/10 text-primary"
                  )}
                  suppressHydrationWarning
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            )
          ))}

          <div className="w-px h-6 bg-border mx-2" />

          {isUserLoading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/dashboard/new">
                <Button className="gap-2 bg-primary hover:bg-primary/90 hidden sm:flex" suppressHydrationWarning>
                  <PenSquare className="w-4 h-4" />
                  Write
                </Button>
              </Link>
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={avatarUrl} data-ai-hint={avatarPlaceholder?.imageHint} />
                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive" suppressHydrationWarning>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="gap-2 rounded-full px-6" suppressHydrationWarning>
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
