"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Bike, Camera, CreditCard } from "lucide-react"

type CaseId = "missing" | "manual"

const CASES: Record<
  CaseId,
  { label: string; code: string; colour: string; rfid: string[]; seen: boolean[]; odd: number; title: string; text: string; fix: string }
> = {
  missing: {
    label: "Missing bike",
    code: "missing_mismatch",
    colour: "var(--vl-red)",
    rfid: ["Available", "Rented", "Available"],
    seen: [true, false, false],
    odd: 2,
    title: "The records say Bike 3 is parked. The camera has not seen it for 10 minutes.",
    text: "Bike 2 is out on a ride, so not seeing it is expected. Bike 3 should be at the stand and is not. Velo marks it missing and alerts the admin.",
    fix: "If the camera sees Bike 3 again, it recovers by itself.",
  },
  manual: {
    label: "Returned without tapping",
    code: "returned_manually",
    colour: "var(--vl-amber)",
    rfid: ["Available", "Rented", "Available"],
    seen: [true, true, true],
    odd: 1,
    title: "The records say Bike 2 is out on a ride. The camera sees it parked.",
    text: "The rider parked and walked away without tapping. The ride is still open in the database, so Velo alerts the admin.",
    fix: "A proper tap-to-return afterwards clears the alert.",
  },
}

export function PhotoFinish() {
  const reduce = useReducedMotion()
  const [id, setId] = useState<CaseId>("missing")
  const c = CASES[id]

  const row = (label: string, Icon: typeof Camera, cells: { text: string; on: boolean }[]) => (
    <div className="grid grid-cols-[5.5rem_repeat(3,1fr)] items-stretch gap-2 sm:grid-cols-[8rem_repeat(3,1fr)] sm:gap-3">
      <p className="vl-label flex items-center gap-2 text-white/65">
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        {label}
      </p>
      {cells.map((cell, i) => {
        const odd = i === c.odd
        return (
          <motion.div
            key={`${id}-${label}-${i}`}
            initial={reduce ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[5.5rem] flex-col justify-between border-2 px-3 py-2.5"
            style={{ borderColor: odd ? c.colour : "rgb(255 255 255 / 0.15)", background: odd ? "rgb(255 255 255 / 0.06)" : "transparent" }}
          >
            <span className="flex items-center justify-between">
              <span className="text-sm font-bold">Bike {i + 1}</span>
              <Bike className={`h-5 w-5 ${cell.on ? "text-white" : "text-white/20"}`} aria-hidden />
            </span>
            <span className="text-[13px]" style={{ color: odd ? c.colour : "rgb(255 255 255 / 0.7)" }}>
              {cell.text}
            </span>
          </motion.div>
        )
      })}
    </div>
  )

  return (
    <section id="photo-finish" className="scroll-mt-16 bg-[var(--vl-ink)] px-6 py-28 text-white lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[80rem]">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="vl-display text-[clamp(2.4rem,6vw,5.5rem)]">Photo finish</h2>
            <p className="mt-6 max-w-md text-lg text-white/80">
              RFID records what the system believes. A camera shows what is physically at the stand. When the two disagree, Velo raises an alert, like a photo finish settling a close call.
            </p>
            <div role="tablist" aria-label="Alert type" className="mt-8 flex flex-wrap gap-2">
              {(Object.keys(CASES) as CaseId[]).map((k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={id === k}
                  onClick={() => setId(k)}
                  className={`border-2 px-4 py-2.5 text-[15px] font-bold transition-colors ${id === k ? "border-white bg-white text-[var(--vl-ink)]" : "border-white/30 text-white hover:border-white"}`}
                >
                  {CASES[k].label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 lg:col-span-7" role="tabpanel" aria-label={c.label}>
            {row(
              "RFID says",
              CreditCard,
              c.rfid.map((t) => ({ text: t, on: true })),
            )}
            {row(
              "Camera sees",
              Camera,
              c.seen.map((s) => ({ text: s ? "At the stand" : "Not seen", on: s })),
            )}
            <div className="border-t border-white/15 pt-5">
              <p className="flex flex-wrap items-center gap-3">
                <span className="vl-label px-2 py-1 text-[11px] text-[var(--vl-ink)]" style={{ background: c.colour }}>
                  Alert
                </span>
                <code className="text-sm text-white/70">{c.code}</code>
              </p>
              <p className="vl-wide mt-3 text-xl font-bold leading-snug">{c.title}</p>
              <p className="mt-2 text-white/75">{c.text}</p>
              <p className="mt-1 text-white/60">{c.fix}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
