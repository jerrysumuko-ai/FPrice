"use client"

import { useEffect, useState } from 'react';
import { ArrowLeft, PlusCircle, ChevronRight, User, LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
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
    if (!user) {
      router.push('/signup?redirect=/add-station');
    } else {
      router.push('/add-station');
    }
  };

  if (loading) return null;

  const displayName = user?.email
    ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
    : user?.phone
    ? user.phone
    : 'Guest';

  const subtitle = user?.email ?? user?.phone ?? 'Calabar FuelFinder';

  return (
    <div className="bg-white min-h-screen -mx-4 -mt-4 md:-mt-8 flex flex-col pb-24">
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft className="size-6 text-slate-800" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Profile</h1>
        <div className="w-10" />
      </header>

      <div className="px-6 py-10 flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <div className="size-36 rounded-full bg-slate-100 flex items-center justify-center mb-3 overflow-hidden border-4 border-white shadow-md ring-1 ring-slate-200">
            <User className="size-24 text-slate-300" />
          </div>
          <span className="text-slate-400 text-sm font-medium">
            {user ? 'Member' : 'Guest User'}
          </span>
        </div>

        <div className="text-center space-y-1 mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{displayName}</h2>
          <p className="text-slate-400 text-sm truncate max-w-xs">{subtitle}</p>
        </div>

        <Separator className="mb-10" />

        <button
          onClick={handleAddStation}
          className="w-full h-16 bg-[#F24E1E] hover:bg-[#D9451B] active:scale-[0.98] transition-all text-white rounded-2xl flex items-center justify-center gap-3 text-xl font-bold shadow-lg shadow-orange-100"
        >
          <PlusCircle className="size-7" />
          Add Station
        </button>

        <div className="w-full mt-10 space-y-0">
          <button className="w-full flex items-center justify-between py-6 border-b border-slate-100 group text-left active:bg-slate-50/50 transition-colors">
            <span className="text-lg text-slate-600 font-medium group-hover:text-slate-900">Help & Support</span>
            <ChevronRight className="size-5 text-slate-400 group-active:translate-x-1 transition-transform" />
          </button>
          <button className="w-full flex items-center justify-between py-6 border-b border-slate-100 group text-left active:bg-slate-50/50 transition-colors">
            <span className="text-lg text-slate-600 font-medium group-hover:text-slate-900">Settings</span>
            <ChevronRight className="size-5 text-slate-400 group-active:translate-x-1 transition-transform" />
          </button>
        </div>

        {user ? (
          <button
            onClick={handleLogout}
            className="w-full h-16 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 active:scale-[0.99] text-slate-800 font-bold text-lg rounded-2xl mt-12 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="size-5" />
            Log Out
          </button>
        ) : (
          <Link href="/signup" className="w-full mt-12">
            <button className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-2xl transition-all flex items-center justify-center">
              Sign Up / Log In
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
