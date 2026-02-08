import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { saveLift } from '../api'; // Added for cloud sync

const EXERCISE_DEFAULTS = {
  Chest: ["Bench Press (Barbell)", "Incline DB Press", "Cable Flys", "Chest Press Machine", "Dips"],
  Back: ["Deadlift", "Lat Pulldown", "Bent Over Row", "Seated Cable Row", "Pull Ups"],
  Legs: ["Back Squat", "Leg Press", "Lying Leg Curl", "Bulgarian Split Squat", "Leg Extension"],
  Shoulders: ["Overhead Press", "Lateral Raise", "Rear Delt Fly", "Arnold Press"],
  Arms: ["Barbell Curl", "Tricep Pushdown", "Hammer Curls", "Skullcrushers"],
  Core: ["Hanging Leg Raise", "Plank", "Ab Wheel Rollout"],
  Triceps: ["Tricep Pushdown", "Skullcrushers", "Dips", "Overhead Extension"],
  Biceps: ["Barbell Curl", "Hammer Curl", "Preacher Curl", "Incline DB Curl"]
};

const BODY_PARTS = [
  { value: 'Chest', label: 'Chest' },
  { value: 'Back', label: 'Back' },
  { value: 'Triceps', label: 'Triceps' },
  { value: 'Legs', label: 'Legs' },
  { value: 'Biceps', label: 'Biceps' },
  { value: 'Core', label: 'Core' },
  { value: 'Shoulders', label: 'Shoulders' },
];

