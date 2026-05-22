
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#F1F3F4] border-t border-slate-200">
      <div className="flex w-full max-w-lg mx-auto justify-around px-3 py-2 gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 flex-1 py-2 px-3 rounded-xl transition-all",
                isActive
                  ? "bg-white border border-slate-200 shadow-sm text-[#F4511E]"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon className={cn("size-5", isActive ? "stroke-[2.5]" : "stroke-[1.5]")} />
              <span className={cn("text-[11px] font-bold", isActive ? "opacity-100" : "opacity-70")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
