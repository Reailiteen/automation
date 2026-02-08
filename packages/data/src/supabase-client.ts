import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
} else if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  // For environments that only provide the anon key (e.g., web)
  supabase = createClient(process.env.SUPABASE_URL.trim(), process.env.SUPABASE_ANON_KEY.trim());
}

export function getSupabase() {
  return supabase;
}
