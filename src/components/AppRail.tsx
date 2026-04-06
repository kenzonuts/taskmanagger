import type { AppView } from '../types/task'
import {
  IconBell,
  IconCalendarRange,
  IconGrid,
  IconHome,
  IconLogOut,
  IconSettings,
  IconUsers,
} from './icons'

type RailProps = {
  active: AppView
  onSelect: (v: AppView) => void
  onOpenSettings: () => void
}

const RAIL: { target: AppView; label: string; icon: typeof IconHome }[] = [
  { target: 'dashboard', label: 'Home', icon: IconHome },
  { target: 'today', label: 'Dashboard', icon: IconGrid },
  { target: 'week', label: 'Calendar', icon: IconCalendarRange },
  { target: 'inbox', label: 'People', icon: IconUsers },
  { target: 'tomorrow', label: 'Reminders', icon: IconBell },
]

export function AppRail({
  active,
  onSelect,
  onOpenSettings,
}: RailProps) {
  return (
    <nav className="app-rail" aria-label="Quick navigation">
      <div className="app-rail-inner">
        {RAIL.map(({ target, label, icon: Icon }) => {
          const isActive = active === target
          return (
            <button
              key={target + label}
              type="button"
              className={`app-rail-btn${isActive ? ' is-active' : ''}`}
              onClick={() => onSelect(target)}
              aria-label={label}
              aria-current={isActive ? 'true' : undefined}
              title={label}
            >
              <Icon size={22} strokeWidth={1.6} />
            </button>
          )
        })}
        <div className="app-rail-spacer" aria-hidden />
        <button
          type="button"
          className="app-rail-btn"
          onClick={onOpenSettings}
          aria-label="Settings"
          title="Settings"
        >
          <IconSettings size={22} strokeWidth={1.6} />
        </button>
        <button
          type="button"
          className="app-rail-btn"
          onClick={onOpenSettings}
          aria-label="Sign out"
          title="Sign out"
        >
          <IconLogOut size={22} strokeWidth={1.6} />
        </button>
      </div>
    </nav>
  )
}
