"use client"

import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const MapScreen = dynamic(() => import("../components/map-screen"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="text-lg">Loading map...</div>
    </div>
  ),
})

const FreeFormPointSelectionInfoModal = dynamic(() => import("@/components/free-form-point-selection-info-modal"), {
  ssr: false,
})

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <FreeFormPointSelectionInfoModal />
      <MapScreen />
    </div>
  )
}
