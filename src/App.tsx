import { useCallback, useMemo, useState } from 'react'
import {
  defaultDateForQuickAdd,
  filterTasksByView,
} from './lib/filterTasks'
import { sortTasksActive } from './lib/sortTasks'
import { viewMeta } from './lib/viewMeta'
import { AppRail } from './components/AppRail'
import { HomeView } from './components/HomeView'
import { MainWorkspace } from './components/MainWorkspace'
import { RightPanel } from './components/RightPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { Sidebar } from './components/Sidebar'
import { CategoryProvider, useCategories } from './state/CategoryContext'
import { TaskProvider, useTasks } from './state/TaskContext'
import type { TaskComposerPayload } from './components/TaskComposer'
import type { AppView } from './types/task'

function PlannerShell() {
  const [view, setView] = useState<AppView>('home')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light',
  )
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const { tasks, dispatch } = useTasks()
  const { categories } = useCategories()

  /** Sidebar selection may reference a deleted list; ignore it for filtering/UI. */
  const resolvedListFilter = useMemo(() => {
    if (!categoryFilter) return null
    return categories.some((c) => c.id === categoryFilter) ? categoryFilter : null
  }, [categoryFilter, categories])

  const setThemeAttr = useCallback((next: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', next)
    setTheme(next)
  }, [])

  const goToView = useCallback((v: AppView) => {
    setSelectedTaskId(null)
    setView(v)
  }, [])

  const toggleCategoryFilter = useCallback((id: string) => {
    setCategoryFilter((c) => (c === id ? null : id))
  }, [])

  const toggleTagFilter = useCallback((id: string) => {
    setTagFilter((t) => (t === id ? null : id))
  }, [])

  const clearListFilter = useCallback(() => setCategoryFilter(null), [])
  const clearTagFilterOnly = useCallback(() => setTagFilter(null), [])
  const clearAllFilters = useCallback(() => {
    setCategoryFilter(null)
    setTagFilter(null)
  }, [])

  const viewFiltered = useMemo(
    () => filterTasksByView(tasks, view),
    [tasks, view],
  )

  const filtered = useMemo(() => {
    let f = viewFiltered
    if (resolvedListFilter)
      f = f.filter((t) => t.category === resolvedListFilter)
    if (tagFilter) f = f.filter((t) => t.tag === tagFilter)
    return f
  }, [viewFiltered, resolvedListFilter, tagFilter])

  const activeTask = useMemo(() => {
    if (selectedTaskId) {
      const hit = tasks.find((t) => t.id === selectedTaskId)
      if (hit && filtered.some((t) => t.id === selectedTaskId)) return hit
    }
    const focusFirst = sortTasksActive(
      filtered.filter((t) => !t.completed && t.isFocus),
    )[0]
    if (focusFirst) return focusFirst
    return (
      sortTasksActive(filtered.filter((t) => !t.completed))[0] ?? null
    )
  }, [tasks, filtered, selectedTaskId])

  const checklistTasks = useMemo(
    () => sortTasksActive(filtered.filter((t) => !t.completed)).slice(0, 8),
    [filtered],
  )

  const onAdd = useCallback(
    (payload: TaskComposerPayload) => {
      dispatch({
        type: 'ADD_TASK',
        title: payload.title,
        date: defaultDateForQuickAdd(view),
        category: payload.category,
        tag: payload.tag,
        time: payload.time,
      })
    },
    [dispatch, view],
  )

  const emptyCopy: Record<AppView, string> = {
    home: '',
    dashboard:
      'No tasks yet—or nothing matches your sidebar filters. Add one with the form above, or clear filters to see everything.',
    today:
      'Nothing scheduled for today yet. Add tasks from Dashboard or Inbox and set the date to today, or move something here from another day—then star items you want In progress.',
    tomorrow:
      'No tasks dated for tomorrow. Create one above (while viewing Tomorrow) or reschedule something from Today with “Tomorrow”.',
    week:
      'No dated tasks in the next seven days. Add tasks with dates in this window, or widen your sidebar filters if lists/tags are hiding them.',
    inbox:
      'Inbox has no unscheduled ideas. Capture something above—it stays here until you tap “Add to today” or set a date on the card.',
    completed:
      'No completed tasks in this filtered view. Complete items from the board, or clear sidebar filters to see more history.',
  }

  return (
    <div className="app-shell">
      <AppRail
        active={view}
        onSelect={goToView}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <Sidebar
        active={view}
        onSelect={goToView}
        categories={categories}
        activeListFilter={resolvedListFilter}
        tagFilter={tagFilter}
        onToggleCategory={toggleCategoryFilter}
        onToggleTag={toggleTagFilter}
      />
      <div className="app-center">
        {view === 'home' ? (
          <HomeView onNavigate={goToView} />
        ) : (
          <MainWorkspace
            view={view}
            meta={viewMeta(view)}
            filtered={filtered}
            onAdd={onAdd}
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
            emptyLabel={emptyCopy[view]}
            categoryFilter={resolvedListFilter}
            tagFilter={tagFilter}
            onClearListFilter={clearListFilter}
            onClearTagFilter={clearTagFilterOnly}
            onClearAllFilters={clearAllFilters}
          />
        )}
      </div>
      <RightPanel
        theme={theme}
        onToggleTheme={() =>
          setThemeAttr(theme === 'light' ? 'dark' : 'light')
        }
        activeTask={activeTask}
        checklistTasks={checklistTasks}
      />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}

export default function App() {
  return (
    <TaskProvider>
      <CategoryProvider>
        <PlannerShell />
      </CategoryProvider>
    </TaskProvider>
  )
}
