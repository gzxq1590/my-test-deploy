import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateSession } from '@/lib/supabase-server';
import { getSupabaseServer } from '@/lib/supabase-actions-client';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn(),
    redirect: vi.fn(),
  },
}));

describe('supabase-server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSupabaseServer', () => {
    it('supabase client を作成できること', async () => {
      const mockCookies = { get: vi.fn(), set: vi.fn(), delete: vi.fn() };
      const { cookies } = await import('next/headers');
      (cookies as any).mockResolvedValueOnce(mockCookies);
      
      await getSupabaseServer();
      expect(createServerClient).toHaveBeenCalled();
    });
  });

  describe('updateSession', () => {
    const mockRequest = {
      nextUrl: {
        pathname: '/',
        clone: vi.fn(() => ({ pathname: '' })),
      },
      cookies: {
        get: vi.fn(),
        set: vi.fn(),
      },
      headers: new Headers(),
    } as any;

    it('認証済みユーザーの場合、NextResponse.next を返すこと', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: { id: '1' } } }),
        },
      };
      (createServerClient as any).mockReturnValueOnce(mockSupabase);
      (NextResponse.next as any).mockReturnValueOnce('next-response');

      const result = await updateSession(mockRequest);
      expect(result).toBe('next-response');
    });

    it('未認証ユーザーが保護されたルートにアクセスした場合、ログインへリダイレクトすること', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: null } }),
        },
      };
      (createServerClient as any).mockReturnValueOnce(mockSupabase);
      (NextResponse.redirect as any).mockReturnValueOnce('redirect-response');

      const result = await updateSession(mockRequest);
      expect(result).toBe('redirect-response');
      expect(NextResponse.redirect).toHaveBeenCalled();
    });

    it('未認証ユーザーがログインページにアクセスした場合、NextResponse.next を返すこと', async () => {
      const loginRequest = {
        ...mockRequest,
        nextUrl: { ...mockRequest.nextUrl, pathname: '/login' },
      };
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: null } }),
        },
      };
      (createServerClient as any).mockReturnValueOnce(mockSupabase);
      (NextResponse.next as any).mockReturnValueOnce('next-response');

      const result = await updateSession(loginRequest);
      expect(result).toBe('next-response');
    });
  });
});
