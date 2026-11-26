# Velo — Landing Page, Live Simulator and Rider App

Velo is an **IoT smart cycle-sharing system**: riders tap an RFID card, a ground-station computer forwards the tap to a cloud API, a database remembers everything, an AI camera cross-checks what is really parked, and an admin panel manages it all.

This site **explains that system and lets you try it**, so a visitor (or an interviewer) can understand the project without anyone walking them through it.

- **Live site:** https://velo-flame.vercel.app
- **Research paper:** *Velo: An IoT-Based SmartCycle Sharing System for Sustainable Urban Mobility*, JETIR, Vol. 13, Issue 3, March 2026 — http://www.jetir.org/view?paper=JETIRHQ06008 (1st place, International Conference at LCIT)

## What is on the home page

1. **How it works:** five steps from card tap to admin screen.
2. **System design:** a diagram of Arduino + RFID reader → ground station → cloud API ↔ database ↔ admin panel, with the camera feeding the ground station.
3. **Live simulator:** a browser simulation of a three-bike stand. Tap RFID cards, tell the camera what it sees, advance time, or press **Guided tour** for a seven-step story. Each action shows the real chain of events (Arduino line, API call, server decision, database change, admin view). The rules in `lib/velo-sim.ts` mirror the real backend.
4. **Alerts explained:** *missing bike* and *returned without tapping*, the two cases where RFID and the camera disagree.
5. **API reference** for the ground station and admin panel, with example requests.
6. **Engineering details** and a two-command way to run the whole system locally.
7. A **rider app prototype** (map, QR unlock, rewards) kept as a concept UI.

## Repositories

| Part | Repo |
|---|---|
| Cloud API, ground station, Arduino sketch, tests | https://github.com/Gaurav-Soni24/velo-backend |
| Admin dashboard | https://github.com/Gaurav-Soni24/velo-frontend |
| This site | https://github.com/Gaurav-Soni24/Velo |

## Run locally

```bash
git clone https://github.com/Gaurav-Soni24/Velo.git
cd Velo
npm install
npm run dev
```

Open http://localhost:3000. The simulator needs no backend.

```bash
npm run test:sim     # checks the simulation rules in lib/velo-sim.ts
```

## Tech stack

Next.js, React, TypeScript, Tailwind CSS, Radix UI, Leaflet (rider map), Lucide icons.

## Notes

- The simulator is a teaching tool, not the production code path. The real logic is in `velo-backend/src/services/flow.js`.
- The rider-app pages (`/map`, `/dashboard`, `/rewards`) are a prototype that stores points and rides in the browser.
- The UI was first prototyped with [v0](https://v0.app) and then extended by hand.

## Author

Gaurav Soni — https://gauravsoni.space
