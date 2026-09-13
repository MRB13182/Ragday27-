import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any)?.env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://eodwqvodokrfnnslppve.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Y0QaDbB8_j1pdjBLrgkFkA_s_p5_ys3';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
