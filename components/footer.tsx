import { BrandMark } from "@/components/navbar"

const link = "transition-colors hover:text-teal"

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <BrandMark className="h-10 w-10" />
              <div className="leading-tight">
                <p className="text-xl font-bold">Velo</p>
                <p className="text-xs text-white/50">Smart cycle sharing</p>
              </div>
            </div>
            <p className="max-w-md text-sm text-white/60">
              An IoT cycle-sharing system: RFID rentals, camera-based monitoring, a cloud API and an admin panel. Published in JETIR, March 2026. Winner, 1st place at an international
              conference at LCIT.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-base font-bold text-white">Explore</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="/#how-it-works" className={link}>How it works</a></li>
              <li><a href="/#demo" className={link}>Live simulator</a></li>
              <li><a href="/#admin" className={link}>Admin panel</a></li>
              <li><a href="/#research" className={link}>Research and award</a></li>
              <li><a href="/#api" className={link}>API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-base font-bold text-white">Source code</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="https://github.com/Gaurav-Soni24/velo-backend" target="_blank" rel="noopener noreferrer" className={link}>velo-backend</a></li>
              <li><a href="https://github.com/Gaurav-Soni24/velo-frontend" target="_blank" rel="noopener noreferrer" className={link}>velo-frontend (admin)</a></li>
              <li><a href="https://github.com/Gaurav-Soni24/Velo" target="_blank" rel="noopener noreferrer" className={link}>Velo (this site)</a></li>
              <li><a href="http://www.jetir.org/view?paper=JETIRHQ06008" target="_blank" rel="noopener noreferrer" className={link}>Research paper</a></li>
              <li><a href="https://gauravsoni.space" target="_blank" rel="noopener noreferrer" className={link}>Author: Gaurav Soni</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
          <p>Velo, a project by students of Government Engineering College, Bilaspur.</p>
          <p>Rider-app pages: <a href="/map" className={link}>Map</a> · <a href="/dashboard" className={link}>Dashboard</a> · <a href="/rewards" className={link}>Rewards</a> · <a href="/contact" className={link}>Contact</a></p>
        </div>
      </div>
    </footer>
  )
}
