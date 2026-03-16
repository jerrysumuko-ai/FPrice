"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { MOCK_STATIONS, NEWS_ALERTS } from '@/lib/mock-data';
import { StationCard } from '@/components/stations/StationCard';
import { Search, Bell, AlertTriangle, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [search, setSearch] = useState('');

  const filteredStations = MOCK_STATIONS
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Calabar FuelFinder</h1>
          <p className="text-muted-foreground">Live fuel prices across Cross River State.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search stations by name..." 
            className="pl-10 h-12 bg-card border-none shadow-sm focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Price Alert News */}
      {NEWS_ALERTS.map((alert) => (
        <Alert key={alert.id} className="bg-primary/5 border-primary/20 animate-in fade-in slide-in-from-top-4">
          <TrendingUp className="size-4 text-primary" />
          <AlertTitle className="text-primary font-bold">Price Increment Alert!</AlertTitle>
          <AlertDescription className="text-sm">
            {alert.content} <span className="font-bold opacity-70 ml-2">— {alert.date}</span>
          </AlertDescription>
        </Alert>
      ))}

      {/* Tabs / Filtered List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-accent/50 w-full justify-start overflow-x-auto h-auto p-1 gap-1">
          <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white px-6">Live Prices</TabsTrigger>
          <TabsTrigger value="favorites" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white px-6">Favorites</TabsTrigger>
          <TabsTrigger value="recent" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white px-6">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStations.map((station, idx) => (
              <StationCard 
                key={station.id} 
                station={station} 
                priority={idx === 0 && search.length > 0}
              />
            ))}
            {filteredStations.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <Search className="size-12 mx-auto mb-4 opacity-20" />
                <p>No stations found matching "{search}"</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="py-12 text-center text-muted-foreground">
           <p>Your favorited stations will appear here.</p>
        </TabsContent>
        <TabsContent value="recent" className="py-12 text-center text-muted-foreground">
           <p>Recently visited stations will appear here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
