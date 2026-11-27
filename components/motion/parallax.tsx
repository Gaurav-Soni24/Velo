"use client"

import { useRef, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

/**
 * Moves its children vertically as the page scrolls past, at a different speed from the page,
 * which creates depth. `speed` is in pixels of travel across the viewport (negative moves up).
 */
export function Parallax({ children, speed = 80, className }: { children?: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -speed, reduce ? 0 : speed])
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

/** The admin screenshot "tilts up" into place as it scrolls into view. */
export function ScrollFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.9, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.35], [reduce ? 1 : 0.15, 1])
  return (
    <div ref={ref} style={{ perspective: 1400 }}>
      <motion.div style={{ rotateX, scale, opacity, transformOrigin: "center top" }}>{children}</motion.div>
    </div>
  )
}
