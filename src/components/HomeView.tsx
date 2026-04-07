import { useMemo } from 'react'
import { categoryLabel } from '../lib/categories'
import { todayISO } from '../lib/dates'
import { sortTasksActive } from '../lib/sortTasks'
import { tagLabel } from '../lib/taskTaxonomy'
import type { UserCategory } from '../types/category'
import type { AppView, Task } from '../types/task'
import { useCategories } from '../state/CategoryContext'
import {
  IconCalendarRange,
  IconInbox,
  IconLayout,
  IconSun,
} from './icons'
import { useTasks } from '../state/TaskContext'

function formatTaskDate(date: string, today: string): string {
  if (!date) return 'Inbox'
  if (date === today) return 'Today'
  const [y, m, d] = date.split('-').map(Number)
  if (!y || !m || !d) return date
  const showYear = date.slice(0, 4) !== today.slice(0, 4)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(showYear ? { year: 'numeric' as const } : {}),
  })
}

function HomeTaskRow({
  task,
  today,
  categories,
}: {
  task: Task
  today: string
  categories: UserCategory[]
}) {
  const listName = categoryLabel(task.category, categories)
  const tag = tagLabel(task.tag)
  const meta = [formatTaskDate(task.date, today), task.time, listName, tag].filter(Boolean)

  return (
    <li
      className={`home-ov-task${task.completed ? ' home-ov-task--done' : ''}${
        task.isFocus ? ' home-ov-task--star' : ''
      }`}
    >
      <span className="home-ov-task-line" aria-hidden />
      <div className="home-ov-task-body">
        <span className="home-ov-task-title">{task.title}</span>
        <span className="home-ov-task-meta">{meta.join(' · ')}</span>
      </div>
    </li>
  )
}

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

export function HomeView({ onNavigate }: HomeViewProps) {
  const { tasks } = useTasks()
  const { categories } = useCategories()
  const today = todayISO()

  const sortedTasks = useMemo(() => sortTasksActive(tasks), [tasks])

  const metrics = useMemo(() => {
    const open = tasks.filter((t) => !t.completed).length
    const done = tasks.filter((t) => t.completed).length
    const todayN = tasks.filter((t) => !t.completed && t.date === today).length
    const inboxN = tasks.filter((t) => !t.completed && t.date === '').length
    const starred = tasks.filter((t) => !t.completed && t.isFocus).length
    const total = tasks.length
    const completionPct = total > 0 ? Math.round((done / total) * 100) : 0
    const restOpen = Math.max(0, open - starred)
    return {
      open,
      done,
      todayN,
      inboxN,
      starred,
      total,
      completionPct,
      restOpen,
    }
  }, [tasks, today])

  return (
    <div className="main-panel home-ov">
      <header className="home-ov-top">
        <div className="home-ov-top-copy">
          <p className="home-ov-eyebrow">{longTodayLine()}</p>
          <h1 className="home-ov-h1">Dayflow overview</h1>
          <p className="home-ov-sub">
            A read-only summary of your workspace. Planning and edits stay on the board—this page is
            just orientation.
          </p>
        </div>
        <button
          type="button"
          className="home-ov-cta"
          onClick={() => onNavigate('dashboard')}
        >
          Open board
          <span className="home-ov-cta-arr" aria-hidden>
            →
          </span>
        </button>
      </header>

      <ul className="home-ov-strip" aria-label="Summary figures">
        <li className="home-ov-strip-item">
          <span className="home-ov-strip-lbl">Finished</span>
          <span className="home-ov-strip-val">{metrics.done}</span>
        </li>
        <li className="home-ov-strip-item">
          <span className="home-ov-strip-lbl">Wrapped up</span>
          <span className="home-ov-strip-val">
            {metrics.total > 0 ? `${metrics.completionPct}%` : '—'}
          </span>
        </li>
        <li className="home-ov-strip-item">
          <span className="home-ov-strip-lbl">Still active</span>
          <span className="home-ov-strip-val">{metrics.open}</span>
        </li>
      </ul>

      <div className="home-ov-layout">
        <section className="home-ov-panel home-ov-panel--main" aria-labelledby="home-ov-list-h">
          <div className="home-ov-panel-head">
            <h2 id="home-ov-list-h" className="home-ov-h2">
              Task tape
            </h2>
            <p className="home-ov-panel-note">
              Same order as the board snapshot. Not editable here.
            </p>
          </div>
          {sortedTasks.length === 0 ? (
            <div className="home-ov-empty">
              Your tape is empty. Use <button type="button" className="home-ov-inline-btn" onClick={() => onNavigate('dashboard')}>Open board</button> to add work.
            </div>
          ) : (
            <ul className="home-ov-tape">
              {sortedTasks.map((task) => (
                <HomeTaskRow key={task.id} task={task} today={today} categories={categories} />
              ))}
            </ul>
          )}
        </section>

        <aside className="home-ov-rail" aria-label="Side details">
          <div className="home-ov-panel home-ov-panel--compact">
            <h2 className="home-ov-h2">Throughput</h2>
            <p className="home-ov-muted">
              {metrics.done} of {Math.max(metrics.total, 1)} items marked done
              {metrics.total === 0 ? ' (nothing tracked yet).' : '.'}
            </p>
            <div className="home-ov-bar" role="meter" aria-valuenow={metrics.completionPct} aria-valuemin={0} aria-valuemax={100} aria-label="Completion proportion">
              <div
                className="home-ov-bar-fill"
                style={{ width: `${metrics.completionPct}%` }}
              />
            </div>
          </div>

          <div className="home-ov-panel home-ov-panel--compact">
            <h2 className="home-ov-h2">Attention split</h2>
            <p className="home-ov-muted">Starred vs everything else still open.</p>
            <div className="home-ov-splitnum">
              <div className="home-ov-splitnum-cell home-ov-splitnum-cell--teal">
                <span className="home-ov-splitnum-n">{metrics.starred}</span>
                <span className="home-ov-splitnum-l">Starred</span>
              </div>
              <div className="home-ov-splitnum-cell home-ov-splitnum-cell--rose">
                <span className="home-ov-splitnum-n">{metrics.restOpen}</span>
                <span className="home-ov-splitnum-l">Other open</span>
              </div>
            </div>
          </div>

          <div className="home-ov-panel home-ov-panel--compact">
            <h2 className="home-ov-h2">Snapshot</h2>
            <dl className="home-ov-dl">
              <div className="home-ov-dl-row">
                <dt>TODAY</dt>
                <dd>{metrics.todayN}</dd>
              </div>
              <div className="home-ov-dl-row">
                <dt>INBOX</dt>
                <dd>{metrics.inboxN}</dd>
              </div>
            </dl>
          </div>

          <nav className="home-ov-jump" aria-label="Jump links">
            <button type="button" className="home-ov-jump-btn" onClick={() => onNavigate('dashboard')}>
              <IconLayout size={20} strokeWidth={1.65} />
              Board
            </button>
            <button type="button" className="home-ov-jump-btn" onClick={() => onNavigate('today')}>
              <IconSun size={20} strokeWidth={1.65} />
              Today
            </button>
            <button type="button" className="home-ov-jump-btn" onClick={() => onNavigate('inbox')}>
              <IconInbox size={20} strokeWidth={1.65} />
              Inbox
            </button>
            <button type="button" className="home-ov-jump-btn" onClick={() => onNavigate('week')}>
              <IconCalendarRange size={20} strokeWidth={1.65} />
              Week window
            </button>
          </nav>
        </aside>
      </div>
    </div>
  )
}
