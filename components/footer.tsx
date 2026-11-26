export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-bold text-foreground">About Velo</h3>
            <p className="text-sm text-foreground/60">
              An IoT smart cycle-sharing system: RFID rentals, camera-based monitoring, a cloud API and an admin panel. Published in JETIR, March 2026.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-foreground">Explore</h3>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="/#how-it-works" className="hover:text-primary">How it works</a></li>
              <li><a href="/#demo" className="hover:text-primary">Live simulator</a></li>
              <li><a href="/#api" className="hover:text-primary">API</a></li>
              <li><a href="http://www.jetir.org/view?paper=JETIRHQ06008" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Research paper</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-foreground">Source code</h3>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="https://github.com/Gaurav-Soni24/velo-backend" target="_blank" rel="noopener noreferrer" className="hover:text-primary">velo-backend</a></li>
              <li><a href="https://github.com/Gaurav-Soni24/velo-frontend" target="_blank" rel="noopener noreferrer" className="hover:text-primary">velo-frontend (admin)</a></li>
              <li><a href="https://github.com/Gaurav-Soni24/Velo" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Velo (this site)</a></li>
              <li><a href="https://gauravsoni.space" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Author: Gaurav Soni</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
          <p>Velo, a project by students of Government Engineering College, Bilaspur.</p>
        </div>
      </div>
    </footer>
  )
}
