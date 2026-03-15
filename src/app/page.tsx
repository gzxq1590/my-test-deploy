import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { addTask, deleteTask, signOut } from './actions';
import { Trash2, LogOut, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('タスクの取得中にエラーが発生しました:', error);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
          <div>
            <h1 className="text-xl font-bold">マイタスク</h1>
            <p className="text-sm text-indigo-200">ログイン中: {session.user.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center space-x-1 text-sm bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md transition-colors"
            >
              <LogOut size={16} />
              <span>サインアウト</span>
            </button>
          </form>
        </div>

        <div className="p-6">
          {/* Add Task Form */}
          <form action={addTask} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="title"
                placeholder="何をしますか？"
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              />
              <button
                type="submit"
                className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus size={20} />
                <span>タスクを追加</span>
              </button>
            </div>
          </form>

          {/* Task List */}
          <div className="space-y-3">
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg group hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-800 font-medium">{task.title}</span>
                  <form action={deleteTask}>
                    <input type="hidden" name="id" value={task.id} />
                    <button
                      type="submit"
                      className="text-gray-400 hover:text-red-500 p-2 rounded-md transition-colors"
                      aria-label="タスクを削除"
                    >
                      <Trash2 size={20} />
                    </button>
                  </form>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>タスクがありません。上のフォームから追加してください！</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
