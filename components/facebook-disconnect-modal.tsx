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
import { Facebook, AlertTriangle, Trash2 } from "lucide-react"
import { useFacebookAccounts } from "@/contexts/facebook-accounts-context"
import { useToast } from "@/hooks/use-toast"

interface FacebookDisconnectModalProps {
  isOpen: boolean
  onClose: () => void
  accountId: string | null
}

export function FacebookDisconnectModal({ isOpen, onClose, accountId }: FacebookDisconnectModalProps) {
  const [loading, setLoading] = useState(false)
  const { accounts, removeAccount } = useFacebookAccounts()
  const { toast } = useToast()
  const [accountToDisconnect, setAccountToDisconnect] = useState<any>(null)

  // Hesap bilgilerini yükle
  useEffect(() => {
    if (accountId && accounts.length > 0) {
      const foundAccount = accounts.find((acc) => acc.id === accountId)
      if (foundAccount) {
        setAccountToDisconnect(foundAccount)
      }
    } else {
      setAccountToDisconnect(null)
    }
  }, [accountId, accounts, isOpen])

  const handleDisconnect = () => {
    if (!accountId) return

    setLoading(true)

    // Hesabı kaldır (gerçek uygulamada API çağrısı yapılır)
    setTimeout(() => {
      removeAccount(accountId)
      setLoading(false)
      onClose()

      toast({
        title: "Account Disconnected",
        description: "Facebook account has been successfully disconnected.",
        variant: "success",
      })
    }, 1000)
  }

  if (!accountToDisconnect) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            <span>Disconnect Facebook Account</span>
          </DialogTitle>
          <DialogDescription>
            You are about to disconnect the Facebook account{" "}
            <span className="font-medium">{accountToDisconnect.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center p-3 bg-amber-50 rounded-md border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Disconnecting will remove access to your Facebook account data and features.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">When you disconnect this account:</p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc pl-5">
              <li>All data associated with this account will be removed from our servers</li>
              <li>Your campaign settings and statistics will be lost</li>
              <li>You will need to reconnect and reconfigure if you want to use this account again</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:flex-1 dark:border-gray-700 dark:text-gray-300">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDisconnect}
            className="sm:flex-1 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              "Disconnecting..."
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Disconnect Account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
