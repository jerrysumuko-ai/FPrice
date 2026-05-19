"use client"

import { ArrowLeft, Camera, X, Check, Info, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { createStation, uploadStationPhoto } from '@/lib/supabase-queries';

type GpsState = 'idle' | 'loading' | 'success' | 'error';

export default function AddStationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 fields
  const [stationName, setStationName] = useState('');
  const [stationAddress, setStationAddress] = useState('');
  const [phone, setPhone] = useState('');

  // Photo (required)
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // GPS (required)
  const [gpsState, setGpsState] = useState<GpsState>('idle');
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);

  // Step 2 fields
  const [petrolPrice, setPetrolPrice] = useState('680');
  const [dieselPrice, setDieselPrice] = useState('750');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File too large', description: 'Please select an image under 10MB.' });
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getMapTileUrl = (lat: number, lng: number) => {
    const z = 15;
    const x = Math.floor((lng + 180) / 360 * Math.pow(2, z));
    const latRad = lat * Math.PI / 180;
    const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * Math.pow(2, z));
    return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('GPS is not supported on this device.');
      setGpsState('error');
      return;
    }
    setGpsState('loading');
    setGpsError(null);

    const onSuccess = async (pos: GeolocationPosition) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setCoords({ lat, lng });
      setGpsState('success');
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
        );
        const data = await res.json();
        // Store the exact Nominatim display_name as the crowd-sourced place identifier
        if (data.display_name) setPlaceName(data.display_name);
        const addr = data.address ?? {};
        const parts = [
          addr.house_number ? `${addr.house_number} ${addr.road ?? ''}`.trim() : addr.road,
          addr.neighbourhood || addr.quarter || addr.suburb || addr.village,
          addr.city_district || addr.county,
          addr.city || addr.town || addr.state_district,
        ].filter(Boolean);
        if (parts.length > 0) setStationAddress(parts.join(', '));
      } catch {
        // silently ignore — user can type address manually
      }
    };

    const onError = (err: GeolocationPositionError) => {
      if (err.code === 1) {
        setGpsError('Location permission denied. Please allow GPS access in your browser settings.');
        setGpsState('error');
        return;
      }
      // High-accuracy timed out or position unavailable — retry with network-based location
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        () => {
          const msg =
            err.code === 3
              ? 'Location timed out. Move to an open area and try again.'
              : 'Could not get your location. Make sure location services are enabled.';
          setGpsError(msg);
          setGpsState('error');
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      toast({ variant: 'destructive', title: 'Photo required', description: 'Please take or upload a photo of the station.' });
      return;
    }
    if (!coords) {
      toast({ variant: 'destructive', title: 'Location required', description: 'Please tap "Get My Location" to capture your GPS coordinates.' });
      return;
    }
    setStep(2);
  };

  const handleFinish = async () => {
    if (!isAuthorized) {
      toast({ variant: 'destructive', title: 'Authorization required', description: 'Please confirm you are authorized to manage this station.' });
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
      // Upload the photo to Supabase Storage first
      const photoUrl = await uploadStationPhoto(photoFile!);

      await createStation({
        name: stationName,
        address: stationAddress,
        petrolPrice: petrol,
        dieselPrice: diesel,
        lat: coords!.lat,
        lng: coords!.lng,
        photoUrl,
        phone: phone || undefined,
        placeName: placeName ?? undefined,
      });

      toast({
        title: '🎉 Station submitted!',
        description: 'Your station is now in review. Thank you!',
        duration: 6000,
      });
      router.push('/');
    } catch (err: any) {
      const msg = err?.message ?? 'Please try again.';
      const isStorageErr = msg.toLowerCase().includes('bucket') || msg.toLowerCase().includes('storage');
      toast({
        variant: 'destructive',
        title: 'Could not submit station',
        description: isStorageErr
          ? 'Photo upload failed. Make sure the "station-photos" storage bucket exists in Supabase.'
          : msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen -mx-4 -mt-4 md:-mt-8 flex flex-col">
      <div className="bg-white min-h-screen w-full">
        {step === 1 ? (
          <div className="px-6 space-y-7 max-w-lg mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <header className="flex items-center -ml-2 py-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95">
                <ArrowLeft className="size-7 text-slate-800" />
              </button>
              <h1 className="text-2xl font-bold text-slate-800 ml-2">Register Your Station</h1>
            </header>

            <p className="text-slate-500 text-[15px] leading-relaxed -mt-2">
              You must be physically at the station to register it.
            </p>

            <form onSubmit={handleNextStep} className="space-y-7 pb-10">

              {/* ── Station Name ── */}
              <div className="space-y-2">
                <Label htmlFor="station-name" className="text-slate-700 font-semibold">Station Name <span className="text-red-500">*</span></Label>
                <Input
                  id="station-name"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  placeholder="e.g. Total Energies – Murtala Muhammed Way"
                  className="h-14 bg-white border-slate-200 rounded-lg text-base"
                  required
                />
              </div>

              {/* ── Address + Location ── */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-700 font-semibold">Address <span className="text-red-500">*</span></Label>
                <Input
                  id="address"
                  value={stationAddress}
                  onChange={(e) => setStationAddress(e.target.value)}
                  placeholder="Enter full address"
                  className="h-14 bg-white border-slate-200 rounded-lg text-base"
                  required
                />
                {gpsState === 'success' && (
                  <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <Info className="size-3 shrink-0" /> Auto-filled — please review and edit if needed.
                  </p>
                )}

                {/* Use Current Location card */}
                <div className={`flex rounded-xl overflow-hidden border ${gpsState === 'error' ? 'border-red-300' : 'border-slate-200'} h-14`}>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gpsState === 'loading'}
                    className="flex-1 flex items-center gap-3 px-4 bg-white hover:bg-slate-50 transition-colors active:bg-slate-100 disabled:opacity-60"
                  >
                    {gpsState === 'loading' ? (
                      <Loader2 className="size-5 text-[#1a73e8] animate-spin shrink-0" />
                    ) : gpsState === 'success' ? (
                      <CheckCircle2 className="size-5 text-green-600 shrink-0" />
                    ) : (
                      <MapPin className="size-5 text-[#1a73e8] shrink-0" />
                    )}
                    <span className={`text-sm font-medium ${gpsState === 'success' ? 'text-green-700' : gpsState === 'error' ? 'text-red-600' : 'text-slate-700'}`}>
                      {gpsState === 'loading' ? 'Getting location…' :
                       gpsState === 'success' ? 'Location captured — tap to update' :
                       gpsState === 'error' ? (gpsError ?? 'Try again') :
                       'Use Current Location'}
                    </span>
                  </button>
                  <div className="w-16 shrink-0 border-l border-slate-200 overflow-hidden bg-slate-100">
                    {coords ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getMapTileUrl(coords.lat, coords.lng)}
                        alt="map"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="size-5 text-slate-300" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Phone ── */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-semibold">Phone Number <span className="text-slate-400 font-normal">(optional)</span></Label>
                <div className="flex h-14">
                  <div className="flex items-center justify-center px-4 border border-r-0 border-slate-200 rounded-l-lg bg-slate-50 text-slate-800 font-bold text-base leading-none">
                    +234
                  </div>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Station phone number"
                    className="h-full bg-white border-slate-200 rounded-l-none rounded-r-lg text-base"
                  />
                </div>
              </div>

              {/* ── Photo (required) ── */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">
                  Station Photo <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-slate-400">Take or upload a clear photo of the station. This helps with verification.</p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />

                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#D9451B]">
                    <div className="relative w-full h-52">
                      <Image src={photoPreview} alt="Station photo" fill className="object-cover" />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/90 backdrop-blur-sm text-slate-800 rounded-full px-3 py-1.5 text-xs font-bold shadow flex items-center gap-1"
                      >
                        <Camera className="size-3.5" /> Change
                      </button>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="bg-white/90 backdrop-blur-sm text-red-600 rounded-full p-1.5 shadow"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white rounded-full px-2.5 py-1 text-xs font-bold flex items-center gap-1">
                      <Check className="size-3" /> Photo captured
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-44 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <div className="size-14 rounded-full bg-slate-200 flex items-center justify-center">
                      <Camera className="size-7 text-slate-500" />
                    </div>
                    <span className="text-sm font-bold text-slate-600">Tap to take / upload photo</span>
                    <span className="text-xs text-slate-400">JPG or PNG, up to 10MB</span>
                  </button>
                )}
              </div>


              <div className="pt-2 pb-12">
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
              <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95">
                <ArrowLeft className="size-7 text-slate-800" />
              </button>
              <h1 className="text-2xl font-bold text-slate-800 ml-2">Set Fuel Prices</h1>
            </header>

            {/* Stepper */}
            <div className="flex items-center justify-center py-4">
              <div className="flex flex-col items-center">
                <div className="size-10 rounded-full bg-[#D9451B] flex items-center justify-center text-white">
                  <Check className="size-6" />
                </div>
                <span className="text-[13px] font-bold text-slate-700 mt-2">Details</span>
              </div>
              <div className="w-24 h-[2px] bg-[#D9451B] -mt-6 mx-2" />
              <div className="flex flex-col items-center">
                <div className="size-10 rounded-full border-2 border-[#D9451B] flex items-center justify-center text-[#D9451B] font-bold">
                  2
                </div>
                <span className="text-[13px] font-bold text-slate-700 mt-2">Prices</span>
              </div>
            </div>

            {/* Pending notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-4 flex items-start gap-3">
              <Info className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">Pending review</p>
                <p className="text-xs text-amber-700 leading-snug mt-0.5">
                  Your station will be reviewed before appearing publicly in the app.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Petrol */}
              <div className="overflow-hidden border rounded-xl shadow-sm bg-white">
                <div className="bg-[#109D3E] px-4 py-2 text-white font-bold text-xl">Petrol</div>
                <div className="p-4 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg pointer-events-none pl-4 leading-none">₦</div>
                  <Input
                    type="number"
                    min="1"
                    value={petrolPrice}
                    onChange={(e) => setPetrolPrice(e.target.value)}
                    className="h-14 pl-12 pr-24 text-xl font-bold bg-slate-50 border-none rounded-lg"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pr-4 leading-none">₦ per litre</div>
                </div>
              </div>

              {/* Diesel */}
              <div className="overflow-hidden border rounded-xl shadow-sm bg-white">
                <div className="bg-[#3B4453] px-4 py-2 text-white font-bold text-xl">Diesel</div>
                <div className="p-4 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg pointer-events-none pl-4 leading-none">₦</div>
                  <Input
                    type="number"
                    min="1"
                    value={dieselPrice}
                    onChange={(e) => setDieselPrice(e.target.value)}
                    className="h-14 pl-12 pr-24 text-xl font-bold bg-slate-50 border-none rounded-lg"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pr-4 leading-none">₦ per litre</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id="authorized"
                  checked={isAuthorized}
                  onCheckedChange={(v) => setIsAuthorized(v as boolean)}
                  className="size-6 border-slate-300 data-[state=checked]:bg-[#D9451B] data-[state=checked]:border-[#D9451B]"
                />
                <label htmlFor="authorized" className="text-sm font-medium text-slate-600 cursor-pointer leading-tight">
                  I confirm I am authorized to represent this station
                </label>
              </div>

              <div className="pt-4 pb-12">
                <Button
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className="w-full h-16 bg-[#D9451B] hover:bg-[#C23C16] text-white text-xl font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><Loader2 className="size-5 animate-spin" /> Submitting…</span>
                  ) : 'Finish'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
