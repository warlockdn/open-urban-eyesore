"use client"

import dynamic from "next/dynamic"

// Dynamically import the similar map component to avoid SSR issues
const SimilarMapScreen = dynamic(() => import("@/components/similar-map-screen"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="text-lg">Loading map...</div>
    </div>
  ),
})

export default function SimilarPage() {
  return <SimilarMapScreen />
}

