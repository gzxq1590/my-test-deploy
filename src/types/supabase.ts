export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          is_completed: boolean
          user_id: string
          due_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          is_completed?: boolean
          user_id: string
          due_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          is_completed?: boolean
          user_id?: string
          due_date?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          task_completed_count: number
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          task_completed_count?: number
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          task_completed_count?: number
        }
      }
    }
  }
}
