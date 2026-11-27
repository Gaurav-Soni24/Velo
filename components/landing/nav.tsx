"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

/** VELO wordmark with a short chest band underneath. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col gap-1 leading-none ${className}`}>
      <span className="vl-display text-[1.6rem] tracking-[-0.01em]">Velo</span>
      <span className="vl-band block h-[7px] w-full" aria-hidden />
    </span>
  )
}

const LINKS = [
  { href: "#course", label: "How it works" },
  { href: "#ride", label: "Simulator" },
  { href: "#photo-finish", label: "Alerts" },
  { href: "#admin", label: "Admin" },
  { href: "#api", label: "API" },
  { href: "/map", label: "Rider app" },
]

export function LandingNav() {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition-[background-color,box-shadow] duration-300 ${solid ? "bg-[var(--vl-ink)] shadow-[0_1px_0_rgb(255_255_255/0.08)]" : "bg-transparent"}`}
    >
      <div className="mx-auto flex h-16 max-w-[80rem] items-center justify-between px-6 lg:px-12">
        <Link href="/" aria-label="Velo home">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[15px] font-medium text-white/75 transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#ride" className="vl-btn vl-btn-lime px-4 py-2 text-[15px]">
          Try the simulator
        </a>
      </div>
    </header>
  )
}
