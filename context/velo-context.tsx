"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Ride {
  id: string
  stationName: string
  duration: number
  distance: number
  timestamp: number
  endTime?: number
}

export interface VeloContextType {
  points: number
  addPoints: (amount: number) => void
  rideActive: boolean
  setRideActive: (active: boolean) => void
  currentRide: { stationName: string; startTime: number } | null
  startRide: (stationName: string) => void
  endRide: () => void
  rides: Ride[]
  level: "bronze" | "silver" | "gold"
}

const VeloContext = createContext<VeloContextType | undefined>(undefined)

export function VeloProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(0)
  const [rideActive, setRideActive] = useState(false)
  const [currentRide, setCurrentRide] = useState<{ stationName: string; startTime: number } | null>(null)
  const [rides, setRides] = useState<Ride[]>([])
  const [isClient, setIsClient] = useState(false)

  // Load from localStorage on client
  useEffect(() => {
    setIsClient(true)
    const savedPoints = localStorage.getItem("velo_points")
    const savedRides = localStorage.getItem("velo_rides")
    const savedRideActive = localStorage.getItem("velo_ride_active")
    const savedCurrentRide = localStorage.getItem("velo_current_ride")

    if (savedPoints) setPoints(Number.parseInt(savedPoints))
    if (savedRides) setRides(JSON.parse(savedRides))
    if (savedRideActive === "true") setRideActive(true)
    if (savedCurrentRide) setCurrentRide(JSON.parse(savedCurrentRide))
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isClient) return
    localStorage.setItem("velo_points", points.toString())
    localStorage.setItem("velo_rides", JSON.stringify(rides))
    localStorage.setItem("velo_ride_active", rideActive.toString())
    if (currentRide) {
      localStorage.setItem("velo_current_ride", JSON.stringify(currentRide))
    } else {
      localStorage.removeItem("velo_current_ride")
    }
  }, [points, rides, rideActive, currentRide, isClient])

  const getLevel = (): "bronze" | "silver" | "gold" => {
    if (points >= 100) return "gold"
    if (points >= 50) return "silver"
    return "bronze"
  }

  const addPoints = (amount: number) => {
    setPoints((prev) => prev + amount)
  }

  const startRide = (stationName: string) => {
    setRideActive(true)
    setCurrentRide({ stationName, startTime: Date.now() })
  }

  const endRide = () => {
    if (currentRide) {
      const duration = Math.floor((Date.now() - currentRide.startTime) / 1000 / 60) // minutes
      const distance = Math.floor(Math.random() * 10) + 2 // 2-12 km
      const newRide: Ride = {
        id: Math.random().toString(),
        stationName: currentRide.stationName,
        duration,
        distance,
        timestamp: currentRide.startTime,
        endTime: Date.now(),
      }
      setRides((prev) => [newRide, ...prev])
      addPoints(10)
      setRideActive(false)
      setCurrentRide(null)
    }
  }

  return (
    <VeloContext.Provider
      value={{
        points,
        addPoints,
        rideActive,
        setRideActive,
        currentRide,
        startRide,
        endRide,
        rides,
        level: getLevel(),
      }}
    >
      {children}
    </VeloContext.Provider>
  )
}

export function useVelo() {
  const context = useContext(VeloContext)
  if (!context) {
    throw new Error("useVelo must be used within VeloProvider")
  }
  return context
}
