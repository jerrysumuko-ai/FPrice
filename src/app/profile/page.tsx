"use client"

import { useEffect, useState, useRef } from 'react';
import {
  ArrowLeft, PlusCircle, ChevronRight, User, LogOut,
  Moon, Sun, Share2, Pencil, Check, X, MapPin, Loader2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useTheme } from '@/hooks/use-theme';
import type { User as SupabaseUser } from '@supabase/supabase-js';

function formatJoinDate(dateStr: string | undefined) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme, mounted } = useTheme();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [displayName, setDisplayName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [location, setLocation] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    const savedLocation = localStorage.getItem('fuelfinder_location');
    if (savedLocation) setLocation(savedLocation);
  }, []);

  const fetchLocation = () => {
    if (!navigator.geolocation) return;
    setLocationLoading(true);

    const resolveLabel = async (latitude: number, longitude: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
        );
        const data = await res.json();
        const addr = data.address ?? {};
        const district =
          addr.city_district || addr.county || addr.suburb || addr.neighbourhood || '';
        const city = addr.city || addr.town || addr.village || '';
        const label = [district, city].filter(Boolean).join(', ');
        if (label) {
          setLocation(label);
          localStorage.setItem('fuelfinder_location', label);
        }
      } catch {
        // silently ignore
      } finally {
        setLocationLoading(false);
      }
    };

    const onError = () => {
      // High-accuracy failed — retry with network-based location
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolveLabel(coords.latitude, coords.longitude),
        () => setLocationLoading(false),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    };

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolveLabel(coords.latitude, coords.longitude),
      onError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);

      if (u) {
        const saved = localStorage.getItem(`displayName:${u.id}`);
        if (saved) {
          setDisplayName(saved);
        } else {
          const derived = u.email
            ? u.email.split('@')[0].charAt(0).toUpperCase() + u.email.split('@')[0].slice(1)
            : u.phone ?? 'User';
          setDisplayName(derived);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleAddStation = () => {
    if (!user) router.push('/signup?redirect=/add-station');
    else router.push('/add-station');
  };

  const startEditing = () => {
    setNameInput(displayName);
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  const saveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed && user) {
      setDisplayName(trimmed);
      localStorage.setItem(`displayName:${user.id}`, trimmed);
    }
    setEditingName(false);
  };

  const cancelEdit = () => {
    setEditingName(false);
    setNameInput('');
  };

  const handleShare = async () => {
    const url = window.location.origin;
    const text = `Find real-time fuel prices in Calabar with FuelFinder! ${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Calabar FuelFinder', text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  if (loading) return null;

  const subtitle = user?.email ?? user?.phone ?? 'Calabar FuelFinder';
  const joinDate = formatJoinDate(user?.created_at);
  const isDark = theme === 'dark';

  return (
    <div className="bg-[#F8F9FA] min-h-screen -mx-4 -mt-4 md:-mt-8 flex flex-col pb-24">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft className="size-6 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Profile</h1>
        <div className="w-10" />
      </header>

      <div className="px-6 py-10 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <div className="size-36 rounded-full bg-muted flex items-center justify-center mb-3 overflow-hidden border-4 border-background shadow-md ring-1 ring-border">
            <User className="size-24 text-muted-foreground" />
          </div>
          {user && (
            <span className="text-muted-foreground text-sm font-medium">Member</span>
          )}
        </div>

        <div className="text-center space-y-1 mb-2 w-full max-w-xs">
          {editingName ? (
            <div className="flex items-center gap-2 justify-center">
              <input
                ref={nameInputRef}
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelEdit(); }}
                className="text-2xl font-black text-foreground tracking-tight bg-muted rounded-xl px-3 py-1 outline-none border-2 border-primary w-full text-center"
                maxLength={32}
              />
              <button onClick={saveName} className="p-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors shrink-0">
                <Check className="size-4" />
              </button>
              <button onClick={cancelEdit} className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors shrink-0">
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-3xl font-black text-foreground tracking-tight">{displayName}</h2>
              {user && (
                <button
                  onClick={startEditing}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </button>
              )}
            </div>
          )}
          {user && <p className="text-muted-foreground text-sm truncate max-w-xs">{subtitle}</p>}
          <button
            onClick={fetchLocation}
            disabled={locationLoading}
            className="flex items-center justify-center gap-1.5 mx-auto mt-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-60"
          >
            {locationLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <MapPin className="size-3.5" />
            )}
            <span>{location ?? 'Add location'}</span>
          </button>
          {joinDate && (
            <p className="text-muted-foreground text-xs font-medium pt-0.5">
              Joined {joinDate}
            </p>
          )}
        </div>

        <Separator className="my-8" />

        <button
          onClick={handleAddStation}
          className="w-full h-16 bg-[#F24E1E] hover:bg-[#D9451B] active:scale-[0.98] transition-all text-white rounded-2xl flex items-center justify-center gap-3 text-xl font-bold shadow-lg shadow-orange-100"
        >
          <PlusCircle className="size-7" />
          Add Station
        </button>

        <div className="w-full mt-6 space-y-0 rounded-2xl overflow-hidden border border-border">
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-between px-5 py-5 bg-card border-b border-border group text-left active:bg-muted/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center">
                <Share2 className="size-4 text-[#F24E1E]" />
              </div>
              <span className="text-base text-foreground font-semibold">Invite a Friend</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-active:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-full flex items-center justify-between px-5 py-5 bg-card border-b border-border group text-left active:bg-muted/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {mounted && isDark
                  ? <Sun className="size-4 text-amber-500" />
                  : <Moon className="size-4 text-slate-600 dark:text-slate-300" />
                }
              </div>
              <span className="text-base text-foreground font-semibold">
                {mounted && isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 ${mounted && isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div className={`size-4 rounded-full bg-white shadow transition-transform duration-300 ${mounted && isDark ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>

          <button className="w-full flex items-center justify-between px-5 py-5 bg-card border-b border-border group text-left active:bg-muted/60 transition-colors">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                <ChevronRight className="size-4 text-blue-500" />
              </div>
              <span className="text-base text-foreground font-semibold">Help & Support</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-active:translate-x-1 transition-transform" />
          </button>

          <button className="w-full flex items-center justify-between px-5 py-5 bg-card group text-left active:bg-muted/60 transition-colors">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <ChevronRight className="size-4 text-slate-500" />
              </div>
              <span className="text-base text-foreground font-semibold">Settings</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-active:translate-x-1 transition-transform" />
          </button>
        </div>

        {user ? (
          <button
            onClick={handleLogout}
            className="w-full h-16 bg-muted hover:bg-muted/80 active:scale-[0.99] text-foreground font-bold text-lg rounded-2xl mt-8 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="size-5" />
            Log Out
          </button>
        ) : (
          <Link href="/signup" className="w-full mt-8 block">
            <button className="w-full h-12 bg-[#C2410C] hover:bg-[#A6330A] text-white font-bold text-base rounded-xl shadow-md shadow-orange-100 transition-all active:scale-[0.98] flex items-center justify-center">
              Sign Up / Log In
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
