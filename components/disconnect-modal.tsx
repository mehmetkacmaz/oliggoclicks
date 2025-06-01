"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Facebook, AlertTriangle } from "lucide-react"

export function DisconnectModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true)
    window.addEventListener("open-disconnect-modal", handleOpenModal)

    return () => {
      window.removeEventListener("open-disconnect-modal", handleOpenModal)
    }
  }, [])

  const handleDisconnect = () => {
    setLoading(true)

    // Simulate disconnect process
    setTimeout(() => {
      setLoading(false)
      setIsOpen(false)

      // You would typically handle the actual disconnect here
      console.log("Facebook account disconnected")
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            <span>Connected Facebook Account</span>
          </DialogTitle>
          <DialogDescription>
            You are currently connected with the Facebook account <span className="font-medium">Demo Account</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center p-3 bg-amber-50 rounded-md border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Disconnecting will remove access to your Facebook account data and features.
            </p>
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
          <Button variant="destructive" onClick={handleDisconnect} className="sm:flex-1" disabled={loading}>
            {loading ? "Disconnecting..." : "Disconnect Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
