"use client"

import { useState, memo } from "react"
import { cn } from "@/lib/utils"
import {
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash2,
  Shield,
  LayoutDashboard,
  Video,
  Settings,
  Database,
  BarChart2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserDropdown } from "@/components/user-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedLogo } from "@/components/animated-logo"
import { useDashboard, type ContentType } from "@/contexts/dashboard-context"
import { useFacebookAccounts } from "@/contexts/facebook-accounts-context"
import { AccountSelectionIndicator } from "./account-selection-indicator"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { FacebookAccountEditModal } from "./facebook-account-edit-modal"
import { FacebookDisconnectModal } from "./facebook-disconnect-modal"

// Route'ları bileşen dışında tanımlayarak gereksiz yeniden oluşturmaları önlüyoruz
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

function MobileSidebarComponent() {
  const [open, setOpen] = useState(false)
  const { activeContent, setActiveContent } = useDashboard()
  const { accounts, activeAccountId, setActiveAccountId } = useFacebookAccounts()
  const [isAccountsExpanded, setIsAccountsExpanded] = useState(false)
  const { user } = useUser()
  const router = useRouter()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)
  const [editAccountId, setEditAccountId] = useState<string | null>(null)
  const [disconnectAccountId, setDisconnectAccountId] = useState<string | null>(null)

  const isAdmin = user?.type === "admin"

  const handleMenuItemClick = (contentType: ContentType) => {
    setActiveContent(contentType)
    setOpen(false)
  }

  const toggleAccountsExpanded = () => {
    setIsAccountsExpanded(!isAccountsExpanded)
  }

  const handleAdminClick = () => {
    router.push("/admin")
    setOpen(false)
  }

  // Düzenleme modalını aç
  const handleEditAccount = (id: string) => {
    setEditAccountId(id)
    setIsEditModalOpen(true)
  }

  // Disconnect modalını aç
  const handleDisconnectAccount = (id: string) => {
    setDisconnectAccountId(id)
    setIsDisconnectModalOpen(true)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300 w-[85vw] max-w-[320px]"
        >
          <div className="flex h-14 items-center border-b px-4 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <AnimatedLogo size="sm" />
              <span className="text-xl font-semibold">Oliggo</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Facebook Accounts Section */}
          <div className="px-2 py-4 border-b dark:border-gray-800">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Facebook Accounts</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleAccountsExpanded}>
                {isAccountsExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>

            <div className={`grid ${isAccountsExpanded ? "grid-cols-4" : "grid-cols-3"} gap-2 mt-2`}>
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setActiveAccountId(account.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-200 overflow-hidden relative ${account.color}`}
                  title={account.name}
                >
                  {account.shortName}
                  <AccountSelectionIndicator isActive={account.id === activeAccountId} />
                </button>
              ))}

              {/* Add Account Button */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-facebook-login-modal"))}
                className="w-10 h-10 rounded-full bg-transparent border border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Add Facebook Account"
              >
                +
              </button>
            </div>

            {/* Expanded Account Info */}
            {isAccountsExpanded && activeAccountId && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {accounts.find((acc) => acc.id === activeAccountId) && (
                  <div className="text-sm">
                    <div className="font-medium mb-1">{accounts.find((acc) => acc.id === activeAccountId)?.name}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      Last active: {accounts.find((acc) => acc.id === activeAccountId)?.lastActive}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs"
                        onClick={() => handleEditAccount(activeAccountId)}
                      >
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 h-8 text-xs"
                        onClick={() => handleDisconnectAccount(activeAccountId)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Disconnect
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="grid items-start px-2 py-4">
            {menuItems.map((item, index) => {
              const isActive = activeContent === item.contentType

              return (
                <button
                  key={index}
                  onClick={() => handleMenuItemClick(item.contentType)}
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

          <div className="p-4 border-t dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>
            <UserDropdown />
          </div>
        </SheetContent>
      </Sheet>

      {/* Düzenleme modalı */}
      <FacebookAccountEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        accountId={editAccountId}
      />

      {/* Disconnect modalı */}
      <FacebookDisconnectModal
        isOpen={isDisconnectModalOpen}
        onClose={() => setIsDisconnectModalOpen(false)}
        accountId={disconnectAccountId}
      />
    </>
  )
}

// Gereksiz yeniden render'ları önlemek için memo kullanıyoruz
export const MobileSidebar = memo(MobileSidebarComponent)
