import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ChevronRight } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';
// 1. IMPORT YOUR LOGO HERE
import logoIcon from '../assets/icon-only.png'; 

const GOALS = [
  { value: 'gain_muscle', label: 'Gain Muscle', emoji: '💪' },
  { value: 'get_stronger', label: 'Get Stronger', emoji: '🏋️' },
  { value: 'lose_weight', label: 'Lose Weight', emoji: '🔥' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [unitSystem, setUnitSystem] = useState('metric');
  const [data, setData] = useState({
    height: '',
    weight: '',
  });

  const handleComplete = async (goal) => {
    const finalData = {
      ...data,
      goal,
      unit_system: unitSystem,
      onboarded: true,
      full_name: "Athlete"
    };

    await Preferences.set({
      key: 'dyel-user',
      value: JSON.stringify(finalData),
    });

    await Preferences.set({
      key: 'has_onboarded',
      value: 'true',
    });

    window.location.href = '/'; 
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(255,255,255,0.2)]">
            {/* 2. FIXED IMAGE TAG */}
            <img src={logoIcon} alt="Logo" className="w-30 h-30 object-contain" />
          </div>
          
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-tight">
            <span className="text-orange-500">DYEL?</span>
            <br />
            <span className="text-white">Lift Tracker</span>
          </h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-3">
            Serious Tracking for Serious Gains
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="flex p-1 bg-[#111] rounded-xl border border-white/5">
              {['imperial', 'metric'].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnitSystem(u)}
                  className={`flex-1 h-10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    unitSystem === u ? 'bg-orange-500 text-white' : 'text-white/40'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <input
                type="number"
                placeholder={`Height (${unitSystem === 'metric' ? 'cm' : 'in'})`}
                className="w-full bg-[#111] border border-white/10 h-16 rounded-2xl px-5 text-xl font-black focus:border-orange-500 outline-none text-white"
                value={data.height}
                onChange={(e) => setData({...data, height: e.target.value})}
              />
              <input
                type="number"
                placeholder={`Weight (${unitSystem === 'metric' ? 'kg' : 'lbs'})`}
                className="w-full bg-[#111] border border-white/10 h-16 rounded-2xl px-5 text-xl font-black focus:border-orange-500 outline-none text-white"
                value={data.weight}
                onChange={(e) => setData({...data, weight: e.target.value})}
              />
            </div>

            <button 
              type="button"
              onClick={() => setStep(2)}
              disabled={!data.height || !data.weight}
              className="w-full h-16 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black uppercase italic tracking-tighter rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-orange-500/20"
            >
              Next Step <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-center text-white/50 font-bold uppercase text-[10px] tracking-widest mb-6">Choose Your Primary Goal</h2>
            {GOALS.map((g) => (
              <button
                key={g.value}
                onClick={() => handleComplete(g.value)}
                className="w-full h-20 bg-[#111] border border-white/5 rounded-2xl text-left px-6 hover:border-orange-500 hover:bg-orange-500/5 transition-all flex items-center gap-5 group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{g.emoji}</span>
                <span className="text-lg font-black uppercase italic tracking-tighter">{g.label}</span>
              </button>
            ))}
            <button onClick={() => setStep(1)} className="w-full py-4 text-white/30 text-[10px] font-black uppercase tracking-widest">Go Back</button>
          </div>
        )}
      </div>
    </div>
  );
}