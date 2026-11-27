"use client"

import { useEffect, useState } from "react"

const SECTIONS = [
  { id: "research", label: "Research" },
  { id: "parts", label: "Parts list" },
  { id: "how-it-works", label: "How it works" },
  { id: "architecture", label: "System design" },
  { id: "demo", label: "Live demo" },
  { id: "admin", label: "Admin panel" },
  { id: "alerts", label: "Alerts" },
  { id: "api", label: "API" },
  { id: "faq", label: "FAQ" },
]

/** Sticky page navigator that highlights the section being read. */
export function SectionNav() {
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="sticky top-16 z-40 border-b border-white/10 bg-navy-deep/95 backdrop-blur">
      <nav aria-label="On this page" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? "true" : undefined}
            className={`shrink-0 rounded px-3 py-1.5 text-[15px] font-semibold transition-colors ${
              active === s.id ? "bg-teal text-navy-deep" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
