"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

interface AdminLayoutProps {
  children: ReactNode
  activeView: string
  onViewChange: (view: string) => void
}

export function AdminLayout({ children, activeView, onViewChange }: AdminLayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - fixed position */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="fixed h-screen w-64">
          <AdminSidebar className="h-full" activeView={activeView} onViewChange={onViewChange} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 h-14 flex items-center px-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              Help
            </Button>
            <ThemeToggle className="bg-transparent text-gray-700 dark:text-gray-300" />
          </div>
        </header>

        {/* Content - scrollable */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
