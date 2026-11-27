import "@/components/landing/landing.css"
import { archivo } from "@/components/landing/fonts"
import { LandingNav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { StageProfile } from "@/components/landing/stage-profile"
import { PhotoFinish } from "@/components/landing/photo-finish"
import { LandingFooter } from "@/components/landing/footer"
import { VeloSimulator } from "@/components/velo-simulator"
import { ApiReference } from "@/components/api-reference"
import { Faq } from "@/components/faq"
import { ArrowUpRight, Github } from "lucide-react"

const LINKS = {
  backend: "https://github.com/Gaurav-Soni24/velo-backend",
  admin: "https://github.com/Gaurav-Soni24/velo-frontend",
  paper: "http://www.jetir.org/view?paper=JETIRHQ06008",
}

const PALMARES = [
  {
    result: "Published",
    event: "JETIR, Journal of Emerging Technologies and Innovative Research",
    detail: "March 2026, Vol. 13, Issue 3, pp. 45 to 46. Peer-reviewed. The paper describes the first prototype (Arduino Uno, a Bluetooth module and a QR-code lock); this build moves the stand to RFID.",
    link: { label: "Read the paper", href: LINKS.paper },
  },
  {
    result: "1st place",
    event: "International conference at LCIT",
    detail: "The team presented Velo, the IoT smart cycle-sharing system, and won first place.",
  },
  {
    result: "11 tests",
    event: "velo-backend test suite",
    detail: "The real API runs against an in-memory MongoDB, including two cards tapped at the same moment.",
    link: { label: "See the tests", href: LINKS.backend },
  },
  {
    result: "Open source",
    event: "Three public repositories",
    detail: "Backend with ground station and Arduino sketch, the admin dashboard, and this site.",
  },
]

const SPEC = [
  ["No double rentals", "A bike is claimed with one atomic database update, so two riders tapping at the same moment can never get the same bike."],
  ["Locked-down access", "The ground station proves who it is with an API key header. The admin dashboard needs a sign-in: a hashed password, signed session tokens and a rate-limited login."],
  ["Built for flaky internet", "The ground station retries with backoff, ignores a card held on the reader and sends a heartbeat, so the admin can see when a stand goes offline."],
  ["Everything is audited", "Every tap is logged, including refused ones, and shown in the admin's live feed."],
  ["Runs without hardware", "A simulator mode and an in-memory database let anyone run the whole system with two commands, no Arduino or MongoDB needed."],
]

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://velo-flame.vercel.app").replace(/\/$/, "")

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Velo", url: `${SITE_URL}/`, inLanguage: "en" },
    {
      "@type": "SoftwareSourceCode",
      name: "Velo",
      description: "IoT smart cycle-sharing system: RFID rentals through a ground station, a cloud API with camera reconciliation, and an admin dashboard.",
      codeRepository: LINKS.backend,
      programmingLanguage: ["JavaScript", "TypeScript", "C++"],
      runtimePlatform: ["Node.js", "Arduino"],
      license: "https://opensource.org/licenses/MIT",
      author: { "@type": "Person", name: "Gaurav Soni", url: "https://gauravsoni.space" },
    },
    {
      "@type": "ScholarlyArticle",
      headline: "Velo: An IoT-Based SmartCycle Sharing System for Sustainable Urban Mobility",
      datePublished: "2026-03",
      url: LINKS.paper,
      isPartOf: { "@type": "Periodical", name: "Journal of Emerging Technologies and Innovative Research (JETIR)" },
      author: ["Akhilesh Kushwaha", "Ankit Sahu", "Gaurav Soni", "Navneet Kushwaha", "Savita Sahu"].map((name) => ({ "@type": "Person", name })),
    },
  ],
}

