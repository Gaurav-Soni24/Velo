# Velo — IoT Smart Cycle Sharing (Rider App)

Velo is a smart cycle-sharing system for campuses and smart cities. This repository is the **rider-facing web app prototype**: find stations on a map, unlock a cycle with a QR code, track rides and earn reward points.

Velo was published as a research paper and won **1st place at an international conference at LCIT**:

> A. Kushwaha, A. Sahu, **G. Soni**, N. Kushwaha, S. Sahu, *"Velo: An IoT-Based SmartCycle Sharing System for Sustainable Urban Mobility"*, **JETIR**, Vol. 13, Issue 3, March 2026, pp. 45-46.
> Paper: http://www.jetir.org/view?paper=JETIRHQ06008

- **Live demo:** https://velo-flame.vercel.app

## System overview

Velo has three layers (see the paper for details):

| Layer | What it does | Repository |
|---|---|---|
| Device | Arduino Uno with Bluetooth and an electronic lock; each cycle has a QR code / RFID identity | (hardware) |
| Application | Rider app: map, QR unlock, ride history, rewards | **this repo** |
| Cloud backend | REST API for rentals, bikes, alerts and camera status | [velo-backend](https://github.com/Gaurav-Soni24/velo-backend) |
| Admin | Operator dashboard for bikes, rentals, users and alerts | [velo-frontend](https://github.com/Gaurav-Soni24/velo-frontend) |

## Features (this app)

- **Station map** built with Leaflet and station data from `data/stations.json`.
- **QR modal** to start a ride at a station.
- **Ride tracking** with duration, distance and ride history.
- **Rewards** with points and bronze / silver / gold levels, persisted in the browser.
- Responsive UI with light and dark themes.

## Tech stack

Next.js, React, TypeScript, Tailwind CSS, Radix UI, Framer Motion, Leaflet, Recharts.

## Run locally

```bash
git clone https://github.com/Gaurav-Soni24/Velo.git
cd Velo
npm install
npm run dev
```

Open http://localhost:3000.

## Notes

The UI was prototyped with [v0](https://v0.app) and then extended by hand. Ride and reward data in this prototype is stored in the browser (`localStorage`); the production-style API lives in `velo-backend`.

## Author

Gaurav Soni — https://gauravsoni.space
