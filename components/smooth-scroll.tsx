"use client"

import { useEffect } from "react"
import Lenis from "lenis"

/** Inertial smooth scrolling (Lenis), skipped when the visitor prefers reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    // anchor links scroll through Lenis so they stay smooth
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const el = document.querySelector(a.getAttribute("href") as string)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el as HTMLElement, { offset: -70 })
      }
    }
    document.addEventListener("click", onClick)
    return () => {
      document.removeEventListener("click", onClick)
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
  return null
}
