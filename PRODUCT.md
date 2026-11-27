# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Visitors to the Velo landing page: recruiters and hiring engineers evaluating the builder's work, faculty and conference/journal readers, and anyone curious about RFID cycle sharing. They have a minute or two and want to understand what Velo is and see that it really works. (Inferred from the portfolio context; not interviewed.)

## Product Purpose
Velo is an IoT smart cycle-sharing system: a rider taps an RFID card at a stand, an Arduino reads it, a ground station (Node.js on a PC or Raspberry Pi) forwards it over HTTPS to a cloud API (Express + MongoDB), and an admin dashboard shows the stand live. An AI camera watches the stand and raises alerts when a bike is missing. The landing page exists to explain the system and prove it with an interactive simulator that follows the real backend rules.

## Positioning
A published, working, end-to-end system (hardware, edge, cloud, admin) rather than a concept: peer-reviewed in JETIR (March 2026) and awarded first place at the LCIT conference. The two-sources-of-truth design (RFID records what the system believes, the camera shows what is physically there) is its distinctive mechanism.

## Operating Context
Stand with RFID reader and Arduino (USB serial `RFID:<uid>`), ground station, cloud API with `POST /api/device/scan`, `/camera`, `/heartbeat`, admin dashboard under `/api/admin/*`. Rules: atomic bike claim (no double rental), camera reconciliation (`missing_mismatch`, `returned_manually`), ScanEvent audit log, device heartbeat.

## Capabilities and Constraints
Next.js 16 + React 19 + Tailwind app, deployed on Vercel. Keep the working simulator (`components/velo-simulator.tsx`) and its test. Page must stay accurate to the real backend. Not deployed: the backend API.

## Brand Commitments
Name "Velo". Existing navy and teal identity and the Lenis smooth scroll with pinned-frame chapters were liked by the user. Copy is plain English. Repo links: Velo, velo-frontend (admin), velo-backend, all public under Gaurav-Soni24.

## Evidence on Hand
JETIR paper http://www.jetir.org/view?paper=JETIRHQ06008 (registration ID 579352); admin screenshots in `public/admin-overview.png` and `public/admin-guide.png`. No customers, pricing, user counts or benchmarks exist: do not invent any.

## Product Principles
Show the mechanism working before explaining it. One card tap should be traceable from stand to admin. Be honest about what is a demo. Plain words over jargon.
