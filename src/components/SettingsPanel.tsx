import { useRef, type ChangeEventHandler } from 'react'
import { parseCategoryRecord } from '../lib/categories'
import { parseTaskRecord } from '../lib/parseTask'
import { useCategories } from '../state/CategoryContext'
import { useTasks } from '../state/TaskContext'
import type { UserCategory } from '../types/category'
import type { Task } from '../types/task'
import { IconLayout } from './icons'

type BackupV2 = {
  version: 2
  tasks: unknown[]
  categories?: unknown[]
}

function isBackupV2(v: unknown): v is BackupV2 {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return o.version === 2 && Array.isArray(o.tasks)
}

type SettingsPanelProps = {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { tasks, dispatch } = useTasks()
  const {
    categories,
    dispatchCategory,
    updateCategoryLabel,
    deleteCategory,
  } = useCategories()
  const importRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const exportJson = () => {
    const payload: BackupV2 = { version: 2, tasks, categories }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dayflow-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImport: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const raw = JSON.parse(String(reader.result)) as unknown
        if (Array.isArray(raw)) {
          const next: Task[] = []
          for (const item of raw) {
            const t = parseTaskRecord(item)
            if (t) next.push(t)
          }
          dispatch({ type: 'HYDRATE', tasks: next })
        } else if (isBackupV2(raw)) {
          const nextTasks: Task[] = []
          for (const item of raw.tasks) {
            const t = parseTaskRecord(item)
            if (t) nextTasks.push(t)
          }
          dispatch({ type: 'HYDRATE', tasks: nextTasks })
          if (Array.isArray(raw.categories)) {
            const nextCats: UserCategory[] = []
            for (const item of raw.categories) {
              const c = parseCategoryRecord(item)
              if (c) nextCats.push(c)
            }
            dispatchCategory({
              type: 'HYDRATE',
              categories: nextCats.length > 0 ? nextCats : [],
            })
          }
        }
      } catch {
        /* ignore */
      }
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  const clearAll = () => {
    if (
      window.confirm(
        'Remove all tasks from this device? This cannot be undone.',
      )
    ) {
      dispatch({ type: 'CLEAR_ALL' })
      onClose()
    }
  }

  const onRemoveList = (c: UserCategory) => {
    if (
      window.confirm(
        `Remove list "${c.label}"? Tasks stay on your board but lose this list label.`,
      )
    ) {
      deleteCategory(c.id)
    }
  }

  return (
    <div className="settings-backdrop" role="presentation" onClick={onClose}>
      <div
        className="settings-panel settings-panel--wide"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onClick={(eve) => eve.stopPropagation()}
      >
        <div className="settings-panel-head">
          <div className="settings-brand">
            <IconLayout size={22} />
            <div>
              <div className="settings-title">Settings</div>
              <div className="settings-sub">Local data on this browser</div>
            </div>
          </div>
          <button type="button" className="settings-close" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="settings-lists-block">
          <h3 className="settings-lists-title">Your lists</h3>
          <p className="settings-lists-desc">
            Rename lists or remove them. Removing a list does not delete tasks.
          </p>
          <ul className="settings-lists-ul">
            {categories.map((c) => (
              <li key={c.id} className="settings-list-row">
                <span
                  className="settings-list-dot"
                  style={{ background: c.color }}
                  aria-hidden
                />
                <input
                  key={`${c.id}-${c.label}`}
                  className="settings-list-input"
                  aria-label={`Rename ${c.label}`}
                  defaultValue={c.label}
                  onBlur={(eve) => {
                    const next = eve.target.value.trim()
                    if (next && next !== c.label) updateCategoryLabel(c.id, next)
                  }}
                  maxLength={48}
                />
                <button
                  type="button"
                  className="settings-list-remove"
                  onClick={() => onRemoveList(c)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="settings-actions">
          <button type="button" className="settings-btn" onClick={exportJson}>
            Export backup
          </button>
          <button
            type="button"
            className="settings-btn"
            onClick={() => importRef.current?.click()}
          >
            Import backup
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={onImport}
          />
          <p className="settings-import-hint">
            New backups include tasks and lists. Older files that are only a task array still
            import.
          </p>
          <button
            type="button"
            className="settings-btn settings-btn-danger"
            onClick={clearAll}
          >
            Clear all tasks
          </button>
        </div>
      </div>
    </div>
  )
}
