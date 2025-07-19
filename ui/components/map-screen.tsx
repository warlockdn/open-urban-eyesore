"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useIsMobile } from "@/hooks/use-mobile"

import { getCityBounds, getCityCenter, MAP_LAYERS } from "./map/map-config"
import { MapLoadHandler } from "./map/map-load-handler"
import { MapControls } from "./map/map-controls"
import { LayerMenu } from "./map/layer-menu"
import { LoadingOverlay } from "./map/loading-overlay";
import { Legend } from "./map/legent"
import { ThemeManager } from "./theme-manager"

import { HoverMarker } from "./map/hover-marker"
import { MapData } from "@/types"
import { MapPoint } from "@/lib/types"
import { getColor } from "@/lib/utils"
import { FloatingCard } from "./map/floating-card"
import { GeneralMessageModal } from "./message-modal"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/placeholder.svg?height=25&width=25",
  iconUrl: "/placeholder.svg?height=25&width=25",
  shadowUrl: "/placeholder.svg?height=25&width=25",
})

export default function MapScreen() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState("street")
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Partial<MapPoint> | null>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const isMobile = useIsMobile();

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("map-intro-seen");
    if (!hasSeenModal) {
      setIsMessageModalOpen(true);
    }
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/api/data`)
      .then((res) => res.json())
      .then((data) => {
        setMapData(data.result as MapData)
      })
      .catch((err) => console.error(err));
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
    <div className="relative h-screen w-screen overflow-hidden bg-gray-100">
      {/* Map Container */}
      <MapContainer
        {...(isMobile
          ? { bounds: getCityBounds(process.env.NEXT_PUBLIC_CITY_NAME!), maxBounds: getCityBounds(process.env.NEXT_PUBLIC_CITY_NAME!) }
          : { center: getCityCenter(process.env.NEXT_PUBLIC_CITY_NAME!), zoom: 12 })}
        maxZoom={18}
        minZoom={11}
        className="h-full w-full"
        zoomControl={false}
        style={{ height: "100vh", width: "100vw" }}
      >
        <TileLayer
          url={currentLayer.url}
          attribution={currentLayer.attribution}
          key={selectedLayer}
        />
        <MapLoadHandler onMapLoad={() => setIsMapLoaded(true)} onMapInstance={setMapInstance} />
        
        {/* Render points as markers */}
        <MarkerClusterGroup
          chunkedLoading={true}
          maxClusterRadius={20}
          disableClusteringAtZoom={16}
          iconCreateFunction={(cluster: any) => {

            const markers = cluster.getAllChildMarkers();
            const category = markers[0]?.options.icon?.options?.iconUrl?.match(/category='([^']+)'/)?.[1] || "#3498db";

            const color = getColor(Number(category))

            return L.divIcon({
              html: `<svg width="40" height="40"><circle cx="20" cy="20" r="18" fill="${color}" /><text x="20" y="25" text-anchor="middle" fill="#fff" font-size="16">${cluster.getChildCount()}</text></svg>`,
              className: "custom-cluster-icon",
              iconSize: [40, 40],
            });
          }}
        >
          {mapData?.data?.map((point, idx) => (
            <HoverMarker 
              point={point} 
              idx={idx} 
              key={idx} 
              onMarkerClick={setSelectedPoint}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <GeneralMessageModal open={isMessageModalOpen} setOpen={handleModalOpenChange} />

      {selectedPoint && (
        <FloatingCard 
          point={selectedPoint} 
          onClose={() => setSelectedPoint(null)} 
        />
      )}

      <LoadingOverlay isVisible={!isMapLoaded} />

      {/* Floating Menu Button */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-background text-foreground hover:bg-accent hover:text-accent-foreground border"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[999]">
        <div className="bg-background rounded-full shadow-lg border px-4 py-2">
          <h1 className="text-lg font-bold text-foreground whitespace-nowrap">{process.env.NEXT_PUBLIC_CITY_NAME} Live Potholes Map</h1>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-[1000]">
        <ThemeManager />
      </div>

      <MapControls mapInstance={mapInstance} />
      <Legend />

      <LayerMenu
        isOpen={isMenuOpen}
        selectedLayer={selectedLayer}
        onLayerChange={setSelectedLayer}
        mapInstance={mapInstance}
      />

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[999]">
        <Link href="/upload">
          <button aria-label="Upload and Contribute" className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-1000 ease-linear animate-[breathing_4s_ease-in-out_infinite] hover:animate-none">
            Upload and Contribute
          </button>
        </Link>
      </div>

      {/* Overlay to close menu */}
      {isMenuOpen && (
        <div className="absolute inset-0 z-[998] bg-black bg-opacity-20" onClick={() => setIsMenuOpen(false)} />
      )}
    </div>
  )
}
