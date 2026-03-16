
"use client"

import { useState } from 'react';
import { MOCK_STATIONS } from '@/lib/mock-data';
import { Search, User, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export default function Home() {
  const [search, setSearch] = useState('');

  const filteredStations = MOCK_STATIONS
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Updated Recent list per user request: Mobile station first with X icon
  const recentItems = [
    { id: 'mobil-marian', name: 'Mobile', icon: X, iconClass: 'bg-slate-200 text-slate-500' },
    { id: 'shafa', name: 'Shafa', icon: X, iconClass: 'bg-slate-200 text-slate-500' }
  ];

  return (
    <div className="bg-white min-h-screen -mx-4 -mt-4 md:-mt-8">
      {/* Simple Search Header */}
      <div className="p-4 pt-6 sticky top-0 bg-white z-10">
        <div className="relative flex items-center bg-[#F1F3F4] rounded-2xl px-4 h-14">
          <Search className="text-slate-600 size-6 mr-3" />
          <input 
            placeholder="Search" 
            className="bg-transparent border-none outline-none flex-1 text-xl text-slate-900 placeholder:text-slate-500 font-normal"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Avatar className="size-9 bg-slate-300 ml-2 border border-slate-200">
            <AvatarFallback className="bg-slate-400">
              <User className="size-6 text-white" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="px-4">
        {/* RECENT Section */}
        <div className="mt-4">
          <h2 className="text-[11px] font-bold text-slate-500 tracking-wider mb-4 uppercase px-1">Recent</h2>
          <div className="space-y-1">
            {recentItems.map((item) => (
              <Link 
                href={`/map?id=${item.id}`} 
                key={item.id} 
                className="flex items-center gap-5 py-3 px-1 active:bg-slate-50 transition-colors group"
              >
                <div className={`size-11 rounded-full flex items-center justify-center shrink-0 ${item.iconClass}`}>
                  <item.icon className="size-6" />
                </div>
                <div className="flex-1 py-1">
                  <div className="text-[17px] font-medium text-slate-800 leading-none mb-1">{item.name}</div>
                  <Separator className="mt-4 bg-slate-100" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* A-Z Section */}
        <div className="mt-6 pb-24">
          <h2 className="text-[11px] font-bold text-slate-500 tracking-wider mb-4 uppercase px-1">A—Z</h2>
          <div className="space-y-1">
            {filteredStations.map((station) => (
              <Link 
                href={`/map?id=${station.id}`} 
                key={station.id} 
                className="block py-4 px-1 border-b border-slate-100 last:border-none active:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[17px] font-medium text-slate-800">{station.name}</div>
                  <div className="text-primary font-bold">₦{station.petrolPrice}</div>
                </div>
                <div className="text-sm text-slate-400 font-normal">
                  {station.address}
                </div>
              </Link>
            ))}
            {filteredStations.length === 0 && (
              <div className="py-12 text-center text-slate-400 italic">
                No matching stations found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
