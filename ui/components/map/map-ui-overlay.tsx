import { Menu, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeManager } from "@/components/theme-manager"

interface MapUIOverlayProps {
  isMenuOpen: boolean
  onMenuToggle: () => void
  cityName: string
}

export default function MapUIOverlay({ isMenuOpen, onMenuToggle, cityName }: MapUIOverlayProps) {
  return (
    <>
      {/* Floating Menu Button */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Button
          onClick={onMenuToggle}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-background text-foreground hover:bg-accent hover:text-accent-foreground border"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* City Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[999]">
        <div className="bg-background rounded-full shadow-lg border px-4 py-2">
          <h1 className="text-lg font-bold text-foreground whitespace-nowrap">
            {cityName} Live Potholes Map
          </h1>
        </div>
      </div>

      {/* Theme Manager */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end space-y-2">
        <ThemeManager />
      </div>

      {/* Upload Button */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[999]">
        <Link href="/upload">
          <button 
            aria-label="Upload and Contribute" 
            className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-1000 ease-linear animate-[breathing_4s_ease-in-out_infinite] hover:animate-none"
          >
            Upload and Contribute
          </button>
        </Link>
      </div>

      {/* Overlay to close menu */}
      {isMenuOpen && (
        <div 
          className="absolute inset-0 z-[998] bg-black bg-opacity-20" 
          onClick={onMenuToggle} 
        />
      )}
    </>
  )
} 