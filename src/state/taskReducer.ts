import { addDaysISO, todayISO } from '../lib/dates'
import { createId } from '../lib/id'
import type { Task, TaskAction } from '../types/task'

const MAX_FOCUS = 5

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'HYDRATE':
      return action.tasks
    case 'CLEAR_ALL':
      return []
    case 'ADD_TASK': {
      const title = action.title.trim()
      if (!title) return state
      const task: Task = {
        id: createId(),
        title,
        completed: false,
        isFocus: false,
        date: action.date,
        time: null,
        createdAt: Date.now(),
      }
      return [task, ...state]
    }
    case 'UPDATE_TITLE': {
      const title = action.title.trim()
      if (!title) return state
      return state.map((t) =>
        t.id === action.id ? { ...t, title } : t,
      )
    }
    case 'TOGGLE_COMPLETE': {
      return state.map((t) =>
        t.id === action.id ? { ...t, completed: !t.completed } : t,
      )
    }
    case 'TOGGLE_FOCUS': {
      const task = state.find((t) => t.id === action.id)
      if (!task || task.completed) return state
      const next = !task.isFocus
      if (next) {
        const n = state.filter((t) => t.isFocus && !t.completed).length
        if (n >= MAX_FOCUS) return state
      }
      return state.map((t) =>
        t.id === action.id ? { ...t, isFocus: next } : t,
      )
    }
    case 'SET_TIME': {
      return state.map((t) =>
        t.id === action.id ? { ...t, time: action.time } : t,
      )
    }
    case 'SET_DATE': {
      return state.map((t) =>
        t.id === action.id ? { ...t, date: action.date } : t,
      )
    }
    case 'RESCHEDULE_TOMORROW': {
      const task = state.find((t) => t.id === action.id)
      if (!task) return state
      const base = task.date || todayISO()
      const next = addDaysISO(base, 1)
      return state.map((t) =>
        t.id === action.id ? { ...t, date: next, completed: false } : t,
      )
    }
    case 'RESCHEDULE_LATER': {
      const task = state.find((t) => t.id === action.id)
      if (!task) return state
      const base = task.date || todayISO()
      const next = addDaysISO(base, 7)
      return state.map((t) =>
        t.id === action.id ? { ...t, date: next, completed: false } : t,
      )
    }
    case 'DELETE_TASK': {
      return state.filter((t) => t.id !== action.id)
    }
    default:
      return state
  }
}

export { MAX_FOCUS }
