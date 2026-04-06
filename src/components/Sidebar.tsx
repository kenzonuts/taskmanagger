import { useState } from 'react'
import type { AppView } from '../types/task'
import {
  IconCalendarRange,
  IconCalendarTomorrow,
  IconCheckCircle,
  IconInbox,
  IconLayout,
  IconSun,
} from './icons'

type SidebarProps = {
  active: AppView
  onSelect: (v: AppView) => void
}

const PRIMARY: {
  id: AppView
  label: string
  icon: typeof IconLayout | typeof IconCalendarTomorrow
}[] = [
  { id: 'dashboard', label: 'All day', icon: IconLayout },
  { id: 'today', label: 'Today', icon: IconSun },
  { id: 'tomorrow', label: 'Tomorrow', icon: IconCalendarTomorrow },
  { id: 'week', label: 'Next 7 days', icon: IconCalendarRange },
]

const LISTS = [
  { id: 'work', label: 'Work', color: 'var(--tag-blue)' },
  { id: 'freelance', label: 'Freelance', color: 'var(--tag-lavender)' },
  { id: 'workout', label: 'Workout', color: 'var(--tag-peach)' },
]

const TAGS = [
  { id: 'work', label: 'work', color: '#7c9cff' },
  { id: 'ux', label: 'uxresearch', color: '#c9a0ff' },
  { id: 'inspo', label: 'inspiration', color: '#ff9ec4' },
]

export function Sidebar({ active, onSelect }: SidebarProps) {
  const [listId, setListId] = useState<string | null>('work')
  const [tagId, setTagId] = useState<string | null>(null)

  return (
    <aside className="sidebar-main" aria-label="Planner views">
      <div className="sidebar-main-brand">
        <span className="sidebar-main-logo" aria-hidden />
        <div>
          <div className="sidebar-main-name">Dayflow</div>
          <div className="sidebar-main-sub">Soft focus</div>
        </div>
      </div>

      <nav className="sidebar-primary-nav" aria-label="Time scope">
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
        <h3 className="sidebar-section-title">Lists</h3>
        <ul className="sidebar-mini-list">
          {LISTS.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                className={`sidebar-mini-row${listId === l.id ? ' is-active' : ''}`}
                onClick={() => setListId(l.id)}
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
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Tags</h3>
        <ul className="sidebar-mini-list">
          {TAGS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className={`sidebar-mini-row${tagId === t.id ? ' is-active' : ''}`}
                onClick={() => setTagId((c) => (c === t.id ? null : t.id))}
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
