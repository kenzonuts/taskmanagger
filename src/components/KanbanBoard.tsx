import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'

type KanbanBoardProps = {
  todo: Task[]
  inProgress: Task[]
  done: Task[]
  selectedId: string | null
  onSelectTask: (id: string) => void
  emptyLabel: string
}

function columnTitle(label: string, n: number) {
  return (
    <div className="kanban-col-head">
      <span className="kanban-col-name">{label}</span>
      <span className="kanban-col-count">{n}</span>
    </div>
  )
}

export function KanbanBoard({
  todo,
  inProgress,
  done,
  selectedId,
  onSelectTask,
  emptyLabel,
}: KanbanBoardProps) {
  const allEmpty = !todo.length && !inProgress.length && !done.length

  return (
    <section className="kanban-section" aria-label="Task board">
      <h2 className="block-heading">To Do list</h2>
      {allEmpty ? (
        <p className="kanban-empty">{emptyLabel}</p>
      ) : (
        <div className="kanban-grid">
          <div className="kanban-col">
            {columnTitle('To Do', todo.length)}
            <div className="kanban-col-cards">
              {todo.map((t) => (
                <div
                  key={t.id}
                  className={`kanban-card-host${selectedId === t.id ? ' is-picked' : ''}`}
                  onClick={() => onSelectTask(t.id)}
                >
                  <TaskItem task={t} />
                </div>
              ))}
            </div>
          </div>
          <div className="kanban-col">
            {columnTitle('In progress', inProgress.length)}
            <div className="kanban-col-cards">
              {inProgress.map((t) => (
                <div
                  key={t.id}
                  className={`kanban-card-host${selectedId === t.id ? ' is-picked' : ''}`}
                  onClick={() => onSelectTask(t.id)}
                >
                  <TaskItem task={t} />
                </div>
              ))}
            </div>
          </div>
          <div className="kanban-col">
            {columnTitle('Completed', done.length)}
            <div className="kanban-col-cards">
              {done.map((t) => (
                <div
                  key={t.id}
                  className={`kanban-card-host${selectedId === t.id ? ' is-picked' : ''}`}
                  onClick={() => onSelectTask(t.id)}
                >
                  <TaskItem task={t} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
