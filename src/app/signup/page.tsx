"use client"

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserCircle2 } from 'lucide-react';
import { saveUser } from '@/lib/auth';
import { Suspense } from 'react';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/profile';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    saveUser({ name: name.trim(), phone: phone.trim() });
    router.replace(redirect);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 -mx-4 -mt-4 md:-mt-8">
      <div className="w-full max-w-[360px] bg-white rounded-[2rem] p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors text-sm font-medium -mb-2"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <div className="flex flex-col items-center space-y-3">
          <div className="size-20 rounded-full bg-orange-50 flex items-center justify-center">
            <UserCircle2 className="size-12 text-[#D9451B]" />
          </div>
          <div className="text-center">
            <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight leading-tight">
              Create Account
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Sign up to add and manage stations
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[14px] font-semibold text-slate-700">
              Full Name
            </Label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-14 px-5 rounded-2xl bg-[#F1F3F4] border-transparent border text-slate-900 text-lg placeholder:text-slate-400 font-medium outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[14px] font-semibold text-slate-700">
              Phone Number <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <div className="flex h-14 rounded-2xl overflow-hidden bg-[#F1F3F4] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
              <span className="flex items-center px-4 text-slate-800 font-bold text-lg border-r border-slate-200 shrink-0">
                +234
              </span>
              <input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-transparent px-4 text-slate-900 text-lg placeholder:text-slate-400 font-medium outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full h-14 bg-[#D9451B] hover:bg-[#C23C16] text-white text-lg font-bold rounded-2xl shadow-lg shadow-orange-100 transition-all active:scale-[0.98] disabled:opacity-60 mt-2"
          >
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
