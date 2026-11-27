const ITEMS = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Express",
  "MongoDB",
  "Arduino Uno",
  "RC522 RFID",
  "AI camera",
  "Tailwind CSS",
  "Framer Motion",
  "Vercel",
  "REST APIs",
  "Serial (USB)",
]

/** Endless sideways ticker of the technologies used. Pauses on hover. */
export function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="marquee-pause relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]" aria-label="Technologies used">
      <div className="animate-marquee flex w-max gap-3">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            aria-hidden={i >= ITEMS.length}
            className="shrink-0 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground/80 shadow-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
