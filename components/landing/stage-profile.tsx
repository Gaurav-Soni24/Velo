"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion"

const STAGES = [
  {
    code: "CP1",
    part: "Reader",
    title: "A rider taps a card",
    text: "An RC522 reader at the stand picks up the card's ID the moment it is held close. The rider does nothing else.",
    data: "RFID:04A1B2C3",
  },
  {
    code: "CP2",
    part: "Arduino",
    title: "The Arduino passes it on",
    text: "An Arduino Uno reads the RC522 and writes the ID to a USB serial line. It also drives the lock, a green and a red light, and a buzzer.",
    data: "USB serial → RFID:04A1B2C3",
  },
  {
    code: "CP3",
    part: "Ground station",
    title: "The ground station calls the cloud",
    text: "A small Node.js program on a PC or Raspberry Pi sends the tap with its device key, retries when the internet drops, and ignores a card left on the reader.",
    data: "POST /api/device/scan · x-device-key",
  },
  {
    code: "CP4",
    part: "Cloud API",
    title: "The cloud decides",
    text: "The Express API claims a free bike in one atomic MongoDB update, so two riders can never get the same bike. A second tap by the same rider closes the ride instead.",
    data: "rent → Bike 1 · ride opened",
  },
  {
    code: "CP5",
    part: "Lock",
    title: "The lock opens",
    text: "The answer goes back the same way. The Arduino turns the green light on, beeps and opens the lock. A refusal shows red and the bike stays put.",
    data: "ACK:RENT:1",
  },
  {
    code: "CP6",
    part: "Admin",
    title: "The admin sees it",
    text: "The tap lands in the admin's live feed within seconds, with rider, bike and time. Refused taps are logged too, so nothing happens off the record.",
    data: "Bike 1 unlocked for Aarav",
  },
]

/** Course line in a 1200 x 300 box; checkpoints sit on it at these x positions. */
const COURSE = "M20 250 C120 250 160 238 200 232 S330 205 400 186 S530 120 600 96 S700 52 800 64 S900 168 980 170 S1100 132 1180 120"
const CP_X = [120, 330, 520, 760, 940, 1130]
const GROUNDS = ["#0b1236", "#0a1132", "#09102e", "#080e2a", "#070c26", "#060a22"]

