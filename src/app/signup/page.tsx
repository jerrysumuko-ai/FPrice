"use client"

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle2, ArrowLeft, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Method = 'phone' | 'email';
type Step = 'enter' | 'verify';

function SignUpForm() {
  const [method, setMethod] = useState<Method>('email');
  const [step, setStep] = useState<Step>('enter');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/profile';
  const { toast } = useToast();
  const supabase = createClient();

  const fullPhone = phoneNumber
    ? `+234${phoneNumber.replace(/^0+/, '').replace(/\D/g, '')}`
    : '';

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const { error } =
        method === 'email'
          ? await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
          : await supabase.auth.signInWithOtp({ phone: fullPhone, options: { shouldCreateUser: true } });

      if (error) throw error;

      setStep('verify');
      toast({
        title: 'Code sent',
        description:
          method === 'email'
            ? `Check ${email} for your 6-digit code.`
            : `We sent a 6-digit code to ${fullPhone}.`,
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Could not send code',
        description: err?.message ?? 'Please try again.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setIsVerifying(true);
    try {
      let success = false;
      let lastError: any = null;

      if (method === 'email') {
        for (const type of ['email', 'signup', 'magiclink'] as const) {
          const res = await supabase.auth.verifyOtp({ email, token: code, type });
          if (!res.error) { success = true; break; }
          lastError = res.error;
        }
      } else {
        const res = await supabase.auth.verifyOtp({ phone: fullPhone, token: code, type: 'sms' });
        if (!res.error) success = true;
        else lastError = res.error;
      }

      if (!success) throw lastError ?? new Error('Verification failed');

      // Persist display name from first + last name
      const session = (await supabase.auth.getSession()).data.session;
      if (session?.user && firstName.trim()) {
        const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
        localStorage.setItem(`displayName:${session.user.id}`, name);
      }

      toast({ title: 'Welcome!', description: 'You are now signed in.' });
      window.location.assign(redirect);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Invalid code',
        description: err?.message ?? 'Check the code and try again.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-4 py-8 -mx-4 -mt-4 md:-mt-8">
      <div className="w-full max-w-[420px] bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="space-y-1">
          <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight leading-tight">
            {step === 'enter' ? 'Sign Up' : 'Enter Code'}
          </h1>
          <p className="text-slate-400 text-base font-normal">
            {step === 'enter'
              ? 'Create your account to get started'
              : `We sent a 6-digit code to your ${method}`}
          </p>
        </div>

        {step === 'enter' ? (
          <div className="space-y-6 pt-2">
            {/* First name + Last name */}
            <div className="flex flex-row gap-3">
              {/* First Name */}
              <div className="flex-1 min-w-0 space-y-1">
                <Label htmlFor="firstName" className="text-[13px] font-semibold text-slate-500 ml-1 block">
                  First Name
                </Label>
                <div className="flex items-center bg-[#F1F3F4] border border-slate-200 rounded-xl px-3 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-300 transition-all">
                  <User className="size-4 text-slate-400 shrink-0" />
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900 placeholder:text-slate-400 font-medium min-w-0"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* Last Name */}
              <div className="flex-1 min-w-0 space-y-1">
                <Label htmlFor="lastName" className="text-[13px] font-semibold text-slate-500 ml-1 block">
                  Last Name
                </Label>
                <div className="flex items-center bg-[#F1F3F4] border border-slate-200 rounded-xl px-3 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-300 transition-all">
                  <User className="size-4 text-slate-400 shrink-0" />
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900 placeholder:text-slate-400 font-medium min-w-0"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <h2 className="text-[18px] font-bold text-[#0F172A]">Verify with One-Time Code</h2>

            <div className="flex bg-[#F1F3F4] rounded-2xl p-1">
              <button
                type="button"
                onClick={() => setMethod('phone')}
                className={`flex-1 h-11 rounded-xl text-[14px] font-bold transition-all ${
                  method === 'phone'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Phone
              </button>
              <button
                type="button"
                onClick={() => setMethod('email')}
                className={`flex-1 h-11 rounded-xl text-[14px] font-bold transition-all ${
                  method === 'email'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Email
              </button>
            </div>

            <form onSubmit={handleSendCode} className="space-y-6">
              {method === 'phone' ? (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[14px] font-semibold text-slate-700 ml-1">
                    Phone Number
                  </Label>
                  <div className="relative flex items-center bg-[#F1F3F4] rounded-2xl h-14 px-6 focus-within:ring-2 ring-orange-500/20 transition-all border border-transparent overflow-hidden">
                    <span className="text-lg font-bold text-slate-800 whitespace-nowrap leading-none flex items-center h-full">
                      +234
                    </span>
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
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[14px] font-semibold text-slate-700 ml-1">
                    Email Address
                  </Label>
                  <div className="relative flex items-center bg-[#F1F3F4] rounded-2xl h-14 px-6 focus-within:ring-2 ring-orange-500/20 transition-all border border-transparent overflow-hidden">
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-transparent border-none outline-none flex-1 text-lg text-slate-900 placeholder:text-slate-400 font-medium leading-none h-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSending}
                className="w-full h-14 bg-[#C2410C] hover:bg-[#A6330A] text-white text-lg font-bold rounded-2xl shadow-lg shadow-orange-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSending ? 'Sending...' : (
                  <>
                    Send Code
                    <CheckCircle2 className="size-5 ml-1" />
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6 pt-2">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-[14px] font-semibold text-slate-700 ml-1">
                Verification Code
              </Label>
              <div className="relative flex items-center bg-[#F1F3F4] rounded-2xl h-14 px-6 focus-within:ring-2 ring-orange-500/20 transition-all border border-transparent overflow-hidden">
                <input
                  id="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter your 6-digit code"
                  className="bg-transparent border-none outline-none flex-1 text-lg text-slate-900 placeholder:text-slate-400 font-medium leading-none h-full"
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                  required
                />
              </div>
              <p className="text-xs text-slate-500 ml-1">
                Sent to{' '}
                <span className="font-semibold text-slate-700">
                  {method === 'email' ? email : fullPhone}
                </span>
              </p>
            </div>

            <Button
              type="submit"
              disabled={isVerifying || !code.trim()}
              className="w-full h-14 bg-[#C2410C] hover:bg-[#A6330A] text-white text-lg font-bold rounded-2xl shadow-lg shadow-orange-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Continue'}
            </Button>

            <button
              type="button"
              onClick={() => { setStep('enter'); setCode(''); }}
              className="w-full text-slate-500 text-sm font-medium flex items-center justify-center gap-1 hover:text-slate-800"
            >
              <ArrowLeft className="size-4" />
              Use a different {method === 'email' ? 'email' : 'phone number'}
            </button>
          </form>
        )}
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
