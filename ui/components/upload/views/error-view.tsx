import { motion } from "motion/react"
import { X } from "lucide-react"

interface ErrorViewProps {
  error: string | null
  resetState: () => void
}

export function ErrorView({ error, resetState }: ErrorViewProps) {
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col items-center text-center text-red-600 dark:text-red-500"
      role="alert"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <X className="w-12 h-12 mb-3" aria-hidden="true" />
      </motion.div>
      <p className="text-sm font-medium mb-1">Upload Failed</p>
      <p className="text-xs mb-4 max-w-xs">{error || "An unknown error occurred."}</p>
      <button
        onClick={resetState}
        type="button"
        className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 rounded-lg transition-all duration-300 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
        aria-label="Try uploading again"
      >
        Try Again
      </button>
    </motion.div>
  )
} 