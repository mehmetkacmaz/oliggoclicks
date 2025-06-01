"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon, User, LogOut } from "lucide-react"

export function UserSettingsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [firstName, setFirstName] = useState("John Tristan")
  const [lastName, setLastName] = useState("Ward")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true)
    window.addEventListener("open-user-settings-modal", handleOpenModal)

    return () => {
      window.removeEventListener("open-user-settings-modal", handleOpenModal)
    }
  }, [])

  const handleSave = () => {
    setLoading(true)

    // Simulate saving
    setTimeout(() => {
      setLoading(false)
      setIsOpen(false)
      // You would typically handle the actual save here
      console.log("User settings saved:", { firstName, lastName })
    }, 1000)
  }

  const handleSignOut = () => {
    window.location.href = "/"
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>User Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <Button variant="ghost" className="text-blue-600">
                <PlusIcon className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="sm:flex-1 dark:border-gray-700 dark:text-gray-300"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="sm:flex-1 bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>

        <div className="pt-4 border-t dark:border-gray-800 mt-4">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-2 text-red-500"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
