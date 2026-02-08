import { createClient } from '@supabase/supabase-js';

// Replace these strings with your actual Supabase project details
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-public-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);