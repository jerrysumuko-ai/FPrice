"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Pencil, PlusCircle, ChevronRight, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/signup');
        return;
      }

      setUserEmail(session.user.email ?? '');
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/signup');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/signup');
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen -mx-4 -mt-4 md:-mt-8 flex items-center justify-center">
        <div className="text-slate-400 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  const displayName = userEmail.split('@')[0];
  const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <div className="bg-white min-h-screen -mx-4 -mt-4 md:-mt-8 flex flex-col pb-24">
      {/* Header with Back button and Edit */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button 
          onClick={() => router.back()} 
          className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft className="size-6 text-slate-800" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Profile</h1>
        <button className="p-2 -mr-2 hover:bg-slate-50 rounded-full transition-colors border border-slate-200 shadow-sm active:scale-95">
          <Pencil className="size-5 text-slate-800" />
        </button>
      </header>

      <div className="px-6 py-10 flex flex-col items-center">
        {/* Profile Avatar/Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="size-36 rounded-full bg-slate-100 flex items-center justify-center mb-3 overflow-hidden border-4 border-white shadow-md ring-1 ring-slate-200">
             <User className="size-24 text-slate-300" />
          </div>
          <span className="text-slate-400 text-sm font-medium">Profile logo</span>
        </div>

        {/* User Identity Section */}
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{capitalized}</h2>
          <p className="text-slate-400">{userEmail}</p>
        </div>

        <Separator className="mb-10" />

        {/* Primary Action Button */}
        <Link href="/add-station" className="w-full">
          <button className="w-full h-16 bg-[#F24E1E] hover:bg-[#D9451B] active:scale-[0.98] transition-all text-white rounded-2xl flex items-center justify-center gap-3 text-xl font-bold shadow-lg shadow-orange-100">
            <PlusCircle className="size-7" />
            Add Station
          </button>
        </Link>

        {/* Menu Navigation */}
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

        {/* Centered Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full h-16 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 active:scale-[0.99] text-slate-800 font-bold text-lg rounded-2xl mt-12 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
