"use client"

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

import { useUploadCore, type UploadCoreOptions, type UploadCallbacks } from "./use-upload-core";
import { useIsMobile } from "@/components/ui/use-mobile";

export type UploadStatus = "idle" | "dragging" | "uploading" | "success" | "error"

export interface FileUploadHookProps extends UploadCoreOptions {
  onFileRemove?: () => void
}

export function useFileUpload(options: FileUploadHookProps = {}) {
  const {
    onFileRemove,
    ...coreOptions
  } = options;

  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [captureMode, setCaptureMode] = useState<"user" | "environment" | false>(false)
  const isMobile = useIsMobile()

  const uploadCore = useUploadCore(coreOptions);

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

  const resetState = useCallback(() => {
    setFile(null)
    setStatus("idle")
    setProgress(0)
    setError(null)
    setPreviewUrl(null)
    setCaptureMode(false)
  }, [])

  const handleFileSelect = useCallback(
    async (selectedFile: File | null) => {
      if (!selectedFile) {
        setFile(null)
        return
      }

      // Basic validation first
      const validation = uploadCore.validateFile(selectedFile);
      if (!validation.valid) {
        setError(validation.error || "File validation failed");
        setStatus("error");
        return;
      }

      setFile(selectedFile)
      setError(null)
      setStatus("uploading")
      setProgress(0)
      simulateUpload()

      try {

        // Extract location from EXIF data
        const exifData = await uploadCore.extractExifData(selectedFile);
        if (!exifData) {
          toast.error("No GPS data found in image", {
            description: "Please use the 'Capture Photo' option or ensure EXIF data is present.",
            position: "top-center",
          });
          resetState();
          return;
        }

        const locationValidation = uploadCore.validateLocation(exifData);
        if (!locationValidation.valid) {
          toast.error(locationValidation.error || "Location validation failed", {
            description: locationValidation.error === `Image is not in ${process.env.NEXT_PUBLIC_CITY_NAME}. Please upload the image from ${process.env.NEXT_PUBLIC_CITY_NAME}.` 
              ? `This is to ensure that the image is relevant to the city of ${process.env.NEXT_PUBLIC_CITY_NAME}.`
              : "Please ensure the image has GPS data.",
            position: "top-center",
          });
          resetState();
          return;
        }

        // Setup upload callbacks
        const callbacks: UploadCallbacks = {
          onProgress: (file, uploadProgress) => {
            setProgress(uploadProgress);
          },
          onSuccess: (file) => {
            setProgress(100);
            setStatus("success");
            toast.success("GPS data found", { 
              description: "Image uploaded successfully!", 
              position: "top-center" 
            });
          },
          onError: (file, error) => {
            let errorMessage = "Error uploading image";
            let errorDescription = "Please try again later";

            if (error.message.includes("GPS data")) {
              errorMessage = "No GPS data found";
              errorDescription = "Please ensure the image has GPS data.";
            } else if (error.message.includes("upload token")) {
              errorMessage = "Failed to generate upload token";
              errorDescription = "Please try again later.";
            } else if (error.message.includes(process.env.NEXT_PUBLIC_CITY_NAME || "")) {
              errorMessage = `Image is not in ${process.env.NEXT_PUBLIC_CITY_NAME}`;
              errorDescription = `Please upload the image from ${process.env.NEXT_PUBLIC_CITY_NAME}.`;
            }

            toast.error(errorMessage, { 
              description: errorDescription, 
              position: "top-center" 
            });
            resetState();
          },
        };

        // Perform the upload
        await uploadCore.uploadSingleFile(selectedFile, callbacks);

      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Upload failed", {
          description: "Please try again later.",
          position: "top-center",
        });
        resetState();
      }
    },
    [uploadCore, resetState],
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

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // Handle regular file selection
    handleFileSelect(selectedFile)
  }

  const triggerFileInput = () => {
    if (status === "uploading" || status === "success") return
    fileInputRef.current?.click()
  }

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

  return {
    file,
    status,
    progress,
    error,
    previewUrl,
    fileInputRef,
    captureMode,
    isMobile,
    formatBytes: uploadCore.formatBytes,
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