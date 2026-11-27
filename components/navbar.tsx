"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useVelo } from "@/context/velo-context"

/** Velo mark: Velo Blue tile, white V, and the ink / lime / white chest band (same as the favicon). */
export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Velo">
      <defs>
        <clipPath id="velo-mark-clip">
          <rect width="64" height="64" rx="10" />
        </clipPath>
      </defs>
      <g clipPath="url(#velo-mark-clip)">
        <rect width="64" height="64" fill="#2440F0" />
        <path d="M10 9h13.5L32 33.5 40.5 9H54L39 46H25z" fill="#fff" />
        <rect y="50" width="64" height="4" fill="#0B1236" />
        <rect y="54" width="64" height="6" fill="#C6F432" />
        <rect y="60" width="64" height="4" fill="#fff" />
      </g>
    </svg>
  )
}

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#research", label: "Research" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#demo", label: "Live demo" },
  { href: "/#admin", label: "Admin panel" },
  { href: "/#api", label: "API" },
  { href: "/map", label: "Rider app" },
]

export function Navbar() {
  const pathname = usePathname()
  const { rideActive } = useVelo()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
        scrolled ? "border-border bg-background/[0.97] shadow-sm" : "border-transparent bg-background/80"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Velo home">
            <BrandMark />
            <span className="hidden leading-tight sm:block">
              <span className="block text-lg font-bold tracking-tight text-primary">Velo</span>
              <span className="block text-xs text-foreground/55">Smart cycle sharing</span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${pathname === link.href ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {rideActive && (
              <div className="hidden items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
                <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                Ride Active
              </div>
            )}
            <Link
              href="/#demo"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] hover:bg-primary/90 active:scale-95"
            >
              Try the demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
