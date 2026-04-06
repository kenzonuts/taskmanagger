import type { UserCategory } from '../types/category'
import type { Task } from '../types/task'
import { formatDisplayDate } from '../lib/dates'
import { categoryLabel } from '../lib/categories'
import { tagLabel } from '../lib/taskTaxonomy'
import { useCategories } from '../state/CategoryContext'

const CHIP_STYLES = [
  'reminder-chip--lavender',
  'reminder-chip--blue',
  'reminder-chip--rose',
  'reminder-chip--mint',
] as const

function ListTagChipLabel(t: Task, categories: UserCategory[]) {
  if (t.tag) return tagLabel(t.tag)
  if (t.category) return categoryLabel(t.category, categories)
  return 'Task'
}

function chipFor(title: string) {
  let h = 0
  for (let i = 0; i < title.length; i++) h = (h + title.charCodeAt(i) * (i + 1)) % 997
  return CHIP_STYLES[h % CHIP_STYLES.length]
}

type RemindersRowProps = {
  tasks: Task[]
}

export function RemindersRow({ tasks }: RemindersRowProps) {
  const { categories } = useCategories()
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
          No timed items in this view. Open a task card, choose <strong>Set time</strong>, and it
          will appear here as a reminder strip you can scan quickly.
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
        {timed.map((t) => {
          const chipText = ListTagChipLabel(t, categories)
          return (
          <article key={t.id} className="reminder-card">
            <div className="reminder-card-top">
              <span className={`reminder-chip ${chipFor(t.title)}`}>{chipText}</span>
            </div>
            <h3 className="reminder-card-title">{t.title}</h3>
            <p className="reminder-card-desc">Stay on track for this block.</p>
            <div className="reminder-card-foot">
              <span className="reminder-loc">{formatDisplayDate(t.date)}</span>
              <span className="reminder-time">{t.time}</span>
            </div>
          </article>
          )
        })}
      </div>
    </section>
  )
}
