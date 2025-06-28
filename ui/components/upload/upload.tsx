"use client"

import type React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { Toaster } from "sonner"

import { useFileUpload, type FileUploadHookProps } from "@/hooks/use-file-upload"
import { DropzoneView } from "./views/dropzone-view"
import { UploadingView } from "./views/uploading-view"
import { SuccessView } from "./views/success-view"
import { ErrorView } from "./views/error-view"
import { FilePreview } from "./views/file-preview"

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export default function FileUpload({
  onUploadError,
  acceptedFileTypes,
  maxFileSize,
  onFileRemove,
}: FileUploadHookProps) {
  const {
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
  } = useFileUpload({ onUploadError, acceptedFileTypes, maxFileSize, onFileRemove })

  const renderContent = () => {
    if (file && (status === "success" || status === "error")) {
      return (
        <FilePreview
          file={file}
          previewUrl={previewUrl}
          formatBytes={formatBytes}
          handleRemoveFile={handleRemoveFile}
        />
      )
    }

    switch (status) {
      case "idle":
      case "dragging":
        return (
          <DropzoneView
            status={status}
            isMobile={isMobile}
            acceptedFileTypes={acceptedFileTypes}
            maxFileSize={maxFileSize}
            formatBytes={formatBytes}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            triggerFileInput={triggerFileInput}
            handleCaptureClick={handleCaptureClick}
          />
        )
      case "uploading":
        return file ? <UploadingView file={file} progress={progress} resetState={resetState} /> : null
      case "awaiting-location":
      case "locating":
        return file ? <UploadingView file={file} progress={50} resetState={resetState} /> : null
      case "success":
        return file ? <SuccessView file={file} formatBytes={formatBytes} resetState={resetState} /> : null
      case "error":
        return <ErrorView error={error} resetState={resetState} />
      default:
        return null
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative"
      style={
        {
          "--border-color": "rgb(var(--zinc-200) / 0.5)",
          "--bg-color": "rgb(var(--zinc-50) / 0.3)",
          "--primary-color": "rgb(var(--violet-500))",
          "--primary-bg": "rgb(var(--violet-50) / 0.2)",
        } as React.CSSProperties
      }
    >
      <Card className="w-full max-w-xl mx-auto overflow-hidden min-h-[250px] flex flex-col bg-white dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/50 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50">
        <CardContent className="p-6 flex-1 flex flex-col items-center justify-center text-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 via-transparent to-sky-50/20 dark:from-violet-500/5 dark:via-transparent dark:to-sky-500/5" />
          <div className="relative z-10 w-full">
            <AnimatePresence mode="wait" initial={false}>
              {renderContent()}
            </AnimatePresence>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            onChange={handleFileInputChange}
            accept={acceptedFileTypes?.join(",")}
            aria-label="File input"
            capture={captureMode}
          />
        </CardContent>
      </Card>
      <Toaster richColors position="top-center" />
    </motion.div>
  )
}
