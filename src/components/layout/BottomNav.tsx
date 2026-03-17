"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Favourite', icon: Star, href: '/favourites' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t h-16 md:h-auto md:top-0 md:bottom-auto md:bg-transparent md:border-b md:backdrop-blur-none flex items-center justify-center">
      <div className="flex w-full max-w-4xl justify-around md:justify-end md:gap-8 px-4 h-full items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col md:flex-row items-center gap-1 transition-colors group p-2",
                isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className={cn("size-6 md:size-5", isActive ? "fill-primary/20" : "")} />
              <span className="text-[10px] md:text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
