"use client"

import { useEffect, useState } from "react"

const STEPS = [
  { who: "Arduino", colour: "text-amber-300", text: "RFID:04A1B2C3", note: "reads the card", link: "USB serial" },
  { who: "Ground station", colour: "text-sky-300", text: "POST /api/device/scan", note: "forwards the tap", link: "HTTPS" },
  { who: "Cloud API", colour: "text-teal-300", text: "rent Bike 1 to Aarav", note: "decides", link: "" },
  { who: "Database", colour: "text-violet-300", text: "rental + bike + log saved", note: "remembers", link: "" },
  { who: "Arduino", colour: "text-amber-300", text: "ACK:RENT:1", note: "green LED, lock opens", link: "" },
  { who: "Admin panel", colour: "text-slate-300", text: "“Bike 1 unlocked for Aarav”", note: "sees it live", link: "" },
]

/** The tap-to-unlock chain, highlighted one step at a time (static when the visitor prefers reduced motion). */
export function HeroFlow() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setInterval(() => setActive((i) => (i + 1) % (STEPS.length + 2)), 1100)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="rounded-2xl border border-border bg-[oklch(0.2_0.05_262)] p-5 font-mono text-xs leading-relaxed text-[oklch(0.93_0.015_255)] shadow-xl">
      <div className="mb-3 flex items-center justify-between text-[oklch(0.72_0.03_255)]">
        <span>// what happens when Aarav taps his card</span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" /> live
        </span>
      </div>
      <ol className="space-y-1">
        {STEPS.map((s, i) => (
          <li key={i}>
            <div className={`flex flex-wrap items-baseline gap-x-3 rounded-md px-2 py-1.5 transition-colors duration-500 ${active === i ? "bg-white/10" : ""}`}>
              <span className={`w-28 shrink-0 ${s.colour}`}>{s.who}</span>
              <span className={active === i ? "text-white" : ""}>{s.text}</span>
              <span className={`ml-auto text-[10px] text-[oklch(0.62_0.03_255)] transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-0"}`}>{s.note}</span>
            </div>
            {s.link && <div className="pl-[8.5rem] text-[10px] text-[oklch(0.56_0.03_255)]">↓ {s.link}</div>}
          </li>
        ))}
      </ol>
      <p className="mt-3 border-t border-white/10 pt-3 text-[10px] text-[oklch(0.62_0.03_255)]">The same chain runs for every tap, return and camera check.</p>
    </div>
  )
}
