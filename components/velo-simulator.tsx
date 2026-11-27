"use client"

import { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Bike, Camera, Clock, CreditCard, Cpu, Database, LayoutDashboard, Laptop, Play, RotateCcw, Server, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  UNKNOWN_TAG,
  advanceTime,
  cameraFrame,
  countStats,
  initialState,
  tap,
  type Actor,
  type SimResult,
  type SimState,
  type TraceStep,
} from "@/lib/velo-sim"

const ACTORS: Record<Actor, { label: string; icon: LucideIcon; colour: string }> = {
  arduino: { label: "Arduino + RFID", icon: Cpu, colour: "bg-amber-100 text-amber-800" },
  camera: { label: "AI camera", icon: Camera, colour: "bg-fuchsia-100 text-fuchsia-800" },
  ground: { label: "Ground station", icon: Laptop, colour: "bg-sky-100 text-sky-800" },
  cloud: { label: "Cloud API", icon: Server, colour: "bg-teal-100 text-teal-800" },
  database: { label: "Database", icon: Database, colour: "bg-violet-100 text-violet-800" },
  admin: { label: "Admin panel", icon: LayoutDashboard, colour: "bg-slate-200 text-slate-800" },
}

const TONE_BORDER = {
  ok: "border-teal-300 bg-teal-50/60",
  error: "border-red-300 bg-red-50/60",
  warn: "border-amber-300 bg-amber-50/60",
  info: "border-border bg-card",
} as const

const STATUS_STYLE = {
  available: "border-teal-300 bg-teal-50 text-teal-800",
  rented: "border-sky-300 bg-sky-50 text-sky-800",
  missing: "border-red-300 bg-red-50 text-red-800",
} as const

const STEP_MS = 380

interface TourStep {
  caption: string
  run: (s: SimState) => SimResult
}

