"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { dataService } from "@/services/data-service"
import { useUser } from "@/contexts/user-context"

// Facebook hesap türü
export interface FacebookAccount {
  id: string
  name: string
  profileImage: string
  profileImageUrl: string // Profil resmi URL'i
  shortName: string
  adAccounts: number
  campaigns: number
  lastActive: string
  status: "active" | "paused" | "limited"
  color: string
}

interface FacebookAccountsContextType {
  accounts: FacebookAccount[]
  activeAccountId: string
  hoveredAccountId: string | null
  setActiveAccountId: (id: string) => void
  setHoveredAccountId: (id: string | null) => void
  updateAccount: (id: string, data: Partial<FacebookAccount>) => void // Hesap güncelleme fonksiyonu
  removeAccount: (id: string) => void // Hesap silme fonksiyonu
}

const FacebookAccountsContext = createContext<FacebookAccountsContextType | undefined>(undefined)

export function FacebookAccountsProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<FacebookAccount[]>([])
  const [activeAccountId, setActiveAccountId] = useState<string>("")
  const [hoveredAccountId, setHoveredAccountId] = useState<string | null>(null)
  const { user } = useUser()

  // Kullanıcı değiştiğinde Facebook hesaplarını yükle
  useEffect(() => {
    if (user) {
      const userAccounts = dataService.getFacebookAccounts(user.id)
      setAccounts(userAccounts)

      // İlk hesabı aktif olarak ayarla (eğer hesap varsa)
      if (userAccounts.length > 0) {
        setActiveAccountId(userAccounts[0].id)
      }
    } else {
      setAccounts([])
      setActiveAccountId("")
    }
  }, [user])

  // Hesap güncelleme fonksiyonu
  const updateAccount = (id: string, data: Partial<FacebookAccount>) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => (account.id === id ? { ...account, ...data } : account)),
    )
  }

  // Hesap silme fonksiyonu
  const removeAccount = (id: string) => {
    // Hesabı listeden kaldır
    setAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== id))

    // Eğer silinen hesap aktif hesapsa, başka bir hesabı aktif yap
    if (id === activeAccountId) {
      const remainingAccounts = accounts.filter((account) => account.id !== id)
      if (remainingAccounts.length > 0) {
        setActiveAccountId(remainingAccounts[0].id)
      } else {
        setActiveAccountId("")
      }
    }
  }

  return (
    <FacebookAccountsContext.Provider
      value={{
        accounts,
        activeAccountId,
        hoveredAccountId,
        setActiveAccountId,
        setHoveredAccountId,
        updateAccount,
        removeAccount,
      }}
    >
      {children}
    </FacebookAccountsContext.Provider>
  )
}

export function useFacebookAccounts() {
  const context = useContext(FacebookAccountsContext)
  if (context === undefined) {
    throw new Error("useFacebookAccounts must be used within a FacebookAccountsProvider")
  }
  return context
}
