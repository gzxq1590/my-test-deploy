'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('確認メールを送信しました。')
      } else {
        console.log('[Login] Attempting sign in...')
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        console.log('[Login] Sign in successful, user:', data.user?.email)
        console.log('[Login] Navigating to /')
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ marginTop: '5rem' }}>
      <h1>{isSignUp ? '新規登録' : 'ログイン'}</h1>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', border: '1px solid #ccc' }}
        />
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', marginBottom: '1rem' }}>
          {loading ? '処理中...' : isSignUp ? '登録する' : 'ログインする'}
        </button>
      </form>
      <p style={{ textAlign: 'center' }}>
        <button 
          onClick={() => setIsSignUp(!isSignUp)} 
          style={{ background: 'none', color: 'var(--primary)', boxShadow: 'none', padding: 0 }}
        >
          {isSignUp ? 'ログインに戻る' : '新しくアカウントを作る'}
        </button>
      </p>
    </div>
  )
}
