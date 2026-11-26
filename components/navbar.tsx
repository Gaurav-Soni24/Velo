"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useVelo } from "@/context/velo-context"
import { Bike } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { points, rideActive } = useVelo()

  const links = [
    { href: "/", label: "Home" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#demo", label: "Live demo" },
    { href: "/#api", label: "API" },
    { href: "/map", label: "Map" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/rewards", label: "Rewards" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Bike className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden text-xl font-bold text-primary sm:inline">Velo</span>
          </Link>

          {/* Links */}
          <div className="hidden gap-5 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href ? "text-primary" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Points & Status */}
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-primary">{points} pts</div>
            {rideActive && (
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Ride Active
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
