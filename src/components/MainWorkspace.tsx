import { useMemo, useState } from 'react'
import type { AppView, Task } from '../types/task'
import { HabitsRow } from './HabitsRow'
import { IconPlus, IconSearch } from './icons'
import { KanbanBoard } from './KanbanBoard'
import { Nudges } from './Nudges'
import { RemindersRow } from './RemindersRow'
import { TaskInput } from './TaskInput'

type MainWorkspaceProps = {
  view: AppView
  meta: { title: string; subtitle: string }
  filtered: Task[]
  onAdd: (title: string) => void
  selectedTaskId: string | null
  onSelectTask: (id: string | null) => void
  emptyLabel: string
}

export function MainWorkspace({
  view,
  meta,
  filtered,
  onAdd,
  selectedTaskId,
  onSelectTask,
  emptyLabel,
}: MainWorkspaceProps) {
  const [query, setQuery] = useState('')

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return filtered
    return filtered.filter((t) => t.title.toLowerCase().includes(q))
  }, [filtered, query])

  const focusTasks = useMemo(
    () => searched.filter((t) => t.isFocus && !t.completed),
    [searched],
  )

  const todo = useMemo(
    () => searched.filter((t) => !t.completed && !t.isFocus),
    [searched],
  )
  const inProgress = useMemo(
    () => searched.filter((t) => !t.completed && t.isFocus),
    [searched],
  )
  const done = useMemo(() => searched.filter((t) => t.completed), [searched])

  const heroTitle =
    view === 'completed'
      ? 'Completed archive'
      : view === 'today'
        ? 'Today Activities'
        : `${meta.title} activities`

  const focusQuickAdd = () => {
    document.getElementById('quick-task')?.focus()
  }

  return (
    <div className="main-panel">
      <div className="main-search-row">
        <div className="main-search">
          <IconSearch size={20} strokeWidth={1.65} className="main-search-icon" />
          <label className="sr-only" htmlFor="main-search-field">
            Search
          </label>
          <input
            id="main-search-field"
            className="main-search-input"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <header className="main-hero">
        <div>
          <h1 className="main-hero-title">{heroTitle}</h1>
          <p className="main-hero-sub">{meta.subtitle}</p>
        </div>
        <button type="button" className="btn-new-activity" onClick={focusQuickAdd}>
          <IconPlus size={18} strokeWidth={1.75} />
          <span>New Activity</span>
        </button>
      </header>

      <Nudges view={view} />

      <div className="main-quick-add">
        <TaskInput onAdd={onAdd} placeholder="Describe an activity and press Enter…" />
      </div>

      {view !== 'completed' && (
        <>
          <HabitsRow focusTasks={focusTasks} />
          <RemindersRow tasks={searched} />
        </>
      )}

      <KanbanBoard
        todo={todo}
        inProgress={inProgress}
        done={done}
        selectedId={selectedTaskId}
        onSelectTask={onSelectTask}
        emptyLabel={
          query.trim()
            ? `No tasks match your search.`
            : emptyLabel
        }
      />
    </div>
  )
}
