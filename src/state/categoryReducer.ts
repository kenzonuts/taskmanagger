import { createId } from '../lib/id'
import type { CategoryAction, UserCategory } from '../types/category'
import {
  CATEGORY_COLOR_PALETTE,
  DEFAULT_CATEGORIES,
} from '../lib/categories'

export function categoryReducer(
  state: UserCategory[],
  action: CategoryAction,
): UserCategory[] {
  switch (action.type) {
    case 'HYDRATE':
      return action.categories.length ? action.categories : DEFAULT_CATEGORIES
    case 'RESET_DEFAULTS':
      return DEFAULT_CATEGORIES
    case 'ADD': {
      const label = action.label.trim()
      if (!label) return state
      const color =
        action.color?.trim() ||
        CATEGORY_COLOR_PALETTE[state.length % CATEGORY_COLOR_PALETTE.length]
      const cat: UserCategory = {
        id: createId(),
        label,
        color,
      }
      return [...state, cat]
    }
    case 'UPDATE': {
      const label = action.label.trim()
      if (!label) return state
      return state.map((c) =>
        c.id === action.id ? { ...c, label } : c,
      )
    }
    case 'DELETE':
      return state.filter((c) => c.id !== action.id)
    default:
      return state
  }
}
