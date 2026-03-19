
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Star, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Favourite', icon: Star, href: '/favourites' },
    { label: 'Profile', icon: User, href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t h-16 md:h-20 flex items-center justify-center">
      <div className="flex w-full max-w-lg justify-around px-4 h-full items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all group py-1 min-w-[64px]",
                isActive ? "text-[#D9451B]" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon className={cn("size-6", isActive ? "fill-[#D9451B]/10" : "")} />
              <span className={cn("text-[11px] font-bold", isActive ? "opacity-100" : "opacity-80")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
