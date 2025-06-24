import { motion } from "motion/react"
import { FileIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface FilePreviewProps {
  file: File
  previewUrl: string | null
  formatBytes: (bytes: number) => string
  handleRemoveFile: () => void
}

export function FilePreview({ file, previewUrl, formatBytes, handleRemoveFile }: FilePreviewProps) {
  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col items-center text-center w-full"
      aria-live="polite"
    >
      {previewUrl && (
        <motion.div
          className="relative w-32 h-32 mb-4 rounded-lg overflow-hidden ring-2 ring-violet-500/20"
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <img src={previewUrl} alt={`Preview of ${file.name}`} className="w-full h-full object-cover" />
        </motion.div>
      )}
      {!previewUrl && <FileIcon className="w-16 h-16 mb-4 text-violet-500" aria-hidden="true" />}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Current File</h3>
      <div className="w-full max-w-xs bg-zinc-50/50 dark:bg-zinc-800/50 rounded-lg p-3 mb-4 backdrop-blur-sm">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2 truncate" title={file.name}>
          {file.name}
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col space-y-1">
            <span className="text-zinc-500 dark:text-zinc-400">Size</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{formatBytes(file.size)}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-zinc-500 dark:text-zinc-400">Type</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {file.type.split("/")[1]?.toUpperCase() || "Unknown"}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-zinc-500 dark:text-zinc-400">Modified</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{new Date(file.lastModified).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-zinc-500 dark:text-zinc-400">Status</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Uploaded</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleRemoveFile} aria-label="Upload Another">
          Upload Another
        </Button>
      </div>
    </motion.div>
  )
} 