"use client"

import { memo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Facebook } from "lucide-react"
import { useFacebookAccounts } from "@/contexts/facebook-accounts-context"

function ConnectedAccountContentComponent() {
  const { accounts } = useFacebookAccounts()
  const [hasConnectedAccounts, setHasConnectedAccounts] = useState(false)

  useEffect(() => {
    // Check if there are any accounts
    setHasConnectedAccounts(accounts.length > 0)
  }, [accounts])

  const handleFacebookLogin = () => {
    window.dispatchEvent(new CustomEvent("open-facebook-login-modal"))
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (dateString.includes("Today") || dateString.includes("Yesterday")) {
      return dateString.split(",")[0]
    }

    // Convert "2 days ago", "1 week ago", "2 weeks ago" to a date format
    if (dateString.includes("days ago")) {
      const days = Number.parseInt(dateString.split(" ")[0])
      const date = new Date()
      date.setDate(date.getDate() - days)
      return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`
    }

    if (dateString.includes("week ago") || dateString.includes("weeks ago")) {
      const weeks = Number.parseInt(dateString.split(" ")[0])
      const date = new Date()
      date.setDate(date.getDate() - weeks * 7)
      return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`
    }

    return dateString
  }

  // Format time for display
  const formatTime = (dateString: string) => {
    if (dateString.includes(",")) {
      return dateString.split(",")[1].trim()
    }
    return "10:00 Eastern" // Default time if not available
  }

  return (
    <div className="p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-semibold mb-6">Connected Account</h1>

        {hasConnectedAccounts ? (
          <div className="mt-6">
            <h2 className="text-xl font-medium mb-4">Facebook Accounts</h2>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <div>Account Name</div>
                <div>Account ID</div>
                <div>Date & Time</div>
                <div>Status</div>
              </div>

              {/* Table Content */}
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="grid grid-cols-4 gap-4 p-4 text-sm border-b border-gray-200 dark:border-gray-800 last:border-0"
                >
                  <div className="font-medium flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full ${account.color} flex items-center justify-center text-white font-medium`}
                    >
                      {account.shortName}
                    </div>
                    <span>{account.name}</span>
                  </div>
                  <div>{account.id.padStart(11, "8")}</div>
                  <div>
                    <div>{formatDate(account.lastActive)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{formatTime(account.lastActive)}</div>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        account.status === "active"
                          ? "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400"
                          : account.status === "paused"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {account.status === "active" ? "CONNECTED" : account.status === "paused" ? "PAUSED" : "LIMITED"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                className="h-10 flex items-center gap-2 dark:border-gray-700 dark:hover:bg-gray-700"
                onClick={handleFacebookLogin}
              >
                <Facebook className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Connect Another Account
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-10 md:mt-20">
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
              You don't have any connected Facebook accounts yet. Connect your account to get started.
            </p>
            <Button
              variant="outline"
              className="w-full max-w-md h-12 flex items-center gap-2 dark:border-gray-700 dark:hover:bg-gray-700"
              onClick={handleFacebookLogin}
            >
              <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Sign In with Facebook
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export const ConnectedAccountContent = memo(ConnectedAccountContentComponent)
