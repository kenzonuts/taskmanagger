export type UserCategory = {
  id: string
  label: string
  /** CSS color (hex or variable) for dots and chips */
  color: string
}

export type CategoryAction =
  | { type: 'ADD'; label: string; color?: string }
  | { type: 'UPDATE'; id: string; label: string }
  | { type: 'DELETE'; id: string }
  | { type: 'HYDRATE'; categories: UserCategory[] }
  | { type: 'RESET_DEFAULTS' }
