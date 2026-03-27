'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { fetchMemos, addMemo, deleteMemo } from '@/lib/memo-actions';

type Memo = {
  id: string;
  content: string;
  created_at: string;
};

export default function MemoBoard({ user }: { user: User }) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemo, setNewMemo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    try {
      const data = await fetchMemos();
      setMemos(data || []);
    } catch (e) {
      console.error('Failed to load memos:', e);
    }
  };

  const handleAddMemo = async () => {
    if (!newMemo.trim()) return;
    setLoading(true);
    try {
      const saved = await addMemo(newMemo);
      if (saved) {
        setMemos([saved, ...memos]);
        setNewMemo('');
      }
    } catch (e) {
      alert('メモの保存に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemo = async (id: string) => {
    if (!confirm('削除してもよろしいですか？')) return;
    try {
      await deleteMemo(id);
      setMemos(memos.filter(m => m.id !== id));
    } catch (e) {
      alert('削除に失敗しました。');
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">新しいメモを残す</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMemo}
            onChange={(e) => setNewMemo(e.target.value)}
            placeholder="ここにメモを書いてください..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            onKeyDown={(e) => e.key === 'Enter' && handleAddMemo()}
          />
          <button
            onClick={handleAddMemo}
            disabled={!newMemo.trim() || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 shadow-sm transition-all"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">メモ一覧</h2>
        {memos.length === 0 ? (
          <p className="text-gray-500 bg-white p-8 rounded-lg text-center border border-dashed border-gray-200">
            メモがありません。最初のメモを投稿してみましょう！
          </p>
        ) : (
          <div className="grid gap-4">
            {memos.map((memo) => (
              <div key={memo.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-gray-800 break-words flex-1 whitespace-pre-wrap">{memo.content}</p>
                <button 
                  onClick={() => handleDeleteMemo(memo.id)}
                  className="text-red-400 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
