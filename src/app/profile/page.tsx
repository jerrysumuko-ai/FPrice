"use client"

import { User, Settings, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const menuItems = [
    { icon: Settings, label: 'Settings', color: 'text-slate-600' },
    { icon: Bell, label: 'Notifications', color: 'text-slate-600' },
    { icon: Shield, label: 'Privacy & Security', color: 'text-slate-600' },
  ];

  return (
    <div className="bg-white min-h-screen -mx-4 -mt-4 md:-mt-8">
      <div className="p-4 pt-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Profile</h1>
        
        <div className="flex items-center gap-4 mb-8 p-1">
          <Avatar className="size-20 border-2 border-slate-100">
            <AvatarFallback className="bg-slate-100">
              <User className="size-10 text-slate-400" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800">Calabar User</h2>
            <p className="text-sm text-slate-500">user@example.com</p>
          </div>
        </div>

        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button className="w-full flex items-center gap-4 py-4 px-2 hover:bg-slate-50 active:bg-slate-100 transition-colors group">
                <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <item.icon className={`size-5 ${item.color}`} />
                </div>
                <span className="flex-1 text-left text-[17px] font-medium text-slate-800">{item.label}</span>
                <ChevronRight className="size-5 text-slate-300" />
              </button>
              {index < menuItems.length - 1 && <Separator className="ml-14 bg-slate-100" />}
            </div>
          ))}
          
          <Separator className="my-4" />
          
          <button className="w-full flex items-center gap-4 py-4 px-2 hover:bg-red-50 active:bg-red-100 transition-colors group">
            <div className="size-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <LogOut className="size-5 text-red-600" />
            </div>
            <span className="flex-1 text-left text-[17px] font-medium text-red-600">Log Out</span>
            <ChevronRight className="size-5 text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
