"use client"

import { useEffect, useRef } from "react"
import { Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { MapPoint } from "@/lib/types"
import { getColor } from "@/lib/utils"
import { cn } from "@/lib/utils"

export function HoverMarker({ 
  point, 
  idx,
  onMarkerClick
}: { 
  point: Partial<MapPoint>
  idx: number
  onMarkerClick: (point: Partial<MapPoint>) => void 
}) {
  const markerRef = useRef<L.Marker>(null)
  const popupRef = useRef<L.Popup>(null)
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const marker = markerRef.current
    if (!marker) return

    // Set consistent cursor style
    marker.getElement()?.style.setProperty('cursor', 'pointer');

    const handleMouseOver = () => {
      hoverTimeout.current = setTimeout(() => {
        if (marker) {
          marker.openPopup()
        }
      }, 200)
    }
    const handleMouseOut = () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
      if (marker) {
        marker.closePopup()
      }
    }

    const handleClick = () => {
      onMarkerClick(point)
    }

    marker.on('mouseover', handleMouseOver)
    marker.on('mouseout', handleMouseOut)
    marker.on('click', handleClick)
    
    return () => {
      marker.off('mouseover', handleMouseOver)
      marker.off('mouseout', handleMouseOut)
      marker.off('click', handleClick)
    }
  }, [point, onMarkerClick])

  return (
    <Marker
      key={idx}
      position={[point.lat ?? 0, point.long ?? 0]}
      icon={L.icon({
        iconUrl: `data:image/svg+xml;utf8,
          <svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256' fill='${encodeURIComponent(getColor(Number(point.category)))}' category='${point.category}'>
            <g style='stroke: none; fill: none; opacity: 1;' transform='translate(1.4 1.4) scale(2.81 2.81)'>
              <path d='M 45 0 C 27.677 0 13.584 14.093 13.584 31.416 c 0 4.818 1.063 9.442 3.175 13.773 c 2.905 5.831 11.409 20.208 20.412 35.428 l 4.385 7.417 C 42.275 89.252 43.585 90 45 90 s 2.725 -0.748 3.444 -1.966 l 4.382 -7.413 c 8.942 -15.116 17.392 -29.4 20.353 -35.309 c 0.027 -0.051 0.055 -0.103 0.08 -0.155 c 2.095 -4.303 3.157 -8.926 3.157 -13.741 C 76.416 14.093 62.323 0 45 0 z M 45 42.81 c -6.892 0 -12.5 -5.607 -12.5 -12.5 c 0 -6.893 5.608 -12.5 12.5 -12.5 c 6.892 0 12.5 5.608 12.5 12.5 C 57.5 37.202 51.892 42.81 45 42.81 z' style='fill: ${encodeURIComponent(getColor(Number(point.category)))}; opacity: 1;' />
            </g>
          </svg>` ,
        iconSize: [25, 25],
        iconAnchor: [12.5, 24.5],
      })}
      ref={markerRef}
    >
      <Popup ref={popupRef}>
        <div className={cn(
          "flex flex-col items-center bg-background text-foreground",
          "rounded-md shadow-sm"
        )}>
          <img 
            src={point.image_thumb || ""} 
            alt={String(point.category)} 
            className="w-20 h-20 object-cover mb-2 rounded border border-border" 
          />
        </div>
      </Popup>
    </Marker>
  )
}