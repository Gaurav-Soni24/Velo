"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface Station {
  id: number
  name: string
  lat: number
  lng: number
  cycles: number
  distance: number
}

interface MapComponentProps {
  stations: Station[]
  onStationClick: (station: Station) => void
  stationAvailability: { [key: number]: number }
}

export default function MapComponent({ stations, onStationClick, stationAvailability }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: number]: L.Marker }>({})

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map("map").setView([40.75, -73.99], 13)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapRef.current)
    }

    // Update markers
    stations.forEach((station) => {
      const availability = stationAvailability[station.id] ?? station.cycles

      if (markersRef.current[station.id]) {
        markersRef.current[station.id].remove()
      }

      // Create custom green marker
      const greenIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg cursor-pointer text-white font-bold text-sm">${availability}</div>`,
        className: "",
        iconSize: [32, 32],
      })

      const marker = L.marker([station.lat, station.lng], { icon: greenIcon })
        .addTo(mapRef.current!)
        .on("click", () => onStationClick(station))

      markersRef.current[station.id] = marker
    })
  }, [stations, stationAvailability, onStationClick])

  return <div id="map" className="w-full h-full" />
}
