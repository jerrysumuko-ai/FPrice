
"use client"

import { useParams, useRouter } from 'next/navigation';
import { MOCK_STATIONS } from '@/lib/mock-data';
import { ArrowLeft, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function StationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const station = MOCK_STATIONS.find(s => s.id === id);

  const [calcAmount, setCalcAmount] = useState('1000');
  const [feedback, setFeedback] = useState('');
  const [selectedFuel, setSelectedFuel] = useState<'petrol' | 'diesel'>('petrol');

  useEffect(() => {
    if (id) {
      const recent = JSON.parse(localStorage.getItem('fuel_finder_recent') || '[]');
      const newRecent = [id, ...recent.filter((i: string) => i !== id)].slice(0, 3);
      localStorage.setItem('fuel_finder_recent', JSON.stringify(newRecent));
    }
  }, [id]);

  if (!station) {
    return <div className="p-8 text-center">Station not found.</div>;
  }

  const currentPrice = selectedFuel === 'petrol' ? station.petrolPrice : station.dieselPrice;
  const liters = (parseFloat(calcAmount) || 0) / currentPrice;

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
        <button 
          onClick={() => setSelectedFuel('petrol')}
          className={cn(
            "bg-[#109D3E] text-white p-4 rounded-lg flex flex-col items-center justify-center space-y-1 shadow-sm transition-all relative",
            selectedFuel === 'petrol' ? "ring-4 ring-blue-500 ring-offset-2 scale-[1.02]" : "opacity-80 hover:opacity-100"
          )}
        >
          <div className="text-lg font-bold">Petrol</div>
          <div className="text-2xl font-black">₦{station.petrolPrice}/L</div>
          {selectedFuel === 'petrol' && (
             <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1 shadow-md">
                <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
             </div>
          )}
        </button>
        <button 
          onClick={() => setSelectedFuel('diesel')}
          className={cn(
            "bg-[#3B4453] text-white p-4 rounded-lg flex flex-col items-center justify-center space-y-1 shadow-sm transition-all relative",
            selectedFuel === 'diesel' ? "ring-4 ring-blue-500 ring-offset-2 scale-[1.02]" : "opacity-80 hover:opacity-100"
          )}
        >
          <div className="text-lg font-bold">Diesel</div>
          <div className="text-2xl font-black">₦{station.dieselPrice}/L</div>
          {selectedFuel === 'diesel' && (
             <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1 shadow-md">
                <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
             </div>
          )}
        </button>
      </div>

      <div className="h-[1px] w-full bg-slate-100" />

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
            ₦{Number(calcAmount).toLocaleString() || '0'} → {isNaN(liters) ? '0.00' : liters.toFixed(2)}L {selectedFuel === 'petrol' ? 'Petrol' : 'Diesel'}
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-slate-100" />

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
        <div className="text-center">
          <button className="text-[15px] font-medium text-slate-900 hover:opacity-80 transition-opacity">
            <span className="text-red-600">Report</span> new price
          </button>
        </div>
      </div>
    </div>
  );
}
