"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { UserManagement } from "@/components/admin/user-management"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { FraudDetection } from "@/components/admin/fraud-detection"
import { useUser } from "@/contexts/user-context"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function AdminPage() {
  const { user } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState("dashboard")

  // Kullanıcı admin değilse dashboard'a yönlendir
  useEffect(() => {
    if (user && user.type !== "admin") {
      router.push("/dashboard")
    } else if (!user) {
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user || user.type !== "admin") {
    return null
  }

  // View değişimini yönet
  const handleViewChange = (view: string) => {
    setActiveView(view)
  }

  return (
    <AdminLayout activeView={activeView} onViewChange={handleViewChange}>
      {activeView === "dashboard" && <AdminDashboard />}
      {activeView === "users" && <UserManagement />}
      {activeView === "fraud" && <FraudDetection />}
      {activeView === "security" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">Manage security settings and configurations.</p>
          <div className="p-8 border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Security content will be displayed here.</p>
          </div>
        </div>
      )}
      {activeView === "notifications" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage system notifications and alerts.</p>
          <div className="p-8 border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Notifications content will be displayed here.</p>
          </div>
        </div>
      )}
      {activeView === "reports" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">View and generate system reports.</p>
          <div className="p-8 border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Reports content will be displayed here.</p>
          </div>
        </div>
      )}
      {activeView === "logs" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground">View system and user activity logs.</p>
          <div className="p-8 border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Activity logs content will be displayed here.</p>
          </div>
        </div>
      )}
      {activeView === "database" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Database Management</h1>
          <p className="text-muted-foreground">Manage database settings and operations.</p>
          <div className="p-8 border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Database management content will be displayed here.</p>
          </div>
        </div>
      )}
      {activeView === "api" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">API Access</h1>
          <p className="text-muted-foreground">Manage API keys and access settings.</p>
          <div className="p-8 border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">API access content will be displayed here.</p>
          </div>
        </div>
      )}
      {activeView === "roles" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user roles and permissions.</p>
          <div className="p-8 border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Roles and permissions content will be displayed here.</p>
          </div>
        </div>
      )}
      {activeView === "settings" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings.</p>
          <div className="p-8 border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">System settings content will be displayed here.</p>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
