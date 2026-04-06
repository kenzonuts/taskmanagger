import { motion } from 'framer-motion'
import { useMotionSafe } from '../lib/useMotionSafe'
import type { Task } from '../types/task'
import { sortTimelineTasks } from '../lib/sortTasks'
import { TaskItem } from './TaskItem'

type TimelineProps = {
  tasks: Task[]
  hint?: string
}

export function Timeline({ tasks, hint = 'Timed tasks · chronological' }: TimelineProps) {
  const reduceMotion = useMotionSafe()
  const t = reduceMotion ? { duration: 0 } : { duration: 0.18 }

  const timed = tasks.filter(
    (t) => t.time && !t.completed && !t.isFocus,
  )
  const sorted = sortTimelineTasks(timed)
  if (!sorted.length) return null

  return (
    <section className="timeline-section" aria-labelledby="timeline-heading">
      <div className="timeline-head">
        <h2 id="timeline-heading" className="section-title">
          Schedule
        </h2>
        <span className="section-hint">{hint}</span>
      </div>
      <ol className="timeline-list">
        {sorted.map((task, i) => (
          <motion.li
            key={task.id}
            className="timeline-item"
            initial={reduceMotion ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: reduceMotion ? 0 : i * 0.04,
              duration: t.duration,
            }}
          >
            <span className="timeline-time">{task.time}</span>
            <TaskItem task={task} variant="timeline" />
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
