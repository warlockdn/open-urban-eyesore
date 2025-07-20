"use client"

import { useEffect, useState, useRef, lazy, Suspense } from "react"

import L from "leaflet"
import { MapContainer, TileLayer } from "react-leaflet"
import { FeatureGroup } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import { area } from "@turf/area"
import { point } from "@turf/helpers"
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon"

import { useIsMobile } from "@/hooks/use-mobile"
import { useMapData } from "@/hooks/use-map-data"

import { getCityBounds, getCityCenter, MAP_LAYERS } from "./map/map-config"
import { MapLoadHandler } from "./map/map-load-handler"
import { MapControls } from "./map/map-controls"
import { LayerMenu } from "./map/layer-menu"
import { LoadingOverlay } from "./map/loading-overlay";
import { Legend } from "./map/legent"
import { MapMarkers } from "./map/map-markers"
import { GeneralMessageModal } from "./message-modal"
import { MapPoint } from "@/types"

import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import "@/styles/leaflet-draw-custom.css"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/placeholder.svg?height=25&width=25",
  iconUrl: "/placeholder.svg?height=25&width=25",
  shadowUrl: "/placeholder.svg?height=25&width=25",
})

const SelectionSidebar = lazy(() => import("@/components/selection-sidebar"))
const MapUIOverlay = lazy(() => import("@/components/map/map-ui-overlay"))
const FloatingCard = lazy(() => import("@/components/map/floating-card"))

export default function MapScreen() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState("street")
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<Partial<MapPoint> | null>(null)
  const [selectedPoints, setSelectedPoints] = useState<Partial<MapPoint>[]>([])
  const [isSelectionSheetOpen, setIsSelectionSheetOpen] = useState(false)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  
  const featureGroupRef = useRef<L.FeatureGroup | null>(null)
  const { mapData, isLoading } = useMapData()
  const isMobile = useIsMobile()

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("map-intro-seen");
    if (!hasSeenModal) {
      setIsMessageModalOpen(true);
    }
  }, []);

  const currentLayer = MAP_LAYERS[selectedLayer as keyof typeof MAP_LAYERS]

  useEffect(() => {
    if (isMobile && mapInstance) {
      mapInstance.fitBounds(getCityBounds(process.env.NEXT_PUBLIC_CITY_NAME!));
    }
  }, [isMobile, mapInstance]);

  const handleModalOpenChange = (isOpen: boolean) => {
    setIsMessageModalOpen(isOpen);
    if (!isOpen) {
      localStorage.setItem("map-intro-seen", "true");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Map Section */}
      <div className="relative h-full w-full">

      {/* Map Container */}
      <MapContainer
        {...(isMobile
          ? { bounds: getCityBounds(process.env.NEXT_PUBLIC_CITY_NAME!), maxBounds: getCityBounds(process.env.NEXT_PUBLIC_CITY_NAME!) }
          : { center: getCityCenter(process.env.NEXT_PUBLIC_CITY_NAME!), zoom: 12 })}
        maxZoom={18}
        minZoom={11}
        className="h-full w-full"
        zoomControl={false}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url={currentLayer.url}
          attribution={currentLayer.attribution}
          key={selectedLayer}
        />

        <FeatureGroup ref={featureGroupRef as any}>
          <EditControl
            position="bottomleft"
            onCreated={(e: any) => {
              if (!mapData) return
              const layer = e.layer
              let points: any[] = []

              // Circle selection
              if (layer instanceof L.Circle) {
                const center = layer.getLatLng()
                const radius = layer.getRadius() // in meters

                if (radius > 5000) {
                  alert("Selection radius cannot exceed 5 km")
                  featureGroupRef.current?.removeLayer(layer)
                  return
                }

                points = mapData.data.filter((p) => {
                  const dist = mapInstance?.distance(center, L.latLng(p.lat, p.long)) ?? 0
                  return dist <= radius
                })
              } else {
                // Polygon or rectangle
                const geojson = layer.toGeoJSON()
                const _area = area(geojson) // in m^2
                if (_area > 80_000_000) { // approx area of circle radius 5km => 78.5 km2
                  alert("Selection area cannot exceed ~5 km radius")
                  featureGroupRef.current?.removeLayer(layer)
                  return
                }

                points = mapData.data.filter((p) => {
                  const pt = point([p.long, p.lat])
                  return booleanPointInPolygon(pt, geojson as any)
                })
              }

              setSelectedPoints(points)
              if (points.length > 0) {
                setIsSelectionSheetOpen(true)
              }
            }}
            draw={{
              rectangle: true,
              polygon: false,
              circle: false,
              marker: false,
              polyline: false,
              circlemarker: false,
            }}
            edit={{
              edit: false,
              remove: false,
            }}
          />
        </FeatureGroup>

        <MapLoadHandler onMapLoad={() => setIsMapLoaded(true)} onMapInstance={setMapInstance} />
        
        <MapMarkers 
          mapData={mapData}
          onMarkerClick={setSelectedPoint}
        />
      </MapContainer>

      <GeneralMessageModal open={isMessageModalOpen} setOpen={handleModalOpenChange} />

      {selectedPoint && (
        <Suspense fallback={null}>
          <FloatingCard 
            point={selectedPoint} 
            onClose={() => setSelectedPoint(null)} 
          />
        </Suspense>
      )}

      <LoadingOverlay isVisible={!isMapLoaded && isLoading} />

      <Suspense fallback={null}>
        <MapUIOverlay 
          isMenuOpen={isMenuOpen}
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
          cityName={process.env.NEXT_PUBLIC_CITY_NAME!}
        />
      </Suspense>

      <MapControls mapInstance={mapInstance} />
      <Legend />

      <LayerMenu
        isOpen={isMenuOpen}
        selectedLayer={selectedLayer}
        onLayerChange={setSelectedLayer}
        mapInstance={mapInstance}
      />
      </div>{/* end map section */}

      <Suspense fallback={null}>
        <SelectionSidebar 
          items={selectedPoints} 
          open={isSelectionSheetOpen}
          onOpenChange={setIsSelectionSheetOpen}
                  onClear={() => {
          setSelectedPoints([])
          featureGroupRef.current?.clearLayers()
        }} 
        />
      </Suspense>
    </div>
  )
}
