"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useVelo } from "@/context/velo-context"
import { QRModal } from "@/components/qr-modal"
import stations from "@/data/stations.json"
import { MapPin, Navigation } from "lucide-react"

const DynamicMap = dynamic(() => import("@/components/map-component"), {
  loading: () => <div className="w-full h-96 bg-muted rounded-lg animate-pulse" />,
  ssr: false,
})

export default function MapPage() {
  const [selectedStation, setSelectedStation] = useState<any>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [stationAvailability, setStationAvailability] = useState<{ [key: number]: number }>({})
  const { rideActive } = useVelo()

  // Initialize and simulate real-time availability
  useEffect(() => {
    const initial = Object.fromEntries(stations.stations.map((s) => [s.id, s.cycles]))
    setStationAvailability(initial)

    const interval = setInterval(() => {
      setStationAvailability((prev) => {
        const updated = { ...prev }
        stations.stations.forEach((station) => {
          updated[station.id] = Math.max(0, Math.floor(Math.random() * 16))
        })
        return updated
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Find Cycles Near You</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="rounded-lg overflow-hidden shadow-lg border border-border h-[500px]">
                <DynamicMap
                  stations={stations.stations}
                  onStationClick={setSelectedStation}
                  stationAvailability={stationAvailability}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Nearby Stations</h2>
              <div className="space-y-3">
                {stations.stations.map((station) => {
                  const availability = stationAvailability[station.id] ?? station.cycles
                  const isSelected = selectedStation?.id === station.id

                  return (
                    <button
                      key={station.id}
                      onClick={() => setSelectedStation(station)}
                      className={`w-full p-4 rounded-lg border-2 transition text-left ${
                        isSelected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className="font-bold text-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {station.name}
                      </div>
                      <p className="text-sm text-foreground/60 mt-1">{availability} cycles available</p>
                      <p className="text-sm text-foreground/60">{station.distance} km away</p>
                    </button>
                  )
                })}
              </div>

              {/* Selected Station Details */}
              {selectedStation && (
                <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-bold text-lg mb-4 text-foreground">{selectedStation.name}</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Available Cycles:</span>
                      <span className="font-bold text-primary">
                        {stationAvailability[selectedStation.id] ?? selectedStation.cycles}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Distance:</span>
                      <span className="font-bold">{selectedStation.distance} km</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowQRModal(true)}
                    disabled={rideActive}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    <Navigation className="w-4 h-4" />
                    {rideActive ? "Ride in Progress" : "Unlock Cycle"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <QRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        stationName={selectedStation?.name || "Station"}
      />
    </>
  )
}
