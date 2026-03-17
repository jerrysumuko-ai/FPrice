"use client"

import { useParams, useRouter } from 'next/navigation';
import { MOCK_STATIONS } from '@/lib/mock-data';
import { ArrowLeft, Send, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function StationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const station = MOCK_STATIONS.find(s => s.id === id);

  const [calcAmount, setCalcAmount] = useState('1000');
  const [feedback, setFeedback] = useState('');

  if (!station) {
    return <div className="p-8 text-center">Station not found.</div>;
  }

  const petrolLiters = (parseFloat(calcAmount) || 0) / station.petrolPrice;

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) return;
    toast({
      title: "Feedback Submitted",
      description: "Thank you for sharing your experience!",
    });
    setFeedback('');
  };

  return (
    <div className="bg-white min-h-screen -mx-4 -mt-4 md:-mt-8 pb-20">
      {/* Header */}
      <header className="flex items-center p-4 border-b">
        <button onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="size-6 text-slate-800" />
        </button>
        <div className="flex items-center gap-2">
          {/* Custom Logo logic: use X icon for Mobile, placeholder leaf for others */}
          {station.name.toLowerCase().includes('mobile') ? (
            <div className="bg-slate-100 p-1.5 rounded-full text-slate-500">
              <X className="size-5" />
            </div>
          ) : (
            <div className="bg-green-100 p-1.5 rounded-full text-green-600">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.12,20C11,20 14.27,15.5 17,12C18,11 20,10.12 21,8C22,5.88 21,4 21,4C21,4 19.12,3 17,4C14.88,5 14,7 13,8C11,10 8,13 8,13C8,13 11,10 13,8Z" />
              </svg>
            </div>
          )}
          <h1 className="text-xl font-bold text-slate-900">{station.name}</h1>
        </div>
      </header>

      {/* Last Updated Bar */}
      <div className="bg-slate-50 px-4 py-2 text-right border-b">
        <span className="text-xs text-slate-500">Last updated: {station.lastUpdated}</span>
      </div>

      {/* Prices Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="bg-[#109D3E] text-white p-4 rounded-lg flex flex-col items-center justify-center space-y-1 shadow-sm">
          <div className="text-lg font-bold">Petrol</div>
          <div className="text-2xl font-black">₦{station.petrolPrice}/L</div>
        </div>
        <div className="bg-[#3B4453] text-white p-4 rounded-lg flex flex-col items-center justify-center space-y-1 shadow-sm">
          <div className="text-lg font-bold">Diesel</div>
          <div className="text-2xl font-black">₦{station.dieselPrice}/L</div>
        </div>
      </div>

      <Separator className="bg-slate-100" />

      {/* Calculator Section */}
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Fuel Calculator</h2>
        
        <div className="space-y-3">
          <Input 
            value={calcAmount}
            onChange={(e) => setCalcAmount(e.target.value)}
            placeholder="Enter amount you want to spend (₦)"
            className="h-12 border-slate-200"
            type="number"
          />
          
          <div className="bg-[#F1F3F4] p-4 rounded-lg text-[17px] font-medium text-slate-900">
            ₦{Number(calcAmount).toLocaleString() || '0'} → {isNaN(petrolLiters) ? '0.00' : petrolLiters.toFixed(2)}L Petrol
          </div>
        </div>
      </div>

      <Separator className="bg-slate-100" />

      {/* Feedback Section */}
      <div className="p-4 space-y-4">
        <div className="relative border border-slate-200 rounded-xl p-3 focus-within:ring-2 ring-primary/20">
          <Textarea 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Leave your feedback or experience..."
            className="border-none focus-visible:ring-0 min-h-[120px] p-0 resize-none text-[15px] placeholder:text-slate-400"
          />
        </div>
        <Button 
          onClick={handleFeedbackSubmit}
          className="w-full h-12 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-lg rounded-xl"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={`h-[1px] w-full ${className}`} />;
}
