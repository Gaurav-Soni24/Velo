/**
 * Browser-side simulation of the Velo system. It mirrors the rules of the real backend
 * (velo-backend/src/services/flow.js) so visitors can see what happens, step by step,
 * without any hardware or server.
 */

export type BikeStatus = "available" | "rented" | "missing"
export type Actor = "arduino" | "camera" | "ground" | "cloud" | "database" | "admin"
export type Tone = "ok" | "error" | "warn" | "info"

export interface SimBike {
  bikeId: number
  status: BikeStatus
  rentedBy: string | null
  /** Minutes since the camera last saw this bike at the stand. */
  lastSeenMin: number
}

export interface SimUser {
  name: string
  rfidTag: string
  ongoing: number | null
}

export interface SimAlert {
  id: number
  type: "missing_mismatch" | "returned_manually"
  bikeId: number
  message: string
  resolved: boolean
}

export interface SimEvent {
  id: number
  action: "rent" | "return"
  ok: boolean
  tag: string
  text: string
}

export interface SimState {
  bikes: SimBike[]
  users: SimUser[]
  alerts: SimAlert[]
  events: SimEvent[]
  nextId: number
  /** Minutes the simulated clock has advanced. */
  clockMin: number
}

export interface TraceStep {
  actor: Actor
  title: string
  detail?: string
  code?: string
  tone: Tone
}

export interface SimResult {
  state: SimState
  trace: TraceStep[]
}

export const MISSING_TIMEOUT_MIN = 10
export const UNKNOWN_TAG = "DEADBEEF"

export const initialState = (): SimState => ({
  bikes: [1, 2, 3].map((bikeId) => ({ bikeId, status: "available", rentedBy: null, lastSeenMin: 0 })),
  users: [
    { name: "Aarav", rfidTag: "04A1B2C3", ongoing: null },
    { name: "Diya", rfidTag: "04D4E5F6", ongoing: null },
  ],
  alerts: [],
  events: [],
  nextId: 1,
  clockMin: 0,
})

const clone = (s: SimState): SimState => JSON.parse(JSON.stringify(s)) as SimState

const raiseAlert = (s: SimState, type: SimAlert["type"], bikeId: number, message: string): boolean => {
  if (s.alerts.some((a) => !a.resolved && a.type === type && a.bikeId === bikeId)) return false
  s.alerts.unshift({ id: s.nextId++, type, bikeId, message, resolved: false })
  return true
}

const resolveAlerts = (s: SimState, type: SimAlert["type"], bikeId: number): number => {
  let n = 0
  s.alerts.forEach((a) => {
    if (!a.resolved && a.type === type && a.bikeId === bikeId) {
      a.resolved = true
      n += 1
    }
  })
  return n
}

const logEvent = (s: SimState, action: SimEvent["action"], ok: boolean, tag: string, text: string) => {
  s.events.unshift({ id: s.nextId++, action, ok, tag, text })
  s.events = s.events.slice(0, 8)
}

/** A card is tapped on the reader: rent if the rider has no ride, return if they do. */
export function tap(prev: SimState, tag: string): SimResult {
  const s = clone(prev)
  const trace: TraceStep[] = []

  trace.push({
    actor: "arduino",
    title: "Card read by the RFID reader",
    detail: "The Arduino reads the card UID and prints it over USB serial.",
    code: `RFID:${tag}`,
    tone: "info",
  })
  trace.push({
    actor: "ground",
    title: "Ground station forwards it to the cloud",
    detail: "A Node.js program on the stand's computer calls the API over the internet.",
    code: `POST /api/device/scan\n{ "rfidTag": "${tag}", "deviceId": "stand-01" }`,
    tone: "info",
  })

  const user = s.users.find((u) => u.rfidTag === tag)
  if (!user) {
    const text = "User not found"
    logEvent(s, "rent", false, tag, text)
    trace.push({ actor: "cloud", title: "Unknown card, request refused", detail: "No rider owns this RFID tag.", code: "404 { \"message\": \"User not found\" }", tone: "error" })
    trace.push({ actor: "database", title: "Failed scan is still logged", detail: "Every tap is stored in the ScanEvent collection for auditing.", tone: "warn" })
    trace.push({ actor: "arduino", title: "Reader shows an error", detail: "The ground station replies and the Arduino lights the red LED and buzzes once.", code: "ERR:User not found", tone: "error" })
    trace.push({ actor: "admin", title: "Admin sees the failed tap", detail: "It appears in the Live RFID Activity feed.", tone: "info" })
    return { state: s, trace }
  }

  if (user.ongoing !== null) {
    // ---- return ----
    const bike = s.bikes.find((b) => b.bikeId === user.ongoing)!
    bike.status = "available"
    bike.rentedBy = null
    bike.lastSeenMin = 0
    user.ongoing = null
    const cleared = resolveAlerts(s, "returned_manually", bike.bikeId)
    const text = `Bike ${bike.bikeId} returned by ${user.name}`
    logEvent(s, "return", true, tag, text)
    trace.push({ actor: "cloud", title: `${user.name} already has a ride, so this tap is a return`, detail: "The API closes the rental and calculates its duration.", code: "200 { \"action\": \"return\" }", tone: "ok" })
    trace.push({
      actor: "database",
      title: "Database updated",
      detail: `Rental marked completed, Bike ${bike.bikeId} set to available${cleared ? ", open 'returned manually' alert resolved" : ""}.`,
      tone: "ok",
    })
    trace.push({ actor: "arduino", title: "Reader confirms the return", detail: "Green LED and two beeps.", code: `ACK:RETURN:${bike.bikeId}`, tone: "ok" })
    trace.push({ actor: "admin", title: "Admin panel updates", detail: "Bike is available again and the rental moves to Completed.", tone: "info" })
    return { state: s, trace }
  }

  // ---- rent ----
  const bike = [...s.bikes].sort((a, b) => a.bikeId - b.bikeId).find((b) => b.status === "available")
  if (!bike) {
    logEvent(s, "rent", false, tag, "No available bikes")
    trace.push({ actor: "cloud", title: "No bike is free", detail: "Every bike is rented, missing or in maintenance.", code: "404 { \"message\": \"No available bikes\" }", tone: "error" })
    trace.push({ actor: "arduino", title: "Reader shows an error", code: "ERR:No available bikes", tone: "error" })
    return { state: s, trace }
  }
  bike.status = "rented"
  bike.rentedBy = user.name
  user.ongoing = bike.bikeId
  const text = `Bike ${bike.bikeId} unlocked for ${user.name}`
  logEvent(s, "rent", true, tag, text)
  trace.push({ actor: "cloud", title: `Card belongs to ${user.name}, who has no active ride`, detail: "The API claims the first available bike in one atomic database operation, so two riders can never get the same bike.", code: "201 { \"action\": \"rent\" }", tone: "ok" })
  trace.push({ actor: "database", title: "Database updated", detail: `Rental created, Bike ${bike.bikeId} set to rented, tap saved in the activity log.`, tone: "ok" })
  trace.push({ actor: "arduino", title: "Reader unlocks the bike", detail: "Green LED, one beep, and the lock opens.", code: `ACK:RENT:${bike.bikeId}`, tone: "ok" })
  trace.push({ actor: "admin", title: "Admin panel updates", detail: "Ongoing rentals +1, bike shows as rented.", tone: "info" })
  return { state: s, trace }
}

