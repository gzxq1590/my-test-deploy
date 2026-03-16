'use client'

import { useState, useEffect } from 'react'
import { calculateGrowthLevel } from '@/lib/growthLogic'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

type Task = {
  id: string
  title: string
  is_completed: boolean
  user_id: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [completedCount, setCompletedCount] = useState(0)
  const [growthLevel, setGrowthLevel] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchTasks = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data, error } = await (supabase
      .from('tasks') as any)
      .select('*')
      .order('created_at', { ascending: true })

    if (!error && data) {
      setTasks(data as Task[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    const count = tasks.filter(t => t.is_completed).length
    setCompletedCount(count)
    setGrowthLevel(calculateGrowthLevel(count))
  }, [tasks])

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data, error } = await (supabase
      .from('tasks') as any)
      .insert([
        { title: newTaskTitle, is_completed: false, user_id: session.user.id }
      ])
      .select()

    if (!error && data) {
      setTasks([...tasks, data[0] as Task])
      setNewTaskTitle('')
    }
  }

  const toggleTask = async (id: string, currentStatus: boolean) => {
    const { error } = await (supabase
      .from('tasks') as any)
      .update({ is_completed: !currentStatus })
      .eq('id', id)

    if (!error) {
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, is_completed: !currentStatus } : t
      ))
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>読み込み中...</div>

  return (
    <div data-level={growthLevel}>
      <header style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <button onClick={handleLogout} style={{ background: '#eee', color: '#666', boxShadow: 'none', padding: '0.5rem 1rem' }}>ログアウト</button>
      </header>
      <main className="container" style={{ marginTop: '3rem' }}>
        <h1>成長型TODOリスト</h1>
        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
          現在のレベル: {growthLevel} (完了したタスク: {completedCount})
        </p>
        
        <form onSubmit={addTask} style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="新しいタスクを入力..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button type="submit" style={{ width: '100%' }}>追加</button>
        </form>

        <div className="task-list">
          {tasks.map(task => (
            <div key={task.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0.75rem', 
              borderBottom: '1px solid #eee',
              gap: '1rem'
            }}>
              <input
                type="checkbox"
                checked={task.is_completed}
                onChange={() => toggleTask(task.id, task.is_completed)}
                style={{ width: '1.2rem', height: '1.2rem' }}
              />
              <span style={{ 
                textDecoration: task.is_completed ? 'line-through' : 'none',
                color: task.is_completed ? '#888' : 'inherit',
                flexGrow: 1
              }}>
                {task.title}
              </span>
            </div>
          ))}
          {tasks.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888' }}>タスクがありません。追加してください！</p>
          )}
        </div>
      </main>
    </div>
  )
}
