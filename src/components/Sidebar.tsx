import { type FormEvent, useState } from 'react'
import type { UserCategory } from '../types/category'
import type { AppView } from '../types/task'
import { TASK_TAGS } from '../lib/taskTaxonomy'
import { useCategories } from '../state/CategoryContext'
import {
  IconCheckCircle,
  IconHome,
  IconInbox,
  IconLayout,
  IconPlus,
} from './icons'

type SidebarProps = {
  active: AppView
  onSelect: (v: AppView) => void
  categories: UserCategory[]
  /** Resolved list id (ignores deleted lists) for active row styling */
  activeListFilter: string | null
  tagFilter: string | null
  onToggleCategory: (id: string) => void
  onToggleTag: (id: string) => void
}

const PRIMARY: {
  id: AppView
  label: string
  icon: typeof IconHome | typeof IconLayout
}[] = [
  { id: 'home', label: 'Home', icon: IconHome },
  { id: 'dashboard', label: 'Dashboard', icon: IconLayout },
]

export function Sidebar({
  active,
  onSelect,
  categories,
  activeListFilter,
  tagFilter,
  onToggleCategory,
  onToggleTag,
}: SidebarProps) {
  const { addCategory } = useCategories()
  const [newListName, setNewListName] = useState('')

  const submitNewList = (e: FormEvent) => {
    e.preventDefault()
    const label = newListName.trim()
    if (!label) return
    addCategory(label)
    setNewListName('')
  }

  return (
    <aside className="sidebar-main" aria-label="Planner views">
      <div className="sidebar-main-brand">
        <span className="sidebar-main-logo" aria-hidden />
        <div>
          <div className="sidebar-main-name">Dayflow</div>
          <div className="sidebar-main-sub">Soft focus</div>
        </div>
      </div>

      <nav className="sidebar-primary-nav" aria-label="Main views">
        {PRIMARY.map(({ id, label, icon: Icon }) => {
          const isOn = active === id
          return (
            <button
              key={id}
              type="button"
              className={`sidebar-pill${isOn ? ' is-active' : ''}`}
              onClick={() => onSelect(id)}
              aria-current={isOn ? 'page' : undefined}
            >
              <Icon size={18} strokeWidth={1.65} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Your lists</h3>
        <p className="sidebar-filter-hint">
          Tap a list to filter. Tap again to show all lists. Add new lists below—rename or remove
          them in Settings.
        </p>
        <ul className="sidebar-mini-list">
          {categories.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                className={`sidebar-mini-row${activeListFilter === l.id ? ' is-active' : ''}`}
                onClick={() => onToggleCategory(l.id)}
              >
                <span
                  className="sidebar-dot"
                  style={{ background: l.color }}
                  aria-hidden
                />
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <form className="sidebar-add-list" onSubmit={submitNewList}>
          <label className="sr-only" htmlFor="new-list-name">
            New list name
          </label>
          <input
            id="new-list-name"
            className="sidebar-add-list-input"
            placeholder="New list…"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            autoComplete="off"
            maxLength={48}
          />
          <button type="submit" className="sidebar-add-list-btn" aria-label="Add list">
            <IconPlus size={18} strokeWidth={1.75} />
          </button>
        </form>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Tags</h3>
        <p className="sidebar-filter-hint">Tap a tag to filter. Tap again to clear.</p>
        <ul className="sidebar-mini-list">
          {TASK_TAGS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className={`sidebar-mini-row${tagFilter === t.id ? ' is-active' : ''}`}
                onClick={() => onToggleTag(t.id)}
              >
                <span className="sidebar-tag-diamond" style={{ color: t.color }} aria-hidden />
                <span>{t.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section sidebar-section-bottom">
        <h3 className="sidebar-section-title">Archive</h3>
        <button
          type="button"
          className={`sidebar-pill${active === 'completed' ? ' is-active' : ''}`}
          onClick={() => onSelect('completed')}
          aria-current={active === 'completed' ? 'page' : undefined}
        >
          <IconCheckCircle size={18} strokeWidth={1.65} />
          <span>Completed</span>
        </button>
        <button
          type="button"
          className={`sidebar-pill sidebar-pill--inbox${active === 'inbox' ? ' is-active' : ''}`}
          onClick={() => onSelect('inbox')}
          aria-current={active === 'inbox' ? 'page' : undefined}
        >
          <IconInbox size={18} strokeWidth={1.65} />
          <span>Inbox</span>
        </button>
      </div>
    </aside>
  )
}
