"use client"

import { motion } from "framer-motion"

interface AccountSelectionIndicatorProps {
  isActive: boolean
}

export function AccountSelectionIndicator({ isActive }: AccountSelectionIndicatorProps) {
  if (!isActive) return null

  return (
    <motion.div
      className="absolute inset-0 rounded-full border-2 border-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )
}
