"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardProvider } from "@/contexts/dashboard-context"
import { DashboardContent } from "@/components/dashboard-content"
import { SettingsContent } from "@/components/settings-content"
import { RecordingContent } from "@/components/recording-content"
import { DataContent } from "@/components/data-content"
import { FraudDetectionContent } from "@/components/fraud-detection-content"
import { useDashboard } from "@/contexts/dashboard-context"
import { useEffect } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { FacebookAccountsProvider } from "@/contexts/facebook-accounts-context"

// İçerik bileşenini seçen yardımcı bileşen
function ContentSelector() {
  const { activeContent } = useDashboard()

  // İçerik değiştiğinde yumuşak bir geçiş efekti için
  useEffect(() => {
    // Sayfayı en üste kaydır
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [activeContent])

  switch (activeContent) {
    case "dashboard":
      return <DashboardContent />
    case "recording":
      return <RecordingContent />
    case "settings":
      return <SettingsContent />
    case "data":
      return <DataContent />
    case "fraud-detection":
      return <FraudDetectionContent />
    default:
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <LoadingSpinner size="lg" />
        </div>
      )
  }
}

export default function DashboardPage() {
  return (
    <FacebookAccountsProvider>
      <DashboardProvider>
        <DashboardLayout>
          <ContentSelector />
        </DashboardLayout>
      </DashboardProvider>
    </FacebookAccountsProvider>
  )
}
