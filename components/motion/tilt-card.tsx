import type { ReactNode } from "react"

export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string; max?: number }) {
  return <div className={className}>{children}</div>
}
