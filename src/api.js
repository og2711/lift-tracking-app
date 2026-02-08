import { createClient } from '@supabase/supabase-js';

// 1. PROJECT CONFIGURATION
// Replace these strings with your actual values from Supabase -> Settings -> API
const supabaseUrl = 'https://tapkijtorbjgqypicmsa.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhcGtpanRvcmJqZ3F5cGljbXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MDA1OTcsImV4cCI6MjA4NjA3NjU5N30.Pkhg0MrdA1gLlmn0eKt0fgy6VV2eKqbIPC8pYmHfppo'; 

export const supabase = createClient(supabaseUrl, supabaseKey);

// 2. UTILS
// Helper to check if the device has an active internet connection
const isOnline = () => typeof window !== 'undefined' && window.navigator.onLine;

// 3. LIFT RECORDS (getLifts, saveLift)
export const getLifts = async () => {
  return await supabase
    .from('lifts')
    .select('*')
    .order('date', { ascending: false });
};

export const saveLift = async (liftData) => {
  if (isOnline()) {
    try {
      const { data, error } = await supabase.from('lifts').insert([liftData]);
      if (!error) return { success: true, data };
    } catch (err) {
      console.log("Network error, saving to local instead.");
    }
  }

  // Fallback to LocalStorage if offline or network fails
  const pending = JSON.parse(localStorage.getItem('pending-lifts') || '[]');
  pending.push({ ...liftData, synced: false, id: Date.now() });
  localStorage.setItem('pending-lifts', JSON.stringify(pending));
  
  const existing = JSON.parse(localStorage.getItem('dyel-records') || '[]');
  localStorage.setItem('dyel-records', JSON.stringify([...existing, liftData]));
  
  return { success: false, offline: true };
};

// 4. PROFILE DATA (updateProfile)
export const updateProfile = async (profileData) => {
  // Uses upsert to either create a new profile or update the existing one based on ID
  return await supabase
    .from('profiles')
    .upsert([profileData]);
};

// 5. OFFLINE SYNC LOGIC
export const syncOfflineData = async () => {
  if (!isOnline()) return;

  const pending = JSON.parse(localStorage.getItem('pending-lifts') || '[]');
  if (pending.length === 0) return;

  console.log(`Syncing ${pending.length} records to Supabase...`);
  
  const { error } = await supabase.from('lifts').insert(
    pending.map(({ synced, id, ...rest }) => rest)
  );

  if (!error) {
    localStorage.setItem('pending-lifts', '[]');
    console.log("Sync complete!");
  }
};

// 6. HEALTH CHECK (Maintains compatibility with your existing code)
export const checkServerHealth = async () => {
  try {
    const { data, error } = await supabase.from('lifts').select('id').limit(1);
    return error ? { status: 'error' } : { status: 'ok' };
  } catch (e) {
    return { status: 'offline' };
  }
};

export default supabase;