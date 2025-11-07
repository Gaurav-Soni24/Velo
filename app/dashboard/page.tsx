"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useVelo } from "@/context/velo-context"
import { Card } from "@/components/ui/card"
import { Calendar, Route, Zap } from "lucide-react"

export default function DashboardPage() {
  const { points, rides, rideActive } = useVelo()

  const totalDistance = rides.reduce((sum, ride) => sum + ride.distance, 0)
  const totalDuration = rides.reduce((sum, ride) => sum + ride.duration, 0)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Your Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 mb-2">Total Rides</p>
                  <p className="text-4xl font-bold text-primary">{rides.length}</p>
                </div>
                <Calendar className="w-12 h-12 text-primary/30" />
              </div>
            </Card>
            <Card className="p-6 border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 mb-2">Total Distance</p>
                  <p className="text-4xl font-bold text-primary">{totalDistance} km</p>
                </div>
                <Route className="w-12 h-12 text-primary/30" />
              </div>
            </Card>
            <Card className="p-6 border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 mb-2">Your Points</p>
                  <p className="text-4xl font-bold text-primary">{points}</p>
                </div>
                <Zap className="w-12 h-12 text-primary/30" />
              </div>
            </Card>
          </div>

          {/* Ride Status */}
          {rideActive && (
            <div className="mb-12 p-6 bg-primary/10 border-2 border-primary rounded-lg">
              <p className="font-bold text-primary mb-2">Active Ride in Progress</p>
              <p className="text-foreground/60">
                Your ride data is being tracked. Return to a station to end your ride.
              </p>
            </div>
          )}

          {/* Ride History */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Ride History</h2>
            {rides.length === 0 ? (
              <Card className="p-8 text-center text-foreground/60">
                <p>No rides yet. Start your first ride!</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {rides.map((ride) => (
                  <Card key={ride.id} className="p-6 border border-border hover:border-primary/50 transition">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-foreground/60 text-sm mb-1">Station</p>
                        <p className="font-bold text-foreground">{ride.stationName}</p>
                      </div>
                      <div>
                        <p className="text-foreground/60 text-sm mb-1">Duration</p>
                        <p className="font-bold text-foreground">{ride.duration} min</p>
                      </div>
                      <div>
                        <p className="text-foreground/60 text-sm mb-1">Distance</p>
                        <p className="font-bold text-foreground">{ride.distance} km</p>
                      </div>
                      <div>
                        <p className="text-foreground/60 text-sm mb-1">Date</p>
                        <p className="font-bold text-foreground">{new Date(ride.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
