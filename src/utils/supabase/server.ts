import { createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerClient = () => {
  return createServerComponentClient(
    { cookies },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key',
    }
  );
};

export const createActionClient = () => {
  return createServerActionClient(
    { cookies },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key',
    }
  );
};
