import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co'; // Get this from Supabase settings
const supabaseKey = 'your-anon-key'; // Get this from Supabase settings

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to check if we are online
const isOnline = () => window.navigator.onLine;

// SAVE LIFT (Logic: Save to Supabase, fallback to LocalStorage)
export const saveLift = async (liftData) => {
  if (isOnline()) {
    try {
      const { data, error } = await supabase.from('lifts').insert([liftData]);
      if (!error) return { success: true, data };
    } catch (err) {
      console.log("Network error, saving to local instead.");
    }
  }

  // FALLBACK: Save to a "pending" queue in LocalStorage
  const pending = JSON.parse(localStorage.getItem('pending-lifts') || '[]');
  pending.push({ ...liftData, synced: false, id: Date.now() });
  localStorage.setItem('pending-lifts', JSON.stringify(pending));
  
  // Also add to your main records so it shows up in the UI immediately
  const existing = JSON.parse(localStorage.getItem('dyel-records') || '[]');
  localStorage.setItem('dyel-records', JSON.stringify([...existing, liftData]));
  
  return { success: false, offline: true };
};

// SYNC FUNCTION: Run this when the app starts
export const syncOfflineData = async () => {
  if (!isOnline()) return;

  const pending = JSON.parse(localStorage.getItem('pending-lifts') || '[]');
  if (pending.length === 0) return;

  console.log(`Syncing ${pending.length} records to Supabase...`);
  
  const { error } = await supabase.from('lifts').insert(
    pending.map(({ synced, id, ...rest }) => rest) // Remove local metadata before upload
  );

  if (!error) {
    localStorage.setItem('pending-lifts', '[]'); // Clear queue on success
    console.log("Sync complete!");
  }
};