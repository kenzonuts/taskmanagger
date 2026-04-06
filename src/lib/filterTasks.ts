import type { AppView, Task } from '../types/task'
import { addDaysISO, todayISO, weekEndISO } from './dates'

export function filterTasksByView(tasks: Task[], view: AppView): Task[] {
  const today = todayISO()
  const end = weekEndISO(today)

  switch (view) {
    case 'dashboard':
      return tasks.filter((t) => !t.completed && !!t.date && t.date <= today)
    case 'today':
      return tasks.filter((t) => !t.completed && t.date === today)
    case 'tomorrow': {
      const next = addDaysISO(today, 1)
      return tasks.filter((t) => !t.completed && t.date === next)
    }
    case 'week':
      return tasks.filter(
        (t) =>
          !t.completed && !!t.date && t.date >= today && t.date <= end,
      )
    case 'inbox':
      return tasks.filter((t) => !t.completed && t.date === '')
    case 'completed':
      return tasks.filter((t) => t.completed)
    default:
      return tasks
  }
}

export function defaultDateForQuickAdd(view: AppView): string {
  if (view === 'inbox') return ''
  if (view === 'tomorrow') return addDaysISO(todayISO(), 1)
  return todayISO()
}

export function countTodayActive(tasks: Task[]): number {
  const t = todayISO()
  return tasks.filter((x) => !x.completed && x.date === t).length
}

export function countFocusToday(tasks: Task[]): number {
  const t = todayISO()
  return tasks.filter(
    (x) => !x.completed && x.isFocus && x.date === t,
  ).length
}
