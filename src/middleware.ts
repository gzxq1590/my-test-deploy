import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient(
    { req, res },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key',
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ユーザーがログインしておらず、かつアクセスしているパスが `/login` や `/_next` 系でない場合、 `/login` にリダイレクト
  if (
    !session &&
    !req.nextUrl.pathname.startsWith('/login') &&
    !req.nextUrl.pathname.startsWith('/auth') &&
    !req.nextUrl.pathname.startsWith('/_next') &&
    !req.nextUrl.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // すでにログインしているユーザーが `/login` にアクセスした場合、トップページにリダイレクト
  if (session && req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
