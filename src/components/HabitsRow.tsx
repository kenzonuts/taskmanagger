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
      range: t.time ? `${t.time} · focus` : 'Any time · focus',
      cls: d.cls,
    }
  })

  return (
    <section className="habits-section" aria-labelledby="habits-heading">
      <h2 id="habits-heading" className="block-heading">
        Your habits
      </h2>
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
