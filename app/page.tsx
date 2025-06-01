"use client"

import { SignInForm } from "@/components/sign-in-form"
import { AnimatedLogo } from "@/components/animated-logo"

export default function Home() {
  return (
    <main className="flex min-h-screen dark:bg-gray-900">
      {/* Empty blue sidebar - no elements inside */}
      <div className="hidden md:flex md:w-[70px] bg-blue-600 flex-col items-center justify-between py-4 flex-shrink-0 dark:bg-blue-800">
        {/* No content here - will be empty on login screen */}
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="mb-8">
          <AnimatedLogo size="lg" />
        </div>
        <SignInForm />
      </div>
    </main>
  )
}
