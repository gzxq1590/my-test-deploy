'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('handleLogin called');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(`エラー: ${error.message}`);
    } else {
      router.refresh();
      router.push('/');
    }
    setLoading(false);
  };
 
  const handleSignUp = async () => {
    setLoading(true);
    console.log('handleSignUp called');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(`エラー: ${error.message}`);
    } else if (data.session) {
      router.refresh();
      router.push('/');
    } else {
      setMessage('新規登録が完了しました。ログインしてください。');
    }
    setLoading(false);
  };
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">自分専用メモアプリ</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none transition-colors"
          >
            {loading ? '処理中...' : 'ログイン'}
          </button>
        </form>
        <button
          type="button"
          onClick={handleSignUp}
          disabled={loading}
          className="w-full mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none transition-colors"
        >
          新規登録
        </button>
        {message && <p className="mt-4 text-center text-sm text-red-600 bg-red-50 p-2 rounded">{message}</p>}
      </div>
    </div>
  );
}
