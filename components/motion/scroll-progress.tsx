"use client"

import { motion, useScroll, useSpring } from "framer-motion"

/** Thin reading-progress bar fixed to the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-teal to-sky-400" style={{ scaleX }} />
}
