"use client"

import { useParams, useRouter } from 'next/navigation';
import { FuelStation } from '@/lib/types';
import { fetchStationById, submitFeedback, submitPriceReport } from '@/lib/supabase-queries';
import { ArrowLeft, Fuel, AlertTriangle, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

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
      <path d="M40 55 C 10 35, 15 15, 40 0 C 65 15, 70 35, 40 55" fill="#E6192E" />
      <path d="M40 50 C 20 35, 25 20, 40 8 C 55 20, 60 35, 40 50" fill="#F37021" />
      <path d="M40 45 C 30 35, 32 25, 40 18 C 48 25, 50 35, 40 45" fill="#FFD700" />
      <path d="M10 75 L20 50 L30 68 L40 45 L50 68 L60 50 L70 75 L70 88 L10 88 Z" fill="#DAA520" stroke="#8B4513" strokeWidth="1" />
      <circle cx="10" cy="75" r="3" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="20" cy="50" r="3" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="40" cy="45" r="4" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="60" cy="50" r="3" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="70" cy="75" r="3" fill="#B22222" stroke="#4A0000" strokeWidth="0.5" />
      <circle cx="25" cy="81" r="2.5" fill="#B22222" />
      <circle cx="40" cy="81" r="2.5" fill="#B22222" />
      <circle cx="55" cy="81" r="2.5" fill="#B22222" />
    </g>
  </svg>
);

const NNPCIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(5, 5)">
      <path d="M5 20 L25 10 L25 65 L5 75 Z" fill="#F0E100" />
      <path d="M25 10 L85 25 L85 80 L25 65 Z" fill="#1B6D44" />
      <path d="M25 65 L45 55 L85 80 Z" fill="#29B462" />
      <path d="M5 75 L25 65 L45 85 L5 95 Z" fill="#E31E24" />
      <text x="50" y="85" style={{ font: 'bold 24px sans-serif' }} fill="#555555">NNPC</text>
    </g>
  </svg>
);

export default function StationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const stationId = Array.isArray(id) ? id[0] : id;

  const [station, setStation] = useState<FuelStation | null>(null);
  const [loading, setLoading] = useState(true);
  const [calcAmount, setCalcAmount] = useState('1000');
  const [feedback, setFeedback] = useState('');
  const [selectedFuel, setSelectedFuel] = useState<'petrol' | 'diesel'>('petrol');

  const [newPetrolPrice, setNewPetrolPrice] = useState('');
  const [newDieselPrice, setNewDieselPrice] = useState('');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  useEffect(() => {
    if (!stationId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const s = await fetchStationById(stationId);
        if (cancelled) return;
        setStation(s);

        if (s) {
          const recent = JSON.parse(localStorage.getItem('fuel_finder_recent') || '[]');
          const newRecent = [stationId, ...recent.filter((i: string) => i !== stationId)].slice(0, 3);
          localStorage.setItem('fuel_finder_recent', JSON.stringify(newRecent));

          const favs = JSON.parse(localStorage.getItem('fuel_finder_favs') || '[]');
          setIsFavourite(favs.includes(stationId));
        }
      } catch (err) {
        console.error('Failed to load station:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stationId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading station...</div>;
  }

  if (!station) {
    return <div className="p-8 text-center">Station not found.</div>;
  }

  const currentPrice = selectedFuel === 'petrol' ? station.petrolPrice : station.dieselPrice;
  const liters = (parseFloat(calcAmount) || 0) / currentPrice;

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return;
    setIsSubmittingFeedback(true);
    try {
      await submitFeedback({
        stationId: station.id,
        subject: `Feedback for ${station.name}`,
        message: feedback,
      });
      toast({
        title: "Feedback Submitted",
        description: "Thank you for sharing your experience!",
      });
      setFeedback('');
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to submit",
        description: err?.message ?? "Please try again later.",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const toggleFavourite = () => {
    const favs = JSON.parse(localStorage.getItem('fuel_finder_favs') || '[]');
    let newFavs;
    if (favs.includes(station.id)) {
      newFavs = favs.filter((i: string) => i !== station.id);
      setIsFavourite(false);
    } else {
      newFavs = [...favs, station.id];
      setIsFavourite(true);
    }
    localStorage.setItem('fuel_finder_favs', JSON.stringify(newFavs));
  };

  const handleReportPrice = async () => {
    if (!newPetrolPrice && !newDieselPrice) return;
    setIsSubmittingReport(true);
    try {
      await submitPriceReport({
        stationId: station.id,
        petrolPrice: newPetrolPrice ? Number(newPetrolPrice) : null,
        dieselPrice: newDieselPrice ? Number(newDieselPrice) : null,
      });
      toast({
        title: "Price Reported",
        description: "Our team will verify the updated rates shortly. Thank you!",
      });
      setIsReportDialogOpen(false);
      setNewPetrolPrice('');
      setNewDieselPrice('');
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to report",
        description: err?.message ?? "Please try again later.",
      });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const isMobil = station.name.toLowerCase().includes('mobil') || station.name.toLowerCase().includes('mobile');
  const isShafa = station.name.toLowerCase().includes('shafa');
  const isUddyKing = station.name.toLowerCase().includes('uddy king');
  const isNNPC = station.name.toLowerCase().includes('nnpc');

  return (
    <div className="bg-white min-h-screen -mx-4 -mt-4 md:-mt-8 pb-20">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center min-w-0">
          <button onClick={() => router.back()} className="mr-4 shrink-0">
            <ArrowLeft className="size-6 text-slate-800" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
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
            <h1 className="text-xl font-bold text-slate-900 truncate">{station.name}</h1>
          </div>
        </div>
        <button
          onClick={toggleFavourite}
          className="p-2 active:scale-90 transition-transform"
        >
          <Star className={cn("size-7 transition-colors", isFavourite ? "fill-yellow-400 text-yellow-400" : "text-slate-300")} />
        </button>
      </header>

      <div className="bg-slate-50 px-4 py-2 text-right border-b">
        <span className="text-xs text-slate-500">Last updated: {(() => { try { const d = new Date(station.lastUpdated); return isNaN(d.getTime()) ? station.lastUpdated : d.toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return station.lastUpdated; } })()}</span>
      </div>

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
            ₦{Number(calcAmount || 0).toLocaleString('en-US')} → {isNaN(liters) ? '0.00' : liters.toFixed(2)}L {selectedFuel === 'petrol' ? 'Petrol' : 'Diesel'}
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-slate-100" />

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
          disabled={isSubmittingFeedback}
          className="w-full h-12 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-lg rounded-xl"
        >
          {isSubmittingFeedback ? 'Submitting...' : 'Submit'}
        </Button>
        <div className="text-center">
          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <button className="text-[15px] font-medium text-slate-900 hover:opacity-80 transition-opacity">
                <span className="text-red-600">Report</span> new price
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] rounded-2xl md:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-red-600" />
                  Report New Price
                </DialogTitle>
                <DialogDescription>
                  Help the community by updating the current rates at {station.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="petrol-report">Petrol Price (₦/Litre)</Label>
                  <Input
                    id="petrol-report"
                    type="number"
                    placeholder={station.petrolPrice.toString()}
                    value={newPetrolPrice}
                    onChange={(e) => setNewPetrolPrice(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="diesel-report">Diesel Price (₦/Litre)</Label>
                  <Input
                    id="diesel-report"
                    type="number"
                    placeholder={station.dieselPrice.toString()}
                    value={newDieselPrice}
                    onChange={(e) => setNewDieselPrice(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleReportPrice}
                  disabled={isSubmittingReport}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl"
                >
                  {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
