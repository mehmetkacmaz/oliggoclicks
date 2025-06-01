"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useFacebookAccounts, type FacebookAccount } from "@/contexts/facebook-accounts-context"

interface FacebookAccountEditModalProps {
  isOpen: boolean
  onClose: () => void
  accountId: string | null
}

export function FacebookAccountEditModal({ isOpen, onClose, accountId }: FacebookAccountEditModalProps) {
  const { accounts, updateAccount } = useFacebookAccounts()
  const [account, setAccount] = useState<Partial<FacebookAccount> | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Hesap bilgilerini yükle
  useEffect(() => {
    if (accountId && accounts.length > 0) {
      const foundAccount = accounts.find((acc) => acc.id === accountId)
      if (foundAccount) {
        setAccount(foundAccount)
        setProfileImage(foundAccount.profileImageUrl || null)
      }
    } else {
      setAccount(null)
      setProfileImage(null)
    }
  }, [accountId, accounts, isOpen])

  // Profil resmi yükleme fonksiyonu
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    // Dosyayı base64'e çevir (gerçek uygulamada bir API'ye yüklersiniz)
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setProfileImage(base64String)
      setAccount((prev) => (prev ? { ...prev, profileImageUrl: base64String } : null))
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  // Form değişikliklerini işle
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // If name is being changed, automatically generate shortName (initials)
    if (name === "name") {
      const words = value.split(" ")
      let initials = ""

      if (words.length >= 2) {
        // Get first letter of first and last word
        initials = (words[0][0] + words[words.length - 1][0]).toUpperCase()
      } else if (words.length === 1 && words[0].length > 0) {
        // If only one word, take first letter or first two letters
        initials = words[0].length > 1 ? (words[0][0] + words[0][1]).toUpperCase() : words[0][0].toUpperCase()
      }

      setAccount((prev) => (prev ? { ...prev, [name]: value, shortName: initials } : null))
    } else {
      setAccount((prev) => (prev ? { ...prev, [name]: value } : null))
    }
  }

  // Renk değişikliğini işle
  const handleColorChange = (color: string) => {
    setAccount((prev) => (prev ? { ...prev, color } : null))
  }

  // Kaydetme işlemi
  const handleSave = () => {
    if (!account || !accountId) return

    setSaving(true)

    // Hesabı güncelle
    updateAccount(accountId, account)

    // Kaydetme işlemini simüle et
    setTimeout(() => {
      setSaving(false)
      onClose()
    }, 500)
  }

  if (!account) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle>Edit Facebook Account</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Profil resmi */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-full ${profileImage ? "" : account.color} flex items-center justify-center text-white text-xl font-semibold overflow-hidden`}
              >
                {profileImage ? (
                  <img
                    src={profileImage || "/placeholder.svg"}
                    alt={account.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  account.shortName
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  disabled={uploading}
                />
                {uploading ? <LoadingSpinner size="sm" className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
              </label>
            </div>
          </div>

          {/* Hesap adı */}
          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              name="name"
              value={account.name || ""}
              onChange={handleInputChange}
              className="dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          {/* Renk seçimi */}
          <div className="space-y-2">
            <Label>Account Color</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "bg-indigo-500",
                "bg-violet-500",
                "bg-teal-500",
                "bg-emerald-500",
                "bg-sky-500",
                "bg-rose-500",
                "bg-amber-500",
                "bg-cyan-500",
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full ${color} ${
                    account.color === color ? "ring-2 ring-offset-2 ring-blue-400" : ""
                  } transition-transform hover:scale-110`}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="dark:border-gray-700 dark:text-gray-300">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
