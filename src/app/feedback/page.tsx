"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MOCK_STATIONS } from '@/lib/mock-data';

export default function FeedbackPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Feedback Sent!",
        description: "Thank you for helping us improve services in Calabar.",
      });
    }, 1500);
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
        <Button onClick={() => setSubmitted(false)} variant="outline">Send another feedback</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Feedback</h1>
        <p className="text-muted-foreground">Report issues or suggest improvements directly to fuel companies.</p>
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="text-primary size-5" />
            Submit Feedback
          </CardTitle>
          <CardDescription>Fill out the form below to reach the station management.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label>Select Station</Label>
              <Select defaultValue={MOCK_STATIONS[0].id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a station" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_STATIONS.map((station) => (
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
              <Input id="subject" placeholder="e.g., Short metering, Attendant behavior" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea 
                id="message" 
                placeholder="Describe your experience in detail..." 
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
