"use client"

import { memo, useEffect, useState } from "react"
import { FilterDropdown } from "@/components/filter-dropdown"
import { StatCard } from "@/components/stat-card"
import { ProgressCard } from "@/components/progress-card"
import { MousePointerClick, ShieldAlert, Users, Shield } from "lucide-react"
import { DatePickerDropdown } from "@/components/date-picker-dropdown"
import { useUser } from "@/contexts/user-context"
import { useFacebookAccounts } from "@/contexts/facebook-accounts-context"
import { dataService } from "@/services/data-service"

function DashboardContentComponent() {
  const { user } = useUser()
  const { accounts, activeAccountId } = useFacebookAccounts()
  const [stats, setStats] = useState({
    clicks: 0,
    blockIp: 0,
    blockDevices: 0,
    vpn: 0,
    totalVisitors: 0,
  })
  const [progress, setProgress] = useState({
    fraudLevel: 0,
    fraudByWeb: 0,
    fraudByMobile: 0,
  })
  const [selectedAccount, setSelectedAccount] = useState<any>(null)

  // Seçilen Facebook hesabını takip et ve verilerini yükle
  useEffect(() => {
    if (accounts.length > 0 && activeAccountId) {
      const account = accounts.find((acc) => acc.id === activeAccountId)
      setSelectedAccount(account)

      if (account && account.dashboardData) {
        // Hesaba özgü verileri yükle
        setStats(account.dashboardData.stats)
        setProgress(account.dashboardData.progress)
      } else {
        // Hesaba özgü veri yoksa varsayılan değerleri kullan
        if (user) {
          const dashboardData = dataService.getDashboardData(user.id)
          if (dashboardData) {
            setStats(dashboardData.stats)
            setProgress(dashboardData.progress)
          }
        }
      }
    } else if (user) {
      // Aktif hesap yoksa kullanıcının genel verilerini yükle
      const dashboardData = dataService.getDashboardData(user.id)
      if (dashboardData) {
        setStats(dashboardData.stats)
        setProgress(dashboardData.progress)
      }
    }
  }, [accounts, activeAccountId, user])

  return (
    <div className="p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <FilterDropdown label="Ad Account" />
          <FilterDropdown label="Campaign" />
          <FilterDropdown label="Adset" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <StatCard
            title="Clicks"
            value={stats.clicks}
            icon={<MousePointerClick className="h-5 w-5 text-white" />}
            iconColor="bg-blue-500"
          />
          <StatCard
            title="Block Ip"
            value={stats.blockIp}
            icon={<ShieldAlert className="h-5 w-5 text-white" />}
            iconColor="bg-teal-500"
          />
          <StatCard
            title="Block Devices"
            value={stats.blockDevices}
            icon={<Shield className="h-5 w-5 text-white" />}
            iconColor="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-16">
          <StatCard
            title="VPN"
            value={stats.vpn}
            icon={<MousePointerClick className="h-5 w-5 text-white" />}
            iconColor="bg-blue-500"
          />
          <StatCard
            title="Total Visitors"
            value={stats.totalVisitors}
            icon={<Users className="h-5 w-5 text-white" />}
            iconColor="bg-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-10">
          <ProgressCard title="Fraud Level" percentage={progress.fraudLevel} color="bg-teal-500" />
          <ProgressCard title="Fraud by Web" percentage={progress.fraudByWeb} color="bg-teal-500" />
          <ProgressCard title="Fraud by Mobile" percentage={progress.fraudByMobile} color="bg-teal-500" />
        </div>
      </div>
    </div>
  )
}

export const DashboardContent = memo(DashboardContentComponent)
