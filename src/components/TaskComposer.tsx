import { type FormEvent, useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { UserCategory } from '../types/category'
import { TASK_TAGS } from '../lib/taskTaxonomy'
import { useMotionSafe } from '../lib/useMotionSafe'

export type TaskComposerPayload = {
  title: string
  category: string
  tag: string
  /** Local time string from `<input type="time">` (e.g. 14:30), or null if unset */
  time: string | null
}

type TaskComposerProps = {
  onAdd: (payload: TaskComposerPayload) => void
  categories: UserCategory[]
  /** Prefills list dropdown; syncs when sidebar list filter changes */
  defaultCategoryId: string
  /** Prefills tag dropdown; syncs when sidebar tag filter changes */
  defaultTag: string
  placeholder?: string
}

export function TaskComposer({
  onAdd,
  categories,
  defaultCategoryId,
  defaultTag,
  placeholder = 'Describe an activity, then Enter or Add…',
}: TaskComposerProps) {
  const reduceMotion = useMotionSafe()
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState(defaultCategoryId)
  const [tag, setTag] = useState(defaultTag)
  const [time, setTime] = useState('')

  useEffect(() => {
    setCategoryId(defaultCategoryId)
  }, [defaultCategoryId])

  useEffect(() => {
    setTag(defaultTag)
  }, [defaultTag])

  useEffect(() => {
    if (categoryId && !categories.some((c) => c.id === categoryId)) {
      setCategoryId('')
    }
  }, [categories, categoryId])

  const submit = useCallback(() => {
    const t = title.trim()
    if (!t) return
    const timeVal = time.trim() ? time.trim() : null
    onAdd({ title: t, category: categoryId, tag, time: timeVal })
    setTitle('')
    setTime('')
  }, [title, categoryId, tag, time, onAdd])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit()
  }

  return (
    <div className="task-input-sticky">
      <motion.form
        className="task-input-card task-compose-card"
        onSubmit={onSubmit}
        initial={false}
        whileTap={reduceMotion ? undefined : { scale: 0.995 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.15 }}
      >
        <div className="task-compose-title-row">
          <div className="task-compose-title-grow">
            <label className="sr-only" htmlFor="quick-task">
              Activity title
            </label>
            <input
              id="quick-task"
              className="task-input-field task-compose-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={placeholder}
              autoComplete="off"
            />
          </div>
          <button type="submit" className="task-compose-submit">
            Add
          </button>
        </div>
        <div className="task-compose-meta" role="group" aria-label="List, tag, and time">
          <div className="task-compose-field">
            <label className="task-compose-label" htmlFor="compose-category">
              List
            </label>
            <select
              id="compose-category"
              className="task-compose-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">No list</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="task-compose-field">
            <label className="task-compose-label" htmlFor="compose-tag">
              Tag
            </label>
            <select
              id="compose-tag"
              className="task-compose-select"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">No tag</option>
              {TASK_TAGS.map((tg) => (
                <option key={tg.id} value={tg.id}>
                  {tg.label}
                </option>
              ))}
            </select>
          </div>
          <div className="task-compose-field task-compose-field--time">
            <label className="task-compose-label" htmlFor="compose-time">
              Time
            </label>
            <input
              id="compose-time"
              type="time"
              className="task-compose-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-label="Optional time for this activity"
            />
          </div>
        </div>
      </motion.form>
    </div>
  )
}
