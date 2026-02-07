import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, User } from 'lucide-react';
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [user, setUser] = useState({ unit_system: 'metric', onboarded: true });

  // Load data from local storage
  useEffect(() => {
    const savedRecords = localStorage.getItem('dyel-records');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const weightUnit = user.unit_system === 'metric' ? 'kg' : 'lbs';

  // Logic to calculate Maxes
  const getBestOneRM = (exerciseName) => {
    const exerciseRecords = records.filter(r => 
      r.exercise_name?.toLowerCase().includes(exerciseName.toLowerCase())
    );
    return exerciseRecords.length > 0 
      ? Math.max(...exerciseRecords.map(r => r.one_rep_max || 0))
      : 0;
  };

  const powerliftingTotal = getBestOneRM('bench') + getBestOneRM('squat') + getBestOneRM('deadlift');

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <div className="max-w-md mx-auto">
        
        {/* TOP NAV - BRANDED VERSION WITH RESTORED ACCOUNT LOGO */}
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-4">
            {/* LOGO BOX - Fixed sizing */}
            <div className="w-40 h-40 flex items-center justify-center">
              <img
                src="/dyel-logo.png"
                alt="Logo"
                className="w-full h-full object-contain"
              /> 
            </div>

            {/* BRAND TEXT */}
            <div className="flex flex-col">
              <span className="text-[24px] text-orange-500 font-black uppercase tracking-tight leading-none mb-1">
                Lift Tracker
              </span>
              <h1 className="text-xl font-black uppercase tracking-tighter leading-none text-white/40">
                Dashboard
              </h1> 
            </div>
          </div>

          {/* ACCOUNT LOGO BUTTON */}
          <Button
            onClick={() => navigate('/profile')}
            variant="ghost"
            className="w-12 h-12 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center hover:border-orange-500/50"
          >
            <User className="text-orange-500 w-6 h-6" />
          </Button>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/new-record')}
            className="w-full bg-[#111] hover:bg-orange-500/10 text-white hover:text-orange-500 border border-white/10 hover:border-orange-500/50 rounded-2xl h-14 px-6 transition-all duration-300 active:scale-95 shadow-2xl flex items-center justify-center gap-2 font-black uppercase tracking-tighter text-sm"
          >
            <span className="font-black uppercase italic tracking-tighter text-sm">
              Add New Record
            </span>
            <Plus size={18} strokeWidth={3} />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Powerlifting Total Card */}
          <div className="bg-[#111] border-t-2 border-t-orange-500 border-x border-x-white/5 border-b border-b-white/5 p-6 rounded-3xl shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">
              Powerlifting Total (Squat + Deadlift + Bench)
            </p>
            <h2 className="text-4xl font-black italic tracking-tighter text-white">
              {powerliftingTotal} <span className="text-sm font-bold uppercase opacity-40">{weightUnit}</span>
            </h2>
          </div>

          {/* Last Session Card */}
          <div className="bg-[#111] border-t-2 border-t-orange-500 border-x border-x-white/5 border-b border-b-white/5 p-6 rounded-3xl shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">
              Last Session
            </p>
            <h2 className="text-xl font-black italic uppercase text-white/90">
              {records.length > 0 ? records[0].date : 'No data'}
            </h2>
          </div>
        </div>

        {/* Recent History */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Recent Records</h3>
          </div>
          
          {records.length === 0 ? (
            <div className="py-20 text-center bg-[#111] rounded-[2.5rem] border border-dashed border-white/10">
              <p className="text-white/20 font-bold italic uppercase tracking-widest">Time to hit the gym!</p>
            </div>
          ) : (
            records.map((r, i) => (
              <div key={i} className="bg-[#111] p-5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-orange-500/30 transition-all">
                <div>
                  <strong className="text-lg font-black uppercase italic tracking-tight">{r.exercise_name}</strong>
                  <div className="text-[10px] text-white/30 font-bold uppercase mt-1">{r.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-orange-500">{r.one_rep_max}</div>
                  <div className="text-[10px] font-bold text-white/30 uppercase">{weightUnit}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}