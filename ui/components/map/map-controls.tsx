"use client"

import { Plus, Minus, RotateCcw, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCityCenter } from "./map-config"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import L from "leaflet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

interface MapControlsProps {
  mapInstance: L.Map | null
}

export function MapControls({ mapInstance }: MapControlsProps) {
  const zoomIn = () => {
    if (mapInstance) {
      mapInstance.zoomIn()
    }
  }

  const zoomOut = () => {
    if (mapInstance) {
      mapInstance.zoomOut()
    }
  }

  const resetView = () => {
    if (mapInstance) {
      mapInstance.setView(getCityCenter(process.env.NEXT_PUBLIC_CITY_NAME!), 12)
    }
  }

  const controlButtonClass = cn(
    "h-10 w-10 rounded-lg",
    "bg-background/80 backdrop-blur-sm text-foreground",
    "hover:bg-accent hover:text-accent-foreground",
    "border border-border",
    "shadow-sm transition-colors"
  )

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        onClick={zoomIn}
        size="icon"
        className={controlButtonClass}
        variant="outline"
        aria-label="Zoom in"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        onClick={zoomOut}
        size="icon"
        className={controlButtonClass}
        variant="outline"
        aria-label="Zoom out"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        onClick={resetView}
        size="icon"
        className={controlButtonClass}
        variant="outline"
        aria-label="Reset view"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className={controlButtonClass}
            variant="outline"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[1000]">
          <DropdownMenuItem>
            
          </DropdownMenuItem>
          <DropdownMenuItem>Help</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  )
} 