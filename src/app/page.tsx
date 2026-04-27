"use client"

import { useState, useEffect } from 'react';
import { FuelStation } from '@/lib/types';
import { fetchStations } from '@/lib/supabase-queries';
import { Search, Fuel } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const MobilIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="30" style={{ font: 'bold 28px sans-serif' }}>
      <tspan fill="#0059B3">M</tspan>
      <tspan fill="#E6192E">o</tspan>
      <tspan fill="#0059B3">bil</tspan>
    </text>
  </svg>
);

const ShafaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 80" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 10)">
      <text x="10" y="50" style={{ font: 'italic 900 50px sans-serif', letterSpacing: '-2px' }} fill="#E31E24">Shafa</text>
      <text x="80" y="70" style={{ font: '900 16px sans-serif' }} fill="#F37021">ENERGY</text>
      <g transform="translate(165, 35) scale(0.5)">
         {[...Array(12)].map((_, i) => (
           <ellipse
             key={i}
             cx="0" cy="0" rx="35" ry="12"
             fill={i % 2 === 0 ? "#E31E24" : "#F37021"}
             transform={`rotate(${i * 30})`}
             opacity="0.9"
           />
         ))}
      </g>
    </g>
  </svg>
);

const UddyKingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10, 5)">
      <path d="M40 55 C 10 35, 15 15, 40 0 C 65 15, 70 35, 40 55" fill="#E6192E" />
      <path d="M40 50 C 20 35, 25 20, 40 8 C 55 20, 60 35, 40 50" fill="#F37021" />
      <path d="M40 45 C 30 35, 32 25, 40 18 C 48 25, 50 35, 40 45" fill="#FFD700" />
      <path d="M10 75 L20 50 L30 68 L40 45 L50 68 L60 50 L70 75 L70 88 L10 88 Z" fill="#DAA520" stroke="#8B4513" strokeWidth="1" />
      <circle cx="10" cy="75" r="3" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="20" cy="50" r="3" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="40" cy="45" r="4" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="60" cy="50" r="3" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="70" cy="75" r="3" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="25" cy="81" r="2.5" fill="#B22222" />
      <circle cx="40" cy="81" r="2.5" fill="#B22222" />
      <circle cx="55" cy="81" r="2.5" fill="#B22222" />
    </g>
  </svg>
);

const NNPCIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(5, 5)">
      <path d="M5 20 L25 10 L25 65 L5 75 Z" fill="#F0E100" />
      <path d="M25 10 L85 25 L85 80 L25 65 Z" fill="#1B6D44" />
      <path d="M25 65 L45 55 L85 80 Z" fill="#29B462" />
      <path d="M5 75 L25 65 L45 85 L5 95 Z" fill="#E31E24" />
      <text x="50" y="85" style={{ font: 'bold 24px sans-serif' }} fill="#555555">NNPC</text>
    </g>
  </svg>
);

export default function Home() {
  const [search, setSearch] = useState('');
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [recentStations, setRecentStations] = useState<FuelStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await fetchStations();
      if (cancelled) return;
      setStations(all);
      setLoading(false);

      const storedRecentIds: string[] = JSON.parse(
        localStorage.getItem('fuel_finder_recent') || '[]'
      );
      if (storedRecentIds.length > 0) {
        const items = storedRecentIds
          .map((id) => all.find((s) => s.id === id))
          .filter(Boolean) as FuelStation[];
        if (!cancelled) setRecentStations(items);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredStations = stations
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const isMobilStation = (name: string) => {
    const lower = name.toLowerCase();
    return lower.includes('mobil') || lower.includes('mobile');
  };

  const isShafaStation = (name: string) => {
    return name.toLowerCase().includes('shafa');
  };

  const isUddyKingStation = (name: string) => {
    return name.toLowerCase().includes('uddy king');
  };

  const isNNPCStation = (name: string) => {
    return name.toLowerCase().includes('nnpc');
  };

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
        </div>
      </div>

      <div className="px-4">
        {/* RECENT Section - Only shown when search is empty */}
        {recentStations.length > 0 && !search && (
          <div className="mt-4 animate-in fade-in duration-300">
            <h2 className="text-[11px] font-bold text-slate-500 tracking-wider mb-4 uppercase px-1">Recent</h2>
            <div className="space-y-1">
              {recentStations.map((station) => {
                const isMobil = isMobilStation(station.name);
                const isShafa = isShafaStation(station.name);
                const isUddyKing = isUddyKingStation(station.name);
                const isNNPC = isNNPCStation(station.name);
                return (
                  <Link
                    href={`/station/${station.id}`}
                    key={station.id}
                    className="flex items-center gap-5 py-3 px-1 active:bg-slate-50 transition-colors group"
                  >
                    <div className="size-11 rounded-full flex items-center justify-center shrink-0 bg-slate-100 overflow-hidden">
                      {isMobil ? (
                        <MobilIcon className="w-8 h-auto" />
                      ) : isShafa ? (
                        <ShafaIcon className="w-10 h-auto" />
                      ) : isUddyKing ? (
                        <UddyKingIcon className="w-8 h-auto" />
                      ) : isNNPC ? (
                        <NNPCIcon className="w-10 h-auto" />
                      ) : (
                        <Fuel className="size-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 py-1">
                      <div className="text-[17px] font-medium text-slate-800 leading-none mb-1">
                        {isMobil ? 'Mobil' : isShafa ? 'Shafa' : isUddyKing ? 'Uddy King' : isNNPC ? 'NNPC' : station.name.split(' ')[0]}
                      </div>
                      <Separator className="mt-4 bg-slate-100" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* A-Z Section */}
        <div className="mt-6 pb-24">
          <h2 className="text-[11px] font-bold text-slate-500 tracking-wider mb-4 uppercase px-1">A—Z</h2>
          <div className="space-y-1">
            {loading ? (
              <div className="py-12 text-center text-slate-400 italic">
                Loading stations...
              </div>
            ) : (
              <>
                {filteredStations.map((station) => {
                  const isMobil = isMobilStation(station.name);
                  const isShafa = isShafaStation(station.name);
                  const isUddyKing = isUddyKingStation(station.name);
                  const isNNPC = isNNPCStation(station.name);
                  return (
                    <Link
                      href={`/station/${station.id}`}
                      key={station.id}
                      className="flex items-center gap-5 py-4 px-1 border-b border-slate-100 last:border-none active:bg-slate-50 transition-colors group"
                    >
                      <div className="size-11 rounded-full flex items-center justify-center shrink-0 bg-slate-100 overflow-hidden">
                        {isMobil ? (
                          <MobilIcon className="w-8 h-auto" />
                        ) : isShafa ? (
                          <ShafaIcon className="w-10 h-auto" />
                        ) : isUddyKing ? (
                          <UddyKingIcon className="w-8 h-auto" />
                        ) : isNNPC ? (
                          <NNPCIcon className="w-10 h-auto" />
                        ) : (
                          <Fuel className="size-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[17px] font-medium text-slate-800 truncate">{station.name}</div>
                        <div className="text-sm text-slate-400 font-normal truncate">
                          {station.address}
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {filteredStations.length === 0 && (
                  <div className="py-12 text-center text-slate-400 italic">
                    No matching stations found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
