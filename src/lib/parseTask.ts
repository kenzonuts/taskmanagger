import type { Task } from '../types/task'
import { sanitizeTagId } from './taskTaxonomy'

/** Parse unknown JSON / storage shape into a Task; fills category/tag for legacy rows. */
export function parseTaskRecord(v: unknown): Task | null {
  if (!v || typeof v !== 'object') return null
  const t = v as Record<string, unknown>
  if (
    typeof t.id !== 'string' ||
    typeof t.title !== 'string' ||
    typeof t.completed !== 'boolean' ||
    typeof t.isFocus !== 'boolean' ||
    typeof t.date !== 'string' ||
    typeof t.createdAt !== 'number'
  ) {
    return null
  }
  if (t.time !== null && typeof t.time !== 'string') return null
  return {
    id: t.id,
    title: t.title,
    completed: t.completed,
    isFocus: t.isFocus,
    date: t.date,
    time: t.time === undefined ? null : (t.time as string | null),
    category:
      typeof t.category === 'string' ? t.category.trim() : '',
    tag: sanitizeTagId(typeof t.tag === 'string' ? t.tag : ''),
    createdAt: t.createdAt,
  }
}
