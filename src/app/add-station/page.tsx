"use client"

import { ArrowLeft, Camera, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function AddStationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      toast({
        variant: "destructive",
        title: "Authorization required",
        description: "Please confirm you are authorized to manage this station.",
      });
      return;
    }
    
    toast({
      title: "Station Registered",
      description: "Your station has been submitted successfully.",
    });
    router.push('/profile');
  };

  return (
    <div className="bg-white min-h-screen -mx-4 -mt-4 md:-mt-8 flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center px-4 py-4">
        <button 
          onClick={() => router.back()} 
          className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft className="size-7 text-slate-800" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800 ml-2">Register Your Station</h1>
      </header>

      <div className="px-6 space-y-8 max-w-lg mx-auto w-full">
        <p className="text-slate-500 text-[15px] leading-relaxed">
          Add your branch so drivers can find you and see real-time fuel prices.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
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
                  onClick={removeLogo}
                  className="absolute -top-1 -right-1 bg-slate-800 text-white rounded-full p-1 shadow-md hover:bg-slate-900 transition-colors"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">PNG or JPG, max 2MB</p>
          </div>

          {/* Station Name */}
          <div className="space-y-2">
            <Label htmlFor="station-name" className="text-slate-700 font-semibold">Station Name</Label>
            <Input 
              id="station-name" 
              placeholder="e.g. Total Energies – Lekki Phase 1" 
              className="h-14 bg-white border-slate-200 rounded-lg text-lg"
              required
            />
          </div>

          {/* Station Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-700 font-semibold">Station Address</Label>
            <Input 
              id="address" 
              placeholder="Enter full address" 
              className="h-14 bg-white border-slate-200 rounded-lg text-lg"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700 font-semibold">Phone Number</Label>
            <div className="flex">
              <div className="flex items-center justify-center px-4 border border-r-0 border-slate-200 rounded-l-lg bg-slate-50 text-slate-800 font-bold text-lg">
                +234
              </div>
              <Input 
                id="phone" 
                placeholder="optional" 
                className="h-14 bg-white border-slate-200 rounded-l-none rounded-r-lg text-lg"
              />
            </div>
          </div>

          {/* Authorization Checkbox */}
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

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit"
              className="w-full h-16 bg-[#D9451B] hover:bg-[#C23C16] text-white text-xl font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
            >
              Add Station
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
