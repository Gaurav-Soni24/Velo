# Velo creative direction: "Timing Chip"

Scope: the public landing page (`app/page.tsx` and `components/landing/*`). The admin dashboard (separate repo `velo-frontend`) and the rider prototype pages (`/map`, `/dashboard`, `/rewards`, `/contact`) are out of scope and keep their current look. All new styling lives under the `.vl` wrapper in `components/landing/landing.css`.

## Audit of the old landing page

| Keep | Replace | Discard |
|---|---|---|
| The facts: six-part chain, two sources of truth, the JETIR paper, the LCIT award, the simulator and its rules, the API reference, the FAQ answers | Navy + teal palette (reads as generic "tech blue"), Figtree/Bricolage type, split hero (copy left, device right), rounded white cards on grey, icon + heading + text grids | Section navigator pill bar, browser-chrome mockup frame, pinned "01/02" chapter cards, decorative grid backgrounds, the V-in-a-square mark |

The old page explained Velo correctly but looked like any SaaS template. Nothing on it was specific to bicycles.

## 1. Brand personality
Precise, athletic, plainspoken. A race official, not a salesman: it reports what happened, at what checkpoint, and moves on.

## 2. Target emotional response
"I get it in five seconds, and it actually works." A visitor taps a card and watches it cross every checkpoint. Then they trust the rest.

## 3. Visual direction
**Race kit and timing chip.** Velo's RFID tap is the same idea as chip timing in a bike race: a tag crosses a reader at a checkpoint and the result is recorded. The page borrows the graphic language of cycling kit and race timing:

- **The chest band:** three horizontal stripes (ink, lime, white) that run across the page like the band on a team jersey. In the hero the band is the route a tap travels, with six checkpoints on it.
- **The race bib:** the rider's RFID card is drawn as a pinned race bib (number, name, chip ID). Bibs are the buttons that start a tap.
- **Stage profile:** "How it works" is a stage profile: a course line with six checkpoints, and a rider marker moves along it as you scroll.
- **Photo finish:** the camera check is presented as a photo-finish strip. RFID says one thing, the camera sees another.
- **Palmarès:** the honours list (paper, award, tests, open source) is set as a cycling palmarès, not as stat cards.

Challengers weighed and declined, with what was kept: a factory-records catalog sleeve (kept: only the active checkpoint is shown in full colour, the rest stay monochrome); a moiré gallery (kept: contrast built from stripe frequency in the band); a deep-dive descent (kept: the stage profile's ground deepens as the story moves to later checkpoints).

## 4. Colour palette

| Role | Name | HEX |
|---|---|---|
| Primary field | Velo Blue | `#2440F0` |
| Deep field, dark text | Kit Ink | `#0B1236` |
| Paper ground | Bib White | `#F6F6F1` |
| Surface | Chalk | `#E9E9E2` |
| Hairline / border | Rule | `#C9CAC2` |
| Secondary text on paper | Slate | `#4A4F66` |
| Accent, live signal | Chip Lime | `#C6F432` |
| Problem / missing | Red Lantern | `#FF5B3A` |
| Caution | Amber Flag | `#FFB020` |

Strategy: **Committed.** Velo Blue owns the hero, the simulator band and the closing section (well over a third of the page). Lime appears only where something is live or active. No gradients; colour comes in flat fields like printed kit.

Interactive states: primary button Lime on Ink text, hover White; secondary button White outline, hover White fill with Blue text; focus ring 2px Lime with 3px offset; disabled 40% opacity.

## 5. Typography
- **Display:** Archivo, extended width (wdth 125), weight 800 to 900, uppercase for headlines. Wide kit lettering, the way team names are set across a jersey.
- **Body:** Archivo, normal width, 400 to 600, 17 to 19px, line-height 1.55.
- **Data:** Geist Mono for chip IDs, endpoints and checkpoint codes only (real data, not decoration).
- Scale (fluid only for display): 13, 15, 17, 20, 26, 36, 56, then display clamp(3.5rem, 11vw, 10.5rem). Tracking: display -0.02em, labels +0.06em.

## 6. Logo
Wordmark **VELO** in Archivo extended black, with a short three-stripe chest band underneath. No icon tile. On blue it is white; on paper it is Ink.

## 7. Layout and composition
- 12-column grid, 1280px max content width, 24px gutters on mobile, 48px on desktop.
- Full-bleed colour fields alternate: Blue, Bib White, Ink. Content sits on the field, not in cards.
- Radius: 2px everywhere (bibs and buttons are cut paper, not pills). Shadows: only under the bibs (offset 0 10px, blur 30px, 25% ink), so they read as paper pinned above the field.
- Section spacing: 128px desktop, 88px mobile; more space above a heading than below it.

## 8. Motion and interaction
- One authored hero moment: the chest band draws in from the left (exponential ease-out, 900ms), then the headline lines rise out of a mask.
- The tap: a lime marker runs along the band; each checkpoint lights in turn (450ms apart) and states what it did.
- The stage profile moves with scroll (sticky section). The rider marker follows the course line.
- Micro-interactions: bibs lift on hover and dip on press; buttons swap fill in 150ms.
- `prefers-reduced-motion`: no entrance, no scroll-linked movement, the tap shows all steps at once.

## 9. Visual references
Cycling kit and jersey bands (team kits, chest stripes), race bibs and chip-timing checkpoints (start, split and finish mats), Tour de France stage profiles, photo-finish strips. Craft bar: award-winning sport and product sites such as Star Bicycle (Awwwards Honorable Mention) and the 21 TSI sports site (Codrops case study).

## 10. Why this fits Velo
Velo is literally a timing-chip system for bicycles: a card crosses a reader, a checkpoint records it, a result appears. The race-kit language shows that mechanism instead of describing it, belongs to cycling rather than to generic SaaS, and gives the brand a recognisable look (blue field, lime-ink-white band, pinned bib) that works on a slide, a sticker on the stand or a GitHub README.
