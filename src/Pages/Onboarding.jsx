import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"; // If this fails, use "button"
import { Dumbbell, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleComplete = (goal) => {
    const finalData = {
      ...data,
      goal,
      unit_system: unitSystem,
      onboarded: true,
      full_name: "Athlete"
    };
    // Save to the key your Account/Dashboard pages are looking for
    localStorage.setItem('dyel-user', JSON.stringify(finalData));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Welcome</h1>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="flex p-1 bg-[#111] rounded-xl border border-white/5">
              {['imperial', 'metric'].map((u) => (
                <button
                  key={u}
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
                className="w-full bg-[#111] border border-white/10 h-14 rounded-xl px-4 text-xl font-black focus:border-orange-500 outline-none"
                onChange={(e) => setData({...data, height: e.target.value})}
              />
              <input
                type="number"
                placeholder={`Weight (${unitSystem === 'metric' ? 'kg' : 'lbs'})`}
                className="w-full bg-[#111] border border-white/10 h-14 rounded-xl px-4 text-xl font-black focus:border-orange-500 outline-none"
                onChange={(e) => setData({...data, weight: e.target.value})}
              />
            </div>

            <Button 
              onClick={() => setStep(2)}
              disabled={!data.height || !data.weight}
              className="w-full h-14 bg-orange-500 font-black uppercase italic tracking-tighter rounded-xl"
            >
              Continue <ChevronRight size={18} className="ml-2" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {GOALS.map((g) => (
              <button
                key={g.value}
                onClick={() => handleComplete(g.value)}
                className="w-full h-20 bg-[#111] border border-white/5 rounded-2xl text-left px-6 hover:border-orange-500 transition-all flex items-center gap-4"
              >
                <span className="text-2xl">{g.emoji}</span>
                <span className="text-lg font-black uppercase italic tracking-tighter">{g.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}