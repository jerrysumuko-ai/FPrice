"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FuelStation } from '@/lib/types';
import { fetchStations, submitFeedback } from '@/lib/supabase-queries';

export default function FeedbackPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [stationId, setStationId] = useState<string>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const list = await fetchStations();
      setStations(list);
      if (list.length > 0) setStationId(list[0].id);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitFeedback({
        stationId: stationId === 'general' ? null : stationId,
        subject,
        message,
      });
      setSubmitted(true);
      toast({
        title: "Feedback Sent!",
        description: "Thank you for helping us improve services in Calabar.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Could not send feedback",
        description: err?.message ?? "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95">
        <div className="size-20 bg-secondary/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="size-10 text-secondary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">Your feedback has been successfully submitted to the company.</p>
        </div>
        <Button
          onClick={() => {
            setSubmitted(false);
            setSubject('');
            setMessage('');
          }}
          variant="outline"
        >
          Send another feedback
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Feedback</h1>
        <p className="text-muted-foreground">Saw a price at the pump? Tell us — your tip helps other drivers in Calabar.</p>
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="text-primary size-5" />
            Submit Feedback
          </CardTitle>
          <CardDescription>Pick the station, tell us the price you saw, and hit send.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label>Select Station</Label>
              <Select value={stationId} onValueChange={setStationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="general">General App Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Petrol price update, Queue situation"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g., Petrol is ₦650/L here, no queue, diesel unavailable..."
                className="min-h-[150px]"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : (
                <>
                  Send Feedback
                  <Send className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
