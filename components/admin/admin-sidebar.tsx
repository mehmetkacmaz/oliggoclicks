"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, BarChart3, Settings, Shield, Bell, FileText, Activity, Database, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AnimatedLogo } from "@/components/animated-logo"
import { useRouter } from "next/navigation"

// AdminSidebar bileşenine onViewChange prop'u ekleyelim
interface AdminSidebarProps {
  className?: string
  activeView: string
  onViewChange: (view: string) => void
}

export function AdminSidebar({ className, activeView, onViewChange }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/admin",
      view: "dashboard",
      active: activeView === "dashboard",
    },
    {
      label: "User Management",
      icon: Users,
      href: "/admin/users",
      view: "users",
      active: activeView === "users",
    },
    {
      label: "Security",
      icon: Shield,
      href: "/admin/security",
      view: "security",
      active: activeView === "security",
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/admin/notifications",
      view: "notifications",
      active: activeView === "notifications",
      badge: 3,
    },
    {
      label: "Reports",
      icon: FileText,
      href: "/admin/reports",
      view: "reports",
      active: activeView === "reports",
    },
    {
      label: "Activity Logs",
      icon: Activity,
      href: "/admin/logs",
      view: "logs",
      active: activeView === "logs",
    },
    {
      label: "Database",
      icon: Database,
      href: "/admin/database",
      view: "database",
      active: activeView === "database",
    },
    {
      label: "API Access",
      icon: Globe,
      href: "/admin/api",
      view: "api",
      active: activeView === "api",
    },
    {
      label: "Roles & Permissions",
      icon: Lock,
      href: "/admin/roles",
      view: "roles",
      active: activeView === "roles",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      view: "settings",
      active: activeView === "settings",
    },
  ]

  const handleNavigation = (view: string) => {
    // View değişimini bildir
    onViewChange(view)
  }

  return (
    <div className={cn("flex flex-col h-full bg-gray-50 border-r dark:bg-gray-900 dark:border-gray-800", className)}>
      <div className="flex h-14 items-center border-b px-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <AnimatedLogo size="sm" />
          <span className="text-xl font-semibold">Admin</span>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1 py-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                route.active
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  : "",
              )}
              onClick={() => handleNavigation(route.view)}
            >
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
              {route.badge && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-400">
                  {route.badge}
                </span>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Super Admin</span>
          </div>
        </div>
      </div>
    </div>
  )
}
