'use server';

import { createActionClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addTask(formData: FormData): Promise<void> {
  const title = formData.get('title') as string;
  if (!title) return;

  const supabase = createActionClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return;
  }

  const { error } = await supabase.from('tasks').insert({
    title,
    user_id: session.user.id,
  });

  if (error) {
    console.error('タスクの追加中にエラーが発生しました:', error);
    return;
  }

  revalidatePath('/');
}

export async function deleteTask(formData: FormData): Promise<void> {
  const id = formData.get('id') as string;
  if (!id) return;

  const supabase = createActionClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return;
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id);

  if (error) {
    console.error('タスクの削除中にエラーが発生しました:', error);
    return;
  }

  revalidatePath('/');
}

export async function signOut(): Promise<void> {
  const supabase = createActionClient();
  await supabase.auth.signOut();
  revalidatePath('/');
}
