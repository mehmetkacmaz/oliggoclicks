"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, Shield, LayoutDashboard, Video, Settings, Database, BarChart2 } from "lucide-react"
import { UserDropdown } from "@/components/user-dropdown"
import { AnimatedLogo } from "@/components/animated-logo"
import { useDashboard, type ContentType } from "@/contexts/dashboard-context"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"

interface SidebarProps {
  collapsed?: boolean
  onCollapse?: () => void
}

// Sidebar route'larını bileşen dışında tanımlayarak gereksiz yeniden oluşturmaları önlüyoruz
const menuItems = [
  {
    label: "Dashboard",
    contentType: "dashboard" as ContentType,
    icon: LayoutDashboard,
  },
  {
    label: "Recording & Ip Adress",
    contentType: "recording" as ContentType,
    icon: Video,
  },
  {
    label: "Data",
    contentType: "data" as ContentType,
    icon: Database,
  },
  {
    label: "Fraud Detection",
    contentType: "fraud-detection" as ContentType,
    icon: Shield,
  },
  {
    label: "Settings",
    contentType: "settings" as ContentType,
    icon: Settings,
  },
]

function SidebarComponent({ collapsed = false, onCollapse }: SidebarProps) {
  const { activeContent, setActiveContent } = useDashboard()
  const { user } = useUser()
  const router = useRouter()

  const isAdmin = user?.type === "admin"

  const handleAdminClick = () => {
    router.push("/admin")
  }

  return (
    <div className="flex h-full flex-col bg-white border-r w-64 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
      <div className="flex h-14 items-center border-b px-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <AnimatedLogo size="sm" />
          {!collapsed && <span className="text-xl font-semibold">Oliggo</span>}
        </div>
        {onCollapse && (
          <button
            onClick={onCollapse}
            className="ml-auto rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Collapse</span>
          </button>
        )}
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 py-4">
          {menuItems.map((item, index) => {
            const isActive = activeContent === item.contentType

            return (
              <button
                key={index}
                onClick={() => setActiveContent(item.contentType)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-blue-600 dark:hover:text-blue-400 text-left w-full",
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/50 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400",
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </button>
            )
          })}

          {/* Admin butonu - sadece admin kullanıcılar için göster */}
          {isAdmin && (
            <button
              onClick={handleAdminClick}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-blue-600 dark:hover:text-blue-400 text-left w-full mt-2 text-gray-500 dark:text-gray-400"
            >
              <BarChart2 className="h-4 w-4" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>
      </div>
      <div className="p-4 pt-6 border-t dark:border-gray-800">
        <UserDropdown />
      </div>
    </div>
  )
}

// Gereksiz yeniden render'ları önlemek için memo kullanıyoruz
export const Sidebar = memo(SidebarComponent)
