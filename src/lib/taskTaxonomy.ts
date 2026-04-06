/** Preset tags for tasks + sidebar (user-defined lists live in CategoryContext). */

export const TASK_TAGS = [
  { id: 'work', label: 'work', color: '#7c9cff' },
  { id: 'ux', label: 'uxresearch', color: '#c9a0ff' },
  { id: 'inspo', label: 'inspiration', color: '#ff9ec4' },
] as const

export type TaskTagId = (typeof TASK_TAGS)[number]['id'] | ''

const TAG_SET = new Set(TASK_TAGS.map((t) => t.id))

export function sanitizeTagId(v: string): TaskTagId {
  if (TAG_SET.has(v as (typeof TASK_TAGS)[number]['id'])) return v as TaskTagId
  return ''
}

export function tagLabel(id: string): string {
  return TASK_TAGS.find((t) => t.id === id)?.label ?? ''
}
