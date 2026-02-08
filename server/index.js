const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

app.use(cors());
app.use(express.json());

const TEMP_USER_ID = '00000000-0000-0000-0000-000000000000';

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', message: 'Server is moving weight' });
});

// 2. Fetch All Lifts (The New Route)
app.get('/api/lifts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lifts')
      .select('*')
      .eq('user_id', TEMP_USER_ID)
      .order('date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Fetch Lifts Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. Save/Update Profile
app.post('/api/profile', async (req, res) => {
  try {
    const { full_name, unit_system, goal, height_cm, weight_kg } = req.body;
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ 
        id: TEMP_USER_ID, 
        full_name: full_name || 'Athlete', 
        unit_system: unit_system || 'metric', 
        goal: goal || 'get_stronger', 
        height_cm: height_cm ? parseInt(height_cm) : null,
        weight_kg: weight_kg ? parseInt(weight_kg) : null,
        updated_at: new Date()
      })
      .select();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Profile Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// 4. Save Individual Lift
app.post('/api/lifts', async (req, res) => {
  try {
    const { exercise_name, weight, reps, notes, date } = req.body;
    const { data, error } = await supabase
      .from('lifts')
      .insert([
        { 
          exercise_name, 
          weight: parseFloat(weight), 
          reps: parseInt(reps), 
          notes: notes || '',
          date: date || new Date(),
          user_id: TEMP_USER_ID
        }
      ])
      .select();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error("Lifts Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});