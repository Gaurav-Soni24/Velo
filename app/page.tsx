import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SystemDiagram } from "@/components/system-diagram"
import { VeloSimulator } from "@/components/velo-simulator"
import { ApiReference } from "@/components/api-reference"
import {
  Award,
  BellRing,
  BookOpen,
  Camera,
  CreditCard,
  Database,
  Eye,
  Gauge,
  Github,
  LayoutDashboard,
  Laptop,
  Lock,
  Map,
  PackageSearch,
  ServerCog,
  ShieldCheck,
  Trophy,
  Wifi,
} from "lucide-react"

const REPOS = {
  backend: "https://github.com/Gaurav-Soni24/velo-backend",
  admin: "https://github.com/Gaurav-Soni24/velo-frontend",
  site: "https://github.com/Gaurav-Soni24/Velo",
  paper: "http://www.jetir.org/view?paper=JETIRHQ06008",
}

const STEPS = [
  { icon: CreditCard, title: "1 · Tap", text: "A rider taps their RFID card on the reader at the stand. An Arduino reads the card ID and sends it over USB serial." },
  { icon: Laptop, title: "2 · Forward", text: "A small program on the stand's computer (the ground station) sends that tap to the cloud over the internet as a secure API call." },
  { icon: ServerCog, title: "3 · Decide", text: "The cloud API finds the rider, hands out a free bike (or closes their ride), saves everything in the database and tells the Arduino to unlock." },
  { icon: Camera, title: "4 · Watch", text: "An AI camera reports which bikes are actually parked. The API compares that with the RFID records and raises alerts for any mismatch." },
  { icon: LayoutDashboard, title: "5 · Manage", text: "The admin panel shows taps live, lists rentals and alerts, and lets the admin manage riders and bikes. It reads the same database." },
]

