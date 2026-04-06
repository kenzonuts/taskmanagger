import { useRef, type ChangeEventHandler } from 'react'
import type { Task } from '../types/task'
import { useTasks } from '../state/TaskContext'
import { IconLayout } from './icons'

type SettingsPanelProps = {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { tasks, dispatch } = useTasks()
  const importRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `smart-daily-planner-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImport: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as unknown
        if (!Array.isArray(data)) return
        const next = data.filter(isTask)
        dispatch({ type: 'HYDRATE', tasks: next })
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

  return (
    <div className="settings-backdrop" role="presentation" onClick={onClose}>
      <div
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onClick={(e) => e.stopPropagation()}
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

function isTask(v: unknown): v is Task {
  if (!v || typeof v !== 'object') return false
  const t = v as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.completed === 'boolean' &&
    typeof t.isFocus === 'boolean' &&
    typeof t.date === 'string' &&
    (t.time === null || typeof t.time === 'string') &&
    typeof t.createdAt === 'number'
  )
}
