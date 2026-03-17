"use client"

import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin } from 'lucide-react';
import { MOCK_STATIONS } from '@/lib/mock-data';
import Link from 'next/link';

export default function FavouritesPage() {
  // Show a couple of stations as "favourites" for demonstration
  const favStations = MOCK_STATIONS.slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">My Favourites</h1>
        <p className="text-muted-foreground">Your most visited and saved filling stations.</p>
      </div>

      {favStations.length > 0 ? (
        <div className="grid gap-4">
          {favStations.map((station) => (
            <Link href={`/station/${station.id}`} key={station.id}>
              <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm hover:bg-slate-50 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Star className="size-6 text-primary fill-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="font-bold text-slate-800 truncate">{station.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-yellow-600">
                        <Star className="size-3 fill-yellow-600" />
                        {station.rating}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 truncate flex items-center gap-1">
                      <MapPin className="size-3" />
                      {station.address}
                    </p>
                    <div className="mt-2 text-primary font-black text-sm">
                      ₦{station.petrolPrice} / Litre
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center">
            <Star className="size-8 text-slate-300" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800">No saved stations</h3>
            <p className="text-slate-500 max-w-xs">Tap the star icon on any station to save it here for quick access.</p>
          </div>
        </div>
      )}
    </div>
  );
}
