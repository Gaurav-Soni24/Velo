"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, BookOpen, CheckCircle2, Cpu, Github, Medal, Search, Server, Smartphone, Trophy } from "lucide-react"
import { CountUp } from "@/components/motion/count-up"
import { PinnedFrame, type Chapter } from "@/components/motion/pinned-frame"

const PAPER = "http://www.jetir.org/view?paper=JETIRHQ06008"
const BACKEND = "https://github.com/Gaurav-Soni24/velo-backend"

const FINDINGS = [
  "Three-layer architecture: device, application and cloud backend.",
  "Arduino Uno, a Bluetooth module and QR-code authentication lock and unlock cycles automatically.",
  "Bluetooth response time under two seconds in the experimental implementation; described as cost-effective, scalable and feasible.",
  "Built with an Agile process for iterative improvement.",
]

const LAYERS = [
  { icon: Cpu, layer: "Device layer", paper: "Arduino Uno, lock, identification", code: "Arduino sketch (RC522) and the ground station" },
  { icon: Smartphone, layer: "Application layer", paper: "User app: register, find cycles, unlock", code: "Rider app prototype and the admin dashboard" },
  { icon: Server, layer: "Cloud backend layer", paper: "Authentication, ride data, rewards", code: "velo-backend: Express API and MongoDB" },
]

const CHAPTERS: Chapter[] = [
  {
    index: "01",
    tag: "Journal paper",
    meta: "JETIR · March 2026",
    title: "Published in\nJETIR 2026",
    org: "Journal of Emerging Technologies and Innovative Research",
    desc: "Velo started as a research project. The design was peer-reviewed and published in an international journal.",
    chips: ["Vol. 13 · Issue 3", "pp. 45 to 46", "ID 579352"],
    icon: BookOpen,
    body: (
      <article className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-teal-deep">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm font-semibold ">Published paper</span>
        </div>
        <h4 className="mb-3 text-xl font-bold leading-snug text-primary">Velo: An IoT-Based SmartCycle Sharing System for Sustainable Urban Mobility</h4>
        <p className="mb-5 text-xs leading-relaxed text-foreground/65">
          Akhilesh Kushwaha, Ankit Sahu, <strong className="text-foreground">Gaurav Soni</strong>, Navneet Kushwaha, Savita Sahu. Department of Computer Science and Engineering, Government Engineering College, Bilaspur.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={PAPER} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
            Read the paper <ArrowUpRight className="h-4 w-4" />
          </a>
          <a href={BACKEND} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-secondary">
            <Github className="h-4 w-4" /> Source code
          </a>
        </div>
      </article>
    ),
  },
  {
    index: "02",
    tag: "Findings",
    meta: "From the paper",
    title: "What the\npaper shows",
    org: "Peer-reviewed design and prototype",
    desc: "The paper proposes the architecture, builds an experimental prototype and measures how quickly the lock responds.",
    chips: ["5 authors", "3 layers", "< 2 s"],
    icon: Search,
    body: (
      <div className="w-full space-y-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            [5, "", "authors"],
            [3, "", "layers"],
            [2, " s", "response, or less"],
          ].map(([n, suffix, label]) => (
            <div key={label as string} className="rounded-lg border border-border bg-card p-3">
              <div className="text-3xl font-bold text-teal-deep">
                {label === "response, or less" ? "< " : ""}
                <CountUp to={n as number} suffix={suffix as string} />
              </div>
              <p className="mt-0.5 text-[11px] text-foreground/60">{label}</p>
            </div>
          ))}
        </div>
        <ul className="space-y-2.5 pt-1">
          {FINDINGS.map((f) => (
            <li key={f} className="flex gap-2.5 text-sm text-foreground/80">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    index: "03",
    tag: "Winner",
    meta: "International conference",
    title: "1st place at\nthe LCIT conference",
    org: "International Conference at LCIT",
    desc: "The team presented Velo, the IoT smart cycle-sharing system, and won first place at an international conference.",
    chips: ["Winner", "Team of five", "GEC Bilaspur"],
    icon: Trophy,
    body: (
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-navy-soft via-navy to-navy-deep p-8 text-center text-white shadow-xl">
        <div className="shine absolute inset-0" aria-hidden />
        <motion.div
          initial={{ scale: 0.5, rotate: -14, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.15 }}
          className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-teal text-navy-deep"
        >
          <Medal className="h-8 w-8" />
        </motion.div>
        <p className="text-sm font-semibold text-teal">Winner</p>
        <p className="my-1 text-8xl font-black leading-none">1st</p>
        <p className="text-lg font-semibold">Place</p>
        <p className="mt-3 text-sm text-white/70">International Conference at LCIT</p>
        <p className="mt-1 text-xs text-white/50">Project: Velo, IoT smart cycle sharing</p>
      </div>
    ),
  },
  {
    index: "04",
    tag: "Paper to code",
    meta: "What this site implements",
    title: "From the paper\nto the code",
    org: "Same architecture, RFID + camera",
    desc: "The paper describes Bluetooth and QR unlocking. The software on this site is the RFID and camera implementation of the same three-layer architecture.",
    chips: ["Device", "Application", "Cloud"],
    icon: Cpu,
    body: (
      <div className="w-full space-y-3">
        {LAYERS.map((m) => (
          <div key={m.layer} className="flex gap-3 rounded-lg border border-border bg-card p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy text-teal">
              <m.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary">{m.layer}</p>
              <p className="text-[11px] text-foreground/55">In the paper: {m.paper}</p>
              <p className="text-xs text-foreground/80">
                <span className="font-semibold text-teal-deep">In the code:</span> {m.code}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
]

export function ResearchSection() {
  return (
    <section id="research" className="scroll-mt-20 bg-navy-deep pb-24 pt-24 text-white">
      <div className="mx-auto mb-12 max-w-6xl px-4">
        <h2 className="max-w-3xl text-4xl font-extrabold leading-[1.08] md:text-5xl">Research and recognition</h2>
        <p className="mt-4 max-w-2xl text-lg text-white/70">
          Velo began as a research project. The design was published in a journal and won first place at an international conference. Scroll to read the paper, the findings and the award.
        </p>
      </div>

      <PinnedFrame label="Research" chapters={CHAPTERS} />
    </section>
  )
}
