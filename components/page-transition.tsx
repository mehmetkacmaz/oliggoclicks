"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  // Sayfa değiştiğinde yükleme durumunu göster
  useEffect(() => {
    setIsLoading(true)

    // Kısa bir gecikme ile yeni içeriği göster (daha iyi UX için)
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <div className="relative w-full h-full min-h-[80vh]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
          <LoadingSpinner size="lg" />
        </div>
      )}
      <div className={isLoading ? "opacity-50 transition-opacity duration-200" : ""}>{displayChildren}</div>
    </div>
  )
}
