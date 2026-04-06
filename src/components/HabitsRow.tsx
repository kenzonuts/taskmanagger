import type { Task } from '../types/task'
import { sortTasksActive } from '../lib/sortTasks'

const DEFAULT = [
  { key: 'h1', title: 'Observing', range: '07:00 – 07:30', cls: 'habit-card--tone-a' },
  { key: 'h2', title: 'Cooking', range: '08:00 – 09:00', cls: 'habit-card--tone-b' },
  { key: 'h3', title: 'Reading', range: '12:30 – 13:00', cls: 'habit-card--tone-c' },
  { key: 'h4', title: 'Walking', range: '18:00 – 18:30', cls: 'habit-card--tone-d' },
  { key: 'h5', title: 'Wind down', range: '21:00 – 21:20', cls: 'habit-card--tone-e' },
]

type HabitsRowProps = {
  focusTasks: Task[]
}

export function HabitsRow({ focusTasks }: HabitsRowProps) {
  const sorted = sortTasksActive(focusTasks)
  const merged = DEFAULT.map((d, i) => {
    const t = sorted[i]
    if (!t) return d
    return {
      key: t.id,
      title: t.title,
      range: t.time ? `${t.time} · starred` : 'Any time · starred',
      cls: d.cls,
    }
  })

  return (
    <section className="habits-section" aria-labelledby="focus-strip-heading">
      <h2 id="focus-strip-heading" className="block-heading">
        Focus strip
      </h2>
      <p className="block-sub">
        These cards mirror your <strong>In progress</strong> column—tasks you have starred (up to five).
        Star a task on the board to pin it here.
      </p>
      <div className="habits-scroll">
        {merged.map((h) => (
          <article key={h.key} className={`habit-card ${h.cls}`}>
            <div className="habit-card-art" aria-hidden />
            <h3 className="habit-card-title">{h.title}</h3>
            <p className="habit-card-range">{h.range}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