export default function Home() {
  return (
    <div className={`vl ${archivo.variable}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-[var(--vl-ink)]">
        Skip to content
      </a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <LandingNav />
      <main id="main">
        <Hero />

        {/* Statement and honours */}
        <section id="research" className="vl-on-paper scroll-mt-16 px-6 py-28 lg:px-12 lg:py-36">
          <div className="mx-auto max-w-[80rem]">
            <div className="grid gap-12 lg:grid-cols-12">
              <h2 className="vl-display text-[clamp(2.1rem,4.6vw,4.25rem)] text-[var(--vl-ink)] lg:col-span-8">
                Cycle sharing should not need a person at every stand.
              </h2>
              <p className="self-end text-lg text-[var(--vl-slate)] lg:col-span-4">
                Campus and city cycle sharing usually depends on manual locking and almost no monitoring. Theft is hard to notice and nothing is on record. Velo rents with a card tap
                and keeps watching after the ride starts.
              </p>
            </div>

            <div className="mt-24 flex items-baseline justify-between gap-4 border-b-[3px] border-[var(--vl-ink)] pb-3">
              <h3 className="vl-display text-3xl md:text-4xl">Palmarès</h3>
              <p className="vl-label text-[var(--vl-slate)]">Honours and proof</p>
            </div>
            <ol>
              {PALMARES.map((p) => (
                <li key={p.result} className="grid gap-x-10 gap-y-2 border-b border-[var(--vl-rule)] py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[19rem_1fr_1.3fr] md:items-baseline">
                  <p className="vl-display text-[2.1rem] text-[var(--vl-blue)] md:col-span-2 lg:col-span-1">{p.result}</p>
                  <p className="vl-wide text-lg font-bold leading-snug">{p.event}</p>
                  <div className="text-[var(--vl-slate)]">
                    <p>{p.detail}</p>
                    {p.link && (
                      <a href={p.link.href} target="_blank" rel="noopener noreferrer" className="vl-link mt-2 inline-flex items-center gap-1 font-semibold text-[var(--vl-ink)] hover:text-[var(--vl-blue)]">
                        {p.link.label} <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <StageProfile />

        {/* Simulator */}
        <section id="ride" className="vl-on-paper scroll-mt-16 px-6 py-28 lg:px-12 lg:py-36">
          <div className="mx-auto max-w-[80rem]">
            <div className="mb-14 grid gap-8 lg:grid-cols-12">
              <h2 className="vl-display text-[clamp(2.4rem,6vw,5.5rem)] lg:col-span-7">Ride the stand</h2>
              <p className="self-end text-lg text-[var(--vl-slate)] lg:col-span-5">
                A full stand in your browser, with three bikes, three riders and a camera. It follows the backend&rsquo;s rules. Press Guided tour for a seven-step story, or tap cards and move
                bikes yourself.
              </p>
            </div>
            <VeloSimulator />
          </div>
        </section>

        <PhotoFinish />

        {/* Admin */}
        <section id="admin" className="scroll-mt-16 bg-[var(--vl-blue)] px-6 py-28 text-white lg:px-12 lg:py-36">
          <div className="mx-auto max-w-[80rem]">
            <div className="mb-14 grid gap-8 lg:grid-cols-12">
              <h2 className="vl-display text-[clamp(2.4rem,6vw,5.5rem)] lg:col-span-7">The view from the team car</h2>
              <p className="self-end text-lg text-white/85 lg:col-span-5">
                The admin dashboard answers one question first: is the stand healthy right now? Rides, alerts and the live tap feed sit one click away.
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/admin-overview.png"
              alt="Velo admin Overview page: status banner, fleet status, rides per hour, alerts, live RFID activity and ground-station status"
              className="vl-frame w-full bg-white"
              loading="lazy"
            />
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {[
                ["Status first", "One sentence at the top says whether everything is normal or what needs attention."],
                ["Numbers with context", "Bikes ready, rides in progress, open alerts and stand status, each with a comparison."],
                ["Live feed and alerts", "Every tap appears within seconds. RFID and camera mismatches are listed to act on."],
              ].map(([t, d]) => (
                <div key={t} className="border-t-2 border-white/40 pt-4">
                  <h3 className="vl-wide text-xl font-extrabold uppercase">{t}</h3>
                  <p className="mt-2 text-white/80">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-white/75">
              Source:{" "}
              <a className="vl-link font-semibold text-white" href={LINKS.admin} target="_blank" rel="noopener noreferrer">
                velo-frontend
              </a>
              . The screenshot shows the dashboard running against the demo backend.
            </p>
          </div>
        </section>

        {/* Tech sheet and API */}
        <section id="api" className="vl-on-paper scroll-mt-16 px-6 py-28 lg:px-12 lg:py-36">
          <div className="mx-auto max-w-[80rem]">
            <h2 className="vl-display text-[clamp(2.4rem,6vw,5.5rem)]">Tech sheet</h2>
            <dl className="mt-12 border-t-[3px] border-[var(--vl-ink)]">
              {SPEC.map(([t, d]) => (
                <div key={t} className="grid gap-x-10 gap-y-1 border-b border-[var(--vl-rule)] py-6 md:grid-cols-[22rem_1fr]">
                  <dt className="vl-wide text-xl font-extrabold uppercase">{t}</dt>
                  <dd className="text-[var(--vl-slate)]">{d}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-12 bg-[var(--vl-ink)] p-6 text-[13px] leading-relaxed text-white/90 sm:p-8">
              <p className="vl-label mb-3 text-[var(--vl-lime)]">Run the whole system on a laptop</p>
              <code className="block whitespace-pre-wrap break-all">
                {`git clone ${LINKS.backend}.git && cd velo-backend
npm install
npm run dev:memory      # API, in-memory database, demo riders and bikes
npm run ground-station  # second terminal, then type: tap 04A1B2C3`}
              </code>
            </div>

            <h3 className="vl-display mt-24 text-[clamp(2rem,4vw,3.5rem)]">The API</h3>
            <p className="mb-10 mt-4 max-w-2xl text-lg text-[var(--vl-slate)]">Two small groups of endpoints: one for the ground station, one for the admin panel.</p>
            <ApiReference />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="vl-on-paper scroll-mt-16 border-t border-[var(--vl-rule)] bg-[var(--vl-chalk)] px-6 py-28 lg:px-12 lg:py-36">
          <div className="mx-auto grid max-w-[80rem] gap-12 lg:grid-cols-12">
            <h2 className="vl-display text-[clamp(2.4rem,6vw,5.5rem)] lg:col-span-4">Questions</h2>
            <div className="lg:col-span-8">
              <Faq />
            </div>
          </div>
        </section>

        {/* Close */}
        <section className="bg-[var(--vl-blue)] px-6 py-28 text-white lg:px-12 lg:py-40">
          <div className="mx-auto max-w-[80rem]">
            <h2 className="vl-display text-[clamp(3.5rem,10vw,9.5rem)]">
              Clip in.
              <br />
              <span className="text-[var(--vl-lime)]">Ride it.</span>
            </h2>
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <a href="#ride" className="vl-btn vl-btn-lime">
                Try the simulator
              </a>
              <a href={LINKS.backend} target="_blank" rel="noopener noreferrer" className="vl-btn vl-btn-ghost">
                <Github className="h-4 w-4" /> View the code
              </a>
              <a href={LINKS.paper} target="_blank" rel="noopener noreferrer" className="vl-btn vl-btn-ghost">
                Read the paper <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  )
}
