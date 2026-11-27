"use client"

import { useRef, useState, type ReactNode } from "react"
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { EASE, Stagger, StaggerItem } from "@/components/motion/reveal"

export interface Chapter {
  index: string
  tag: string
  meta?: string
  title: string
  org?: string
  desc: string
  chips?: string[]
  code?: string
  icon: LucideIcon
  /** Optional rich content shown on the right instead of the illustration. */
  body?: ReactNode
}

/** Concentric rings + icon, used as the chapter illustration when there is no body. */
function Art({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="relative flex h-72 w-72 items-center justify-center lg:h-96 lg:w-96">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[spin_40s_linear_infinite] text-border" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="100" cy="100" r="96" strokeDasharray="2 7" />
        <circle cx="100" cy="100" r="74" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 15 * Math.PI) / 180
          return <line key={i} x1={100 + 74 * Math.sin(a)} y1={100 - 74 * Math.cos(a)} x2={100 + (i % 6 === 0 ? 86 : 80) * Math.sin(a)} y2={100 - (i % 6 === 0 ? 86 : 80) * Math.cos(a)} />
        })}
      </svg>
      <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border border-teal-deep/40 bg-navy text-teal shadow-xl shadow-navy/20 lg:h-32 lg:w-32">
        <Icon className="h-12 w-12 lg:h-14 lg:w-14" />
      </div>
    </div>
  )
}

/**
 * Portfolio-style scroll interaction: a frame pins to the viewport while the page scrolls,
 * a rail fills, and each chapter swaps in with its own animation.
 */
export function PinnedFrame({ label, chapters }: { label: string; chapters: Chapter[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(chapters.length - 1, Math.max(0, Math.floor(p * chapters.length))))
  })

  const c = chapters[active]
  const enter = reduce ? false : { opacity: 0, y: 28 }
  const leave = reduce ? undefined : { opacity: 0, y: -20 }

  return (
    <>
      {/* Desktop: pinned frame */}
      <div ref={ref} className="relative hidden md:block" style={{ height: `${chapters.length * 100}vh` }}>
        <div className="sticky top-28 mx-auto flex h-[calc(100vh-8rem)] min-h-[520px] max-w-6xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/30">
          {/* chrome bar */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
            <span className="text-sm text-foreground/60">{label}</span>
            <div className="flex items-center gap-1">
              {chapters.map((ch, i) => (
                <span key={ch.index} className={`px-2 py-0.5 text-sm transition-colors duration-300 ${i === active ? "text-teal-deep" : "text-foreground/35"}`}>
                  {ch.index}
                </span>
              ))}
            </div>
          </div>

          <div className="grid flex-1 grid-cols-[52px_1fr] overflow-hidden">
            {/* spine */}
            <div className="flex flex-col items-center justify-between border-r border-border py-8">
              <span className="h-3" aria-hidden />
              <div className="relative my-3 w-px flex-1 bg-border">
                <motion.div style={{ height: fill }} className="absolute left-0 top-0 w-px bg-teal-deep" />
                {chapters.map((ch, i) => (
                  <motion.span
                    key={ch.index}
                    animate={{ scale: i === active ? 1.6 : 1, backgroundColor: i <= active ? "var(--teal-deep)" : "var(--background)" }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-teal-deep"
                    style={{ top: `${(i / Math.max(1, chapters.length - 1)) * 100}%` }}
                  />
                ))}
              </div>
              <span className="text-xs text-foreground/50">{String(active + 1).padStart(2, "0")}</span>
            </div>

            {/* chapter spread */}
            <div className="relative flex flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`bg-${active}`}
                  initial={reduce ? false : { opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  aria-hidden
                  className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[14vw] font-black leading-none text-foreground/[0.06] lg:text-[200px]"
                >
                  {c.index}
                </motion.span>
              </AnimatePresence>

              <div className="relative z-10 flex shrink-0 items-center gap-3 border-b border-border px-10 py-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`tag-${active}`}
                    initial={reduce ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-teal-deep px-3 py-1 text-xs text-teal-deep"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-deep" />
                    {c.tag}
                  </motion.span>
                </AnimatePresence>
                {c.meta && <span className="text-xs text-foreground/50">{c.meta}</span>}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={enter}
                  animate={{ opacity: 1, y: 0 }}
                  exit={leave}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="relative z-10 grid flex-1 grid-cols-[1.05fr_0.95fr] items-center gap-10 overflow-hidden px-10 py-8"
                >
                  <div className="flex h-full flex-col justify-between gap-6">
                    <div>
                      <h3 className="whitespace-pre-line text-4xl font-bold leading-[1.02] tracking-tight text-primary lg:text-5xl">{c.title}</h3>
                      {c.org && <p className="mt-3 text-xs text-foreground/55">{c.org}</p>}
                    </div>
                    <div>
                      <p className="mb-4 max-w-lg text-base leading-relaxed text-foreground/75">{c.desc}</p>
                      {c.code && <code className="inline-block max-w-full overflow-x-auto rounded-lg bg-navy px-3.5 py-2 text-xs text-teal">{c.code}</code>}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        {c.chips?.map((t) => (
                          <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground/70">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        {chapters.map((ch, i) => (
                          <motion.span
                            key={ch.index}
                            animate={{ width: i === active ? 24 : 6, backgroundColor: i === active ? "var(--teal-deep)" : i < active ? "var(--navy)" : "var(--border)" }}
                            transition={{ duration: 0.35 }}
                            className="h-[3px] rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center overflow-hidden">{c.body ?? <Art icon={c.icon} />}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <Stagger className="mx-auto grid max-w-xl gap-4 px-4 md:hidden">
        {chapters.map((ch) => (
          <StaggerItem key={ch.index}>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-white">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal text-navy-deep">
                  <ch.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-teal">{ch.index} · {ch.tag}</p>
                  <h3 className="whitespace-pre-line font-semibold">{ch.title.replace(/\n/g, " ")}</h3>
                </div>
              </div>
              <p className="mb-3 text-sm text-white/70">{ch.desc}</p>
              {ch.code && <code className="block overflow-x-auto rounded bg-white/5 px-3 py-2 text-xs text-teal">{ch.code}</code>}
              {ch.chips && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {ch.chips.map((t) => (
                    <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 text-xs tracking-wide text-white/75">{t}</span>
                  ))}
                </div>
              )}
              {ch.body && <div className="mt-4 rounded-lg bg-background p-4 text-foreground">{ch.body}</div>}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </>
  )
}
