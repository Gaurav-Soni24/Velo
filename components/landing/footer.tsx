const REPO = "https://github.com/Gaurav-Soni24"

const COLS = [
  {
    title: "On this page",
    links: [
      ["How it works", "#course"],
      ["Simulator", "#ride"],
      ["Alerts", "#photo-finish"],
      ["Admin", "#admin"],
      ["API", "#api"],
    ],
  },
  {
    title: "Source",
    links: [
      ["velo-backend", `${REPO}/velo-backend`],
      ["velo-frontend (admin)", `${REPO}/velo-frontend`],
      ["Velo (this site)", `${REPO}/Velo`],
      ["Research paper", "http://www.jetir.org/view?paper=JETIRHQ06008"],
    ],
  },
  {
    title: "Rider app prototype",
    links: [
      ["Map", "/map"],
      ["Dashboard", "/dashboard"],
      ["Rewards", "/rewards"],
      ["Contact", "/contact"],
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="bg-[var(--vl-ink)] text-white">
      <div className="vl-band h-6" aria-hidden />
      <div className="mx-auto max-w-[80rem] px-6 pb-10 pt-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <p className="max-w-sm text-white/70">
            An IoT cycle-sharing system: RFID rentals, camera checks, a cloud API and an admin panel. Published in JETIR, March 2026. First place at an international conference at LCIT.
          </p>
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="vl-label mb-4 text-white/50">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => {
                  const external = href.startsWith("http")
                  return (
                    <li key={label}>
                      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="font-medium text-white/85 transition-colors hover:text-[var(--vl-lime)]">
                        {label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <p className="vl-display mt-20 select-none text-[clamp(5rem,24vw,22rem)] leading-[0.78] text-white" aria-hidden>
          Velo
        </p>

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-white/15 pt-6 text-sm text-white/55 sm:flex-row">
          <p>A project by students of Government Engineering College, Bilaspur.</p>
          <p>
            Author:{" "}
            <a href="https://gauravsoni.space" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 hover:text-[var(--vl-lime)]">
              Gaurav Soni
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
