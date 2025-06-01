"use client"

import { useState, memo, useEffect } from "react"
import { FilterDropdown } from "@/components/filter-dropdown"
import { Button } from "@/components/ui/button"
import { Eye, Info } from "lucide-react"
import { DatePickerDropdown } from "@/components/date-picker-dropdown"
import { IpDetailsModal } from "@/components/ip-details-modal"
import { useIsMobile } from "@/hooks/use-mobile"
import { useUser } from "@/contexts/user-context"
import { useFacebookAccounts } from "@/contexts/facebook-accounts-context"
import { dataService } from "@/services/data-service"

function RecordingContentComponent() {
  const { user } = useUser()
  const { accounts, activeAccountId } = useFacebookAccounts()
  const [ipData, setIpData] = useState([])
  const [selectedIp, setSelectedIp] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const isMobile = useIsMobile()

  // Seçilen Facebook hesabını takip et ve verilerini yükle
  useEffect(() => {
    if (accounts.length > 0 && activeAccountId) {
      const account = accounts.find((acc) => acc.id === activeAccountId)
      setSelectedAccount(account)

      if (account && account.recordingData) {
        // Hesaba özgü verileri yükle
        setIpData(account.recordingData)
      } else {
        // Hesaba özgü veri yoksa varsayılan değerleri kullan
        if (user) {
          const dashboardData = dataService.getDashboardData(user.id)
          if (dashboardData && dashboardData.recording) {
            setIpData(dashboardData.recording)
          }
        }
      }
    } else if (user) {
      // Aktif hesap yoksa kullanıcının genel verilerini yükle
      const dashboardData = dataService.getDashboardData(user.id)
      if (dashboardData && dashboardData.recording) {
        setIpData(dashboardData.recording)
      }
    }
  }, [accounts, activeAccountId, user])

  const handleOpenDetails = (ip) => {
    setSelectedIp(ip)
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false)
  }

  const handleBlockIp = () => {
    if (selectedIp) {
      // IP'yi engelle ve verileri güncelle
      const updatedIpData = ipData.map((item) => (item.id === selectedIp.id ? { ...item, isBlocked: true } : item))
      setIpData(updatedIpData)

      // Seçilen hesabın verilerini güncelle (gerçek uygulamada API'ye kaydedilir)
      if (selectedAccount) {
        selectedAccount.recordingData = updatedIpData
      }
    }
  }

  const handleUnblockIp = () => {
    if (selectedIp) {
      // IP'nin engelini kaldır ve verileri güncelle
      const updatedIpData = ipData.map((item) => (item.id === selectedIp.id ? { ...item, isBlocked: false } : item))
      setIpData(updatedIpData)

      // Seçilen hesabın verilerini güncelle (gerçek uygulamada API'ye kaydedilir)
      if (selectedAccount) {
        selectedAccount.recordingData = updatedIpData
      }
    }
  }

  // Mobil için kart görünümü
  const renderMobileCard = (item) => (
    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg border p-4 mb-4 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <div className="font-medium text-sm">{item.ip}</div>
        {item.isBlocked ? (
          <Button
            variant="outline"
            className="h-7 text-xs bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:border-red-800/30"
            disabled
          >
            Blocked
          </Button>
        ) : (
          <Button
            variant="outline"
            className="h-7 text-xs bg-teal-50 text-teal-600 hover:bg-teal-100 hover:text-teal-700 dark:bg-teal-900/20 dark:text-teal-400 dark:hover:bg-teal-900/30 dark:border-teal-800/30"
          >
            Block
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="text-gray-500 dark:text-gray-400">Device ID:</div>
        <div>{item.deviceId}</div>

        <div className="text-gray-500 dark:text-gray-400">Date & Time:</div>
        <div>
          {item.date} at {item.time}
        </div>

        <div className="text-gray-500 dark:text-gray-400">Clicks:</div>
        <div>{item.clicks}</div>
      </div>

      <div className="flex justify-between mt-3">
        <Button variant="ghost" size="sm" className="text-xs dark:text-gray-300 dark:hover:bg-gray-700">
          <Eye className="h-3.5 w-3.5 mr-1" /> View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
          onClick={() => handleOpenDetails(item)}
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
            <h1 className="text-2xl font-semibold">Recording & Ip Address</h1>
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
        {isMobile && <div className="md:hidden">{ipData.map((item) => renderMobileCard(item))}</div>}

        {/* Masaüstü görünüm için tablo */}
        {!isMobile && (
          <div className="bg-white dark:bg-gray-800 rounded-md border shadow-sm overflow-x-auto dark:border-gray-700 hidden md:block">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-7 gap-4 p-4 border-b text-xs font-medium text-gray-500 dark:text-gray-400 dark:border-gray-700">
                <div>Ip Address</div>
                <div>Device Id</div>
                <div>Date & Time</div>
                <div>Clicks</div>
                <div>Status</div>
                <div>Action</div>
                <div>Details</div>
              </div>
              <div className="divide-y dark:divide-gray-700">
                {ipData.map((item) => (
                  <div key={item.id} className="grid grid-cols-7 gap-4 p-4 items-center text-sm">
                    <div className="text-xs">{item.ip}</div>
                    <div className="text-xs">{item.deviceId}</div>
                    <div>
                      <div className="text-xs">{item.date}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.time}</div>
                    </div>
                    <div className="text-xs">{item.clicks}</div>
                    <div>
                      {item.isBlocked ? (
                        <Button
                          variant="outline"
                          className="h-7 text-xs bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:border-red-800/30"
                          disabled
                        >
                          Blocked
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="h-7 text-xs bg-teal-50 text-teal-600 hover:bg-teal-100 hover:text-teal-700 dark:bg-teal-900/20 dark:text-teal-400 dark:hover:bg-teal-900/30 dark:border-teal-800/30"
                        >
                          Block
                        </Button>
                      )}
                    </div>
                    <div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 dark:text-gray-300 dark:hover:bg-gray-700">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                        onClick={() => handleOpenDetails(item)}
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

      {selectedIp && (
        <IpDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetails}
          ipData={selectedIp}
          onBlock={handleBlockIp}
          onUnblock={handleUnblockIp}
        />
      )}
    </div>
  )
}

export const RecordingContent = memo(RecordingContentComponent)
