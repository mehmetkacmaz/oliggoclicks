"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Facebook } from "lucide-react"

export function FacebookLoginModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true)
    window.addEventListener("open-facebook-login-modal", handleOpenModal)

    return () => {
      window.removeEventListener("open-facebook-login-modal", handleOpenModal)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate login process
    setTimeout(() => {
      setLoading(false)
      setIsOpen(false)
      // Reset form
      setEmail("")
      setPassword("")

      // You would typically handle the actual login here
      console.log("Facebook login with:", email)

      // Redirect to connected account page after login
      window.location.href = "/dashboard"
    }, 800)
  }

  const handleFacebookLogin = () => {
    setLoading(true)

    // Simulate direct Facebook login process
    setTimeout(() => {
      setLoading(false)
      setIsOpen(false)

      // Redirect to connected account page after login
      window.location.href = "/dashboard"
    }, 800)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <Facebook className="h-5 w-5 text-blue-600" />
            <span>Connect with Facebook</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <Button
            variant="outline"
            className="w-full h-12 flex items-center gap-2 border-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
            onClick={handleFacebookLogin}
            disabled={loading}
          >
            <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {loading ? "Connecting..." : "Connect with Facebook"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
