import type { ReactNode } from "react"

const QUESTIONS: { q: string; a: ReactNode }[] = [
  {
    q: "Why use both RFID and a camera?",
    a: "RFID only knows what riders tell it by tapping. A camera shows what is really parked. Using both lets the system notice things nobody reports, like a bike that vanished or a rider who parked and walked away without tapping.",
  },
  {
    q: "Can two riders get the same bike?",
    a: "No. The API claims a bike with a single atomic database update, so if two cards are tapped at the same moment, one rider gets Bike 1 and the other gets Bike 2 (or a clear refusal if none are left). A backend test fires simultaneous taps to prove it.",
  },
  {
    q: "What happens if the internet drops at the stand?",
    a: "The ground station retries each request with a short backoff and tells the Arduino to show an error if it still cannot reach the cloud, so a rider is never told a bike is unlocked when it is not. It also stops sending heartbeats, so the admin panel shows the stand as offline.",
  },
  {
    q: "What is real on this page and what is simulated?",
    a: "The simulator in the browser is a teaching model that follows the same rules as the backend. The backend, ground station, Arduino sketch and admin dashboard are real code you can run: two commands start the API with demo data and a simulated stand, no hardware needed.",
  },
  {
    q: "Is it production-ready?",
    a: "It is a complete working prototype with tests, but not a finished product. The admin dashboard now has a real sign-in (signed session tokens, hashed password, rate-limited login), but there is a single admin account, and the hardware part has been tested as a prototype rather than at scale.",
  },
  {
    q: "Where is the code and the research?",
    a: (
      <>
        All source is on GitHub:{" "}
        <a className="text-primary underline underline-offset-4" href="https://github.com/Gaurav-Soni24/velo-backend" target="_blank" rel="noopener noreferrer">
          backend, ground station and Arduino
        </a>
        ,{" "}
        <a className="text-primary underline underline-offset-4" href="https://github.com/Gaurav-Soni24/velo-frontend" target="_blank" rel="noopener noreferrer">
          admin dashboard
        </a>{" "}
        and{" "}
        <a className="text-primary underline underline-offset-4" href="https://github.com/Gaurav-Soni24/Velo" target="_blank" rel="noopener noreferrer">
          this site
        </a>
        . The design was published in{" "}
        <a className="text-primary underline underline-offset-4" href="http://www.jetir.org/view?paper=JETIRHQ06008" target="_blank" rel="noopener noreferrer">
          JETIR, March 2026
        </a>
        .
      </>
    ),
  },
]

export function Faq() {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-xl border border-border bg-card">
      {QUESTIONS.map((item) => (
        <details key={item.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
            {item.q}
            <span className="shrink-0 text-primary transition-transform group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-foreground/70">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
