export type Task = {
  id: string
  title: string
  completed: boolean
  isFocus: boolean
  date: string
  time: string | null
  createdAt: number
}

export type AppView =
  | 'dashboard'
  | 'today'
  | 'tomorrow'
  | 'week'
  | 'inbox'
  | 'completed'

export type TaskAction =
  | { type: 'ADD_TASK'; title: string; date: string }
  | { type: 'UPDATE_TITLE'; id: string; title: string }
  | { type: 'TOGGLE_COMPLETE'; id: string }
  | { type: 'TOGGLE_FOCUS'; id: string }
  | { type: 'SET_TIME'; id: string; time: string | null }
  | { type: 'SET_DATE'; id: string; date: string }
  | { type: 'RESCHEDULE_TOMORROW'; id: string }
  | { type: 'RESCHEDULE_LATER'; id: string }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'HYDRATE'; tasks: Task[] }
  | { type: 'CLEAR_ALL' }