const TOUR: TourStep[] = [
  { caption: "1 / 7 · Aarav taps his card on the stand. The system rents him Bike 1.", run: (s) => tap(s, "04A1B2C3") },
  { caption: "2 / 7 · Diya taps her card and gets the next free bike.", run: (s) => tap(s, "04D4E5F6") },
  { caption: "3 / 7 · A card nobody owns is refused, and the failed tap is still logged.", run: (s) => tap(s, UNKNOWN_TAG) },
  { caption: "4 / 7 · Diya parks her bike but forgets to tap. The camera sees a “rented” bike at the stand, so the system raises an alert.", run: (s) => cameraFrame(s, [2, 3]) },
  { caption: "5 / 7 · Diya taps to return it properly. The ride closes and the alert clears itself.", run: (s) => tap(s, "04D4E5F6") },
  {
    caption: "6 / 7 · 20 minutes pass and the camera can no longer see Bike 3. It is flagged missing.",
    run: (s) => {
      const t = advanceTime(s, 20)
      const f = cameraFrame(t.state, [2])
      return { state: f.state, trace: [...t.trace, ...f.trace] }
    },
  },
  { caption: "7 / 7 · Bike 3 is found and the camera sees it again. It recovers and the alert resolves.", run: (s) => cameraFrame(s, [2, 3]) },
]

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export function VeloSimulator() {
  const [sim, setSim] = useState<SimState>(initialState)
  const simRef = useRef<SimState>(sim)
  const [trace, setTrace] = useState<TraceStep[]>([])
  const [shown, setShown] = useState(0)
  const [caption, setCaption] = useState<string | null>(null)
  const [touring, setTouring] = useState(false)
  const [seen, setSeen] = useState<number[]>([1, 2, 3])
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const cancelTour = useRef(false)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => () => {
    cancelTour.current = true
    clearTimers()
  }, [])

  /** Reveal the trace step by step, then update the stand and admin views. */
  const apply = (result: SimResult) => {
    clearTimers()
    simRef.current = result.state
    setTrace(result.trace)
    setShown(0)
    result.trace.forEach((_, i) => {
      timers.current.push(setTimeout(() => setShown(i + 1), STEP_MS * (i + 1)))
    })
    timers.current.push(setTimeout(() => setSim(result.state), STEP_MS * Math.min(result.trace.length, 4)))
    return STEP_MS * (result.trace.length + 1)
  }

  const doTap = (tag: string) => apply(tap(simRef.current, tag))
  const doCamera = () => apply(cameraFrame(simRef.current, seen))
  const doTime = () => apply(advanceTime(simRef.current, 15))

  const reset = () => {
    cancelTour.current = true
    clearTimers()
    const fresh = initialState()
    simRef.current = fresh
    setSim(fresh)
    setTrace([])
    setShown(0)
    setCaption(null)
    setTouring(false)
    setSeen([1, 2, 3])
  }

  const runTour = async () => {
    reset()
    await sleep(50)
    cancelTour.current = false
    setTouring(true)
    for (const step of TOUR) {
      if (cancelTour.current) return
      setCaption(step.caption)
      const wait = apply(step.run(simRef.current))
      await sleep(wait + 2300)
    }
    if (!cancelTour.current) {
      setCaption("Tour finished. Now try the controls yourself, for example tap a card twice, or send a camera frame without a bike.")
      setTouring(false)
    }
  }

  const stats = countStats(sim)
  const toggleSeen = (id: number) => setSeen((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].sort()))

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      {/* Tour bar */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-h-[2.5rem] text-sm text-foreground/80 sm:max-w-2xl">
          {caption ?? "New here? Press “Guided tour” to watch a full story, or tap the cards below and see what each part of the system does."}
        </p>
        <div className="flex shrink-0 gap-2">
          {touring ? (
            <Button onClick={reset} variant="outline" className="border-primary text-primary">
              <Square className="mr-2 h-4 w-4" /> Stop
            </Button>
          ) : (
            <Button onClick={runTour} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Play className="mr-2 h-4 w-4" /> Guided tour
            </Button>
          )}
          <Button onClick={reset} variant="outline" className="border-border">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: the physical stand */}
        <div className="space-y-5">
          <section>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">At the stand</h4>
            <div className="grid grid-cols-3 gap-3">
              {sim.bikes.map((b) => (
                <div key={b.bikeId} className={`rounded-xl border p-3 text-center transition-colors ${STATUS_STYLE[b.status]}`}>
                  <Bike className="mx-auto h-7 w-7" />
                  <p className="mt-1 text-sm font-bold">Bike {b.bikeId}</p>
                  <p className="text-xs font-medium capitalize">{b.status}</p>
                  <p className="mt-1 text-[11px] opacity-70">{b.rentedBy ? `with ${b.rentedBy}` : `seen ${b.lastSeenMin} min ago`}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">1 · Tap an RFID card</h4>
            <div className="flex flex-wrap gap-2">
              {sim.users.map((u) => (
                <Button key={u.rfidTag} onClick={() => doTap(u.rfidTag)} disabled={touring} variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  <CreditCard className="mr-2 h-4 w-4" />
                  {u.name} <span className="ml-1 font-mono text-[10px] opacity-60">{u.rfidTag}</span>
                </Button>
              ))}
              <Button onClick={() => doTap(UNKNOWN_TAG)} disabled={touring} variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/5">
                <CreditCard className="mr-2 h-4 w-4" /> Unknown card
              </Button>
            </div>
            <p className="mt-2 text-xs text-foreground/60">One reader, one action: tapping rents a bike, and tapping again returns it.</p>
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">2 · What the camera sees</h4>
            <div className="flex flex-wrap items-center gap-3">
              {sim.bikes.map((b) => (
                <label key={b.bikeId} className="flex cursor-pointer items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={seen.includes(b.bikeId)} onChange={() => toggleSeen(b.bikeId)} disabled={touring} className="h-4 w-4 accent-[var(--primary)]" />
                  Bike {b.bikeId}
                </label>
              ))}
              <Button onClick={doCamera} disabled={touring} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Camera className="mr-2 h-4 w-4" /> Send camera frame
              </Button>
              <Button onClick={doTime} disabled={touring} size="sm" variant="outline">
                <Clock className="mr-2 h-4 w-4" /> Wait 15 min
              </Button>
            </div>
            <p className="mt-2 text-xs text-foreground/60">
              Untick a bike, wait 15 minutes, then send a frame: an available bike the camera cannot see is flagged as missing.
            </p>
          </section>
        </div>

        {/* Right: what happens inside */}
        <section>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">What happens inside the system</h4>
          <div className="min-h-[22rem] space-y-2 rounded-xl border border-border bg-background p-3">
            {trace.length === 0 && (
              <p className="p-4 text-sm text-foreground/60">
                Every action walks through the real chain: <strong>Arduino → ground station → cloud API → database → admin panel</strong>. Each step appears here.
              </p>
            )}
            {trace.slice(0, shown).map((step, i) => {
              const a = ACTORS[step.actor]
              return (
                <div key={`${i}-${step.title}`} className={`animate-in fade-in slide-in-from-bottom-1 rounded-lg border p-3 ${TONE_BORDER[step.tone]}`}>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${a.colour}`}>
                      <a.icon className="h-3 w-3" />
                      {a.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{step.title}</span>
                  </div>
                  {step.detail && <p className="mt-1 text-xs text-foreground/70">{step.detail}</p>}
                  {step.code && <pre className="mt-2 overflow-x-auto rounded bg-secondary/60 p-2 font-mono text-[11px] leading-snug">{step.code}</pre>}
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Admin panel view */}
      <section className="mt-6">
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">What the admin sees</h4>
        <div className="grid gap-4 rounded-xl border border-border bg-background p-4 md:grid-cols-[auto_1fr_1fr]">
          <div className="grid grid-cols-2 gap-3 md:w-56">
            {[
              ["Available", stats.available, "text-teal-700"],
              ["Rented", stats.rented, "text-sky-700"],
              ["Missing", stats.missing, "text-red-700"],
              ["Open alerts", stats.openAlerts, "text-amber-700"],
            ].map(([label, value, colour]) => (
              <div key={label as string} className="rounded-lg border border-border bg-card p-3 text-center">
                <div className={`text-2xl font-bold ${colour}`}>{value}</div>
                <div className="text-[11px] text-foreground/60">{label}</div>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold text-foreground/60">Alerts</p>
            <div className="space-y-1.5">
              {sim.alerts.length === 0 && <p className="text-sm text-foreground/50">No alerts.</p>}
              {sim.alerts.slice(0, 4).map((a) => (
                <div key={a.id} className={`rounded-md border px-2 py-1.5 text-xs ${a.resolved ? "border-border text-foreground/40 line-through" : "border-amber-300 bg-amber-50 text-amber-900"}`}>
                  <span className="font-mono font-semibold">{a.type}</span> · {a.message}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold text-foreground/60">Live RFID activity</p>
            <div className="space-y-1.5">
              {sim.events.length === 0 && <p className="text-sm text-foreground/50">No taps yet.</p>}
              {sim.events.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-start gap-2 text-xs">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${e.ok ? "bg-teal-500" : "bg-red-500"}`} />
                  <span>
                    {e.text} <span className="font-mono text-foreground/50">({e.tag})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
