import type { UserCategory } from '../types/category'

/** Starter lists — stable ids match earlier app versions. */
export const DEFAULT_CATEGORIES: UserCategory[] = [
  { id: 'work', label: 'Work', color: '#8eb6ff' },
  { id: 'freelance', label: 'Freelance', color: '#c9a0ff' },
  { id: 'workout', label: 'Workout', color: '#ffcfae' },
]

export const CATEGORY_COLOR_PALETTE = [
  '#8eb6ff',
  '#c9a0ff',
  '#ffcfae',
  '#82dcc3',
  '#ffb8d9',
  '#c4b5fd',
  '#fcd34d',
  '#94d4ff',
] as const

export function categoryLabel(id: string, categories: UserCategory[]): string {
  if (!id) return ''
  const hit = categories.find((c) => c.id === id)
  return hit?.label ?? 'Former list'
}

export function parseCategoryRecord(v: unknown): UserCategory | null {
  if (!v || typeof v !== 'object') return null
  const c = v as Record<string, unknown>
  if (typeof c.id !== 'string' || typeof c.label !== 'string') return null
  const color =
    typeof c.color === 'string' && c.color.trim()
      ? c.color.trim()
      : CATEGORY_COLOR_PALETTE[0]
  const label = c.label.trim()
  if (!label || !c.id.trim()) return null
  return { id: c.id.trim(), label, color }
}
