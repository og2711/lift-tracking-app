import { supabase } from './supabaseClient';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';

export const saveWorkout = async (workoutData) => {
  const localId = `workout_${Date.now()}`;
  
  // Create the object that includes the sync status
  const workoutToSave = { ...workoutData, synced: false, localId };

  // 1. SAVE TO PHONE DISK
  await Preferences.set({
    key: localId,
    value: JSON.stringify(workoutToSave)
  });

  // 2. CHECK NETWORK
  const status = await Network.getStatus();
  
  if (status.connected) {
    try {
      const { error } = await supabase
        .from('workouts')
        .insert([{
          exercise_name: workoutToSave.exercise_name,
          body_part: workoutToSave.body_part,
          weight: workoutToSave.weight,
          reps: workoutToSave.reps,
          one_rep_max: workoutToSave.one_rep_max,
          training_split: workoutToSave.training_split,
          date: workoutToSave.date,
          warmup_weight: workoutToSave.warmup_weight
        }]);

      if (!error) {
        // 3. MARK AS SYNCED 
        // We overwrite the local key with 'synced: true'
        await Preferences.set({
          key: localId,
          value: JSON.stringify({ ...workoutToSave, synced: true })
        });
        console.log("Workout synced to Supabase successfully.");
      }
    } catch (err) {
      console.error("Cloud sync failed, remains local-only for now.");
    }
  }

  return { success: true, id: localId };
};