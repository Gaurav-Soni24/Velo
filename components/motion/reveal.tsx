import type { ReactNode } from "react"

export const EASE = [0.22, 1, 0.36, 1] as const

/* The page keeps scroll-triggered motion to a few deliberate moments (the pinned frames and the hero),
   so these wrappers render their children as they are. */
export function Reveal({ children, className }: { children: ReactNode; delay?: number; y?: number; x?: number; className?: string }) {
  return <div className={className}>{children}</div>
}

export function Stagger({ children, className }: { children: ReactNode; className?: string; gap?: number }) {
  return <div className={className}>{children}</div>
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
