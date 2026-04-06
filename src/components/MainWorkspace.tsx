import { useMemo, useState } from 'react'
import type { AppView, Task } from '../types/task'
import { categoryLabel } from '../lib/categories'
import { tagLabel } from '../lib/taskTaxonomy'
import { useCategories } from '../state/CategoryContext'
import { HabitsRow } from './HabitsRow'
import { IconPlus, IconSearch } from './icons'
import { KanbanBoard } from './KanbanBoard'
import { Nudges } from './Nudges'
import { RemindersRow } from './RemindersRow'
import { TaskComposer, type TaskComposerPayload } from './TaskComposer'

type MainWorkspaceProps = {
  view: AppView
  meta: { title: string; subtitle: string }
  filtered: Task[]
  onAdd: (payload: TaskComposerPayload) => void
  selectedTaskId: string | null
  onSelectTask: (id: string | null) => void
  emptyLabel: string
  categoryFilter: string | null
  tagFilter: string | null
  onClearListFilter: () => void
  onClearTagFilter: () => void
  onClearAllFilters: () => void
}

export function MainWorkspace({
  view,
  meta,
  filtered,
  onAdd,
  selectedTaskId,
  onSelectTask,
  emptyLabel,
  categoryFilter,
  tagFilter,
  onClearListFilter,
  onClearTagFilter,
  onClearAllFilters,
}: MainWorkspaceProps) {
  const { categories } = useCategories()
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

  const hasTaxonomyFilter = Boolean(categoryFilter || tagFilter)
  const q = query.trim()
  /** Today = execution-only; capture stays on Dashboard, Inbox, etc. */
  const showAddTask = view !== 'today'

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
            placeholder="Search titles in this view…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      {hasTaxonomyFilter && (
        <div className="main-filter-banner" role="status" aria-live="polite">
          <div className="main-filter-banner-row">
            <span className="main-filter-banner-label">Filters on</span>
            <div className="main-filter-chips">
              {categoryFilter ? (
                <button
                  type="button"
                  className="main-filter-chip"
                  onClick={onClearListFilter}
                  aria-label={`Remove list filter: ${categoryLabel(categoryFilter, categories)}`}
                >
                  List · {categoryLabel(categoryFilter, categories)}
                  <span className="main-filter-chip-x" aria-hidden>
                    ×
                  </span>
                </button>
              ) : null}
              {tagFilter ? (
                <button
                  type="button"
                  className="main-filter-chip"
                  onClick={onClearTagFilter}
                  aria-label={`Remove tag filter: ${tagLabel(tagFilter)}`}
                >
                  Tag · {tagLabel(tagFilter)}
                  <span className="main-filter-chip-x" aria-hidden>
                    ×
                  </span>
                </button>
              ) : null}
            </div>
            <button type="button" className="main-filter-clear-all" onClick={onClearAllFilters}>
              Clear all
            </button>
          </div>
          <p className="main-filter-hint">
            {showAddTask
              ? 'Sidebar lists and tags narrow what you see here. The add form below starts with those same defaults—you can change list or tag before you press Enter.'
              : 'Sidebar lists and tags narrow what you see on Today.'}
          </p>
        </div>
      )}

      <header className="main-hero">
        <div>
          <h1 className="main-hero-title">{heroTitle}</h1>
          <p className="main-hero-sub">{meta.subtitle}</p>
        </div>
        {showAddTask ? (
          <button type="button" className="btn-new-activity" onClick={focusQuickAdd}>
            <IconPlus size={18} strokeWidth={1.75} />
            <span>New Activity</span>
          </button>
        ) : null}
      </header>

      <Nudges view={view} />

      {showAddTask ? (
        <div className="main-quick-add">
          <TaskComposer
            onAdd={onAdd}
            categories={categories}
            defaultCategoryId={categoryFilter ?? ''}
            defaultTag={tagFilter ?? ''}
            placeholder="Describe an activity and press Enter…"
          />
        </div>
      ) : null}

      <div className="main-panel-flow">
        <div className="main-panel-board">
          <KanbanBoard
            todo={todo}
            inProgress={inProgress}
            done={done}
            selectedId={selectedTaskId}
            onSelectTask={onSelectTask}
            emptyLabel={
              q
                ? 'No tasks match your search. Try another word or clear the search box.'
                : emptyLabel
            }
          />
        </div>
        {view !== 'completed' && view !== 'dashboard' && (
          <div className="main-panel-aside">
            <HabitsRow focusTasks={focusTasks} />
            <RemindersRow tasks={searched} />
          </div>
        )}
      </div>
    </div>
  )
}
