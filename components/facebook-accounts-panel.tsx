"use client"

import { useState, useEffect, useRef } from "react"
import { useFacebookAccounts, type FacebookAccount } from "@/contexts/facebook-accounts-context"
import {
  Facebook,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart,
  ChevronRight,
  ChevronLeft,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FacebookAccountEditModal } from "./facebook-account-edit-modal"
import { FacebookDisconnectModal } from "./facebook-disconnect-modal"
import { AccountSelectionIndicator } from "./account-selection-indicator"
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"

interface FacebookAccountsPanelProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

export function FacebookAccountsPanel({ isExpanded, onToggleExpand }: FacebookAccountsPanelProps) {
  const { accounts, activeAccountId, setActiveAccountId } = useFacebookAccounts()
  const [hoveredAccountId, setHoveredAccountId] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)
  const [editAccountId, setEditAccountId] = useState<string | null>(null)
  const [disconnectAccountId, setDisconnectAccountId] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const accountsRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useIsMobile()

  // Check if there are multiple accounts
  const hasMultipleAccounts = accounts.length > 1

  // Aktif veya hover edilen hesabı bul
  const displayedAccount = accounts.find((acc) => acc.id === (hoveredAccountId || activeAccountId))

  // Mouse olayları
  const handleMouseEnter = () => {
    // Genişletilmiş modda hover panelini gösterme
    if (isExpanded || isMobile) return

    // Eğer timeout varsa temizle
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsPanelOpen(true)
  }

  const handleMouseLeave = () => {
    // Genişletilmiş modda hover panelini gösterme
    if (isExpanded || isMobile) return

    // Panel kapanmadan önce kısa bir gecikme ekle
    // Bu, kullanıcının panel ile hesaplar arasında geçiş yapmasına olanak tanır
    timeoutRef.current = setTimeout(() => {
      if (!isPanelHovered) {
        setIsPanelOpen(false)
        setHoveredAccountId(null)
      }
    }, 300)
  }

  // Panel hover durumu
  const [isPanelHovered, setIsPanelHovered] = useState(false)

  const handlePanelMouseEnter = () => {
    if (isMobile) return

    setIsPanelHovered(true)
    // Eğer timeout varsa temizle
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handlePanelMouseLeave = () => {
    if (isMobile) return

    setIsPanelHovered(false)
    // Panel kapanmadan önce kısa bir gecikme ekle
    timeoutRef.current = setTimeout(() => {
      if (!isAccountsHovered) {
        setIsPanelOpen(false)
        setHoveredAccountId(null)
      }
    }, 300)
  }

  // Hesaplar hover durumu
  const [isAccountsHovered, setIsAccountsHovered] = useState(false)

  const handleAccountsMouseEnter = () => {
    if (isMobile) return

    setIsAccountsHovered(true)
    // Eğer timeout varsa temizle
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handleAccountsMouseLeave = () => {
    if (isMobile) return

    setIsAccountsHovered(false)
    // Panel kapanmadan önce kısa bir gecikme ekle
    timeoutRef.current = setTimeout(() => {
      if (!isPanelHovered) {
        setIsPanelOpen(false)
        setHoveredAccountId(null)
      }
    }, 300)
  }

  // Temizlik
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Hesap durumuna göre badge rengi
  const getStatusBadge = (status: FacebookAccount["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-0">
            <Clock className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        )
      case "limited":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Limited
          </Badge>
        )
      default:
        return null
    }
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

  // Facebook hesaplarının boyutunu küçültelim
  // Get account size based on active state and multiple accounts
  const getAccountSize = (accountId: string) => {
    const isActive = accountId === activeAccountId

    if (isExpanded) {
      // Expanded mode sizes - daha küçük boyutlar
      return isActive && hasMultipleAccounts ? "w-12 h-12" : "w-10 h-10"
    } else {
      // Collapsed mode sizes - daha küçük boyutlar
      return isActive && hasMultipleAccounts ? "w-10 h-10" : "w-8 h-8"
    }
  }

  return (
    <>
      <div className="relative">
        {/* Genişletme/Daraltma Butonu */}
        <div className="flex justify-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleExpand}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
            title={isExpanded ? "Collapse panel" : "Expand panel"}
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Facebook hesapları */}
        <AnimatePresence>
          <motion.div
            ref={accountsRef}
            className={`flex ${isExpanded ? "flex-row flex-wrap justify-center gap-3" : "flex-col items-center space-y-4"} py-4`}
            onMouseEnter={handleAccountsMouseEnter}
            onMouseLeave={handleAccountsMouseLeave}
            initial={false}
            animate={{ width: isExpanded ? "auto" : "auto" }}
            transition={{ duration: 0.3 }}
          >
            {accounts.map((account) => (
              <motion.button
                key={account.id}
                onClick={() => setActiveAccountId(account.id)}
                onMouseEnter={() => setHoveredAccountId(account.id)}
                onMouseOver={handleMouseEnter}
                className={`${getAccountSize(account.id)} rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 overflow-hidden relative ${account.color} ${account.id === activeAccountId && hasMultipleAccounts ? "z-10" : "z-0"}`}
                title={account.name}
                layout
              >
                <span className={`${account.id === activeAccountId && hasMultipleAccounts ? "text-lg" : "text-base"}`}>
                  {account.shortName}
                </span>
                <AccountSelectionIndicator isActive={account.id === activeAccountId} />
              </motion.button>
            ))}

            {/* Yeni hesap ekleme butonu */}
            <motion.button
              onClick={() => window.dispatchEvent(new CustomEvent("open-facebook-login-modal"))}
              className={`${isExpanded ? "w-12 h-12" : "w-10 h-10"} rounded-full bg-transparent border border-white flex items-center justify-center text-white ${isExpanded ? "" : "mt-4 mx-auto"} cursor-pointer hover:bg-blue-700 transition-colors`}
              title="Add Facebook Account"
              layout
            >
              +
            </motion.button>
          </motion.div>
        </AnimatePresence>

        {/* Genişletilmiş mod için hesap bilgileri */}
        {isExpanded && displayedAccount && (
          <div className="mt-4 px-4 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-12 h-12 rounded-full ${displayedAccount.color} flex items-center justify-center text-white font-semibold shadow-md overflow-hidden`}
              >
                {displayedAccount.shortName}
              </div>
              <div>
                <h3 className="font-medium text-white">{displayedAccount.name}</h3>
                <div className="flex items-center mt-1">
                  <Facebook className="h-3.5 w-3.5 text-white/80 mr-1" />
                  <span className="text-xs text-white/80">Facebook Account</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white/90">Status</span>
                {getStatusBadge(displayedAccount.status)}
              </div>

              <div className="space-y-3 bg-white/10 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-white/80">
                    <BarChart className="h-4 w-4 mr-2 text-white/80" />
                    <span>Ad Accounts</span>
                  </div>
                  <span className="text-sm font-medium text-white">{displayedAccount.adAccounts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-white/80">
                    <BarChart className="h-4 w-4 mr-2 text-white/80" />
                    <span>Campaigns</span>
                  </div>
                  <span className="text-sm font-medium text-white">{displayedAccount.campaigns}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-white/80">
                    <Clock className="h-4 w-4 mr-2 text-white/80" />
                    <span>Last Active</span>
                  </div>
                  <span className="text-sm font-medium text-white">{displayedAccount.lastActive}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="bg-white/10 hover:bg-white/20 text-white"
                  onClick={() => handleEditAccount(displayedAccount.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  className="bg-red-500/20 hover:bg-red-500/30 text-white"
                  onClick={() => handleDisconnectAccount(displayedAccount.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hover panel - sadece daraltılmış modda göster */}
        {!isExpanded && isPanelOpen && displayedAccount && !isMobile && (
          <div
            ref={panelRef}
            className="absolute left-16 top-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50 overflow-hidden"
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handlePanelMouseLeave}
          >
            <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${displayedAccount.color} flex items-center justify-center text-white font-semibold shadow-md overflow-hidden`}
                >
                  {displayedAccount.shortName}
                </div>
                <div>
                  <h3 className="font-medium">{displayedAccount.name}</h3>
                  <div className="flex items-center mt-1">
                    <Facebook className="h-3.5 w-3.5 text-blue-600 mr-1" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">Facebook Account</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                {getStatusBadge(displayedAccount.status)}
              </div>

              <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <BarChart className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Ad Accounts</span>
                  </div>
                  <span className="text-sm font-medium">{displayedAccount.adAccounts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <BarChart className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Campaigns</span>
                  </div>
                  <span className="text-sm font-medium">{displayedAccount.campaigns}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Last Active</span>
                  </div>
                  <span className="text-sm font-medium">{displayedAccount.lastActive}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleEditAccount(displayedAccount.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDisconnectAccount(displayedAccount.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

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
