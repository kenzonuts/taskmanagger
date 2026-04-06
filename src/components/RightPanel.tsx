import { useMemo } from 'react'
import type { Task } from '../types/task'
import { useTasks } from '../state/TaskContext'
import { IconChevronDown, IconMoon, IconSun } from './icons'

type RightPanelProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  activeTask: Task | null
  checklistTasks: Task[]
}

export function RightPanel({
  theme,
  onToggleTheme,
  activeTask,
  checklistTasks,
}: RightPanelProps) {
  const { dispatch } = useTasks()

  const checklist = useMemo(() => checklistTasks.slice(0, 6), [checklistTasks])

  const markActiveDone = () => {
    if (!activeTask || activeTask.completed) return
    dispatch({ type: 'TOGGLE_COMPLETE', id: activeTask.id })
  }

  return (
    <aside className="right-panel" aria-label="Focus and checklist">
      <div className="right-panel-top">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className={`theme-toggle-knob${theme === 'dark' ? ' is-dark' : ''}`}>
            <IconSun size={16} strokeWidth={1.75} className="theme-icon-sun" />
            <IconMoon size={16} strokeWidth={1.75} className="theme-icon-moon" />
          </span>
        </button>
        <button type="button" className="user-blob">
          <span className="user-avatar" aria-hidden />
          <span className="user-name">Evelyn</span>
          <IconChevronDown size={16} strokeWidth={1.75} />
        </button>
      </div>

      <section className="right-active-card">
        <h2 className="sr-only">Active task</h2>
        {activeTask ? (
          <>
            <h3 className="right-active-title">{activeTask.title}</h3>
            <p className="right-active-body">
              Keep this block distraction-free. Star other priorities only when this feels
              finished enough to park.
            </p>
            <div className="right-active-meta">
              <span className="right-pill">
                <span className="right-pill-icon" aria-hidden />
                Focus list
              </span>
              <span className="right-tag-chip">today</span>
            </div>
          </>
        ) : (
          <p className="right-active-placeholder">
            Select a card on the board or star a task to anchor this panel.
          </p>
        )}
      </section>

      <section className="right-checklist" aria-label="Quick checklist">
        <h3 className="right-checklist-title">Checklist</h3>
        <ul className="right-checklist-ul">
          {checklist.length === 0 ? (
            <li className="right-checklist-empty">Nothing left to tick off in this view.</li>
          ) : (
            checklist.map((t) => {
              const checked = t.completed
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    className={`right-check-row${checked ? ' is-checked' : ''}`}
                    onClick={() => dispatch({ type: 'TOGGLE_COMPLETE', id: t.id })}
                  >
                    <span className="right-check-box" aria-hidden>
                      {checked ? '✓' : ''}
                    </span>
                    <span className="right-check-label">{t.title}</span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
        <button
          type="button"
          className="btn-mark-done"
          onClick={markActiveDone}
          disabled={!activeTask || activeTask.completed}
        >
          Mark as done
        </button>
      </section>
    </aside>
  )
}
