import type { AppView } from '../types/task'
import {
  countFocusToday,
  countTodayActive,
} from '../lib/filterTasks'
import { useTasks } from '../state/TaskContext'

type NudgesProps = {
  view: AppView
}

export function Nudges({ view }: NudgesProps) {
  const { tasks, focusBlocked } = useTasks()
  const todayN = countTodayActive(tasks)
  const focusN = countFocusToday(tasks)
  const showTodayHints =
    view === 'dashboard' || view === 'today' || view === 'tomorrow'

  return (
    <div className="nudges" role="status">
      {focusBlocked && <FocusLimitNotice />}
      {showTodayHints && todayN > 10 && (
        <p className="nudge nudge-warn">
          That is a lot for one day. Consider moving a few to{' '}
          <strong>Later</strong>—your future self will thank you.
        </p>
      )}
      {showTodayHints && todayN > 0 && focusN === 0 && (
        <p className="nudge nudge-hint">
          No focus items yet. Star up to five priorities to keep the noise down.
        </p>
      )}
      {showTodayHints && todayN > 8 && todayN <= 10 && (
        <p className="nudge nudge-soft">
          Heavy list today. If energy dips, reschedule the non-essential—no guilt.
        </p>
      )}
    </div>
  )
}

function FocusLimitNotice() {
  return (
    <p className="nudge nudge-accent">
      Focus is capped at five tasks. Unstar one to add another.
    </p>
  )
}
