import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Task, TaskAction } from '../types/task'
import { MAX_FOCUS, taskReducer } from './taskReducer'

const STORAGE_KEY = 'smart-daily-planner-tasks'

function parseStored(raw: string | null): Task[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(isTask)
  } catch {
    return []
  }
}

function isTask(v: unknown): v is Task {
  if (!v || typeof v !== 'object') return false
  const t = v as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.completed === 'boolean' &&
    typeof t.isFocus === 'boolean' &&
    typeof t.date === 'string' &&
    (t.time === null || typeof t.time === 'string') &&
    typeof t.createdAt === 'number'
  )
}

type TaskContextValue = {
  tasks: Task[]
  dispatch: (a: TaskAction) => void
  focusBlocked: boolean
}

const TaskContext = createContext<TaskContextValue | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatchBase] = useReducer(taskReducer, [], () =>
    parseStored(
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(STORAGE_KEY)
        : null,
    ),
  )
  const [focusBlocked, setFocusBlocked] = useState(false)
  const hydrated = useRef(false)

  useEffect(() => {
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const dispatch = useCallback(
    (action: TaskAction) => {
      if (action.type === 'TOGGLE_FOCUS') {
        const task = tasks.find((t) => t.id === action.id)
        if (task && !task.completed && !task.isFocus) {
          const n = tasks.filter((t) => t.isFocus && !t.completed).length
          if (n >= MAX_FOCUS) {
            setFocusBlocked(true)
            window.setTimeout(() => setFocusBlocked(false), 3200)
            return
          }
        }
      }
      dispatchBase(action)
    },
    [tasks],
  )

  const value = useMemo(
    () => ({ tasks, dispatch, focusBlocked }),
    [tasks, dispatch, focusBlocked],
  )

  return (
    <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
  )
}

// Co-located hook + provider keeps a single import surface for the feature.
// eslint-disable-next-line react-refresh/only-export-components -- useTasks must live next to TaskProvider
export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within TaskProvider')
  return ctx
}
