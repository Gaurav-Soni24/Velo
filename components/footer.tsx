export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-foreground mb-4">About Velo</h3>
            <p className="text-sm text-foreground/60">Smart cycle sharing for sustainable cities.</p>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>
                <a href="#" className="hover:text-primary">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Safety
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>
                <a href="#" className="hover:text-primary">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Terms
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Contact</h3>
            <p className="text-sm text-foreground/60">hello@velo.city</p>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
          <p>&copy; 2025 Velo Smart Cycle Sharing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
