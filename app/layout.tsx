import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { NetworkBackground } from "@/components/network-background"
import { FacebookLoginModal } from "@/components/facebook-login-modal"
import { DisconnectModal } from "@/components/disconnect-modal"
import { UserSettingsModal } from "@/components/user-settings-modal"
import { UserProvider } from "@/contexts/user-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Font yüklenirken daha iyi bir deneyim için
})

export const metadata = {
  title: "Oliggo - Fraud Detection Dashboard",
  description: "Monitor and manage fraud detection for your ad campaigns",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Kritik CSS'i önceden yükle */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          as="style"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <UserProvider>
            <NetworkBackground />
            {children}
            <FacebookLoginModal />
            <DisconnectModal />
            <UserSettingsModal />
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
