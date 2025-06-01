"use client"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "p-4 rounded-md shadow-lg transition-all transform translate-y-0 opacity-100 flex items-start",
            "bg-white dark:bg-gray-800 border dark:border-gray-700",
            toast.variant === "destructive" && "border-red-500 dark:border-red-500",
            toast.variant === "success" && "border-green-500 dark:border-green-500",
          )}
        >
          <div className="flex-1">
            <h3
              className={cn(
                "font-medium",
                toast.variant === "destructive" && "text-red-500 dark:text-red-400",
                toast.variant === "success" && "text-green-500 dark:text-green-400",
              )}
            >
              {toast.title}
            </h3>
            {toast.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{toast.description}</p>}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="ml-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
