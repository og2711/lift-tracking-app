import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, User, Trophy, Zap, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
// Fixed: Using standard button for build stability as per v1.3 standards
import { getLifts, syncOfflineData } from '../api'; 

export default function Dashboard() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [user, setUser] = useState({ unit_system: 'metric', onboarded: true });

  useEffect(() => {
    const init = async () => {
      // Fixed: Syntax error in previous useEffect block
      try {
        await syncOfflineData(); 
      } catch (e) {
        console.log("Sync skipped");
      }

      const savedRecords = localStorage.getItem('dyel-records');
      if (savedRecords) {
        setRecords(JSON.parse(savedRecords));
      }

      const syncCloud = async () => {
        try {
          const response = await getLifts();
          if (response.data && response.data.length > 0) {
            setRecords(response.data);
            localStorage.setItem('dyel-records', JSON.stringify(response.data));
          }
        } catch (err) {
          console.log("Using local backup...");
        }
      };
      syncCloud();
    };
    init();
  }, []);

  const weightUnit = user.unit_system === 'metric' ? 'kg' : 'lbs';

  const getBestOneRM = (exerciseName) => {
    const exerciseRecords = records.filter(r => 
      r.exercise_name?.toLowerCase().includes(exerciseName.toLowerCase())
    );
    return exerciseRecords.length > 0 
      ? Math.max(...exerciseRecords.map(r => r.one_rep_max || r.weight || 0))
      : 0;
  };

  const powerliftingTotal = getBestOneRM('bench') + getBestOneRM('squat') + getBestOneRM('deadlift');

  const uniqueExercises = [...new Set(records.map(r => r.exercise_name))];
  const allMaxes = uniqueExercises.map(exName => {
    const exerciseRecords = records.filter(r => r.exercise_name === exName);
    const bestWeight = Math.max(...exerciseRecords.map(r => (r.one_rep_max || r.weight || 0)));
    return { name: exName, weight: bestWeight };
  }).filter(m => m.weight > 0);

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <div className="max-w-md mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-4">
            <div className="w-45 h-45 flex items-center justify-center">
              <img src="/dyel-logo.png" alt="Logo" className="w-full h-full object-contain" /> 
            </div>
            <div className="flex flex-col">
              <span className="text-[24px] text-orange-500 font-black uppercase tracking-tight leading-none mb-1">
                Lift Tracker
              </span>
              <h1 className="text-xl font-black uppercase tracking-tighter leading-none text-white/40">
                Dashboard
              </h1> 
            </div>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center hover:border-orange-500/50 transition-all"
          >
            <User className="text-orange-500 w-6 h-6" />
          </button>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/new-record')}
            className="w-full bg-[#111] border border-white/10 hover:border-orange-500/50 rounded-2xl h-14 font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-2 group transition-all text-white"
          >
            <span className="group-hover:text-orange-500 transition-colors">Add New Record</span>
            <Plus size={18} strokeWidth={3} className="group-hover:text-orange-500 transition-colors" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* TOTAL CARD */}
          <div className="bg-[#111] border-t-2 border-t-orange-500 border-x border-x-white/5 border-b border-b-white/5 p-5 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Strength Total (Squat+Bench+Deadlift)</p>
              <Trophy size={14} className="text-orange-500/40" />
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter text-white">
              {powerliftingTotal} <span className="text-sm font-bold uppercase opacity-30">{weightUnit}</span>
            </h2>
            <div className="absolute -right-4 -bottom-4 bg-orange-500/5 w-16 h-16 rounded-full blur-2xl" />
          </div>

          {/* ROLLING PR CARD */}
          <div className="bg-[#111] border-t-2 border-t-orange-500 border-x border-x-white/5 border-b border-b-white/5 p-5 rounded-3xl shadow-2xl relative overflow-hidden h-30">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">Recent PR Records</p>
              <Zap size={14} className="text-orange-500/40" />
            </div>
            
            <div className="relative h-[70px] overflow-hidden">
              {allMaxes.length > 0 ? (
                <motion.div
                  animate={{ y: allMaxes.length > 1 ? allMaxes.map((_, i) => -(i * 80)) : 0 }}
                  transition={{ 
                    duration: 0.8, 
                    repeat: Infinity, 
                    repeatDelay: 3, 
                    ease: [0.45, 0, 0.55, 1] 
                  }}
                  className="flex flex-col"
                >
                  {[...allMaxes, ...allMaxes].map((max, idx) => (
                    <div key={idx} className="h-[50px] mb-[30px] flex flex-col justify-center">
                      <p className="text-3xl font-black text-white tracking-tighter leading-none mb-1">
                        {max.weight}<span className="text-[10px] text-orange-500 ml-1 italic font-bold">{weightUnit}</span>
                      </p>
                      <h2 className="text-[10px] font-black italic uppercase text-white/30 truncate leading-none tracking-widest">
                        {max.name}
                      </h2>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <h2 className="text-xs font-black italic uppercase text-white/20">No data</h2>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#111] via-[#111]/90 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Recent History */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Activity size={14} className="text-orange-500" />
            <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Recent Records</h3>
          </div>
          
          {records.length === 0 ? (
            <div className="py-20 text-center bg-[#111] rounded-[2.5rem] border border-dashed border-white/10">
              <p className="text-white/20 font-bold italic uppercase tracking-widest">Time to hit the gym!</p>
            </div>
          ) : (
            records.slice(0, 5).map((r, i) => (
              <div key={i} className="bg-[#111] p-5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-orange-500/30 transition-all relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-orange-500 transition-all" />
                <div className="flex flex-col gap-1">
                  <strong className="text-lg font-black uppercase italic tracking-tight group-hover:text-orange-500 transition-colors">
                    {r.exercise_name}
                  </strong>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-bold uppercase">
                    <Clock size={10} />
                    {r.date ? new Date(r.date).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white group-hover:text-orange-500 transition-colors">
                    {r.one_rep_max || r.weight}
                  </div>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{weightUnit}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}