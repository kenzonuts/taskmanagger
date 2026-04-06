import { useReducedMotion } from 'framer-motion'

/** Respects prefers-reduced-motion for Framer Motion props. */
export function useMotionSafe() {
  const reduced = useReducedMotion()
  return reduced === true
}
