import { useState, useEffect } from "react"
import { MapData } from "@/types"

export function useMapData() {
  const [mapData, setMapData] = useState<MapData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/data`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setMapData(data.result as MapData)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch map data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMapData()
  }, [])

  return { mapData, isLoading, error }
} 