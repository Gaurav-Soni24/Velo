"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useVelo } from "@/context/velo-context"
import { QRModal } from "@/components/qr-modal"
import { Bike, Zap, Trophy, MapPin } from "lucide-react"

export default function Home() {
  const { points, rideActive } = useVelo()
  const [showQRModal, setShowQRModal] = useState(false)

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                  Smart Cycle Sharing for Smart Cities
                </h1>
                <p className="text-xl text-foreground/70 mb-8">
                  Unlock eco-friendly transportation with Velo. Ride smart, earn rewards, build a sustainable future.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Button
                    onClick={() => setShowQRModal(true)}
                    disabled={rideActive}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
                  >
                    {rideActive ? "Ride in Progress" : "Start Ride"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/map")}
                    className="px-8 py-6 text-lg border-primary text-primary hover:bg-primary/5"
                  >
                    Find Cycles
                  </Button>
                </div>
              </div>
              <div className="relative h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                <Bike className="w-32 h-32 text-primary/40" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-secondary/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Why Choose Velo?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: MapPin,
                  title: "Find Nearby Cycles",
                  description: "Locate available cycles at your nearest station with real-time tracking.",
                },
                {
                  icon: Zap,
                  title: "Quick QR Unlock",
                  description: "Unlock cycles instantly with our QR code scanning technology.",
                },
                {
                  icon: Trophy,
                  title: "Earn Rewards",
                  description: "Earn points on every ride and unlock badges as you progress.",
                },
              ].map((feature, idx) => (
                <div key={idx} className="bg-card rounded-lg p-6 border border-border">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: "Your Points", value: points },
                { label: "Active Stations", value: 5 },
                { label: "Rides Available", value: "24/7" },
                { label: "Eco Impact", value: "100%" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <p className="text-foreground/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <QRModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} stationName="Quick Ride" />
    </>
  )
}