/** The AI camera reports which bikes it can currently see at the stand. */
export function cameraFrame(prev: SimState, present: number[]): SimResult {
  const s = clone(prev)
  const trace: TraceStep[] = []

  trace.push({
    actor: "camera",
    title: "Camera looks at the stand",
    detail: "The AI camera detects which bikes are physically parked.",
    code: `CAM:${present.join(",") || "(none)"}`,
    tone: "info",
  })
  trace.push({
    actor: "ground",
    title: "Ground station sends the frame to the cloud",
    code: `POST /api/device/camera\n{ "bikesPresent": [${present.join(", ")}], "timestamp": "…" }`,
    tone: "info",
  })

  let recovered = 0
  let manual = 0
  let missing = 0
  const notes: TraceStep[] = []

  s.bikes.forEach((bike) => {
    const seen = present.includes(bike.bikeId)
    if (seen) {
      bike.lastSeenMin = 0
      if (bike.status === "missing") {
        bike.status = "available"
        recovered += 1
        resolveAlerts(s, "missing_mismatch", bike.bikeId)
        notes.push({ actor: "database", title: `Bike ${bike.bikeId} is back`, detail: "It was missing; status restored to available and the alert resolved.", tone: "ok" })
      } else if (bike.status === "rented") {
        const created = raiseAlert(s, "returned_manually", bike.bikeId, `Bike ${bike.bikeId} is marked rented but the camera sees it at the stand`)
        if (created) {
          manual += 1
          notes.push({ actor: "database", title: `Mismatch on Bike ${bike.bikeId}`, detail: "The system says it is rented, but the camera sees it at the stand: the rider parked it without tapping the card. Alert raised.", tone: "warn" })
        }
      }
    } else if (bike.status === "available" && bike.lastSeenMin >= MISSING_TIMEOUT_MIN) {
      const created = raiseAlert(s, "missing_mismatch", bike.bikeId, `Bike ${bike.bikeId} should be at the stand but was not seen for ${bike.lastSeenMin} minutes`)
      if (created) {
        bike.status = "missing"
        missing += 1
        notes.push({ actor: "database", title: `Bike ${bike.bikeId} flagged missing`, detail: `It should be at the stand but the camera has not seen it for ${MISSING_TIMEOUT_MIN}+ minutes. Alert raised.`, tone: "error" })
      }
    }
  })

  trace.push({
    actor: "cloud",
    title: "Cloud reconciles RFID state with what the camera sees",
    detail: "RFID says what should be where; the camera says what is where. Differences become alerts.",
    code: `200 { "bikesSeen": ${present.length}, "recovered": ${recovered}, "manualReturnsFlagged": ${manual}, "missingFlagged": ${missing} }`,
    tone: "ok",
  })
  trace.push(...notes)
  if (notes.length === 0) trace.push({ actor: "database", title: "Everything matches", detail: "No mismatch, no new alert.", tone: "ok" })
  trace.push({ actor: "admin", title: "Admin alerts panel refreshes", detail: "Open alerts are listed with the bike, type and time.", tone: "info" })
  return { state: s, trace }
}

/** Move the simulated clock forward. Bikes the camera has not refreshed get older. */
export function advanceTime(prev: SimState, minutes: number): SimResult {
  const s = clone(prev)
  s.clockMin += minutes
  s.bikes.forEach((b) => {
    b.lastSeenMin += minutes
  })
  return {
    state: s,
    trace: [{ actor: "cloud", title: `${minutes} minutes pass`, detail: `Bikes the camera has not refreshed now show "last seen" ${minutes} minutes older.`, tone: "info" }],
  }
}

export const countStats = (s: SimState) => ({
  available: s.bikes.filter((b) => b.status === "available").length,
  rented: s.bikes.filter((b) => b.status === "rented").length,
  missing: s.bikes.filter((b) => b.status === "missing").length,
  openAlerts: s.alerts.filter((a) => !a.resolved).length,
})
