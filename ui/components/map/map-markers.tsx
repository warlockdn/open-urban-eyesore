import { lazy, Suspense } from "react"
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from "leaflet"
import { MapData, MapPoint } from "@/types"
import { getColor } from "@/lib/utils"
import { HoverMarker } from "./hover-marker"

interface MapMarkersProps {
  mapData: MapData | null
  onMarkerClick: (point: Partial<MapPoint> | null) => void
}

export function MapMarkers({ mapData, onMarkerClick }: MapMarkersProps) {
  if (!mapData?.data) return null

  return (
    <MarkerClusterGroup
      chunkedLoading={true}
      maxClusterRadius={20}
      disableClusteringAtZoom={16}
      iconCreateFunction={(cluster: any) => {
        const markers = cluster.getAllChildMarkers()
        const category = markers[0]?.options.icon?.options?.iconUrl?.match(/category='([^']+)'/)?.[1] || "#3498db"
        const color = getColor(Number(category))

        return L.divIcon({
          html: `<svg width="40" height="40"><circle cx="20" cy="20" r="18" fill="${color}" /><text x="20" y="25" text-anchor="middle" fill="#fff" font-size="16">${cluster.getChildCount()}</text></svg>`,
          className: "custom-cluster-icon",
          iconSize: [40, 40],
        })
      }}
    >
      {mapData.data.map((point: MapPoint, idx: number) => (
        <HoverMarker 
          point={point} 
          idx={idx} 
          key={idx} 
          onMarkerClick={onMarkerClick}
        />
      ))}
    </MarkerClusterGroup>
  )
} 