"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Activity, AlertTriangle, CheckCircle, Lock, Unlock } from "lucide-react"

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  userData: {
    id: string
    name: string
    email: string
    lastActive: string
    activityLevel: number
    isRestricted: boolean
  }
  onRestrict: () => void
  onUnrestrict: () => void
}

export function UserDetailsModal({ isOpen, onClose, userData, onRestrict, onUnrestrict }: UserDetailsModalProps) {
  const [loading, setLoading] = useState(false)

  const handleAction = (action: "restrict" | "unrestrict") => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (action === "restrict") {
        onRestrict()
      } else {
        onUnrestrict()
      }
      setLoading(false)
      onClose()
    }, 800)
  }

  // Calculate activity level color
  const getActivityColor = (level: number) => {
    if (level < 30) return "text-red-500"
    if (level < 70) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">{userData.name}</h3>
            <Badge variant={userData.isRestricted ? "destructive" : "outline"}>
              {userData.isRestricted ? "Restricted" : "Active"}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
              </div>
              <div className="text-sm font-medium">{userData.email}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">Last Active:</span>
              </div>
              <div className="text-sm font-medium">{userData.lastActive}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">Activity Level:</span>
              </div>
              <div className={`text-sm font-medium ${getActivityColor(userData.activityLevel)}`}>
                {userData.activityLevel}%
              </div>
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded-md border dark:bg-gray-800 dark:border-gray-700">
              <h4 className="text-sm font-medium mb-2">Security Assessment</h4>
              <div className="flex items-center gap-2">
                {userData.isRestricted ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">Suspicious activity detected from this user</span>
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
            {userData.isRestricted ? (
              <Button
                variant="outline"
                className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                onClick={() => handleAction("unrestrict")}
                disabled={loading}
              >
                <Unlock className="h-4 w-4 mr-2" />
                {loading ? "Processing..." : "Remove Restriction"}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={() => handleAction("restrict")}
                disabled={loading}
              >
                <Lock className="h-4 w-4 mr-2" />
                {loading ? "Processing..." : "Restrict User"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
