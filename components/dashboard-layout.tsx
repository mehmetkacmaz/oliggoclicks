"use client"

import { memo, type ReactNode, useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedLogo } from "@/components/animated-logo"
import { PageTransition } from "@/components/page-transition"
import { FacebookAccountsPanel } from "@/components/facebook-accounts-panel"
import { FacebookAccountsProvider } from "@/contexts/facebook-accounts-context"
import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: ReactNode
}

function DashboardLayoutComponent({ children }: DashboardLayoutProps) {
  const [isBlueBarExpanded, setIsBlueBarExpanded] = useState(false)
  const isMobile = useIsMobile()

  const toggleBlueBar = () => {
    setIsBlueBarExpanded(!isBlueBarExpanded)
  }

  // Ekran boyutu değiştiğinde mavi çubuğu otomatik olarak daralt
  useEffect(() => {
    if (isMobile && isBlueBarExpanded) {
      setIsBlueBarExpanded(false)
    }
  }, [isMobile, isBlueBarExpanded])

  return (
    <FacebookAccountsProvider>
      <div className="flex min-h-screen">
        {/* Mobile sidebar button */}
        <div className="fixed top-0 left-0 z-50 w-full bg-white border-b md:hidden dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center h-14 px-4">
            <MobileSidebar />
            <div className="flex items-center gap-2 ml-2">
              <AnimatedLogo size="sm" />
              <span className="text-xl font-semibold">Oliggo</span>
            </div>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <motion.div
          className="hidden md:flex bg-blue-600 flex-col items-center justify-between py-4 flex-shrink-0 dark:bg-blue-800"
          animate={{
            width: isBlueBarExpanded ? "240px" : "70px",
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center w-full">
            <FacebookAccountsPanel isExpanded={isBlueBarExpanded} onToggleExpand={toggleBlueBar} />
          </div>

          {/* Theme toggle at the bottom */}
          <div className="mt-auto mb-4">
            <ThemeToggle />
          </div>
        </motion.div>
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 md:pt-0 pt-14 dark:bg-gray-900 dark:text-white transition-colors duration-300">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </FacebookAccountsProvider>
  )
}

// Gereksiz yeniden render'ları önlemek için memo kullanıyoruz
export const DashboardLayout = memo(DashboardLayoutComponent)
