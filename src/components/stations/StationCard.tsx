"use client"

import { FuelStation } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, Star } from 'lucide-react';
import Image from 'next/image';

interface StationCardProps {
  station: FuelStation;
  priority?: boolean;
}

export function StationCard({ station, priority }: StationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group border-none bg-card/50 backdrop-blur-sm shadow-sm">
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={station.image}
          alt={station.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          data-ai-hint="fuel station"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={station.isOpen ? "secondary" : "destructive"} className="font-semibold shadow-sm">
            {station.isOpen ? "OPEN" : "CLOSED"}
          </Badge>
        </div>
        {priority && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary text-primary-foreground font-semibold shadow-sm">
              NEAREST
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {station.name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded text-xs font-bold">
            <Star className="size-3 fill-yellow-600" />
            {station.rating}
          </div>
        </div>

        <p className="text-muted-foreground text-xs mb-4 flex items-center gap-1">
          <Navigation className="size-3" />
          {station.address} • {station.distance}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-accent/50 p-2 rounded-lg border border-primary/10">
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Petrol (PMS)</div>
            <div className="text-primary font-bold text-lg">₦{station.petrolPrice}</div>
          </div>
          <div className="bg-accent/50 p-2 rounded-lg border border-secondary/10">
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Diesel (AGO)</div>
            <div className="text-secondary font-bold text-lg">₦{station.dieselPrice}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
