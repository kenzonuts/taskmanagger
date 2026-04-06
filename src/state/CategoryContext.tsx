import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import { DEFAULT_CATEGORIES, parseCategoryRecord } from '../lib/categories'
import type { CategoryAction, UserCategory } from '../types/category'
import { useTasks } from './TaskContext'
import { categoryReducer } from './categoryReducer'

const CATEGORIES_STORAGE_KEY = 'smart-daily-planner-categories'

function readCategoriesFromStorage(): UserCategory[] {
  if (typeof localStorage === 'undefined') return DEFAULT_CATEGORIES
  const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY)
  if (!raw) return DEFAULT_CATEGORIES
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return DEFAULT_CATEGORIES
    const out: UserCategory[] = []
    for (const item of data) {
      const c = parseCategoryRecord(item)
      if (c) out.push(c)
    }
    return out.length > 0 ? out : DEFAULT_CATEGORIES
  } catch {
    return DEFAULT_CATEGORIES
  }
}

type CategoryContextValue = {
  categories: UserCategory[]
  dispatchCategory: (a: CategoryAction) => void
  addCategory: (label: string, color?: string) => void
  updateCategoryLabel: (id: string, label: string) => void
  deleteCategory: (id: string) => void
}

const CategoryContext = createContext<CategoryContextValue | null>(null)

export function CategoryProvider({ children }: { children: ReactNode }) {
  const { dispatch: taskDispatch } = useTasks()
  const [categories, dispatch] = useReducer(
    categoryReducer,
    [],
    readCategoriesFromStorage,
  )
  const hydrated = useRef(false)

  useEffect(() => {
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    localStorage.setItem(
      CATEGORIES_STORAGE_KEY,
      JSON.stringify(categories),
    )
  }, [categories])

  const deleteCategory = useCallback(
    (id: string) => {
      taskDispatch({ type: 'STRIP_CATEGORY_FROM_TASKS', categoryId: id })
      dispatch({ type: 'DELETE', id })
    },
    [taskDispatch],
  )

  const addCategory = useCallback((label: string, color?: string) => {
    dispatch({ type: 'ADD', label, color })
  }, [])

  const updateCategoryLabel = useCallback((id: string, label: string) => {
    dispatch({ type: 'UPDATE', id, label })
  }, [])

  const dispatchCategory = useCallback((action: CategoryAction) => {
    if (action.type === 'DELETE') {
      deleteCategory(action.id)
      return
    }
    dispatch(action)
  }, [deleteCategory])

  const value = useMemo(
    () => ({
      categories,
      dispatchCategory,
      addCategory,
      updateCategoryLabel,
      deleteCategory,
    }),
    [
      categories,
      dispatchCategory,
      addCategory,
      updateCategoryLabel,
      deleteCategory,
    ],
  )

  return (
    <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useCategories() {
  const ctx = useContext(CategoryContext)
  if (!ctx) throw new Error('useCategories must be used within CategoryProvider')
  return ctx
}
