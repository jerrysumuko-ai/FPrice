
"use client"

import { useParams, useRouter } from 'next/navigation';
import { MOCK_STATIONS } from '@/lib/mock-data';
import { ArrowLeft, Fuel } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
      {/* Flame Layers */}
      <path d="M40 55 C 10 35, 15 15, 40 0 C 65 15, 70 35, 40 55" fill="#E6192E" />
      <path d="M40 50 C 20 35, 25 20, 40 8 C 55 20, 60 35, 40 50" fill="#F37021" />
      <path d="M40 45 C 30 35, 32 25, 40 18 C 48 25, 50 35, 40 45" fill="#FFD700" />
      
      {/* Crown Points */}
      <path d="M10 75 L20 50 L30 68 L40 45 L50 68 L60 50 L70 75 L70 88 L10 88 Z" fill="#DAA520" stroke="#8B4513" strokeWidth="1" />
      
      {/* Gem Details */}
      <circle cx="10" cy="75" r="3" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="20" cy="50" r="3" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="40" cy="45" r="4" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="60" cy="50" r="3" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="70" cy="75" r="3" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      
      {/* Base Band Gems */}
      <circle cx="25" cy="81" r="2.5" fill="#B22222" />
      <circle cx="40" cy="81" r="2.5" fill="#B22222" />
      <circle cx="55" cy="81" r="2.5" fill="#B22222" />
    </g>
  </svg>
);

const NNPCIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(5, 5)">
      {/* The Geometric Ribbon */}
      <path d="M5 20 L25 10 L25 65 L5 75 Z" fill="#F0E100" /> {/* Yellow left */}
      <path d="M25 10 L85 25 L85 80 L25 65 Z" fill="#1B6D44" /> {/* Dark Green center */}
      <path d="M25 65 L45 55 L85 80 Z" fill="#29B462" /> {/* Light Green triangle */}
      <path d="M5 75 L25 65 L45 85 L5 95 Z" fill="#E31E24" /> {/* Red bottom */}
      
      {/* NNPC Text */}
      <text x="50" y="85" style={{ font: 'bold 24px sans-serif' }} fill="#555555">NNPC</text>
    </g>
  </svg>
);

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

  const isMobil = station.name.toLowerCase().includes('mobil') || station.name.toLowerCase().includes('mobile');
  const isShafa = station.name.toLowerCase().includes('shafa');
  const isUddyKing = station.name.toLowerCase().includes('uddy king');
  const isNNPC = station.name.toLowerCase().includes('nnpc');

  return (
    <div className="bg-white min-h-screen -mx-4 -mt-4 md:-mt-8 pb-20">
      {/* Header */}
      <header className="flex items-center p-4 border-b">
        <button onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="size-6 text-slate-800" />
        </button>
        <div className="flex items-center gap-2">
          <div className="size-10 rounded-full flex items-center justify-center shrink-0 bg-slate-100 overflow-hidden p-1">
            {isMobil ? (
              <MobilIcon className="w-full h-auto" />
            ) : isShafa ? (
              <ShafaIcon className="w-full h-auto" />
            ) : isUddyKing ? (
              <UddyKingIcon className="w-full h-auto" />
            ) : isNNPC ? (
              <NNPCIcon className="w-full h-auto" />
            ) : (
              <Fuel className="size-5 text-slate-400" />
            )}
          </div>
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
