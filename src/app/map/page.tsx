"use client"

import { Card } from '@/components/ui/card';
import { MOCK_STATIONS } from '@/lib/mock-data';
import { MapPin, Info, Navigation2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Station Locator</h1>
        <p className="text-muted-foreground">Find filling stations near you in Calabar.</p>
      </div>

      <div className="relative h-[60vh] w-full rounded-2xl overflow-hidden border shadow-lg bg-accent/30 flex items-center justify-center">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-[#E5E3DF] opacity-50 overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-px opacity-20">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border-r border-b border-black/10" />
            ))}
          </div>
        </div>

        {/* Mock Map Markers */}
        {MOCK_STATIONS.map((station, idx) => (
          <div 
            key={station.id} 
            className="absolute transition-transform hover:scale-110 cursor-pointer group"
            style={{
              top: `${20 + idx * 15}%`,
              left: `${15 + idx * 18}%`
            }}
          >
            <div className="bg-white px-2 py-1 rounded shadow-md text-[10px] font-bold absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {station.name} - ₦{station.petrolPrice}
            </div>
            <MapPin className="size-8 text-primary fill-primary/20 drop-shadow-md" />
          </div>
        ))}

        <div className="z-10 bg-white/90 backdrop-blur p-4 rounded-xl border shadow-xl max-w-xs text-center space-y-3">
          <Info className="size-8 text-secondary mx-auto" />
          <div>
            <h3 className="font-bold">Interactive Map</h3>
            <p className="text-xs text-muted-foreground">Google Maps API integration would be rendered here in a production environment.</p>
          </div>
          <Badge variant="outline" className="border-secondary text-secondary">
            5 Stations Nearby
          </Badge>
        </div>

        {/* Map Controls */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-2">
          <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary border hover:bg-accent transition-colors">
             <Navigation2 className="size-5 fill-current" />
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        <h2 className="text-xl font-bold">Nearest Stations</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {MOCK_STATIONS.map((station) => (
            <Card key={station.id} className="min-w-[280px] p-4 flex gap-4 items-center bg-card/50 backdrop-blur-sm border-none shadow-sm">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="text-primary size-6" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-sm truncate w-40">{station.name}</div>
                <div className="text-xs text-muted-foreground">{station.distance} away</div>
                <div className="text-xs font-black text-primary">₦{station.petrolPrice}/Litre</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
