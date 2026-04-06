import type { AppView } from '../types/task'
import { addDaysISO, todayISO } from './dates'

function longToday(): string {
  const [y, m, d] = todayISO().split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function longDateFromISO(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function viewMeta(view: AppView): { title: string; subtitle: string } {
  switch (view) {
    case 'dashboard':
      return {
        title: 'Dashboard',
        subtitle:
          'Stay present—capture tasks fast, work what matters, reschedule the rest.',
      }
    case 'today':
      return {
        title: 'Today',
        subtitle: longToday(),
      }
    case 'tomorrow':
      return {
        title: 'Tomorrow',
        subtitle: longDateFromISO(addDaysISO(todayISO(), 1)),
      }
    case 'week':
      return {
        title: 'Next 7 Days',
        subtitle: 'Upcoming work, sorted calmly by time and focus.',
      }
    case 'inbox':
      return {
        title: 'Inbox',
        subtitle: 'Ideas without a date. Assign when you are ready.',
      }
    case 'completed':
      return {
        title: 'Completed',
        subtitle: 'A quiet archive of what you already moved forward.',
      }
    default:
      return { title: 'Planner', subtitle: '' }
  }
}
