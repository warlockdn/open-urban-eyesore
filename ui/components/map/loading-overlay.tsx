interface LoadingOverlayProps {
  isVisible: boolean
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 z-[1001] bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-lg text-gray-600">Loading map...</div>
      </div>
    </div>
  )
} 