"use client"

import { useState, memo, useEffect } from "react"
import { FilterDropdown } from "@/components/filter-dropdown"
import { DatePickerDropdown } from "@/components/date-picker-dropdown"
import { Button } from "@/components/ui/button"
import { Info, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { UserDetailsModal } from "@/components/user-details-modal"
import { useIsMobile } from "@/hooks/use-mobile"
import { useUser } from "@/contexts/user-context"
import { useFacebookAccounts } from "@/contexts/facebook-accounts-context"
import { dataService } from "@/services/data-service"

function DataContentComponent() {
  const { user } = useUser()
  const { accounts, activeAccountId } = useFacebookAccounts()
  const [userData, setUserData] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const isMobile = useIsMobile()

  // Seçilen Facebook hesabını takip et ve verilerini yükle
  useEffect(() => {
    if (accounts.length > 0 && activeAccountId) {
      const account = accounts.find((acc) => acc.id === activeAccountId)
      setSelectedAccount(account)

      if (account && account.userData) {
        // Hesaba özgü verileri yükle
        setUserData(account.userData)
      } else {
        // Hesaba özgü veri yoksa varsayılan değerleri kullan
        if (user) {
          const dashboardData = dataService.getDashboardData(user.id)
          if (dashboardData && dashboardData.userData) {
            setUserData(dashboardData.userData)
          }
        }
      }
    } else if (user) {
      // Aktif hesap yoksa kullanıcının genel verilerini yükle
      const dashboardData = dataService.getDashboardData(user.id)
      if (dashboardData && dashboardData.userData) {
        setUserData(dashboardData.userData)
      }
    }
  }, [accounts, activeAccountId, user])

  const handleOpenDetails = (user) => {
    setSelectedUser(user)
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false)
  }

  const handleRestrictUser = () => {
    if (selectedUser) {
      // Kullanıcıyı kısıtla ve verileri güncelle
      const updatedUserData = userData.map((item) =>
        item.id === selectedUser.id ? { ...item, isRestricted: true } : item,
      )
      setUserData(updatedUserData)

      // Seçilen hesabın verilerini güncelle (gerçek uygulamada API'ye kaydedilir)
      if (selectedAccount) {
        selectedAccount.userData = updatedUserData
      }
    }
  }

  const handleUnrestrictUser = () => {
    if (selectedUser) {
      // Kullanıcının kısıtlamasını kaldır ve verileri güncelle
      const updatedUserData = userData.map((item) =>
        item.id === selectedUser.id ? { ...item, isRestricted: false } : item,
      )
      setUserData(updatedUserData)

      // Seçilen hesabın verilerini güncelle (gerçek uygulamada API'ye kaydedilir)
      if (selectedAccount) {
        selectedAccount.userData = updatedUserData
      }
    }
  }

  // Function to get activity level color
  const getActivityColor = (level) => {
    if (level < 30) return "text-red-500 dark:text-red-400"
    if (level < 70) return "text-yellow-500 dark:text-yellow-400"
    return "text-green-500 dark:text-green-400"
  }

  // Mobil için kart görünümü
  const renderMobileCard = (user) => (
    <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg border p-4 mb-4 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <div className="font-medium">{user.name}</div>
        <Badge
          variant={user.isRestricted ? "destructive" : "outline"}
          className={`text-xs ${user.isRestricted ? "dark:bg-red-900/30 dark:text-red-400" : "dark:bg-gray-700 dark:text-gray-300"}`}
        >
          {user.isRestricted ? "Restricted" : "Active"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="text-gray-500 dark:text-gray-400">Email:</div>
        <div>{user.email}</div>

        <div className="text-gray-500 dark:text-gray-400">Last Active:</div>
        <div>{user.lastActive}</div>

        <div className="text-gray-500 dark:text-gray-400">Activity Level:</div>
        <div className="flex items-center">
          <Activity className={`h-3.5 w-3.5 mr-1 ${getActivityColor(user.activityLevel)}`} />
          <span className={getActivityColor(user.activityLevel)}>{user.activityLevel}%</span>
        </div>
      </div>

      <div className="flex justify-end mt-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
          onClick={() => handleOpenDetails(user)}
        >
          <Info className="h-3.5 w-3.5 mr-1" /> Details
        </Button>
      </div>
    </div>
  )

  return (
    <div className="p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Data</h1>
            {selectedAccount && (
              <div
                className={`h-8 px-3 rounded-full ${selectedAccount.color} flex items-center justify-center text-white text-sm font-medium`}
              >
                {selectedAccount.name}
              </div>
            )}
          </div>
          <DatePickerDropdown />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
          <FilterDropdown label="Ad Account" />
          <FilterDropdown label="Campaign" />
          <FilterDropdown label="Adset" />
        </div>

        {/* Mobil görünüm için kart tabanlı liste */}
        {isMobile && <div className="md:hidden">{userData.map((user) => renderMobileCard(user))}</div>}

        {/* Masaüstü görünüm için tablo */}
        {!isMobile && (
          <div className="bg-white dark:bg-gray-800 rounded-md border shadow-sm overflow-x-auto dark:border-gray-700 hidden md:block">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-5 gap-4 p-4 border-b text-xs font-medium text-gray-500 dark:text-gray-400 dark:border-gray-700">
                <div>User</div>
                <div>Status</div>
                <div>Last Active</div>
                <div>Activity Level</div>
                <div>Details</div>
              </div>
              <div className="divide-y dark:divide-gray-700">
                {userData.map((user) => (
                  <div key={user.id} className="grid grid-cols-5 gap-4 p-4 items-center text-xs">
                    <div className="font-medium">{user.name}</div>
                    <div>
                      <Badge
                        variant={user.isRestricted ? "destructive" : "outline"}
                        className={`text-xs ${user.isRestricted ? "dark:bg-red-900/30 dark:text-red-400" : "dark:bg-gray-700 dark:text-gray-300"}`}
                      >
                        {user.isRestricted ? "Restricted" : "Active"}
                      </Badge>
                    </div>
                    <div>{user.lastActive}</div>
                    <div className="flex items-center gap-2">
                      <Activity className={`h-3.5 w-3.5 ${getActivityColor(user.activityLevel)}`} />
                      <span className={`${getActivityColor(user.activityLevel)}`}>{user.activityLevel}%</span>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                        onClick={() => handleOpenDetails(user)}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedUser && (
        <UserDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetails}
          userData={selectedUser}
          onRestrict={handleRestrictUser}
          onUnrestrict={handleUnrestrictUser}
        />
      )}
    </div>
  )
}

export const DataContent = memo(DataContentComponent)
