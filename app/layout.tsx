import type React from "react"
import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Figtree, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { VeloProvider } from "@/context/velo-context"
import { SmoothScroll } from "@/components/smooth-scroll"

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" })
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", weight: ["500", "700", "800"] })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://velo-flame.vercel.app").replace(/\/$/, "")
const DESCRIPTION =
  "Velo is an IoT smart cycle-sharing system: tap an RFID card to rent a bike, a ground station sends it to a cloud API, and a camera flags missing bikes. Try the live simulator. Published in JETIR 2026, first place at LCIT."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Velo: RFID smart cycle sharing | Tap in. Ride out.",
    template: "%s | Velo",
  },
  description: DESCRIPTION,
  applicationName: "Velo",
  authors: [{ name: "Gaurav Soni", url: "https://gauravsoni.space" }],
  creator: "Gaurav Soni",
  keywords: [
    "Velo",
    "smart cycle sharing",
    "bike sharing system",
    "RFID bike rental",
    "IoT project",
    "Arduino RFID",
    "RC522",
    "ground station",
    "Express MongoDB API",
    "Next.js admin dashboard",
    "JETIR 2026",
  ],
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Velo",
    locale: "en_IN",
    title: "Velo: RFID smart cycle sharing",
    description: "Tap a card and watch it cross six checkpoints, from the stand to the admin screen. Live simulator, open source, published in JETIR 2026.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Velo: Tap in. Ride out. RFID smart cycle sharing." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velo: RFID smart cycle sharing",
    description: "Tap a card and watch it cross six checkpoints, from the stand to the admin screen. Live simulator and open source.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
}

export const viewport: Viewport = {
  themeColor: "#2440F0",
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${bricolage.variable} ${geistMono.variable} font-sans antialiased`}>
        <SmoothScroll />
        <VeloProvider>{children}</VeloProvider>
        <Analytics />
      </body>
    </html>
  )
}
