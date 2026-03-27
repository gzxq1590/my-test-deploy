import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchMemos, addMemo, deleteMemo } from '@/lib/memo-actions';

// Mock Supabase Server Client
const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  select: vi.fn(() => mockSupabase),
  order: vi.fn(() => mockSupabase),
  insert: vi.fn(() => mockSupabase),
  delete: vi.fn(() => mockSupabase),
  match: vi.fn(() => mockSupabase),
  auth: {
    getUser: vi.fn(),
  },
} as any;

vi.mock('@/lib/supabase-actions-client', () => ({
  getSupabaseServer: vi.fn(() => mockSupabase),
}));

describe('memo-actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchMemos', () => {
    it('正常にメモを取得できること', async () => {
      const mockData = [{ id: '1', content: 'test', created_at: '2024-01-01' }];
      mockSupabase.from.mockReturnValueOnce(mockSupabase);
      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.order.mockReturnValueOnce({ data: mockData, error: null } as any);
      
      const result = await fetchMemos();
      expect(result).toEqual(mockData);
    });

    it('エラー時に例外をスローすること', async () => {
      mockSupabase.from.mockReturnValueOnce(mockSupabase);
      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.order.mockReturnValueOnce({ data: null, error: { message: 'DB Error' } } as any);
      await expect(fetchMemos()).rejects.toThrow('DB Error');
    });
  });

  describe('addMemo', () => {
    it('正常にメモを追加できること', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: { id: 'user1' } } });
      const mockNewMemo = { id: '2', content: 'new memo', user_id: 'user1' };
      mockSupabase.from.mockReturnValueOnce(mockSupabase);
      mockSupabase.insert.mockReturnValueOnce(mockSupabase);
      mockSupabase.select.mockReturnValueOnce({ data: [mockNewMemo], error: null } as any);

      const result = await addMemo('new memo');
      expect(result).toEqual(mockNewMemo);
    });

    it('空のメモは追加せず null を返すこと', async () => {
      const result = await addMemo(' ');
      expect(result).toBeNull();
    });

    it('未認証時にエラーをスローすること', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null } });
      await expect(addMemo('test')).rejects.toThrow('Unauthorized');
    });

    it('DBエラー時に例外をスローすること', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: { id: 'user1' } } });
      mockSupabase.from.mockReturnValueOnce(mockSupabase);
      mockSupabase.insert.mockReturnValueOnce(mockSupabase);
      mockSupabase.select.mockReturnValueOnce({ data: null, error: { message: 'Insert Error' } } as any);
      await expect(addMemo('test')).rejects.toThrow('Insert Error');
    });
  });

  describe('deleteMemo', () => {
    it('正常にメモを削除できること', async () => {
      mockSupabase.from.mockReturnValueOnce(mockSupabase);
      mockSupabase.delete.mockReturnValueOnce(mockSupabase);
      mockSupabase.match.mockReturnValueOnce({ error: null } as any);
      const result = await deleteMemo('1');
      expect(result).toBe(true);
    });

    it('削除エラー時に例外をスローすること', async () => {
      mockSupabase.from.mockReturnValueOnce(mockSupabase);
      mockSupabase.delete.mockReturnValueOnce(mockSupabase);
      mockSupabase.match.mockReturnValueOnce({ error: { message: 'Delete Error' } } as any);
      await expect(deleteMemo('1')).rejects.toThrow('Delete Error');
    });
  });
});
