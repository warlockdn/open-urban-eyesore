import { MapPoint } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Image } from "@imagekit/react";

interface FloatingCardProps {
  point: Partial<MapPoint>
  onClose: () => void
}

export default function FloatingCard({ point, onClose }: FloatingCardProps) {
  return (
    <div className="absolute right-4 top-4 z-[1000] w-80">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Location Details</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <a href={point.image || ""} target="_blank" rel="noopener noreferrer">
              <Image
                urlEndpoint="https://ik.imagekit.io/blrpotholes"
                src={point.image?.split("/").slice(-1)[0] || ""} 
                alt="Location Image"
                className="w-full h-48 object-cover rounded-md"
                loading="eager"
              />
              <p className="text-sm text-center text-muted-foreground">Click to view full image</p>
            </a>
            
            <div className="space-y-2">
              <div>
                <span className="font-medium">Latitude: </span>
                <span className="text-foreground">{point.lat?.toFixed(6)}</span>
              </div>
              <div>
                <span className="font-medium">Longitude: </span>
                <span className="text-foreground">{point.long?.toFixed(6)}</span>
              </div>
              {point.created_at && (
                <div>
                  <span className="font-medium">Added: </span>
                  <span className="text-foreground">{new Date(point.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 