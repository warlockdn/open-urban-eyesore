"use client"

import { useEffect } from "react"
import { useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"

interface MapLoadHandlerProps {
  onMapLoad: () => void
  onMapInstance: (map: L.Map) => void
}

export function MapLoadHandler({ onMapLoad, onMapInstance }: MapLoadHandlerProps) {
  const map = useMap()

  useMapEvents({
    load: () => {
      console.log("Map loaded")
      onMapLoad()
    },
    tileload: () => {
      // Optional: you can add additional logic here if needed
    },
    tileloadstart: () => {
      // Optional: you can add additional logic here if needed
    },
  })

  useEffect(() => {
    if (map) {
      onMapInstance(map)
      
      // Fallback: if map events don't fire, use a timeout
      const timer = setTimeout(() => {
        console.log("Fallback map load")
        onMapLoad()
      }, 2000)

      // Also listen for when the map is ready
      map.whenReady(() => {
        console.log("Map ready")
        onMapLoad()
      })

      return () => clearTimeout(timer)
    }
  }, [map, onMapLoad, onMapInstance])

  return null
} 