"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { CreditCard } from "lucide-react"
import { EASE } from "@/components/motion/reveal"

const RIDERS = [
  { name: "Aarav", uid: "04A1B2C3" },
  { name: "Diya", uid: "04D4E5F6" },
]

type Dock = string | null

/** Centres of the six parts on the exploded-view diagonal (viewBox units). */
const POS = [
  { x: 92, y: 500 },
  { x: 196, y: 418 },
  { x: 300, y: 336 },
  { x: 380, y: 244 },
  { x: 436, y: 150 },
  { x: 470, y: 58 },
]

const PARTS = [
  { name: "RFID card and reader", idle: "Waiting for a card" },
  { name: "Arduino Uno", idle: "Reads the reader over USB serial" },
  { name: "Ground station", idle: "Forwards every tap over HTTPS" },
  { name: "Cloud API and database", idle: "Decides, then records the result" },
  { name: "Bike and lock", idle: "Opens only when the cloud says yes" },
  { name: "Admin panel", idle: "Shows the tap within seconds" },
]

function Drawing({ n }: { n: number }) {
  switch (n) {
    case 0:
      return (
        <>
          <rect x={-34} y={-14} width={68} height={34} rx={3} />
          <path d="M-8 -2a9 9 0 0 1 0 12M-1 -6a15 15 0 0 1 0 20M6 -10a21 21 0 0 1 0 28" />
          <g transform="rotate(-14) translate(-10 -48)">
            <rect width={46} height={30} rx={3} />
            <rect x={7} y={8} width={11} height={9} rx={1.5} />
          </g>
        </>
      )
    case 1:
      return (
        <>
          <rect x={-38} y={-24} width={76} height={48} rx={3} />
          <rect x={-8} y={-9} width={24} height={20} rx={1.5} />
          <path d="M-32 -20h38M-32 20h28M-46 -8v14h8" />
        </>
      )
    case 2:
      return (
        <>
          <rect x={-32} y={-26} width={64} height={40} rx={2} />
          <path d="M-42 22h84M-24 -14h26M-24 -6h40M-24 2h18" />
        </>
      )
    case 3:
      return (
        <>
          <path d="M-36 14a16 16 0 0 1 3-31a22 22 0 0 1 42-6a18 18 0 0 1 17 37z" />
          <path d="M-10 -2h20M-10 5h12" />
        </>
      )
    case 4:
      return (
        <>
          <circle cx={-32} cy={12} r={19} />
          <circle cx={32} cy={12} r={19} />
          <path d="M-32 12L-8 -16H20L32 12M-8 -16L5 12H-32M20 -16l-4 -9h10M-8 -16l-4 -8h-9" />
          <rect x={-5} y={-3} width={11} height={9} rx={1.5} />
        </>
      )
    default:
      return (
        <>
          <rect x={-40} y={-28} width={80} height={48} rx={2} />
          <path d="M-12 20v9M-22 29h20M-30 8v-8M-20 8v-16M-10 8v-11M0 8v-20" />
          <circle cx={26} cy={-14} r={5} />
        </>
      )
  }
}

