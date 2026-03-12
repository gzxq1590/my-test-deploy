import { createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerClient = () => {
  return createServerComponentClient({ cookies });
};

export const createActionClient = () => {
  return createServerActionClient({ cookies });
};
