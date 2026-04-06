import { type FormEvent, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { useMotionSafe } from '../lib/useMotionSafe'

type TaskInputProps = {
  onAdd: (title: string) => void
  placeholder?: string
}

export function TaskInput({
  onAdd,
  placeholder = 'Add a task and press Enter…',
}: TaskInputProps) {
  const reduceMotion = useMotionSafe()
  const [value, setValue] = useState('')

  const submit = useCallback(() => {
    const t = value.trim()
    if (!t) return
    onAdd(t)
    setValue('')
  }, [value, onAdd])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit()
  }

  return (
    <div className="task-input-sticky">
      <motion.form
        className="task-input-card"
        onSubmit={onSubmit}
        initial={false}
        whileTap={reduceMotion ? undefined : { scale: 0.995 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.15 }}
      >
        <label className="sr-only" htmlFor="quick-task">
          Quick add task
        </label>
        <input
          id="quick-task"
          className="task-input-field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
      </motion.form>
    </div>
  )
}
