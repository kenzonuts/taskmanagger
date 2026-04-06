export type Task = {
  id: string
  title: string
  completed: boolean
  isFocus: boolean
  date: string
  time: string | null
  /** List / category: work, freelance, workout, or '' */
  category: string
  /** Fine-grained tag: work, ux, inspo, or '' */
  tag: string
  createdAt: number
}

export type AppView =
  | 'home'
  | 'dashboard'
  | 'today'
  | 'tomorrow'
  | 'week'
  | 'inbox'
  | 'completed'

export type TaskAction =
  | {
      type: 'ADD_TASK'
      title: string
      date: string
      category: string
      tag: string
      time: string | null
    }
  | { type: 'UPDATE_TITLE'; id: string; title: string }
  | { type: 'SET_CATEGORY'; id: string; category: string }
  | { type: 'SET_TAG'; id: string; tag: string }
  | { type: 'TOGGLE_COMPLETE'; id: string }
  | { type: 'TOGGLE_FOCUS'; id: string }
  | { type: 'SET_TIME'; id: string; time: string | null }
  | { type: 'SET_DATE'; id: string; date: string }
  | { type: 'RESCHEDULE_TOMORROW'; id: string }
  | { type: 'RESCHEDULE_LATER'; id: string }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'HYDRATE'; tasks: Task[] }
  | { type: 'CLEAR_ALL' }
  | { type: 'STRIP_CATEGORY_FROM_TASKS'; categoryId: string }
