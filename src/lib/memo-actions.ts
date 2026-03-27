'use server'

import { getSupabaseServer } from '@/lib/supabase-actions-client'

export async function fetchMemos() {
  const supabase = await getSupabaseServer()
  const { data, error } = await supabase
    .from('memos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function addMemo(content: string) {
  if (!content.trim()) return null
  
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('memos')
    .insert([{ content, user_id: user.id }])
    .select()

  if (error) throw new Error(error.message)
  return data?.[0]
}

export async function deleteMemo(id: string) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase
    .from('memos')
    .delete()
    .match({ id })

  if (error) throw new Error(error.message)
  return true
}
