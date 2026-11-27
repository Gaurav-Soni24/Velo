"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Bike } from "lucide-react"

const EASE = [0.16, 1, 0.3, 1] as const

const RIDERS = [
  { n: "01", name: "Aarav", uid: "04A1B2C3", tilt: -2.5 },
  { n: "02", name: "Diya", uid: "04D4E5F6", tilt: 2 },
]

/** Checkpoints along the chest band, left to right, in the order a tap crosses them. */
const CPS = [
  { code: "CP1", name: "Reader", idle: "Waiting for a card" },
  { code: "CP2", name: "Arduino", idle: "Reads the card over USB" },
  { code: "CP3", name: "Ground station", idle: "Forwards over HTTPS" },
  { code: "CP4", name: "Cloud API", idle: "Decides rent or return" },
  { code: "CP5", name: "Lock", idle: "Opens only on a yes" },
  { code: "CP6", name: "Admin", idle: "Sees the tap live" },
]
const POS = [7, 24, 41, 58, 75, 92]

type Dock = string | null

function Bib({ n, name, uid, tilt, riding, onTap, index }: { n: string; name: string; uid: string; tilt: number; riding: boolean; onTap: () => void; index: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.button
      type="button"
      onClick={onTap}
      aria-label={`Tap ${name}'s card (bib ${n}) to ${riding ? "return the bike" : "rent a bike"}`}
      initial={reduce ? false : { opacity: 0, y: 40, rotate: tilt * 3 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      whileHover={reduce ? undefined : { y: -6, rotate: tilt * 0.4 }}
      whileTap={reduce ? undefined : { y: 3, scale: 0.98 }}
      transition={{ duration: 0.7, delay: reduce ? 0 : 0.55 + index * 0.1, ease: EASE }}
      className="vl-bib vl-on-paper w-[calc(50%-0.75rem)] max-w-[14rem] min-w-0 px-3.5 pb-3 pt-5 text-left sm:w-[14rem] sm:px-4"
    >
      <span className="vl-pin left-2 top-2" />
      <span className="vl-pin right-2 top-2" />
      <span className="vl-pin bottom-2 left-2" />
      <span className="vl-pin bottom-2 right-2" />
      <span className="vl-label flex justify-between text-[10px] text-[var(--vl-slate)]">
        <span>Stand 01</span>
        <span>Bib</span>
      </span>
      <span className="vl-display mt-1 block text-[4.1rem] leading-[0.82] sm:text-[5.75rem]">{n}</span>
      <span className="vl-wide mt-2 block text-lg font-extrabold uppercase leading-none">{name}</span>
      <span className="vl-mono mt-1 block text-xs text-[var(--vl-slate)]">CHIP {uid}</span>
      <span className="mt-3 flex items-center justify-between border-t border-[var(--vl-ink)]/15 pt-2 text-[13px] font-semibold">
        <span>{riding ? "Tap to return" : "Tap to rent"}</span>
        {riding && <span className="vl-label bg-[var(--vl-lime)] px-1.5 py-0.5 text-[10px] text-[var(--vl-ink)]">Riding</span>}
      </span>
    </motion.button>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const [docks, setDocks] = useState<Dock[]>([null, null, null])
  const [reached, setReached] = useState(0)
  const [msgs, setMsgs] = useState<string[]>([])
  const [result, setResult] = useState("")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const tap = (name: string, uid: string) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    const next = [...docks]
    const has = next.indexOf(name)
    let cloud: string
    let lock: string
    let done: string
    if (has >= 0) {
      next[has] = null
      cloud = "Return accepted"
      lock = `Bike ${has + 1} locks again`
      done = `${name} returned Bike ${has + 1}. Ride closed.`
    } else {
      const free = next.indexOf(null)
      if (free < 0) {
        cloud = "No bike free, refused"
        lock = "Every bike stays locked"
        done = "No bike free. Tap refused."
      } else {
        next[free] = name
        cloud = `Rent accepted for ${name}`
        lock = `Bike ${free + 1} unlocks`
        done = `Bike ${free + 1} unlocked for ${name}.`
      }
    }
    setDocks(next)
    setMsgs([`RFID:${uid}`, "Serial line to the PC", "POST /api/device/scan", cloud, lock, "On the live feed"])
    setResult("")
    if (reduce) {
      setReached(6)
      setResult(done)
      return
    }
    setReached(0)
    for (let i = 1; i <= 6; i++) timers.current.push(setTimeout(() => setReached(i), 80 + i * 450))
    timers.current.push(setTimeout(() => setResult(done), 80 + 6 * 450 + 150))
  }

  const free = docks.filter((d) => d === null).length
  const markerLeft = reached === 0 ? 1.5 : POS[reached - 1]
  const current = reached > 0 ? CPS[reached - 1] : null

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-clip bg-[var(--vl-blue)] pb-10 pt-24 text-white lg:pt-28">
      <div className="mx-auto w-full max-w-[80rem] px-6 lg:px-12">
        <h1 className="vl-display text-[clamp(3.6rem,10.4vw,9.75rem)]">
          {["Tap in.", "Ride out."].map((line, i) => (
            <span key={line} className="block overflow-clip pb-[0.04em]">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: reduce ? 0 : 0.2 + i * 0.12, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid items-end gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-6">
            <p className="max-w-[34rem] text-lg leading-relaxed text-white/85 sm:text-xl">
              Velo is cycle sharing run by an RFID card. One tap crosses six checkpoints, from the reader at the stand to the admin screen, and a camera checks that every bike is where the
              records say it is.
            </p>
            <p className="mt-3 max-w-[34rem] text-white/70">Tap a bib to rent a bike, tap it again to return it. Same rules as the real backend.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#ride" className="vl-btn vl-btn-lime">
                Run the full simulator
              </a>
              <a href="#course" className="vl-btn vl-btn-ghost">
                How it works
              </a>
            </div>
          </div>
          <div className="flex min-w-0 justify-start gap-6 sm:gap-8 lg:col-span-6 lg:justify-end lg:pr-4">
            {RIDERS.map((r, i) => (
              <Bib key={r.n} {...r} index={i} riding={docks.includes(r.name)} onTap={() => tap(r.name, r.uid)} />
            ))}
          </div>
        </div>
      </div>

      {/* The chest band: the route a tap travels */}
      <div className="mt-14">
        <div className="mx-auto hidden w-full max-w-[80rem] px-6 md:block lg:px-12">
          <div className="relative h-12">
            {CPS.map((c, i) => (
              <div key={c.code} className="absolute bottom-2 -translate-x-1/2 text-center" style={{ left: `${POS[i]}%` }}>
                <p className={`vl-label text-[11px] transition-colors duration-300 ${reached > i ? "text-[var(--vl-lime)]" : "text-white/55"}`}>{c.code}</p>
                <p className="vl-wide whitespace-nowrap text-[15px] font-bold leading-tight">{c.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <motion.div
            className="vl-band h-11 origin-left"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: reduce ? 0 : 0.05, ease: EASE }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0">
            <div className="relative mx-auto h-full max-w-[80rem] px-6 lg:px-12">
              <div className="relative h-full">
                {CPS.map((c, i) => (
                  <span
                    key={c.code}
                    className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 border-2 transition-colors duration-300 ${
                      reached > i ? "border-[var(--vl-ink)] bg-[var(--vl-ink)]" : "border-[var(--vl-ink)] bg-white"
                    }`}
                    style={{ left: `${POS[i]}%` }}
                    aria-hidden
                  />
                ))}
                <motion.span
                  className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--vl-ink)] bg-white text-[var(--vl-ink)] shadow-[0_6px_16px_rgb(11_18_54/0.35)]"
                  initial={false}
                  animate={{ left: `${markerLeft}%` }}
                  transition={{ duration: reduce ? 0 : 0.42, ease: EASE }}
                  aria-hidden
                >
                  <Bike className="h-5 w-5" />
                </motion.span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[80rem] px-6 lg:px-12">
          <div className="relative hidden h-12 md:block">
            {CPS.map((c, i) => (
              <p
                key={c.code}
                className={`absolute top-3 w-[10.5rem] -translate-x-1/2 text-center text-[13px] leading-snug transition-colors duration-300 ${reached > i ? "text-white" : "text-white/50"}`}
                style={{ left: `${POS[i]}%` }}
              >
                {reached > i ? msgs[i] : c.idle}
              </p>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-white/20 pt-4" aria-live="polite">
            <p className="vl-label text-white/60">
              Stand 01 · {free} of 3 bikes free
              <span className="md:hidden"> · {current ? `${current.code} ${current.name}: ${msgs[reached - 1]}` : "Tap a bib to start"}</span>
            </p>
            <p className="vl-wide min-h-[1.75rem] text-xl font-extrabold uppercase text-[var(--vl-lime)]">{result}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
