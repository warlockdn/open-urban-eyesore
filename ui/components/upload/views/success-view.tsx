import { motion } from "motion/react"
import { CheckCircle } from "lucide-react"

interface SuccessViewProps {
  file: File
  formatBytes: (bytes: number) => string
  resetState: () => void
}

const successIconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
}

export function SuccessView({ file, formatBytes, resetState }: SuccessViewProps) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col items-center text-center"
      aria-live="polite"
    >
      <div className="relative mb-4">
        <motion.div
          className="absolute inset-0 blur-2xl bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.5 }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
        />
        <motion.div variants={successIconVariants as any} initial="initial" animate="animate">
          <CheckCircle className="w-16 h-16 text-emerald-500 dark:text-emerald-400 relative z-10 drop-shadow-lg" aria-label="Success" />
        </motion.div>
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Upload Successful!</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 truncate max-w-[200px]" title={file.name}>
        {file.name} ({formatBytes(file.size)})
      </p>
      <button
        onClick={resetState}
        type="button"
        className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/20 dark:shadow-violet-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
        aria-label="Upload another file"
      >
        Upload Another File
      </button>
    </motion.div>
  )
} 