"use client"

import { Camera, CreditCard, LayoutDashboard, Laptop, ServerCog } from "lucide-react"
import { PinnedFrame, type Chapter } from "@/components/motion/pinned-frame"

const CHAPTERS: Chapter[] = [
  {
    index: "01",
    tag: "Device layer",
    meta: "Arduino + RC522",
    title: "A rider\ntaps a card",
    org: "Arduino Uno · RFID reader",
    desc: "An RC522 RFID reader wired to an Arduino Uno reads the card ID and prints it over USB serial. A green LED and a beep confirm the result.",
    code: "RFID:04A1B2C3",
    chips: ["USB serial", "Green LED", "Beep"],
    icon: CreditCard,
  },
  {
    index: "02",
    tag: "Edge layer",
    meta: "Ground station",
    title: "The ground station\nforwards it",
    org: "Node.js on the stand's computer",
    desc: "A small Node.js program reads that line and sends it to the cloud over the internet with a secret device key. It retries when the connection is poor.",
    code: "POST /api/device/scan  x-device-key: ••••",
    chips: ["HTTPS", "Retry + backoff", "Debounce"],
    icon: Laptop,
  },
  {
    index: "03",
    tag: "Cloud layer",
    meta: "Express + MongoDB",
    title: "The cloud decides\nand remembers",
    org: "Express API · MongoDB",
    desc: "The API finds the rider, claims the first free bike with one atomic database update (so no two riders get the same bike) and stores the rental, the bike status and the tap.",
    code: '201  { action: "rent", bike: 1 }',
    chips: ["Atomic claim", "Audit log", "Rental stored"],
    icon: ServerCog,
  },
  {
    index: "04",
    tag: "Device layer",
    meta: "AI camera",
    title: "A camera checks\nthe real stand",
    org: "Camera → ground station → API",
    desc: "An AI camera reports which bikes are really parked. The API compares that with the RFID records and raises an alert for a missing bike or a bike returned without tapping.",
    code: "CAM:2,3,4  →  missing_mismatch / returned_manually",
    chips: ["Two sources of truth", "Alerts"],
    icon: Camera,
  },
  {
    index: "05",
    tag: "Cloud layer",
    meta: "Next.js dashboard",
    title: "The admin sees\nit all live",
    org: "Admin dashboard",
    desc: "The dashboard reads the same database: live taps, rentals, alerts and whether the stand is online. The admin adds riders and bikes and resolves alerts.",
    code: "GET /api/admin/dashboard/stats",
    chips: ["Live feed", "Alerts", "Manage riders"],
    icon: LayoutDashboard,
  },
]

/** Pinned storytelling: one frame stays on screen while the five steps swap in as you scroll. */
export function ScrollStory() {
  return <PinnedFrame label="How it works" chapters={CHAPTERS} />
}
