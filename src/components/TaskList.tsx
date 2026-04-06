import { AnimatePresence, motion } from 'framer-motion'
import { useMotionSafe } from '../lib/useMotionSafe'
import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'

type TaskListProps = {
  tasks: Task[]
  emptyLabel: string
}

export function TaskList({ tasks, emptyLabel }: TaskListProps) {
  const reduceMotion = useMotionSafe()
  const t = reduceMotion ? { duration: 0 } : { duration: 0.2 }

  if (!tasks.length) {
    return <p className="task-list-empty">{emptyLabel}</p>
  }

  return (
    <section className="task-list-section" aria-label="Tasks">
      <div className="task-list-head">
        <h2 className="section-title">Tasks</h2>
        <span className="section-hint">Inline edit · gentle scheduling</span>
      </div>
      <motion.ul className="task-list" layout={reduceMotion ? false : 'position'}>
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, filter: 'blur(4px)' }
              }
              transition={t}
            >
              <TaskItem task={task} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  )
}
