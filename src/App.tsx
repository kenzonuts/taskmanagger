import { useCallback, useMemo, useState } from 'react'
import {
  defaultDateForQuickAdd,
  filterTasksByView,
} from './lib/filterTasks'
import { sortTasksActive } from './lib/sortTasks'
import { viewMeta } from './lib/viewMeta'
import { AppRail } from './components/AppRail'
import { MainWorkspace } from './components/MainWorkspace'
import { RightPanel } from './components/RightPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { Sidebar } from './components/Sidebar'
import { TaskProvider, useTasks } from './state/TaskContext'
import type { AppView } from './types/task'

function PlannerShell() {
  const [view, setView] = useState<AppView>('today')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light',
  )
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const { tasks, dispatch } = useTasks()

  const setThemeAttr = useCallback((next: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', next)
    setTheme(next)
  }, [])

  const goToView = useCallback((v: AppView) => {
    setSelectedTaskId(null)
    setView(v)
  }, [])

  const filtered = useMemo(() => filterTasksByView(tasks, view), [tasks, view])

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
    (title: string) => {
      dispatch({
        type: 'ADD_TASK',
        title,
        date: defaultDateForQuickAdd(view),
      })
    },
    [dispatch, view],
  )

  const meta = viewMeta(view)
  const emptyCopy: Record<AppView, string> = {
    dashboard: 'Nothing scheduled here yet. Capture something new above.',
    today: 'A quiet board. Add an activity or pull items from Inbox.',
    tomorrow: 'Tomorrow is open—plant a few anchors with times if it helps.',
    week: 'No upcoming tasks in this window.',
    inbox: 'Inbox is clear. Ideas can land here without a date.',
    completed: 'No completed tasks in this view yet.',
  }

  return (
    <div className="app-shell">
      <AppRail
        active={view}
        onSelect={goToView}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <Sidebar active={view} onSelect={goToView} />
      <div className="app-center">
        <MainWorkspace
          view={view}
          meta={meta}
          filtered={filtered}
          onAdd={onAdd}
          selectedTaskId={selectedTaskId}
          onSelectTask={setSelectedTaskId}
          emptyLabel={emptyCopy[view]}
        />
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
      <PlannerShell />
    </TaskProvider>
  )
}
