import type { LucideIcon } from "lucide-react"
import { ArrowDown, ArrowRight, ArrowUp, Camera, CreditCard, Database, LayoutDashboard, Laptop, Server } from "lucide-react"

interface NodeProps {
  icon: LucideIcon
  title: string
  subtitle: string
  tag: string
  accent?: boolean
}

function Node({ icon: Icon, title, subtitle, tag, accent }: NodeProps) {
  return (
    <div
      className={`h-full rounded-xl border p-4 ${
        accent ? "border-primary bg-primary/5" : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold leading-tight text-foreground">{title}</p>
          <p className="text-xs text-foreground/60">{tag}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-foreground/70">{subtitle}</p>
    </div>
  )
}

function HArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 px-1 text-primary">
      <span className="max-w-[110px] text-center font-mono text-[10px] leading-tight whitespace-pre-line text-foreground/60">{label}</span>
      <div className="flex items-center">
        {/* a data packet travelling along the link */}
        <div className="relative h-0.5 w-10 overflow-hidden rounded bg-border">
          <span className="flow-dot absolute left-0 top-1/2 h-1.5 w-3 -translate-y-1/2 rounded-full bg-accent" />
        </div>
        <ArrowRight className="-ml-1 h-4 w-4" />
      </div>
    </div>
  )
}

function VArrow({ label, up }: { label: string; up?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-1 text-primary">
      {up ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
      <span className="text-center font-mono text-[10px] leading-tight whitespace-pre-line text-foreground/60">{label}</span>
    </div>
  )
}

const nodes = {
  card: { icon: CreditCard, title: "RFID card + reader", tag: "Device layer", subtitle: "Rider taps a card on an RC522 reader wired to an Arduino Uno, which prints the card ID over USB serial." },
  ground: { icon: Laptop, title: "Ground station", tag: "Computer at the stand", subtitle: "Node.js program that reads the Arduino and the camera, then calls the cloud API over the internet.", accent: true },
  camera: { icon: Camera, title: "AI camera", tag: "Device layer", subtitle: "Detects which bikes are physically parked at the stand." },
  cloud: { icon: Server, title: "Cloud API", tag: "Express on the server", subtitle: "Decides rent or return, reconciles the camera, raises alerts and serves the admin panel.", accent: true },
  db: { icon: Database, title: "Database", tag: "MongoDB", subtitle: "Users, bikes, rentals, alerts, ground-station status and the activity log." },
  admin: { icon: LayoutDashboard, title: "Admin panel", tag: "Next.js dashboard", subtitle: "Manage riders, bikes, rentals and alerts, and watch the stand live." },
}

export function SystemDiagram() {
  return (
    <div>
      {/* Desktop: grid with arrows */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-y-2">
        <Node {...nodes.card} />
        <HArrow label={'USB serial\n"RFID:04A1B2C3"'} />
        <Node {...nodes.ground} />
        <HArrow label={"HTTPS + JSON\nx-device-key"} />
        <Node {...nodes.cloud} />
        <HArrow label="read / write" />
        <Node {...nodes.db} />

        <div />
        <div />
        <VArrow up label={'"CAM:1,2,3"'} />
        <div />
        <VArrow label="REST /api/admin" />
        <div />
        <div />

        <div />
        <div />
        <Node {...nodes.camera} />
        <div />
        <Node {...nodes.admin} />
        <div />
        <div />
      </div>

      {/* Mobile: simple vertical flow */}
      <div className="flex flex-col md:hidden">
        <Node {...nodes.card} />
        <VArrow label="USB serial" />
        <Node {...nodes.camera} />
        <VArrow label="CAM:1,2,3" />
        <Node {...nodes.ground} />
        <VArrow label="HTTPS + JSON, x-device-key" />
        <Node {...nodes.cloud} />
        <VArrow label="read / write" />
        <Node {...nodes.db} />
        <VArrow up label="REST /api/admin" />
        <Node {...nodes.admin} />
      </div>
    </div>
  )
}
