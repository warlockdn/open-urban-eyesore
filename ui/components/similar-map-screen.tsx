"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useIsMobile } from "@/hooks/use-mobile"

import { BENGALURU_CENTER, MAP_LAYERS } from "./map/map-config"
import { MapLoadHandler } from "./map/map-load-handler"
import { MapControls } from "./map/map-controls"
import { LayerMenu } from "./map/layer-menu"
import { LoadingOverlay } from "./map/loading-overlay"

import { getColor } from "@/lib/utils"
import { HoverMarker } from "./map/hover-marker"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/placeholder.svg?height=25&width=25",
  iconUrl: "/placeholder.svg?height=25&width=25",
  shadowUrl: "/placeholder.svg?height=25&width=25",
})

// Haversine formula to calculate distance between two lat/lng points in meters
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lng2-lng1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

export default function SimilarMapScreen() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState("street")
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [filteredPoints, setFilteredPoints] = useState<any[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>(BENGALURU_CENTER)
  const [zoomLevel, setZoomLevel] = useState(16)
  
  const searchParams = useSearchParams()
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const isMobile = useIsMobile()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/api/data`)
      .then((res) => res.json())
      .then((data) => {
        
        if (lat && lng) {
          const targetLat = parseFloat(lat)
          const targetLng = parseFloat(lng)
          
          // Filter points within 30 meters
          const nearbyPoints = data.result.data.filter((point: any) => {
            const distance = calculateDistance(targetLat, targetLng, point.lat, point.long)
            return distance <= 30
          }).map((point: any) => ({
            ...point,
            distance: calculateDistance(targetLat, targetLng, point.lat, point.long)
          }))

          setFilteredPoints(nearbyPoints)
          
          const zoom = isMobile ? 16 : 16
          if (nearbyPoints.length > 0) {
            // Calculate center of nearby points
            const centerLat = nearbyPoints.reduce((sum: number, p: any) => sum + p.lat, 0) / nearbyPoints.length
            const centerLng = nearbyPoints.reduce((sum: number, p: any) => sum + p.long, 0) / nearbyPoints.length
            setMapCenter([centerLat, centerLng])
            setZoomLevel(zoom) // Zoom in for detailed view
          } else {
            // No nearby points, center on target location
            setMapCenter([targetLat, targetLng])
            setZoomLevel(zoom)
          }
        } else {
          // No coordinates provided, show all data
          setFilteredPoints(data.result.data)
        }
      })
      .catch((err) => console.error(err))
  }, [lat, lng, isMobile])

  // Update map view when center or zoom changes
  useEffect(() => {
    if (mapInstance && mapCenter && zoomLevel && isMapLoaded) {
      // Wait for next tick to ensure map is ready
      setTimeout(() => {
        try {
          mapInstance.invalidateSize();
          mapInstance.setView(mapCenter, 20)
        } catch (error) {
          console.warn('Map view update failed:', error)
        }
      }, 100)
    }
  }, [mapInstance, mapCenter, zoomLevel, isMapLoaded])

  const currentLayer = MAP_LAYERS[selectedLayer as keyof typeof MAP_LAYERS]

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-100">
      {/* Info Banner */}
      {lat && lng && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 dark:bg-gray-900/90 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-md max-w-md text-center text-gray-900 dark:text-gray-100 backdrop-blur">
          <h3 className="font-semibold text-xs mb-1">Existing Submissions</h3>
          <p className="text-sm">
            Found <strong>{filteredPoints.length}</strong> points 
            <br />
            <span className="text-xs">within 30m of the target location</span>
          </p> 
        </div>
      )}

      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        maxZoom={18}
        className="h-full w-full"
        zoomControl={false}
        style={{ height: "100vh", width: "100vw" }}
        key={`${mapCenter[0]}-${mapCenter[1]}-${zoomLevel}`} // Force re-render when center/zoom changes
      >
        <TileLayer
          url={currentLayer.url}
          attribution={currentLayer.attribution}
          key={selectedLayer}
        />
        <MapLoadHandler onMapLoad={() => setIsMapLoaded(true)} onMapInstance={setMapInstance} />
        
        {/* Target location marker */}
        {lat && lng && (
          <Marker
            position={[parseFloat(lat), parseFloat(lng)]}
            icon={L.icon({
              iconUrl: `data:image/svg+xml;utf8,
                <svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256' fill='%23ff6b6b'>
                  <g style='stroke: none; fill: none; opacity: 1;' transform='translate(1.4 1.4) scale(2.81 2.81)'>
                    <path d='M 45 0 C 27.677 0 13.584 14.093 13.584 31.416 c 0 4.818 1.063 9.442 3.175 13.773 c 2.905 5.831 11.409 20.208 20.412 35.428 l 4.385 7.417 C 42.275 89.252 43.585 90 45 90 s 2.725 -0.748 3.444 -1.966 l 4.382 -7.413 c 8.942 -15.116 17.392 -29.4 20.353 -35.309 c 0.027 -0.051 0.055 -0.103 0.08 -0.155 c 2.095 -4.303 3.157 -8.926 3.157 -13.741 C 76.416 14.093 62.323 0 45 0 z M 45 42.81 c -6.892 0 -12.5 -5.607 -12.5 -12.5 c 0 -6.893 5.608 -12.5 12.5 -12.5 c 6.892 0 12.5 5.608 12.5 12.5 C 57.5 37.202 51.892 42.81 45 42.81 z' style='fill: %23ff6b6b; opacity: 1;' />
                  </g>
                </svg>`,
              iconSize: [35, 35],
              iconAnchor: [17.5, 35],
            })}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Target Location</p>
                <p className="text-sm">{parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Render filtered points as markers */}
        <MarkerClusterGroup
          chunkedLoading={true}
          maxClusterRadius={40}
          disableClusteringAtZoom={16}
          iconCreateFunction={(cluster: any) => {
            const markers = cluster.getAllChildMarkers();
            const category = markers[0]?.options.icon?.options?.iconUrl?.match(/category='([^']+)'/)?.[1] || "#3498db";
            const color = getColor(Number(category))

            return L.divIcon({
              html: `<svg width="25" height="25"><circle cx="12.5" cy="12.5" r="12.5" fill="${color}" /></svg>`,
              className: "custom-cluster-icon",
              iconSize: [25, 25],
            });
          }}
        >
          {filteredPoints.map((point, idx) => (
            <HoverMarker point={point} idx={idx} key={idx} onMarkerClick={() => {}} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <LoadingOverlay isVisible={!isMapLoaded} />

      {/* Floating Menu Button */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-white text-gray-800 hover:bg-gray-100 border"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <MapControls mapInstance={mapInstance} />

      <LayerMenu
        isOpen={isMenuOpen}
        selectedLayer={selectedLayer}
        onLayerChange={setSelectedLayer}
        mapInstance={mapInstance}
      />

      {/* Overlay to close menu */}
      {isMenuOpen && (
        <div className="absolute inset-0 z-[998] bg-black bg-opacity-20" onClick={() => setIsMenuOpen(false)} />
      )}
    </div>
  )
} 