/** The catalog plate: an exploded view of the stand. A tap runs a pulse through the six numbered parts. */
function Plate() {
  const reduce = useReducedMotion()
  const [docks, setDocks] = useState<Dock[]>([null, null, null])
  const [reached, setReached] = useState(0) // 0 = idle, 1..6 = parts the tap has reached
  const [msgs, setMsgs] = useState<string[]>([])
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const tap = (name: string, uid: string) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    const next = [...docks]
    const has = next.indexOf(name)
    let cloud: string
    let bike: string
    if (has >= 0) {
      next[has] = null
      cloud = `Return accepted, ride closed`
      bike = `Bike ${has + 1} locks again`
    } else {
      const free = next.indexOf(null)
      if (free < 0) {
        cloud = "No bike free, tap refused"
        bike = "Every bike stays locked"
      } else {
        next[free] = name
        cloud = `Rent accepted for ${name}`
        bike = `Bike ${free + 1} unlocks for ${name}`
      }
    }
    setDocks(next)
    setMsgs([`${name}'s card, RFID:${uid}`, `Sends RFID:${uid} to the PC`, "POST /api/device/scan", cloud, bike, `"${bike}" on the live feed`])
    if (reduce) {
      setReached(6)
      return
    }
    setReached(0)
    for (let i = 1; i <= 6; i++) timers.current.push(setTimeout(() => setReached(i), 120 + i * 480))
  }

  const rented = docks.filter(Boolean).length

  return (
    <div className="rounded-md border border-white/15 bg-navy-deep/80 p-4 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-6">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="plate-title text-2xl text-white">Stand 01, exploded view</p>
        <p className="partno text-xs text-white/60">
          {3 - rented} of 3 bikes free
        </p>
      </div>

      <svg viewBox="20 0 520 570" className="mx-auto w-full max-w-[29rem]" role="img" aria-label="Exploded diagram of the Velo stand: card reader, Arduino, ground station, cloud, bike lock and admin panel connected in order">
        {/* base axis */}
        {POS.slice(0, -1).map((p, i) => (
          <line key={`b${i}`} x1={p.x} y1={p.y} x2={POS[i + 1].x} y2={POS[i + 1].y} stroke="white" strokeOpacity={0.22} strokeDasharray="3 6" />
        ))}
        {/* live pulse */}
        {POS.slice(0, -1).map((p, i) => (
          <motion.path
            key={`l${i}`}
            d={`M${p.x} ${p.y} L${POS[i + 1].x} ${POS[i + 1].y}`}
            stroke="var(--teal)"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            initial={false}
            animate={{ pathLength: reached > i ? 1 : 0, opacity: reached > i ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
          />
        ))}

        {PARTS.map((part, i) => {
          const on = reached > i
          const now = reached === i + 1
          return (
            <g key={part.name} transform={`translate(${POS[i].x} ${POS[i].y})`}>
              {now && !reduce && (
                <motion.circle r={50} fill="none" stroke="var(--teal)" strokeWidth={1.5} initial={{ opacity: 0.9, scale: 0.7 }} animate={{ opacity: 0, scale: 1.25 }} transition={{ duration: 0.9, ease: EASE }} />
              )}
              <g
                fill={on ? "oklch(0.74 0.12 185 / 0.14)" : "none"}
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-colors duration-300 ${on ? "text-teal" : "text-white/70"}`}
              >
                <Drawing n={i} />
              </g>
              <g transform="translate(-54 -34)">
                <circle r={13} fill="var(--amber)" />
                <text textAnchor="middle" dy="0.35em" className="partno" fontSize={14} fontWeight={700} fill="var(--navy-deep)">
                  {i + 1}
                </text>
              </g>
            </g>
          )
        })}
      </svg>

      <div className="mt-1 grid grid-cols-2 gap-3">
        {RIDERS.map((r) => (
          <motion.button
            key={r.name}
            onClick={() => tap(r.name, r.uid)}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className="hang-tag flex items-center gap-3 bg-amber py-2.5 pl-6 pr-3 text-left text-navy-deep transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            <CreditCard className="h-5 w-5 shrink-0" />
            <span className="leading-tight">
              <span className="block text-[15px] font-bold">Tap {r.name}&rsquo;s card</span>
              <span className="partno text-[11px] text-navy-deep/70">rent or return</span>
            </span>
          </motion.button>
        ))}
      </div>

      <ol className="mt-4 divide-y divide-white/10 border-y border-white/10" aria-live="polite">
        {PARTS.map((part, i) => {
          const on = reached > i
          return (
            <li key={part.name} className="flex items-baseline gap-3 py-1.5 text-sm">
              <span className={`partno w-5 shrink-0 text-xs font-bold transition-colors duration-300 ${on ? "text-teal" : "text-amber"}`}>{i + 1}</span>
              <span className={`w-40 shrink-0 font-semibold transition-colors duration-300 sm:w-44 ${on ? "text-white" : "text-white/80"}`}>{part.name}</span>
              <span className={`min-w-0 transition-colors duration-300 ${on ? "text-teal" : "text-white/55"}`}>{on ? msgs[i] : part.idle}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function Hero() {
  return (
    <section className="blueprint-grid relative overflow-clip bg-navy-deep text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1fr_35rem] lg:gap-14 lg:px-8 lg:pb-28 lg:pt-16">
        <div>
          <h1 className="plate-title text-[clamp(3.25rem,6.4vw,6rem)]">
            Tap a card.
            <br />
            <span className="text-teal">The bike unlocks.</span>
          </h1>
          <p className="mt-7 max-w-lg text-xl leading-relaxed text-white/80">
            Velo is a cycle-sharing system built from six parts: an RFID reader, an Arduino, a small computer at the stand, a cloud API, a lock and an admin panel. A camera watches the stand
            and raises an alert when a bike goes missing.
          </p>
          <p className="mt-3 max-w-lg text-lg leading-relaxed text-white/65">Tap a card on the plate and follow the signal through every part. It uses the same rent and return rules as the real backend.</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#demo" className="rounded bg-teal px-6 py-3.5 text-lg font-bold text-navy-deep transition-colors hover:bg-white">
              Open the full simulator
            </a>
            <a href="#parts" className="rounded border-2 border-white/30 px-6 py-3.5 text-lg font-bold text-white transition-colors hover:border-white">
              See the parts list
            </a>
          </div>

          <p className="mt-12 max-w-lg border-t border-white/15 pt-5 text-white/75">
            Published in the JETIR journal in March 2026 and awarded first place at an international conference at LCIT.{" "}
            <a href="#research" className="font-semibold text-white underline underline-offset-4 hover:text-teal">
              Read about the research
            </a>
          </p>
        </div>

        <Plate />
      </div>
    </section>
  )
}
