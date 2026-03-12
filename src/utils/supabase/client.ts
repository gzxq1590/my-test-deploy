import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => {
  return createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key',
  });
};
