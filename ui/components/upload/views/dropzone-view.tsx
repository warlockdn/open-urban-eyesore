import type React from "react"
import { motion } from "motion/react"
import { UploadCloud, Camera } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { UploadStatus } from "@/hooks/use-file-upload"

interface DropzoneViewProps {
  status: UploadStatus
  isMobile: boolean
  acceptedFileTypes?: string[]
  maxFileSize?: number
  formatBytes: (bytes: number) => string
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  triggerFileInput: () => void
  handleCaptureClick: () => void
}

const dropzoneVariants = {
  idle: { scale: 1, borderColor: "var(--border-color)", backgroundColor: "var(--bg-color)" },
  dragging: {
    scale: 1.02,
    borderColor: "var(--primary-color)",
    backgroundColor: "var(--primary-bg)",
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
}

const iconVariants = {
  idle: { y: 0, scale: 1 },
  dragging: {
    y: -5,
    scale: 1.1,
    transition: { repeat: Infinity, repeatType: "reverse" as const, duration: 1, ease: "easeInOut" },
  },
}

export function DropzoneView({
  status,
  isMobile,
  acceptedFileTypes,
  maxFileSize,
  formatBytes,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  triggerFileInput,
  handleCaptureClick,
}: DropzoneViewProps) {
  return (
    <motion.div
      key="dropzone"
      variants={dropzoneVariants as any}
      initial="idle"
      animate={status === "dragging" ? "dragging" : "idle"}
      className={`
        w-full h-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg
        transition-all duration-500 ease-in-out backdrop-blur-sm relative overflow-hidden
        ${
          status === "dragging"
            ? "border-violet-500 dark:border-violet-400 bg-violet-50/20 dark:bg-violet-500/10"
            : "border-zinc-200/50 dark:border-zinc-800/50 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50/10 dark:hover:bg-violet-500/5 group cursor-pointer"
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
        (e.key === "Enter" || e.key === " ") && (e.preventDefault(), triggerFileInput())
      }
      aria-label="File upload dropzone"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.02] via-transparent to-violet-500/[0.02] dark:from-violet-400/[0.02] dark:to-violet-400/[0.02] animate-shimmer" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.02),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.03),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </div>
      <motion.div variants={iconVariants as any} initial="idle" animate={status === "dragging" ? "dragging" : "idle"}>
        <UploadCloud
          className={`
            w-12 h-12 mb-4 transform transition-all duration-500 ease-out
            ${
              status === "dragging"
                ? "text-violet-600 dark:text-violet-400"
                : "text-zinc-400 dark:text-zinc-500 group-hover:text-violet-500 group-hover:translate-y-[-2px]"
            }
          `}
          aria-label="Upload cloud icon"
        />
      </motion.div>
      <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400 transition-all duration-500">
        <span className="font-semibold text-violet-600/90 dark:text-violet-400/90 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-500">
          Click to upload
        </span>{" "}
        or drag and drop
      </p>
      <p className="text-xs text-zinc-500/90 dark:text-zinc-500/90 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors duration-500">
        {acceptedFileTypes && acceptedFileTypes.length > 0
          ? `Accepted: ${acceptedFileTypes.map((t) => t.split("/")[1]).join(", ")}`
          : "SVG, PNG, JPG or GIF"}{" "}
        {maxFileSize && `(Max ${formatBytes(maxFileSize)})`}
      </p>
      {/* {isMobile && (
        <>
          <div className="relative flex items-center my-4 w-full max-w-xs">
            <div className="flex-grow border-t border-zinc-300 dark:border-zinc-700" />
            <span className="flex-shrink mx-4 text-xs text-zinc-500 dark:text-zinc-400">OR</span>
            <div className="flex-grow border-t border-zinc-300 dark:border-zinc-700" />
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleCaptureClick()
            }}
            size="lg"
            variant="blue"
            className="gap-2"
          >
            <Camera className="w-4 h-4" />
            Capture Photo
          </Button>
        </>
      )} */}
    </motion.div>
  )
} 