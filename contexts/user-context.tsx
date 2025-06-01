"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type User, authService } from "@/services/auth-service"

interface UserContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgisini kontrol et
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("currentUser")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)

    // Gerçek bir API çağrısını simüle etmek için setTimeout kullanıyoruz
    return new Promise((resolve) => {
      setTimeout(() => {
        const loggedInUser = authService.login(email, password)

        if (loggedInUser) {
          setUser(loggedInUser)
          localStorage.setItem("currentUser", JSON.stringify(loggedInUser))
          setLoading(false)
          resolve(true)
        } else {
          setLoading(false)
          resolve(false)
        }
      }, 800) // 800ms gecikme
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return <UserContext.Provider value={{ user, loading, login, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
