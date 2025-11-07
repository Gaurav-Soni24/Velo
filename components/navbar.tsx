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
    { href: "/map", label: "Map" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/rewards", label: "Rewards" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Bike className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary hidden sm:inline">Velo</span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex gap-8">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Ride Active
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
