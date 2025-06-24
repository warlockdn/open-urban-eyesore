"use client"

import { Layers, Palette } from "lucide-react";
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MAP_LAYERS } from "./map-config"
import L from "leaflet"
import Link from "next/link";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface LayerMenuProps {
  isOpen: boolean
  selectedLayer: string
  onLayerChange: (layer: string) => void
  mapInstance: L.Map | null
}

export function LayerMenu({ isOpen, selectedLayer, onLayerChange, mapInstance }: LayerMenuProps) {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 z-[999] h-full bg-background border-r",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      style={{ width: "350px" }}
    >
      <div className="p-6 pt-20 h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-foreground flex items-center">
          <Layers className="h-5 w-5 mr-2" />
          Map Layers & Controls
        </h2>

        {/* Base Map Layers */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Base Maps</h3>
          <div className="space-y-2">
            {Object.entries(MAP_LAYERS)
              .filter(([key]) => ["street", "satellite", "terrain"].includes(key))
              .map(([key, layer]) => {
                const IconComponent = layer.icon
                return (
                  <Card
                    key={key}
                    className={cn(
                      "p-2 px-3 cursor-pointer transition-colors",
                      selectedLayer === key 
                        ? "bg-accent border-accent-foreground/20" 
                        : "hover:bg-muted"
                    )}
                    onClick={() => onLayerChange(key)}
                  >
                    <div className="flex items-center">
                      <IconComponent className="h-4 w-4 mr-3 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">{layer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {key === "street" && "Standard OpenStreetMap view"}
                          {key === "satellite" && "Aerial imagery view"}
                          {key === "terrain" && "Topographic map view"}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Color Themes */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Color Themes
          </h3>
          <div className="space-y-2">
            {Object.entries(MAP_LAYERS)
              .filter(([key]) => ["dark", "light", "watercolor"].includes(key))
              .map(([key, layer]) => (
                <Card
                  key={key}
                  className={cn(
                    "p-2 px-3 cursor-pointer transition-colors",
                    selectedLayer === key 
                      ? "bg-accent border-accent-foreground/20" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => onLayerChange(key)}
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "w-4 h-4 rounded mr-3",
                        key === "dark"
                          ? "bg-foreground"
                          : key === "light"
                            ? "bg-background border-2 border-border"
                            : "bg-gradient-to-r from-blue-400 to-purple-400"
                      )}
                    />
                    <div>
                      <div className="font-medium text-foreground">{layer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {key === "dark" && "Dark mode optimized"}
                        {key === "light" && "Clean minimal style"}
                        {key === "watercolor" && "Artistic watercolor style"}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Application other pages */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
            Platform Links
          </h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/upload">Upload</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/changelog">Changelog</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
} 