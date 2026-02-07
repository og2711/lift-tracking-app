import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, User, Settings, Shield } from 'lucide-react';
import { Button } from "../components/ui/button";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-white bg-[#111]"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-black uppercase italic tracking-tighter">Account</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 text-center mb-6">
          <div className="w-20 h-20 bg-orange-500 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl shadow-orange-500/20">
            <User size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-black uppercase italic">Athlete</h2>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-1">Premium Member</p>
        </div>

        {/* Menu Options */}
        <div className="space-y-3">
          <Button className="w-full h-16 bg-[#111] border border-white/5 rounded-2xl justify-start px-6 gap-4 hover:border-orange-500/50 transition-all">
            <Settings size={20} className="text-orange-500" />
            <span className="font-black uppercase italic text-sm">Settings</span>
          </Button>
          
          <Button className="w-full h-16 bg-[#111] border border-white/5 rounded-2xl justify-start px-6 gap-4 hover:border-orange-500/50 transition-all">
            <Shield size={20} className="text-orange-500" />
            <span className="font-black uppercase italic text-sm">Privacy</span>
          </Button>

          <Button 
            variant="destructive"
            className="w-full h-16 bg-red-500/10 border border-red-500/20 rounded-2xl justify-start px-6 gap-4 hover:bg-red-500 hover:text-white transition-all group"
            onClick={() => {/* Add logout logic here */}}
          >
            <LogOut size={20} className="text-red-500 group-hover:text-white" />
            <span className="font-black uppercase italic text-sm">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}