"use client"

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import exifReader from "exifreader"
import { toast } from "sonner";

import useImageKitUpload from "@/components/upload/imagekit";
import { useIsMobile } from "@/components/ui/use-mobile";
import { convertExifToFormattedString, isInBengaluru, reportToSentry } from "@/lib/utils";

export type UploadStatus = "idle" | "dragging" | "uploading" | "success" | "error"

export interface FileUploadHookProps {
  onUploadError?: (error: string) => void
  acceptedFileTypes?: string[]
  maxFileSize?: number
  onFileRemove?: () => void
}

export function useFileUpload({
  onUploadError,
  acceptedFileTypes,
  maxFileSize = 10 * 1024 * 1024, // Default 10MB
  onFileRemove,
}: FileUploadHookProps) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [captureMode, setCaptureMode] = useState<"user" | "environment" | false>(false)
  const isMobile = useIsMobile()
  const capturedLocation = useRef<{ lat: number; lng: number } | null>(null);
  const [exif, setExif] = useState<exifReader.Tags | null>(null);

  const { handleUpload } = useImageKitUpload()

  useEffect(() => {
    if (file?.type?.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(null)
  }, [file])

  useEffect(() => {
    if (captureMode) {
      fileInputRef.current?.click()
    }
  }, [captureMode])

  const handleFileValidation = useCallback(
    (selectedFile: File): boolean => {
      setError(null)
      if (acceptedFileTypes && acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(selectedFile.type)) {
        const err = `Invalid file type. Accepted: ${acceptedFileTypes
          .map((t) => t.split("/")[1])
          .join(", ")
          .toUpperCase()}`
        setError(err)
        setStatus("error")
        if (onUploadError) onUploadError(err)
        return false
      }
      if (maxFileSize && selectedFile.size > maxFileSize) {
        const err = `File size exceeds the limit of ${formatBytes(maxFileSize)}.`
        setError(err)
        setStatus("error")
        if (onUploadError) onUploadError(err)
        return false
      }
      return true
    },
    [acceptedFileTypes, maxFileSize, onUploadError],
  )

  const simulateUpload = () => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10 + 10
      if (currentProgress >= 100) {
        clearInterval(interval)
      } else {
        setStatus((prevStatus) => {
          if (prevStatus === "uploading") {
            setProgress(currentProgress)
            return "uploading"
          }
          clearInterval(interval)
          return prevStatus
        })
      }
    }, 300)
  }

  const performUpload = useCallback(
    async (selectedFile: File, lat: number, lng: number) => {
      try {

        toast.success("GPS data found", { description: "Uploading image...", position: "top-center" })

        const uploadResponse = await handleUpload(selectedFile)
        const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/tokens/upload`)
        const tokenData = (await tokenResponse.json()) as { data: { token: string } }

        if (!tokenData.data.token) {
          toast.error("Failed to generate upload token", {
            description: "Please try again later.",
            position: "top-center",
          })
          reportToSentry(new Error("Failed to generate upload token"), {
            exif: convertExifToFormattedString(exif),
          });
          resetState();
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/upload`, {
          method: "POST",
          body: JSON.stringify({
            image: {
              fileId: uploadResponse?.fileId,
              url: uploadResponse?.url,
              thumbnailUrl: uploadResponse?.thumbnailUrl,
            },
            lat,
            lng,
            token: tokenData.data.token,
          }),
        })

        if (!response.ok) {
          toast.error("Failed to upload image", {
            description: "Please try again later.",
            position: "top-center",
          })
          reportToSentry(new Error("Failed to upload image"), {
            exif: convertExifToFormattedString(exif),
          });
          resetState();
          return;
        }

        await response.json()
        setProgress(100)
        setStatus("success")
      } catch (error: any) {
        let errorMessage = "Error uploading image"
        let errorDescription = "Please try again later"

        if (error.message === "Invalid GPS data") {
          errorMessage = "No GPS data found"
          errorDescription = "Please ensure the image has GPS data."
        } else if (error.message === "Failed to generate upload token") {
          errorMessage = "Failed to generate upload token"
        }

        toast.error(errorMessage, { description: errorDescription, position: "top-center" })

        setFile(null)
        setStatus("idle")
        setProgress(0)
        setError(null)
        setPreviewUrl(null)
      }
    },
    [handleUpload],
  )

  const performValidations = useCallback(async (exifData: exifReader.Tags) => {
    const { GPSLatitude, GPSLongitude } = exifData
    const lat = parseFloat(GPSLatitude?.description as string);
    const lng = parseFloat(GPSLongitude?.description as string);
    
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      toast.error("Invalid GPS data", {
        description: "Please ensure the image has GPS data.",
        position: "top-center",
      })
      reportToSentry(new Error("Invalid GPS data"), {
        lat,
        lng,
        exif: convertExifToFormattedString(exifData)
      });
      resetState();
      return { lat: -1, lng: -1 };
    }

    if (!isInBengaluru(lat, lng)) {
      toast.error("Image is not in Bengaluru. Please upload the image from Bengaluru.", {
        description: "This is to ensure that the image is relevant to the city of Bengaluru.",
        position: "top-center",
      })
      reportToSentry(new Error("Image is not in Bengaluru"), {
        lat,
        lng,
        exif: convertExifToFormattedString(exif)
      });
      resetState();
      return { lat: -1, lng: -1 };
    }

    return { lat, lng };
  }, [])

  const handleFileSelect = useCallback(
    async (selectedFile: File | null) => {
      if (!selectedFile || !handleFileValidation(selectedFile)) {
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
      setStatus("uploading")
      setProgress(0)
      simulateUpload()

      if (capturedLocation.current) {
        const { lat, lng } = capturedLocation.current;
        capturedLocation.current = null;

        const exifData = exifReader.load(await selectedFile.arrayBuffer());
        const { lat: validatedLat, lng: validatedLng } = await performValidations(exifData);

        if (validatedLat === -1 || validatedLng === -1) {
          resetState();
          return;
        }

        await performUpload(selectedFile, lat, lng)
      } else {
        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const exifData = exifReader.load(e.target?.result as ArrayBuffer)
            setExif(exifData);
            
            const { lat, lng } = await performValidations(exifData);

            if (lat === -1 || lng === -1) {
              resetState();
              return;
            }

            await performUpload(selectedFile, lat, lng)
          } catch (error) {
            toast.error("No GPS data found in image", {
              description: "Please use the 'Capture Photo' option or ensure EXIF data is present.",
              position: "top-center",
            })
            resetState();
            reportToSentry(new Error("No GPS data found in image"), {
              exif: convertExifToFormattedString(exif),
            });
          }
        }
        reader.readAsArrayBuffer(selectedFile)
      }
    },
    [handleFileValidation, performUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (status !== "uploading" && status !== "success") {
      setStatus("dragging")
    }
  }, [status])

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (status === "dragging") {
        setStatus("idle")
      }
    },
    [status],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (status === "uploading" || status === "success") return

      setStatus("idle")
      const droppedFile = e.dataTransfer.files?.[0]
      if (droppedFile) {
        handleFileSelect(droppedFile)
      }
    },
    [status, handleFileSelect],
  )

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wasCapture = !!captureMode
    if (captureMode) {
      setCaptureMode(false)
    }

    const selectedFile = e.target.files?.[0]
    if (e.target) e.target.value = ""

    if (!selectedFile) {
      if (wasCapture) {
        // User cancelled camera, reset state
        resetState()
      }
      return
    }

    if (wasCapture) {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser.", { position: "top-center" })
        return
      }

      toast.info("Getting your location...", { position: "top-center" })

      navigator.geolocation.getCurrentPosition(
        (position) => {
          capturedLocation.current = { lat: position.coords.latitude, lng: position.coords.longitude }
          toast.success("Location found.", { position: "top-center" })
          handleFileSelect(selectedFile)
        },
        (error) => {
          console.error("Error getting location", error)
          toast.error("Could not get your location.", {
            description: "Please enable location services and try again.",
            position: "top-center",
          })
          resetState()
          reportToSentry(new Error("Could not get your location."), {
            userAgent: navigator.userAgent,
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      handleFileSelect(selectedFile)
    }
  }

  const triggerFileInput = () => {
    if (status === "uploading" || status === "success") return
    fileInputRef.current?.click()
  }

  const resetState = useCallback(() => {
    setFile(null)
    setStatus("idle")
    setProgress(0)
    setError(null)
    setPreviewUrl(null)
    setCaptureMode(false)
    setExif(null);
  }, [])

  const handleRemoveFile = useCallback(() => {
    resetState()
    if (onFileRemove) onFileRemove()
  }, [resetState, onFileRemove])

  useEffect(() => {
    // This effect makes cancellation of the file dialog more robust on both desktop and mobile.
    // It listens for the page to become visible again ('visibilitychange') or for the window
    // to regain focus ('focus'). This covers different browser/OS behaviors when the
    // camera or file dialog is closed.
    const handleCancelCheck = () => {
      // A timeout gives the 'change' event a moment to fire first.
      setTimeout(() => {
        // If captureMode is still active, it means the 'change' event didn't fire.
        // This implies the user cancelled, so we reset the state.
        if (captureMode && fileInputRef.current && !fileInputRef.current.files?.length) {
          resetState()
        }
      }, 300)
    }

    if (captureMode) {
      document.addEventListener("visibilitychange", handleCancelCheck)
      window.addEventListener("focus", handleCancelCheck)
    }

    return () => {
      document.removeEventListener("visibilitychange", handleCancelCheck)
      window.removeEventListener("focus", handleCancelCheck)
    }
  }, [captureMode, resetState])

  const handleCaptureClick = () => {
    setCaptureMode("environment")
  }

  const formatBytes = (bytes: number, decimals = 2): string => {
    if (!+bytes) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i] || "Bytes"}`
  }

  return {
    file,
    status,
    progress,
    error,
    previewUrl,
    fileInputRef,
    captureMode,
    isMobile,
    formatBytes,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    triggerFileInput,
    resetState,
    handleRemoveFile,
    handleCaptureClick,
  }
} 