const HIGHLIGHTS = [
  { icon: Lock, title: "No double rentals", text: "A bike is claimed with one atomic database update, so two riders tapping at the same moment can never get the same bike. Covered by a concurrency test." },
  { icon: ShieldCheck, title: "Device authentication", text: "The ground station proves who it is with an API key header. The admin API can be locked with its own key." },
  { icon: Wifi, title: "Built for flaky internet", text: "The ground station retries with backoff, ignores a card held on the reader (debounce), and sends a heartbeat so the admin can see if a stand goes offline." },
  { icon: Eye, title: "Everything is audited", text: "Every tap is logged, including refused ones (unknown card, disabled account, no bikes), and shown in the admin's live feed." },
  { icon: Gauge, title: "Tested end to end", text: "11 automated tests run the real API against an in-memory MongoDB. The browser simulator on this page follows the same rules." },
  { icon: PackageSearch, title: "Runs without hardware", text: "A simulator mode and an in-memory database let anyone try the whole system with two commands and no Arduino or MongoDB." },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
            <div>
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-primary">IoT · RFID · Arduino · Cloud</p>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl">
                Tap your card. Unlock a bike. Everything else is automatic.
              </h1>
              <p className="mb-8 text-lg text-foreground/70">
                Velo is a smart cycle-sharing system. An RFID reader at the stand, a ground-station computer, a cloud API with a database and an admin
                panel work together to rent bikes, track them and raise alerts. This page explains each part and lets you try the flow yourself.
              </p>
              <div className="mb-6 flex flex-wrap gap-3">
                <a href="#demo" className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Try the live simulator
                </a>
                <a href="#how-it-works" className="rounded-lg border border-primary px-6 py-3 font-medium text-primary transition-colors hover:bg-primary/5">
                  How it works
                </a>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <a href={REPOS.paper} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 hover:border-primary">
                  <BookOpen className="h-3.5 w-3.5 text-primary" /> Published in JETIR, March 2026
                </a>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" /> 1st place · International Conference, LCIT
                </span>
              </div>
            </div>

            {/* A real request, as the system sees it */}
            <div className="rounded-2xl border border-border bg-[oklch(0.2_0.02_120)] p-5 font-mono text-xs leading-relaxed text-[oklch(0.92_0.02_120)] shadow-xl">
              <p className="mb-3 text-[oklch(0.7_0.02_120)]">// what happens when Aarav taps his card</p>
              <p><span className="text-amber-300">Arduino</span>        RFID:04A1B2C3</p>
              <p className="text-[oklch(0.6_0.02_120)]">      ↓ USB serial</p>
              <p><span className="text-sky-300">Ground station</span> POST /api/device/scan</p>
              <p className="text-[oklch(0.6_0.02_120)]">      ↓ HTTPS</p>
              <p><span className="text-emerald-300">Cloud API</span>      rent Bike 1 to Aarav</p>
              <p className="text-[oklch(0.6_0.02_120)]">      ↓</p>
              <p><span className="text-violet-300">Database</span>       rental + bike + log saved</p>
              <p className="text-[oklch(0.6_0.02_120)]">      ↓</p>
              <p><span className="text-amber-300">Arduino</span>        ACK:RENT:1  → green LED, lock opens</p>
              <p><span className="text-slate-300">Admin panel</span>    live feed: &quot;Bike 1 unlocked for Aarav&quot;</p>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-3 text-center text-3xl font-bold">Why this system exists</h2>
            <p className="mx-auto mb-10 max-w-3xl text-center text-foreground/70">
              Campus and city cycle sharing usually depends on manual locking, docking stations and almost no monitoring. That wastes staff time, makes
              theft hard to notice and leaves no record of what happened. Velo automates the rental and keeps watching afterwards.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                ["Automated", "Rent and return happen with a card tap. No staff and no paperwork."],
                ["Monitored", "A camera compares what is physically parked with what the system believes."],
                ["Auditable", "Every tap, ride and alert is stored and visible to the admin."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-2 text-lg font-bold text-primary">{title}</h3>
                  <p className="text-sm text-foreground/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 bg-secondary/20 px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-3 text-center text-3xl font-bold">How it works</h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-foreground/70">From a card tap to the admin screen in five steps.</p>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((s) => (
                <div key={s.title} className="rounded-xl border border-border bg-card p-5">
                  <s.icon className="mb-3 h-9 w-9 text-primary" />
                  <h3 className="mb-2 font-bold text-foreground">{s.title}</h3>
                  <p className="text-sm text-foreground/70">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section id="architecture" className="scroll-mt-20 px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-3 text-center text-3xl font-bold">System design</h2>
            <p className="mx-auto mb-10 max-w-3xl text-center text-foreground/70">
              Hardware stays at the stand. Everything that needs to be shared or remembered lives in the cloud, so any number of stands and admins can use
              the same data.
            </p>
            <SystemDiagram />
            <div className="mt-8 grid gap-4 text-sm md:grid-cols-3">
              <div className="rounded-lg bg-secondary/40 p-4"><strong>Device layer.</strong> Arduino Uno + RC522 RFID reader, lock and AI camera.</div>
              <div className="rounded-lg bg-secondary/40 p-4"><strong>Edge layer.</strong> The ground station: reads the devices, talks to the cloud, retries on bad internet.</div>
              <div className="rounded-lg bg-secondary/40 p-4"><strong>Cloud layer.</strong> Express API + MongoDB, plus the Next.js admin panel on top.</div>
            </div>
          </div>
        </section>

        {/* Demo */}
        <section id="demo" className="scroll-mt-20 bg-secondary/20 px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-3 text-center text-3xl font-bold">Try it: a simulated stand</h2>
            <p className="mx-auto mb-10 max-w-3xl text-center text-foreground/70">
              This runs in your browser and follows the same rules as the real backend. Press <strong>Guided tour</strong> for a seven-step story, or use
              the controls and watch the Arduino, ground station, cloud, database and admin panel react.
            </p>
            <VeloSimulator />
          </div>
        </section>

        {/* Alerts */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-3 text-center text-3xl font-bold">Two sources of truth, one alert</h2>
            <p className="mx-auto mb-10 max-w-3xl text-center text-foreground/70">
              RFID records what the system <em>believes</em>. The camera shows what is <em>physically</em> there. When they disagree, Velo raises an alert.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <BellRing className="mb-3 h-8 w-8 text-red-600" />
                <h3 className="mb-1 font-bold">Missing bike</h3>
                <p className="mb-3 text-xs font-mono text-foreground/60">missing_mismatch</p>
                <p className="text-sm text-foreground/70">
                  The system says a bike is <strong>available</strong>, but the camera has not seen it at the stand for 10 minutes. The bike is marked
                  missing and the admin is alerted. If it reappears, it recovers by itself.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <BellRing className="mb-3 h-8 w-8 text-amber-600" />
                <h3 className="mb-1 font-bold">Returned without tapping</h3>
                <p className="mb-3 text-xs font-mono text-foreground/60">returned_manually</p>
                <p className="text-sm text-foreground/70">
                  The system says a bike is <strong>rented</strong>, but the camera sees it parked at the stand: the rider forgot to tap. The admin is
                  alerted, and a proper return afterwards clears the alert.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* API */}
        <section id="api" className="scroll-mt-20 bg-secondary/20 px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-3 text-center text-3xl font-bold">The API</h2>
            <p className="mx-auto mb-10 max-w-3xl text-center text-foreground/70">
              Two small groups of endpoints: one for the ground station and one for the admin panel.
            </p>
            <ApiReference />
          </div>
        </section>

        {/* Engineering highlights */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-3 text-center text-3xl font-bold">Engineering details</h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-foreground/70">The parts that make it dependable, not just a demo.</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {HIGHLIGHTS.map((h) => (
                <div key={h.title} className="rounded-xl border border-border bg-card p-6">
                  <h.icon className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-bold">{h.title}</h3>
                  <p className="text-sm text-foreground/70">{h.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl bg-[oklch(0.2_0.02_120)] p-6 font-mono text-xs leading-relaxed text-[oklch(0.92_0.02_120)]">
              <p className="mb-2 text-[oklch(0.7_0.02_120)]"># run the whole system on your laptop (no Arduino, no MongoDB needed)</p>
              <p>git clone {REPOS.backend}.git &amp;&amp; cd velo-backend</p>
              <p>npm install</p>
              <p>npm run dev:memory        <span className="text-[oklch(0.6_0.02_120)]"># API + in-memory database + demo riders and bikes</span></p>
              <p>npm run ground-station    <span className="text-[oklch(0.6_0.02_120)]"># in a second terminal, then type:  tap 04A1B2C3</span></p>
            </div>
          </div>
        </section>

        {/* Rider app prototype */}
        <section className="bg-secondary/20 px-4 py-20">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="mb-3 text-3xl font-bold">Rider app prototype</h2>
            <p className="mx-auto mb-8 max-w-2xl text-foreground/70">
              Alongside the RFID system there is a concept rider app: find stations on a map, unlock with a QR code and earn reward points. It is a UI
              prototype that stores its data in the browser.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/map" className="inline-flex items-center gap-2 rounded-lg border border-primary px-5 py-2.5 font-medium text-primary hover:bg-primary/5">
                <Map className="h-4 w-4" /> Station map
              </Link>
              <Link href="/rewards" className="inline-flex items-center gap-2 rounded-lg border border-primary px-5 py-2.5 font-medium text-primary hover:bg-primary/5">
                <Trophy className="h-4 w-4" /> Rewards
              </Link>
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg border border-primary px-5 py-2.5 font-medium text-primary hover:bg-primary/5">
                <Database className="h-4 w-4" /> Rider dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Repos + research */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-center text-3xl font-bold">Source code and research</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                ["velo-backend", "Cloud API, ground-station program, Arduino sketch, tests and seed data.", REPOS.backend],
                ["velo-frontend", "The admin dashboard: riders, bikes, rentals, alerts and the live stand view.", REPOS.admin],
                ["Velo (this site)", "The landing page, simulator and rider-app prototype.", REPOS.site],
                ["Research paper", "Velo: An IoT-Based SmartCycle Sharing System for Sustainable Urban Mobility. JETIR, Vol. 13, Issue 3, March 2026.", REPOS.paper],
              ].map(([title, text, href]) => (
                <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary">
                  <div className="mb-2 flex items-center gap-2 font-bold text-foreground group-hover:text-primary">
                    <Github className="h-5 w-5" /> {title}
                  </div>
                  <p className="text-sm text-foreground/70">{text}</p>
                </a>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-foreground/60">
              Built by Gaurav Soni with Akhilesh Kushwaha, Ankit Sahu, Navneet Kushwaha and Savita Sahu, Government Engineering College, Bilaspur.
              Winner (1st place), International Conference at LCIT.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
