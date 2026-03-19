
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 -mx-4 -mt-4 md:-mt-8">
      <div className="w-full max-w-[360px] bg-white rounded-[2rem] p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
        {/* Header Section */}
        <div className="space-y-1">
          <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight leading-tight">Sign Up</h1>
          <p className="text-slate-400 text-base font-normal">Create your account to get started</p>
        </div>

        {/* Verification Section */}
        <div className="space-y-6 pt-2">
          <h2 className="text-[18px] font-bold text-[#0F172A]">Verify with One-Time Code</h2>
          
          <form onSubmit={handleSendCode} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[14px] font-semibold text-slate-700 ml-1">Phone Number</Label>
              <div className="relative flex items-center bg-[#F1F3F4] rounded-2xl h-14 px-6 focus-within:ring-2 ring-orange-500/20 transition-all border border-transparent overflow-hidden">
                <span className="text-lg font-bold text-slate-800 whitespace-nowrap leading-none flex items-center h-full">+234</span>
                <div className="w-[1px] h-6 bg-slate-300 mx-4 shrink-0" />
                <input 
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="bg-transparent border-none outline-none flex-1 text-lg text-slate-900 placeholder:text-slate-400 font-medium leading-none h-full"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-14 bg-[#C2410C] hover:bg-[#A6330A] text-white text-lg font-bold rounded-2xl shadow-lg shadow-orange-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Send Code
              <CheckCircle2 className="size-5 ml-1" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
