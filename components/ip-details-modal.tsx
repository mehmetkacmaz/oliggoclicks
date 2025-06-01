"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Globe, Monitor, Clock, MousePointer, Shield } from "lucide-react"

interface IpDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  ipData: {
    ip: string
    deviceId: string
    date: string
    time: string
    clicks: number
    isBlocked: boolean
  }
  onBlock: () => void
  onUnblock: () => void
}

export function IpDetailsModal({ isOpen, onClose, ipData, onBlock, onUnblock }: IpDetailsModalProps) {
  const [loading, setLoading] = useState(false)

  const handleAction = (action: "block" | "unblock") => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (action === "block") {
        onBlock()
      } else {
        onUnblock()
      }
      setLoading(false)
      onClose()
    }, 800)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            IP Address Details
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">{ipData.ip}</h3>
            <Badge variant={ipData.isBlocked ? "destructive" : "outline"}>
              {ipData.isBlocked ? "Blocked" : "Active"}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Monitor className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">Device ID:</span>
              </div>
              <div className="text-sm font-medium">{ipData.deviceId}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">Last Activity:</span>
              </div>
              <div className="text-sm font-medium">
                {ipData.date} at {ipData.time}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <MousePointer className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">Total Clicks:</span>
              </div>
              <div className="text-sm font-medium">{ipData.clicks}</div>
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded-md border dark:bg-gray-800 dark:border-gray-700">
              <h4 className="text-sm font-medium mb-2">Risk Assessment</h4>
              <div className="flex items-center gap-2">
                {ipData.isBlocked ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">High risk activity detected from this IP</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">No suspicious activity detected</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="dark:border-gray-700 dark:text-gray-300"
          >
            Close
          </Button>
          <div className="space-x-2">
            {ipData.isBlocked ? (
              <Button
                variant="outline"
                className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                onClick={() => handleAction("unblock")}
                disabled={loading}
              >
                <Shield className="h-4 w-4 mr-2" />
                {loading ? "Processing..." : "Unblock IP"}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={() => handleAction("block")}
                disabled={loading}
              >
                <Shield className="h-4 w-4 mr-2" />
                {loading ? "Processing..." : "Block IP"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
