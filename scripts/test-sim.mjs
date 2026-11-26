// Run with: node scripts/test-sim.mjs   (Node 22.6+ strips TypeScript types natively)
import assert from "node:assert/strict"
import { initialState, tap, cameraFrame, advanceTime, countStats, UNKNOWN_TAG } from "../lib/velo-sim.ts"

let s = initialState()

// rent

;({ state: s } = tap(s, "04A1B2C3"))
assert.equal(s.bikes[0].status, "rented")
assert.equal(s.bikes[0].rentedBy, "Aarav")

// second rider gets the next bike

;({ state: s } = tap(s, "04D4E5F6"))
assert.equal(s.bikes[1].status, "rented")

// unknown card refused and logged
let r = tap(s, UNKNOWN_TAG)
assert.equal(r.state.events[0].ok, false)
assert.equal(countStats(r.state).rented, 2)

// camera sees a rented bike at the stand -> returned_manually alert
r = cameraFrame(s, [1, 2, 3])
assert.equal(r.state.alerts.filter((a) => a.type === "returned_manually" && !a.resolved).length, 2)
s = r.state

// proper return resolves that bike's alert

;({ state: s } = tap(s, "04A1B2C3"))
assert.equal(s.bikes[0].status, "available")
assert.equal(s.alerts.filter((a) => a.bikeId === 1 && !a.resolved).length, 0)
assert.equal(s.alerts.filter((a) => a.bikeId === 2 && !a.resolved).length, 1)

// bike 3 disappears: 15 minutes later, a frame without it flags it missing

;({ state: s } = advanceTime(s, 15))
r = cameraFrame(s, [1, 2])
assert.equal(r.state.bikes[2].status, "missing")
assert.ok(r.state.alerts.some((a) => a.type === "missing_mismatch" && a.bikeId === 3 && !a.resolved))
s = r.state

// it comes back
r = cameraFrame(s, [1, 2, 3])
assert.equal(r.state.bikes[2].status, "available")
assert.ok(!r.state.alerts.some((a) => a.type === "missing_mismatch" && !a.resolved))

// no bikes left -> refused
let t = initialState()
;({ state: t } = tap(t, "04A1B2C3"))
t.bikes.forEach((b) => { if (b.status === "available") b.status = "missing" })
const none = tap(t, "04D4E5F6")
assert.equal(none.state.events[0].ok, false)

console.log("velo-sim: all checks passed")
