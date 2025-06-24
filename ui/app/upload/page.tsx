"use client"

import { DisclaimerAlert } from "@/components/upload/disclaimer"
import { useState } from "react"
import dynamic from "next/dynamic"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { FAQ } from "@/components/upload/faq";

const FileUpload = dynamic(() => import("@/components/upload/upload"), { ssr: false })

export default function UploadPage() {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-full">
        <DisclaimerAlert open={open} setOpen={setOpen} />

        <div className="flex flex-col items-center justify-evenly min-h-screen gap-4">
          <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Upload your image</h1>
            <Alert 
              variant="default" 
              className="bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800"
            >
              <AlertDescription>
                Images you upload needs to be <strong className="text-gray-100 dark:text-slate-50 font-bold bg-blue-500 dark:bg-emerald-400 p-1 animate-bounce inline-block">GEOTAGGED</strong>. This will help us appropriately place your entry on the map.
                If you need help with this, kindly look at the FAQ below.
              </AlertDescription>
            </Alert>
          </div>
          <FileUpload acceptedFileTypes={["image/jpeg", "image/jpg"]} />
          <div className="w-full max-w-sm mx-auto mt-4 mb-4">
            <FAQ />
          </div>
        </div>
      </div>
    </div>
  )
}