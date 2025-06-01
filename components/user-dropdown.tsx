"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings, LogOut, ShieldCheck } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"

export function UserDropdown() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useUser()
  const router = useRouter()

  const handleUserSettings = () => {
    window.dispatchEvent(new CustomEvent("open-user-settings-modal"))
    setOpen(false)
  }

  const handleSignOut = () => {
    logout()
    router.push("/")
    setOpen(false)
  }

  if (!user) return null

  // Kullanıcı adının baş harflerini al
  const initials = `${user.name.charAt(0)}${user.surname.charAt(0)}`.toUpperCase()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-800">
          <div className="relative">
            {/* Profil fotoğrafını daha görünür hale getirdik */}
            <div className="rounded-full h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm shadow-md border-2 border-blue-400 dark:border-blue-700">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></span>
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium">
              {user.name} {user.surname}
            </span>
            {/* Security Analyst text removed */}
          </div>
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 dark:bg-gray-900 dark:border-gray-800" align="end">
        <div className="grid gap-1">
          <Button variant="ghost" className="flex items-center justify-start gap-2" onClick={handleUserSettings}>
            <Settings className="h-4 w-4" />
            <span>User Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-2 text-red-500"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
