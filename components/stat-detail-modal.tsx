"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart, ArrowUpRight, ArrowDownRight, Calendar, Download } from "lucide-react"

interface StatDetailModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  value: string | number
  icon: React.ReactNode
  iconColor: string
}

export function StatDetailModal({ isOpen, onClose, title, value, icon, iconColor }: StatDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily")
  const [loading, setLoading] = useState(false)

  // Sahte veri oluştur
  const generateRandomData = (count: number, min: number, max: number) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
  }

  const dailyData = generateRandomData(7, 10, 120)
  const weeklyData = generateRandomData(4, 50, 200)
  const monthlyData = generateRandomData(6, 100, 500)

  // Değişim yüzdesi hesapla (rastgele pozitif veya negatif)
  const changePercent = Math.random() > 0.5 ? +(Math.random() * 20).toFixed(1) : -(Math.random() * 20).toFixed(1)

  const handleExport = () => {
    setLoading(true)

    // Dışa aktarma işlemini simüle et
    setTimeout(() => {
      setLoading(false)
      alert("Data exported successfully!")
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className={`w-8 h-8 rounded-full ${iconColor} flex items-center justify-center`}>{icon}</div>
            <span>{title} Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-3xl font-bold">{value}</h3>
              <div className="flex items-center mt-1 text-sm">
                {changePercent > 0 ? (
                  <>
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">{changePercent}% increase</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-500">{Math.abs(changePercent)}% decrease</span>
                  </>
                )}
                <span className="text-gray-500 dark:text-gray-400 ml-2">from previous period</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 dark:border-gray-700">
                <Calendar className="h-4 w-4 mr-2" />
                Last 7 days
              </Button>
            </div>
          </div>

          <div className="flex border-b mb-4 dark:border-gray-700">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "daily"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("daily")}
            >
              Daily
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "weekly"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("weekly")}
            >
              Weekly
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "monthly"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("monthly")}
            >
              Monthly
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            {activeTab === "daily" && (
              <div className="h-48 flex items-end justify-between gap-2">
                {dailyData.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-10 bg-blue-500 dark:bg-blue-600 rounded-t-sm"
                      style={{ height: `${value / 2}px` }}
                    ></div>
                    <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "weekly" && (
              <div className="h-48 flex items-end justify-between gap-2">
                {weeklyData.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-16 bg-teal-500 dark:bg-teal-600 rounded-t-sm"
                      style={{ height: `${value / 4}px` }}
                    ></div>
                    <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                      {["Week 1", "Week 2", "Week 3", "Week 4"][index]}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "monthly" && (
              <div className="h-48 flex items-end justify-between gap-2">
                {monthlyData.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-12 bg-purple-500 dark:bg-purple-600 rounded-t-sm"
                      style={{ height: `${value / 10}px` }}
                    ></div>
                    <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center">
              <BarChart className="h-5 w-5 text-blue-500 mb-2" />
              <span className="text-sm font-medium">Distribution</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">By source</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center">
              <LineChart className="h-5 w-5 text-green-500 mb-2" />
              <span className="text-sm font-medium">Trends</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center">
              <PieChart className="h-5 w-5 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Breakdown</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">By category</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose} className="dark:border-gray-700 dark:text-gray-300">
            Close
          </Button>
          <Button
            variant="outline"
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
            onClick={handleExport}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            {loading ? "Exporting..." : "Export Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
