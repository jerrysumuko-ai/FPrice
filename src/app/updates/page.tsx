"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Info, TrendingUp } from 'lucide-react';
import { NewsAlert } from '@/lib/types';
import { fetchNewsAlerts } from '@/lib/supabase-queries';
import { Badge } from '@/components/ui/badge';

export default function UpdatesPage() {
  const [alerts, setAlerts] = useState<NewsAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const list = await fetchNewsAlerts();
      setAlerts(list);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Price Updates</h1>
        <p className="text-muted-foreground">Stay informed about fuel trends and news in Calabar.</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400 italic">Loading updates...</div>
        ) : (
          <>
            {alerts.map((alert) => (
              <Card key={alert.id} className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="h-1 bg-primary w-full" />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="size-5 text-primary" />
                      {alert.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] uppercase">{alert.date}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">
                    {alert.content}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-primary font-bold">
                    <TrendingUp className="size-3" />
                    Market Forecast
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-none shadow-sm bg-accent/20 backdrop-blur-sm border-dashed border-2">
              <CardContent className="pt-6 flex flex-col items-center text-center space-y-3">
                <Info className="size-8 text-muted-foreground opacity-50" />
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800">No more alerts</h3>
                  <p className="text-sm text-muted-foreground">We'll notify you when prices change at your favorite stations.</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
