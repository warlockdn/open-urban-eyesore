import { motion } from "motion/react"
import { FileIcon } from "lucide-react"

interface UploadingViewProps {
  file: File
  progress: number
  resetState: () => void
}

const progressVariants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: (progress: number) => ({
    pathLength: progress / 100,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  }),
}

export function UploadingView({ file, progress, resetState }: UploadingViewProps) {
  return (
    <motion.div
      key="uploading"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full flex flex-col items-center"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-16 h-16 mb-4 relative flex items-center justify-center">
        <motion.svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 36 36"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          aria-label="Upload progress indicator"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-zinc-100 dark:text-zinc-800" strokeWidth="2.5" />
          <motion.circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-violet-500 dark:text-violet-400"
            strokeWidth="2.5"
            strokeDasharray="100"
            variants={progressVariants as any}
            initial="initial"
            animate="animate"
            custom={progress}
          />
        </motion.svg>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
        >
          <FileIcon className="w-8 h-8 absolute text-violet-600 dark:text-violet-400" aria-hidden="true" />
        </motion.div>
      </div>
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1 truncate max-w-[200px]" title={file.name}>
        {file.name}
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Uploading... {Math.round(progress)}%</p>
      <button
        onClick={resetState}
        type="button"
        className="mt-4 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-md border border-red-200/50 dark:border-red-800/50 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-300"
        aria-label="Cancel upload"
      >
        Cancel
      </button>
    </motion.div>
  )
} 