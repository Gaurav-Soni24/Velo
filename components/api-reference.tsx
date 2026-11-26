"use client"

import { useState } from "react"

const device = [
  { method: "POST", path: "/api/device/scan", who: "Ground station", what: "A card tap. Rents a bike if the rider has no ride, returns it if they do." },
  { method: "POST", path: "/api/device/camera", who: "Ground station", what: "Bikes the camera sees at the stand. Raises missing and manual-return alerts." },
  { method: "POST", path: "/api/device/heartbeat", who: "Ground station", what: "I am alive. Shows the stand as online in the admin panel." },
]

const admin = [
  { method: "GET", path: "/api/admin/dashboard/stats", who: "Admin panel", what: "Bike, rider, rental and alert counts." },
  { method: "GET", path: "/api/admin/events", who: "Admin panel", what: "Live feed of recent card taps, including refused ones." },
  { method: "GET", path: "/api/admin/devices", who: "Admin panel", what: "Ground stations and whether they are online." },
  { method: "CRUD", path: "/api/admin/bikes  ·  /users", who: "Admin panel", what: "Add, edit and remove bikes and riders (with their RFID cards)." },
  { method: "GET", path: "/api/admin/rentals", who: "Admin panel", what: "Every rental with rider, bike and duration." },
  { method: "PATCH", path: "/api/admin/alerts/:id/resolve", who: "Admin panel", what: "Mark an alert as handled." },
]

const examples = {
  scan: {
    request: `POST /api/device/scan
x-device-key: ••••••••
{
  "rfidTag": "04A1B2C3",
  "deviceId": "stand-01"
}`,
    response: `201 Created
{
  "success": true,
  "action": "rent",
  "message": "Bike 1 unlocked for Aarav Sharma",
  "bike":   { "bikeId": 1, "status": "rented" },
  "rental": { "status": "ongoing" }
}`,
  },
  camera: {
    request: `POST /api/device/camera
{
  "deviceId": "stand-01",
  "bikesPresent": [1, 2],
  "timestamp": "2026-11-26T10:30:00Z"
}`,
    response: `200 OK
{
  "success": true,
  "bikesSeen": 2,
  "recovered": 0,
  "missingFlagged": 1,
  "manualReturnsFlagged": 0
}`,
  },
}

const methodColour: Record<string, string> = {
  POST: "bg-amber-100 text-amber-800",
  GET: "bg-green-100 text-green-800",
  PATCH: "bg-sky-100 text-sky-800",
  CRUD: "bg-violet-100 text-violet-800",
}

function Table({ rows }: { rows: typeof device }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {rows.map((r, i) => (
        <div key={r.path} className={`flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-4 ${i ? "border-t border-border" : ""}`}>
          <span className={`w-fit rounded px-2 py-0.5 font-mono text-xs font-semibold ${methodColour[r.method]}`}>{r.method}</span>
          <code className="font-mono text-sm text-foreground sm:w-72">{r.path}</code>
          <span className="text-sm text-foreground/70">{r.what}</span>
        </div>
      ))}
    </div>
  )
}

export function ApiReference() {
  const [tab, setTab] = useState<"scan" | "camera">("scan")
  const ex = examples[tab]

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 font-semibold text-foreground">Called by the ground station</h3>
          <Table rows={device} />
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-foreground">Called by the admin panel</h3>
          <Table rows={admin} />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          {(["scan", "camera"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:text-foreground"
              }`}
            >
              {t === "scan" ? "Card tap" : "Camera frame"}
            </button>
          ))}
          <span className="text-sm text-foreground/60">Example request and response</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <pre className="overflow-x-auto rounded-xl bg-[oklch(0.2_0.02_120)] p-4 text-xs leading-relaxed text-[oklch(0.92_0.02_120)]">{ex.request}</pre>
          <pre className="overflow-x-auto rounded-xl bg-[oklch(0.2_0.02_120)] p-4 text-xs leading-relaxed text-[oklch(0.85_0.12_140)]">{ex.response}</pre>
        </div>
      </div>
    </div>
  )
}
