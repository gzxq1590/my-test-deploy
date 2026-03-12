import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient(
      { cookies },
      {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key',
      }
    );
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URLをパースして、`/` などにリダイレクトさせる
  return NextResponse.redirect(new URL('/', request.url));
}
