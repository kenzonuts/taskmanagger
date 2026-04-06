import { AnimatePresence, motion } from 'framer-motion'
import { useMotionSafe } from '../lib/useMotionSafe'
import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'

type FocusSectionProps = {
  tasks: Task[]
}

export function FocusSection({ tasks }: FocusSectionProps) {
  const reduceMotion = useMotionSafe()
  const t = reduceMotion ? { duration: 0 } : { duration: 0.18 }

  if (!tasks.length) return null

  return (
    <section className="focus-section" aria-labelledby="focus-heading">
      <div className="focus-section-head">
        <h2 id="focus-heading" className="section-title">
          Focus
        </h2>
        <span className="section-hint">Max 5 · what you are doing first</span>
      </div>
      <motion.ul
        className="focus-list"
        layout={reduceMotion ? false : 'position'}
        initial={false}
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={t}
            >
              <TaskItem task={task} variant="focus" />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  )
}