function StaticCourse() {
  return (
    <ol className="mt-12 divide-y divide-white/15 border-y border-white/15">
      {STAGES.map((s) => (
        <li key={s.code} className="grid gap-2 py-6 md:grid-cols-[6rem_16rem_1fr]">
          <span className="vl-label text-[var(--vl-lime)]">{s.code}</span>
          <h3 className="vl-wide text-xl font-extrabold uppercase">{s.title}</h3>
          <div>
            <p className="text-white/75">{s.text}</p>
            <code className="mt-2 block text-sm text-[var(--vl-lime)]">{s.data}</code>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function StageProfile() {
  const reduce = useReducedMotion()
  const wrap = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const [len, setLen] = useState(0)
  const [cpLen, setCpLen] = useState<number[]>([])
  const [pt, setPt] = useState({ x: 20, y: 250 })
  const [active, setActive] = useState(0)
  const [dist, setDist] = useState(0)
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] })

  // Measure the course once, and find how far along it each checkpoint sits.
  useLayoutEffect(() => {
    const p = path.current
    if (!p) return
    const total = p.getTotalLength()
    const at: number[] = []
    let cursor = 0
    for (const x of CP_X) {
      while (cursor < total && p.getPointAtLength(cursor).x < x) cursor += 2
      at.push(cursor)
    }
    setLen(total)
    setCpLen(at)
    setDist(at[0])
    const first = p.getPointAtLength(at[0])
    setPt({ x: first.x, y: first.y })
  }, [reduce])

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!path.current || !len || cpLen.length === 0) return
    // Spend the first sliver of scroll arriving at CP1 and the rest moving through the six.
    const start = cpLen[0]
    const end = cpLen[cpLen.length - 1]
    const d = start + Math.min(Math.max(v, 0), 1) * (end - start)
    const p = path.current.getPointAtLength(d)
    setPt({ x: p.x, y: p.y })
    setDist(d)
    let idx = 0
    cpLen.forEach((c, i) => {
      if (d >= c - 8) idx = i
    })
    setActive(idx)
  })

  if (reduce) {
    return (
      <section id="course" className="scroll-mt-16 bg-[var(--vl-ink)] px-6 py-28 text-white lg:px-12">
        <div className="mx-auto max-w-[80rem]">
          <h2 className="vl-display text-[clamp(2.4rem,6vw,5.5rem)]">One tap, six checkpoints</h2>
          <StaticCourse />
        </div>
      </section>
    )
  }

  const s = STAGES[active]

  return (
    <motion.section id="course" ref={wrap} className="relative h-[480vh] scroll-mt-16 text-white" animate={{ backgroundColor: GROUNDS[active] }} transition={{ duration: 0.6 }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-clip px-6 pt-16 lg:px-12">
        <div className="mx-auto w-full max-w-[80rem]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="vl-display text-[clamp(2rem,5.6vw,5.25rem)]">
              One tap,
              <br />
              six checkpoints
            </h2>
            <p className="vl-label pb-2 text-white/55">Stage profile · scroll to ride it</p>
          </div>

          <svg viewBox="0 0 1200 300" className="mt-8 w-full" role="img" aria-label={`Course with six checkpoints. Current: ${s.code}, ${s.part}`}>
            <path d={`${COURSE} L1180 300 L20 300 Z`} fill="rgb(255 255 255 / 0.04)" />
            <path ref={path} d={COURSE} fill="none" stroke="rgb(255 255 255 / 0.28)" strokeWidth={3} />
            {len > 0 && (
              <path
                d={COURSE}
                fill="none"
                stroke="var(--vl-lime)"
                strokeWidth={4}
                strokeDasharray={len}
                strokeDashoffset={len - dist}
                strokeLinecap="round"
              />
            )}
            {CP_X.map((x, i) => {
              const y = cpLen[i] !== undefined && path.current ? path.current.getPointAtLength(cpLen[i]).y : 200
              const on = i <= active
              return (
                <g key={x}>
                  <line x1={x} x2={x} y1={y} y2={14} stroke={on ? "var(--vl-lime)" : "rgb(255 255 255 / 0.25)"} strokeWidth={1.5} strokeDasharray={on ? undefined : "3 5"} />
                  <rect x={x - 7} y={y - 7} width={14} height={14} fill={on ? "var(--vl-lime)" : "var(--vl-ink)"} stroke={on ? "var(--vl-lime)" : "white"} strokeWidth={2} />
                  <text x={x + 8} y={28} fill={on ? "var(--vl-lime)" : "rgb(255 255 255 / 0.55)"} fontSize={15} className="vl-mono max-md:hidden">
                    {STAGES[i].code}
                  </text>
                  <text x={x + 8} y={48} fill={on ? "white" : "rgb(255 255 255 / 0.5)"} fontSize={17} fontWeight={700} className="max-md:hidden">
                    {STAGES[i].part}
                  </text>
                </g>
              )
            })}
            <circle cx={pt.x} cy={pt.y} r={13} fill="white" stroke="var(--vl-ink)" strokeWidth={3} />
            <circle cx={pt.x} cy={pt.y} r={4} fill="var(--vl-blue)" />
          </svg>

          <div className="mt-8 grid min-h-[11rem] gap-6 border-t border-white/15 pt-6 md:grid-cols-[10rem_1fr_1fr]" aria-live="polite">
            <p className="vl-display text-5xl text-[var(--vl-lime)] md:text-6xl">{s.code}</p>
            <motion.h3 key={`t${active}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="vl-wide text-2xl font-extrabold uppercase leading-tight md:text-3xl">
              {s.title}
            </motion.h3>
            <motion.div key={`b${active}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
              <p className="text-white/80">{s.text}</p>
              <code className="mt-3 inline-block bg-white/10 px-2 py-1 text-sm text-[var(--vl-lime)]">{s.data}</code>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
