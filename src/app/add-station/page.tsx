"use client"

import { ArrowLeft, Camera, X, Check, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { createStation } from '@/lib/supabase-queries';

export default function AddStationPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Flow State
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 State
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [stationName, setStationName] = useState('');
  const [stationAddress, setStationAddress] = useState('');
  const [phone, setPhone] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 State
  const [petrolPrice, setPetrolPrice] = useState('680');
  const [dieselPrice, setDieselPrice] = useState('750');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 2MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinish = async () => {
    if (!isAuthorized) {
      toast({
        variant: "destructive",
        title: "Authorization required",
        description: "Please confirm you are authorized to manage this station.",
      });
      return;
    }

    const petrol = Number(petrolPrice);
    const diesel = Number(dieselPrice);
    if (petrol <= 0 || diesel <= 0) {
      toast({ variant: 'destructive', title: 'Invalid prices', description: 'Prices must be greater than zero.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await createStation({
        name: stationName,
        address: stationAddress,
        petrolPrice: petrol,
        dieselPrice: diesel,
        phone: phone || undefined,
        // base64 previews are filtered out server-side; only remote URLs are stored
        logoUrl: logoPreview && !logoPreview.startsWith('data:') ? logoPreview : undefined,
      });
      toast({
        title: "Station Registered",
        description: "Your station has been submitted successfully.",
      });
      router.push('/profile');
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Could not register station",
        description: err?.message ?? "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen -mx-4 -mt-4 md:-mt-8 flex flex-col">
      <div className="bg-white min-h-screen w-full">
        {step === 1 ? (
          <div className="px-6 space-y-8 max-w-lg mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <header className="flex items-center -ml-2 py-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95"
              >
                <ArrowLeft className="size-7 text-slate-800" />
              </button>
              <h1 className="text-2xl font-bold text-slate-800 ml-2">Register Your Station</h1>
            </header>

            <p className="text-slate-500 text-[15px] leading-relaxed">
              Add your branch so drivers can find you and see real-time fuel prices.
            </p>

            <form onSubmit={handleNextStep} className="space-y-8 pb-10">
              {/* Upload Logo Section */}
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div
                  onClick={handleLogoClick}
                  className="relative group cursor-pointer"
                >
                  <div className="size-32 rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center space-y-1 bg-slate-50/50 hover:bg-slate-100 transition-all overflow-hidden relative">
                    {logoPreview ? (
                      <>
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="size-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Camera className="size-8 text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Upload Logo</span>
                      </>
                    )}
                  </div>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-1 -right-1 bg-slate-800 text-white rounded-full p-1 shadow-md hover:bg-slate-900 transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">PNG or JPG, max 2MB</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="station-name" className="text-slate-700 font-semibold">Station Name</Label>
                <Input
                  id="station-name"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  placeholder="e.g. Total Energies – Lekki Phase 1"
                  className="h-14 bg-white border-slate-200 rounded-lg text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-700 font-semibold">Station Address</Label>
                <Input
                  id="address"
                  value={stationAddress}
                  onChange={(e) => setStationAddress(e.target.value)}
                  placeholder="Enter full address"
                  className="h-14 bg-white border-slate-200 rounded-lg text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-semibold">Phone Number</Label>
                <div className="flex h-14">
                  <div className="flex items-center justify-center px-4 border border-r-0 border-slate-200 rounded-l-lg bg-slate-50 text-slate-800 font-bold text-lg leading-none">
                    +234
                  </div>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="optional"
                    className="h-full bg-white border-slate-200 rounded-l-none rounded-r-lg text-lg"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-16 bg-[#D9451B] hover:bg-[#C23C16] text-white text-xl font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
                >
                  Continue
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="px-6 space-y-6 max-w-lg mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <header className="flex items-center -ml-2 py-4">
              <button
                onClick={() => setStep(1)}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95"
              >
                <ArrowLeft className="size-7 text-slate-800" />
              </button>
              <h1 className="text-2xl font-bold text-slate-800 ml-2">Set Fuel Prices</h1>
            </header>

            <p className="text-slate-500 text-[15px] leading-relaxed -mt-4">
              Enter the prices for Petrol and Diesel at your station.
            </p>

            {/* Stepper */}
            <div className="flex items-center justify-center py-6">
              <div className="flex flex-col items-center">
                <div className="size-10 rounded-full bg-[#D9451B] flex items-center justify-center text-white">
                  <Check className="size-6" />
                </div>
                <span className="text-[13px] font-bold text-slate-700 mt-2">Details</span>
              </div>
              <div className="w-24 h-[2px] bg-slate-200 -mt-6 mx-2" />
              <div className="flex flex-col items-center">
                <div className="size-10 rounded-full border-2 border-[#D9451B] flex items-center justify-center text-[#D9451B] font-bold">
                  2
                </div>
                <span className="text-[13px] font-bold text-slate-700 mt-2">Prices</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Petrol Card */}
              <div className="overflow-hidden border rounded-xl shadow-sm bg-white">
                <div className="bg-[#109D3E] px-4 py-2 text-white font-bold text-xl">
                  Petrol
                </div>
                <div className="p-4 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg pointer-events-none pl-4 leading-none">
                    ₦
                  </div>
                  <Input
                    type="number"
                    value={petrolPrice}
                    onChange={(e) => setPetrolPrice(e.target.value)}
                    className="h-14 pl-12 pr-24 text-xl font-bold bg-slate-50 border-none rounded-lg"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pr-4 leading-none">
                    ₦ per liter
                  </div>
                </div>
              </div>

              {/* Diesel Card */}
              <div className="overflow-hidden border rounded-xl shadow-sm bg-white">
                <div className="bg-[#3B4453] px-4 py-2 text-white font-bold text-xl">
                  Diesel
                </div>
                <div className="p-4 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg pointer-events-none pl-4 leading-none">
                    ₦
                  </div>
                  <Input
                    type="number"
                    value={dieselPrice}
                    onChange={(e) => setDieselPrice(e.target.value)}
                    className="h-14 pl-12 pr-24 text-xl font-bold bg-slate-50 border-none rounded-lg"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pr-4 leading-none">
                    ₦ per liter
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id="authorized"
                  checked={isAuthorized}
                  onCheckedChange={(checked) => setIsAuthorized(checked as boolean)}
                  className="size-6 border-slate-300 data-[state=checked]:bg-[#D9451B] data-[state=checked]:border-[#D9451B]"
                />
                <label
                  htmlFor="authorized"
                  className="text-sm font-medium text-slate-600 cursor-pointer leading-tight"
                >
                  I confirm I am authorized to manage this station
                </label>
              </div>

              {/* Info Box */}
              <div className="bg-[#FFF3F0] p-4 rounded-xl flex items-start gap-3 border border-orange-100">
                <div className="size-5 bg-[#D9451B] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="size-3 text-white" />
                </div>
                <p className="text-[13px] text-slate-700 leading-tight">
                  Tap 'Finish' to complete your station registration. You can update fuel prices at any time.
                </p>
              </div>

              <div className="pt-4 pb-12">
                <Button
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className="w-full h-16 bg-[#D9451B] hover:bg-[#C23C16] text-white text-xl font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? 'Submitting...' : 'Finish'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
