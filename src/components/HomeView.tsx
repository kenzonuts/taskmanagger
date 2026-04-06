import { useMemo } from 'react'
import type { AppView } from '../types/task'
import { todayISO } from '../lib/dates'
import { IconCalendarRange, IconInbox, IconLayout, IconSun } from './icons'
import { useTasks } from '../state/TaskContext'

type HomeViewProps = {
  onNavigate: (v: AppView) => void
}

function longTodayLine(): string {
  const [y, m, d] = todayISO().split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { tasks } = useTasks()
  const today = todayISO()

  const stats = useMemo(() => {
    const open = tasks.filter((t) => !t.completed).length
    const todayN = tasks.filter((t) => !t.completed && t.date === today).length
    const inboxN = tasks.filter((t) => !t.completed && t.date === '').length
    const starred = tasks.filter((t) => !t.completed && t.isFocus).length
    return { open, todayN, inboxN, starred }
  }, [tasks, today])

  return (
    <div className="main-panel home-landing">
      <div className="home-landing-hero">
        <p className="home-landing-kicker">{longTodayLine()}</p>
        <h1 className="home-landing-title">{greeting()}</h1>
        <p className="home-landing-lead">
          This is your calm entry point. Open the board to add or reorganize tasks, or go straight to
          today when you are ready to execute.
        </p>
      </div>

      <ul className="home-landing-stats" aria-label="Task overview">
        <li className="home-stat">
          <span className="home-stat-value">{stats.open}</span>
          <span className="home-stat-label">Open</span>
        </li>
        <li className="home-stat">
          <span className="home-stat-value">{stats.todayN}</span>
          <span className="home-stat-label">Due today</span>
        </li>
        <li className="home-stat">
          <span className="home-stat-value">{stats.inboxN}</span>
          <span className="home-stat-label">Inbox</span>
        </li>
        <li className="home-stat">
          <span className="home-stat-value">{stats.starred}</span>
          <span className="home-stat-label">In focus</span>
        </li>
      </ul>

      <div className="home-landing-actions" role="group" aria-label="Go to workspace">
        <button
          type="button"
          className="home-action home-action--primary"
          onClick={() => onNavigate('dashboard')}
        >
          <IconLayout size={20} strokeWidth={1.65} />
          <span className="home-action-text">
            <span className="home-action-title">Dashboard</span>
            <span className="home-action-sub">Full board and capture</span>
          </span>
        </button>
        <button type="button" className="home-action" onClick={() => onNavigate('today')}>
          <IconSun size={20} strokeWidth={1.65} />
          <span className="home-action-text">
            <span className="home-action-title">Today</span>
            <span className="home-action-sub">Execution view</span>
          </span>
        </button>
        <button type="button" className="home-action" onClick={() => onNavigate('inbox')}>
          <IconInbox size={20} strokeWidth={1.65} />
          <span className="home-action-text">
            <span className="home-action-title">Inbox</span>
            <span className="home-action-sub">Undated ideas</span>
          </span>
        </button>
        <button type="button" className="home-action" onClick={() => onNavigate('week')}>
          <IconCalendarRange size={20} strokeWidth={1.65} />
          <span className="home-action-text">
            <span className="home-action-title">Next 7 days</span>
            <span className="home-action-sub">Calendar window</span>
          </span>
        </button>
      </div>
    </div>
  )
}
