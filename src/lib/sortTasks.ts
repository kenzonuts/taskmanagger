import type { Task } from '../types/task'

function timeToMinutes(t: string | null): number {
  if (!t) return 24 * 60
  const [h, m] = t.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return 24 * 60
  return h * 60 + m
}

/** Incomplete task ordering: focus → timed (asc) → regular; completed bucket separate. */
export function sortTasksActive(tasks: Task[]): Task[] {
  const incomplete = tasks.filter((t) => !t.completed)
  const done = tasks.filter((t) => t.completed)

  const key = (t: Task): [number, number, number, number] => {
    const focus = t.isFocus ? 0 : 1
    const hasTime = t.time ? 0 : 1
    const minutes = timeToMinutes(t.time)
    return [focus, hasTime, minutes, t.createdAt]
  }

  incomplete.sort((a, b) => {
    const ka = key(a)
    const kb = key(b)
    for (let i = 0; i < ka.length; i++) {
      if (ka[i] !== kb[i]) return ka[i] - kb[i]
    }
    return 0
  })

  done.sort((a, b) => b.createdAt - a.createdAt)
  return [...incomplete, ...done]
}

export function sortTimelineTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const ma = timeToMinutes(a.time)
    const mb = timeToMinutes(b.time)
    if (ma !== mb) return ma - mb
    return a.createdAt - b.createdAt
  })
}
