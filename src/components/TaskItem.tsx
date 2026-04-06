import { motion } from 'framer-motion'
import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import { todayISO } from '../lib/dates'
import { useMotionSafe } from '../lib/useMotionSafe'
import { TASK_TAGS } from '../lib/taskTaxonomy'
import { useCategories } from '../state/CategoryContext'
import type { Task } from '../types/task'
import { useTasks } from '../state/TaskContext'
import { IconClock, IconStar, IconTrash } from './icons'

type TaskItemProps = {
  task: Task
  variant?: 'default' | 'focus' | 'timeline'
}

export function TaskItem({ task, variant = 'default' }: TaskItemProps) {
  const { dispatch } = useTasks()
  const { categories } = useCategories()
  const reduceMotion = useMotionSafe()
  const timeFieldId = useId()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const commitTitle = useCallback(() => {
    const t = draft.trim()
    if (!t) {
      setDraft(task.title)
      setEditing(false)
      return
    }
    if (t !== task.title) {
      dispatch({ type: 'UPDATE_TITLE', id: task.id, title: t })
    }
    setEditing(false)
  }, [draft, task.title, task.id, dispatch])

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
    if (e.key === 'Escape') {
      setDraft(task.title)
      setEditing(false)
    }
  }

  const toggleComplete = () => {
    dispatch({ type: 'TOGGLE_COMPLETE', id: task.id })
  }

  const toggleFocus = () => {
    dispatch({ type: 'TOGGLE_FOCUS', id: task.id })
  }

  const onTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    dispatch({
      type: 'SET_TIME',
      id: task.id,
      time: v ? v : null,
    })
  }

  const showTimeControl = variant !== 'timeline'

  const motionTransition = reduceMotion ? { duration: 0 } : { duration: 0.18 }

  const startEdit = () => {
    setDraft(task.title)
    setEditing(true)
    queueMicrotask(() => inputRef.current?.focus())
  }

  return (
    <motion.div
      layout={reduceMotion ? false : 'position'}
      transition={motionTransition}
      className={`task-item${task.completed ? ' is-done' : ''}${
        variant === 'focus' ? ' task-item--focus' : ''
      }${variant === 'timeline' ? ' task-item--timeline' : ''}`}
    >
      <motion.button
        type="button"
        className={`task-check${task.completed ? ' is-checked' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          toggleComplete()
        }}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        whileTap={reduceMotion ? {} : { scale: 0.92 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.15 }}
      >
        <span className="task-check-inner" />
      </motion.button>

      <button
        type="button"
        className={`task-star${task.isFocus ? ' is-on' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          toggleFocus()
        }}
        disabled={task.completed}
        aria-label={task.isFocus ? 'Remove from focus' : 'Add to focus'}
      >
        <IconStar size={17} filled={task.isFocus} />
      </button>

      <div className="task-main">
        {editing ? (
          <input
            ref={inputRef}
            className="task-title-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={onKeyDown}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            aria-label="Task title"
          />
        ) : (
          <button type="button" className="task-title-btn" onClick={startEdit}>
            {task.title}
          </button>
        )}

        {!task.completed && (
          <div
            className="task-taxonomy-row"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <span className="task-taxonomy-label">List</span>
            <div className="task-taxonomy-chips">
              {categories.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={`task-chip${task.category === l.id ? ' is-on' : ''}`}
                  onClick={() =>
                    dispatch({
                      type: 'SET_CATEGORY',
                      id: task.id,
                      category: task.category === l.id ? '' : l.id,
                    })
                  }
                >
                  {l.label}
                </button>
              ))}
            </div>
            <span className="task-taxonomy-label">Tags</span>
            <div className="task-taxonomy-chips">
              {TASK_TAGS.map((tg) => (
                <button
                  key={tg.id}
                  type="button"
                  className={`task-chip${task.tag === tg.id ? ' is-on' : ''}`}
                  onClick={() =>
                    dispatch({
                      type: 'SET_TAG',
                      id: task.id,
                      tag: task.tag === tg.id ? '' : tg.id,
                    })
                  }
                >
                  {tg.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!task.date && !task.completed && (
          <div
            className="task-meta-row"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="task-chip"
              onClick={() =>
                dispatch({ type: 'SET_DATE', id: task.id, date: todayISO() })
              }
            >
              Add to today
            </button>
          </div>
        )}

        <div
          className="task-actions-row"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {showTimeControl && (
            <label className="task-time-control" htmlFor={timeFieldId}>
              <span className="task-time-display task-ghost task-ghost-with-icon">
                <IconClock size={15} aria-hidden />
                {task.time ? task.time : 'Set time'}
              </span>
              <input
                id={timeFieldId}
                type="time"
                className="task-time-input-native"
                value={task.time ?? ''}
                onChange={onTimeChange}
                aria-label={`Set time — ${task.title}`}
              />
            </label>
          )}
          <button
            type="button"
            className="task-ghost"
            onClick={() => dispatch({ type: 'RESCHEDULE_TOMORROW', id: task.id })}
            disabled={task.completed}
          >
            Tomorrow
          </button>
          <button
            type="button"
            className="task-ghost"
            onClick={() => dispatch({ type: 'RESCHEDULE_LATER', id: task.id })}
            disabled={task.completed}
          >
            Later
          </button>
          <button
            type="button"
            className="task-ghost task-ghost-danger task-ghost-with-icon"
            onClick={() => dispatch({ type: 'DELETE_TASK', id: task.id })}
            aria-label={`Remove task: ${task.title}`}
            title="Remove this task"
          >
            <IconTrash size={15} aria-hidden />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
