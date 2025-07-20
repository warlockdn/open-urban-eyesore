import { MapPoint } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Image } from "@imagekit/react";
import Link from "next/link";

interface SelectionSidebarProps {
  items: Partial<MapPoint>[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClear: () => void;
}

export default function SelectionSidebar({ items, open, onOpenChange, onClear }: SelectionSidebarProps) {
  const handleClear = () => {
    onClear();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClear}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto z-[1000]">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle>Selected ({items.length})</SheetTitle>
          </div>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {items.map((point, idx) => (
            <Card key={`${point.uuid ?? idx}`} className="shadow-sm">
              <CardContent className="p-4 space-y-2">
                {point.image && (
                  <Link href={point.image} target="_blank">
                    <Image
                      urlEndpoint="https://ik.imagekit.io/blrpotholes"
                      src={point.image?.split("/").slice(-1)[0] ?? ""}
                      alt="Location image"
                      className="w-full h-32 object-cover bg-center rounded"
                      responsive={true}
                    />
                  </Link>
                )}
                <div className="text-sm">
                  <div>Lat: <span className="font-medium">{point.lat !== undefined ? point.lat.toFixed(5) : "-"}</span></div>
                  <div>Lng: <span className="font-medium">{point.long !== undefined ? point.long.toFixed(5) : "-"}</span></div>
                  {point.created_at && <div>Date: {new Date(point.created_at).toLocaleDateString()}</div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
} 