import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export function Legend() {
  const [showLabels, setShowLabels] = useState(false);
  
  const categories = [
    { color: "#fa285c", label: "Minor" },
    { color: "#eb1a4e", label: "Major" },
    { color: "#d11141", label: "Severe" },
    { color: "#ba0734", label: "Critical" },
  ];

  return (
    <Card className="absolute right-4 z-[400] p-2 pb-3 shadow-lg transition-all duration-300 ease-in-out" style={{ bottom: "10rem" }}>
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setShowLabels(!showLabels)}
          aria-label={showLabels ? "Hide legend" : "Show legend"}
        >
          <Info className={cn(
            "h-4 w-4 transition-transform duration-300",
            showLabels && "rotate-180"
          )} />
        </Button>
        {showLabels && (
          <span className="text-sm font-medium animate-in fade-in slide-in-from-left-1 duration-200">
            Legend
          </span>
        )}
      </div>
      <div className={cn(
        "flex flex-col gap-2",
        !showLabels && "items-center"
      )}>
        {categories.map((category, i) => (
          <div key={i} className={cn(
            "flex items-center gap-2",
            !showLabels && "justify-center"
          )}>
            <div
              className="h-4 w-4 rounded-sm"
              style={{ backgroundColor: category.color }}
            />
            {showLabels && (
              <span className="text-sm font-medium animate-in fade-in slide-in-from-left-1 duration-200">
                {category.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}