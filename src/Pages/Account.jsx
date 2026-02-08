import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, User as UserIcon, Target, Ruler, Scale, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "../components/ui/button";
import { updateProfile } from '../api'; // Ensure src/api.js exists!

const GOAL_LABELS = {
  gain_muscle: 'Gain Muscle',
  get_stronger: 'Get Stronger',
  lose_weight: 'Lose Weight',
};

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // 1. Load data from local storage
    const localUser = localStorage.getItem('dyel-user');
    const localRecords = localStorage.getItem('dyel-records');

    // 2. Set state with fallbacks to prevent "blank" screens
    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      setUser({
        full_name: 'Active User',
        unit_system: 'metric',
        goal: 'get_stronger',
        height_cm: 180,
        weight_kg: 85
      });
    }

    setRecords(localRecords ? JSON.parse(localRecords) : []);
  }, []);

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    try {
      // Sends the current state to our Node server on port 5001
      await updateProfile(user); 
      alert("✅ Profile synced to Supabase!");
    } catch (err) {
      console.error("Sync error:", err);
      // Check the SERVER terminal for the real error reason!
      alert("❌ Sync failed. Check server console for 400 details.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteData = () => {
    if (window.confirm(`WARNING: This will permanently wipe your profile and all ${records.length} lift records. Proceed?`)) {
      localStorage.clear();
      window.location.href = '/onboarding';
    }
  };

  if (!user) return null;

  const isMetric = user.unit_system === 'metric';
  const heightDisplay = isMetric ? `${user.height_cm || '—'} cm` : `${user.height_inches || '—'} in`;
  const weightDisplay = isMetric ? `${user.weight_kg || '—'} kg` : `${user.weight_lbs || '—'} lbs`;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-10 pt-2">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-2xl bg-[#111] border border-white/10 text-white w-12 h-12"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Profile</h1>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">Athlete Data</p>
            </div>
          </div>

          <Button 
            onClick={handleSyncToCloud}
            disabled={isSyncing}
            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 px-4 transition-all active:scale-95"
          >
            {isSyncing ? "Syncing..." : <><Cloud size={16} className="mr-2" /> Sync</>}
          </Button>
        </header>

        {/* User Identity Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 mb-6 text-center"
        >
          <div className="w-20 h-20 bg-orange-500 rounded-4xl mx-auto mb-4 flex items-center justify-center shadow-xl shadow-orange-500/20 rotate-3">
            <UserIcon size={40} className="text-white -rotate-3" />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">
            {user.full_name || 'Active User'}
          </h2>
          <div className="inline-block mt-2 px-3 py-1 bg-white/5 rounded-full">
            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">
              {user.unit_system === 'metric' ? 'Metric System' : 'Imperial System'}
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#111] p-5 rounded-3xl border border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/20 mb-1">
              <Ruler size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Height</span>
            </div>
            <p className="text-xl font-black italic">{heightDisplay}</p>
          </div>

          <div className="bg-[#111] p-5 rounded-3xl border border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/20 mb-1">
              <Scale size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Weight</span>
            </div>
            <p className="text-xl font-black italic">{weightDisplay}</p>
          </div>

          <div className="bg-[#111] p-5 rounded-3xl border border-white/5 flex flex-col gap-1 col-span-2">
            <div className="flex items-center gap-2 text-white/20 mb-1">
              <Target size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Primary Objective</span>
            </div>
            <p className="text-xl font-black italic uppercase tracking-tighter text-orange-500">
              {GOAL_LABELS[user.goal] || 'Get Stronger'}
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="bg-red-500/5 p-6 rounded-4xl border border-red-500/20"
        >
          <h3 className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Danger Zone</h3>
          <p className="text-white/30 text-xs mb-4">
            Wiping data will reset your PRs and dashboard stats. This action is irreversible.
          </p>
          <Button 
            onClick={handleDeleteData}
            variant="destructive"
            className="w-full h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase italic tracking-tighter transition-all"
          >
            <Trash2 size={18} className="mr-2" />
            Clear All Data
          </Button>
        </motion.div>

      </div>
    </div>
  );
}