"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Mevcut içerik türlerini tanımlayalım
export type ContentType = "dashboard" | "recording" | "settings" | "data" | "fraud-detection"

interface DashboardContextType {
  activeContent: ContentType
  setActiveContent: (content: ContentType) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeContent, setActiveContent] = useState<ContentType>("dashboard")

  return <DashboardContext.Provider value={{ activeContent, setActiveContent }}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
