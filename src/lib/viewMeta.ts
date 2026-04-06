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
    case 'home':
      return {
        title: 'Home',
        subtitle: 'Your day at a glance—jump into planning when you are ready.',
      }
    case 'dashboard':
      return {
        title: 'Dashboard',
        subtitle:
          'Everything in one board—add here, then give tasks a date or list when you are ready.',
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