export default function NewRecord() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [records, setRecords] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [record, setRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    body_part: '',
    exercise_name: '',
    training_split: '',
    warmup_weight: '',
    working_weight: '',
    max_reps: '',
    max_sets: '1',
    one_rep_max: 0,
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('dyel-records') || '[]');
    setRecords(saved);
  }, []);

  useEffect(() => {
    if (record.working_weight && record.max_reps) {
      const weight = parseFloat(record.working_weight);
      const reps = parseFloat(record.max_reps);
      if (weight > 0 && reps > 0 && reps < 37 && !record.one_rep_max) {
        const oneRM = Math.round(weight * (36 / (37 - reps)));
        setRecord(prev => ({ ...prev, one_rep_max: oneRM }));
      }
    }
  }, [record.working_weight, record.max_reps]);

  const exerciseHistory = records.filter(r => 
    r.exercise_name && record.exercise_name &&
    r.exercise_name.toLowerCase() === record.exercise_name.toLowerCase()
  );
  
  const personalBest = exerciseHistory.length > 0 
    ? Math.max(...exerciseHistory.map(r => r.one_rep_max || 0)) 
    : 0;

  // UPDATED HANDLE SAVE: Logic stays same, plus adds cloud sync
  const handleSave = async () => {
    setIsSyncing(true);
    try {
      // 1. Save to Cloud
      await saveLift({
        exercise_name: record.exercise_name,
        weight: record.working_weight,
        reps: record.max_reps,
        notes: `1RM: ${record.one_rep_max} | Type: ${record.training_split}`,
        date: record.date
      });

      // 2. Save to Local (Original Logic)
      const updatedRecords = [record, ...records];
      localStorage.setItem('dyel-records', JSON.stringify(updatedRecords));
      
      navigate('/');
    } catch (err) {
      console.error("Cloud save failed, saving locally only.");
      const updatedRecords = [record, ...records];
      localStorage.setItem('dyel-records', JSON.stringify(updatedRecords));
      navigate('/');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-125 mx-auto flex flex-col min-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-white"
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-black uppercase italic tracking-tighter">Log PR</h1>
            <div className="flex gap-1 mt-2">
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-white/10'}`} />
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-white/10'}`} />
              <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-orange-500' : 'bg-white/10'}`} />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-3"
            >
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] text-center mb-4">Step 01: Select Body Part</p>
              {BODY_PARTS.map((part) => (
                <Button 
                  key={part.value} 
                  className="h-16 justify-between bg-[#111] border border-white/5 hover:border-orange-500/50 rounded-2xl text-lg px-6 font-bold uppercase italic transition-all active:scale-95"
                  onClick={() => { setRecord({...record, body_part: part.value}); setStep(2); }}
                >
                  {part.label}
                  <ChevronRight size={18} className="text-orange-500" />
                </Button>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] text-center mb-4">Step 02: Select Exercise</p>
                <div className="grid grid-cols-1 gap-2 mb-6">
                  {EXERCISE_DEFAULTS[record.body_part]?.map((ex) => (
                    <Button
                      key={ex}
                      variant="outline"
                      className="h-14 justify-start bg-[#111] border-white/5 rounded-xl text-sm font-black uppercase italic px-5 hover:border-orange-500/50"
                      onClick={() => { setRecord({...record, exercise_name: ex}); setStep(3); }}
                    >
                      {ex}
                    </Button>
                  ))}
                </div>
                <div className="relative flex items-center gap-4 mb-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] font-black text-white/20 uppercase italic">Or custom</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <Input 
                  className="bg-[#111] border-white/10 h-16 text-center text-xl rounded-2xl font-bold uppercase italic placeholder:text-white/10"
                  placeholder="Enter custom exercise..." 
                  value={record.exercise_name}
                  onChange={(e) => setRecord({...record, exercise_name: e.target.value})} 
                />
              </div>
              <Button 
                className="w-full h-16 bg-orange-500 text-white font-black text-lg rounded-2xl italic uppercase"
                onClick={() => setStep(3)}
                disabled={!record.exercise_name}
              >
                Continue <ChevronRight size={20} className="ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6 pb-10"
            >
              {/* PB CARD */}
              <div className="bg-orange-500 p-6 rounded-4xl shadow-xl shadow-orange-500/20 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 italic">Personal Best</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-5xl font-black italic tracking-tighter">{personalBest || 0}</h2>
                    <span className="text-sm font-bold uppercase italic">kg (1RM)</span>
                  </div>
                </div>
                <span className="absolute -right-4 -bottom-4 text-7xl font-black italic opacity-10 select-none">BEST</span>
              </div>

              {/* INPUTS GRID */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/30 uppercase ml-2 tracking-widest">Date</label>
                  <Input 
                    type="date" 
                    className="bg-[#111] border-white/5 h-12 text-xs rounded-xl font-bold uppercase text-white"
                    value={record.date}
                    onChange={(e) => setRecord({...record, date: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/30 uppercase ml-2 tracking-widest">Workout Type</label>
                  <select 
                    className="w-full bg-[#111] border-white/5 h-12 text-[10px] rounded-xl font-bold uppercase px-3 text-white outline-none focus:border-orange-500/50 appearance-none"
                    value={record.training_split}
                    onChange={(e) => setRecord({...record, training_split: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    <option value="Upper Body">Upper Body</option>
                    <option value="Lower Body">Lower Body</option>
                    <option value="Push Day">Push Day</option>
                    <option value="Pull Day">Pull Day</option>
                    <option value="Cardio">Cardio</option>
                    <option value="HIIT">HIIT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase text-center block">Warmup (kg)</label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    className="bg-[#111] border-white/5 h-16 text-center text-xl font-black rounded-2xl"
                    value={record.warmup_weight}
                    onChange={(e) => setRecord({...record, warmup_weight: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase text-center block tracking-tighter">Working (kg) *</label>
                  <Input 
                    type="number" 
                    className="bg-[#111] border-orange-500/20 h-16 text-center text-xl font-black rounded-2xl border-2"
                    value={record.working_weight}
                    onChange={(e) => setRecord({...record, working_weight: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase text-center block tracking-tighter">
                    1 Rep Max (kg)
                  </label>
                  <Input 
                    type="number" 
                    className="bg-[#111] border-orange-500/40 h-16 text-center text-xl font-black rounded-2xl border-2 text-orange-500"
                    value={record.one_rep_max}
                    onChange={(e) => setRecord({...record, one_rep_max: parseFloat(e.target.value) || ''})} 
                    placeholder="Enter Max"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase text-center block tracking-tighter">Reps *</label>
                  <Input 
                    type="number" 
                    className="bg-[#111] border-orange-500/20 h-16 text-center text-xl font-black rounded-2xl border-2"
                    value={record.max_reps}
                    onChange={(e) => setRecord({...record, max_reps: e.target.value})} 
                  />
                </div>
              </div>

              {/* HISTORY TABLE */}
              <div className="mt-4">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Last 10 Records</p>
                <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-[8px] font-black uppercase text-white/40 italic">
                        <th className="p-3">Date</th>
                        <th className="p-3 text-center">W-up</th>
                        <th className="p-3 text-center text-orange-500">Work</th>
                        <th className="p-3 text-center">R/S</th>
                        <th className="p-3 text-right">1RM</th>
                      </tr>
                    </thead>
                    <tbody className="text-[10px] font-bold uppercase italic">
                      {exerciseHistory.slice(0, 10).map((h, idx) => (
                        <tr key={idx} className="border-t border-white/5">
                          <td className="p-3 text-white/60">{h.date}</td>
                          <td className="p-3 text-center">{h.warmup_weight || '-'}</td>
                          <td className="p-3 text-center text-white">{h.working_weight}</td>
                          <td className="p-3 text-center text-white/60">{h.max_reps}/{h.max_sets || 1}</td>
                          <td className="p-3 text-right text-orange-500 font-black">{h.one_rep_max}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Button 
                onClick={handleSave} 
                className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white font-black text-xl rounded-2xl mt-4 italic uppercase shadow-lg shadow-orange-500/20"
                disabled={!record.working_weight || !record.max_reps || isSyncing}
              >
                {isSyncing ? "Syncing..." : "Save Record"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}