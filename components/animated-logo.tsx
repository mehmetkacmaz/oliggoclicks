"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AnimatedLogo({ size = "md", className = "" }: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)
  const animationCompletedRef = useRef(false)

  // Sizes based on the size prop
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  // Run initial animation once on mount
  useEffect(() => {
    // Animasyonu başlat
    setIsAnimating(true)

    // 2 saniye sonra animasyonu tamamla
    const timer = setTimeout(() => {
      setIsAnimating(false)
      animationCompletedRef.current = true
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // SVG path for the "O" shape
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.2 },
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  }

  // Inner arc animation
  const innerArcVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0, delay: 0.5 },
        opacity: { duration: 0.2, delay: 0.5 },
      },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.3 },
    },
  }

  // Circle pulse animation
  const circleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        scale: { type: "spring", duration: 1, bounce: 0.4 },
        opacity: { duration: 0.4 },
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 8px rgba(66, 153, 225, 0.6)",
      transition: { duration: 0.3 },
    },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: 1, // Ensure opacity is always 1 during pulse
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleClick = () => {
    // Trigger animation again on click
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
    }, 2000)
  }

  return (
    <motion.div
      className={`${sizes[size]} rounded-full bg-blue-600 flex items-center justify-center ${className}`}
      variants={circleVariants}
      initial="hidden"
      animate={isHovered ? "hover" : isAnimating ? "visible" : "pulse"}
      style={{ opacity: 1 }} // Ensure the logo always remains visible
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        width="65%"
        height="65%"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <motion.path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate={isHovered ? "hover" : isAnimating ? "visible" : "visible"}
        />
        <motion.path
          d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={innerArcVariants}
          initial="hidden"
          animate={isHovered ? "hover" : isAnimating ? "visible" : "visible"}
        />
      </svg>
    </motion.div>
  )
}
