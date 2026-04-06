import type { Task } from '../types/task'
import { formatDisplayDate } from '../lib/dates'

const CHIP_STYLES = [
  'reminder-chip--lavender',
  'reminder-chip--blue',
  'reminder-chip--rose',
  'reminder-chip--mint',
] as const

function chipFor(title: string) {
  let h = 0
  for (let i = 0; i < title.length; i++) h = (h + title.charCodeAt(i) * (i + 1)) % 997
  return CHIP_STYLES[h % CHIP_STYLES.length]
}

type RemindersRowProps = {
  tasks: Task[]
}

export function RemindersRow({ tasks }: RemindersRowProps) {
  const timed = tasks
    .filter((t) => !t.completed && t.time)
    .slice(0, 6)

  if (!timed.length) {
    return (
      <section className="reminders-section" aria-labelledby="reminders-heading">
        <h2 id="reminders-heading" className="block-heading">
          Reminders
        </h2>
        <p className="reminders-empty">
          No timed items here yet—add a time to a task and it will surface as a gentle reminder card.
        </p>
      </section>
    )
  }

  return (
    <section className="reminders-section" aria-labelledby="reminders-heading">
      <h2 id="reminders-heading" className="block-heading">
        Reminders
      </h2>
      <div className="reminders-scroll">
        {timed.map((t) => (
          <article key={t.id} className="reminder-card">
            <div className="reminder-card-top">
              <span className={`reminder-chip ${chipFor(t.title)}`}>work</span>
            </div>
            <h3 className="reminder-card-title">{t.title}</h3>
            <p className="reminder-card-desc">Stay on track for this block.</p>
            <div className="reminder-card-foot">
              <span className="reminder-loc">{formatDisplayDate(t.date)}</span>
              <span className="reminder-time">{t.time}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
