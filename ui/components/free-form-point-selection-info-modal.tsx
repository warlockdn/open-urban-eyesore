"use client"

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

export default function FreeFormPointSelectionInfoModal() {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("freeFormPointSelectionInfoModalClosed")) {
      setTimeout(() => {
        setOpen(true);
      }, 10000)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem("freeFormPointSelectionInfoModalClosed", "true");
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>New Feature: 📍 Area Selection</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
          Now select your area of interest to view potholes within a 5km radius.
          <br/>
          <br/>
          <Image src={"/selection-icon.png"} alt="selection icon"  width={50} height={50} className="inline-block" />
          <br/>
          <br/>
          <strong>🚀 How to Use:</strong>
          <br/><br/>
          <span className="text-left inline-block">
            🔲 Tap the selection tool (square icon - bottom left) in the toolbar to activate area selection mode
            <br/><br/>
            ✏️ Draw your selection area by tapping and dragging on the map to create a rectangular boundary
            <br/><br/>
            🔧 Adjust the selection if needed by dragging the corners or edges of the blue selection box
            <br/><br/>
            👀 View results - All potholes within 5km of your selected area will be highlighted
          </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>Got it!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
