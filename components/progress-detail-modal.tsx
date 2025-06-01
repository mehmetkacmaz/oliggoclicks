"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Download, AlertTriangle, CheckCircle, Info, Clock } from "lucide-react"

interface ProgressDetailModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  percentage: number
  color: string
}

export function ProgressDetailModal({ isOpen, onClose, title, percentage, color }: ProgressDetailModalProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")
  const [loading, setLoading] = useState(false)

  // Sahte veri oluştur
  const generateRandomData = (count: number, min: number, max: number) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
  }

  const weekData = generateRandomData(7, 0, 100)
  const monthData = generateRandomData(30, 0, 100)
  const yearData = generateRandomData(12, 0, 100)

  // Değişim yüzdesi hesapla (rastgele pozitif veya negatif)
  const changePercent = Math.random() > 0.5 ? +(Math.random() * 15).toFixed(1) : -(Math.random() * 15).toFixed(1)

  // Risk seviyesini belirle
  const getRiskLevel = (percentage: number) => {
    if (percentage < 30) return { level: "Low", color: "text-green-500", icon: <CheckCircle className="h-4 w-4" /> }
    if (percentage < 70) return { level: "Medium", color: "text-yellow-500", icon: <Info className="h-4 w-4" /> }
    return { level: "High", color: "text-red-500", icon: <AlertTriangle className="h-4 w-4" /> }
  }

  const risk = getRiskLevel(percentage)

  const handleExport = () => {
    setLoading(true)

    // Dışa aktarma işlemini simüle et
    setTimeout(() => {
      setLoading(false)
      alert("Data exported successfully!")
    }, 1000)
  }

  // Aktif veriyi seç
  const getActiveData = () => {
    switch (timeRange) {
      case "week":
        return weekData
      case "month":
        return monthData
      case "year":
        return yearData
      default:
        return weekData
    }
  }

  const activeData = getActiveData()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white`}>
              {percentage}%
            </div>
            <span>{title} Analysis</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center">
                <h3 className="text-3xl font-bold">{percentage}%</h3>
                <div className="ml-3 flex items-center">
                  {changePercent > 0 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500">{changePercent}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-500">{Math.abs(changePercent)}%</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center mt-1 text-sm">
                <span className="text-gray-500 dark:text-gray-400">from previous period</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${risk.color} bg-opacity-10`}>
                {risk.icon}
                <span className={`text-sm font-medium ${risk.color}`}>{risk.level} Risk</span>
              </div>
            </div>
          </div>

          <div className="flex border-b mb-4 dark:border-gray-700">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === "week"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setTimeRange("week")}
            >
              This Week
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === "month"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setTimeRange("month")}
            >
              This Month
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === "year"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setTimeRange("year")}
            >
              This Year
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div className="h-48 relative">
              {/* Line chart */}
              <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Area under the line */}
                <path
                  d={`M0,${150 - (activeData[0] / 100) * 150} ${activeData
                    .map((value, index) => {
                      const x = (index / (activeData.length - 1)) * 300
                      const y = 150 - (value / 100) * 150
                      return `L${x},${y}`
                    })
                    .join(" ")} L300,150 L0,150 Z`}
                  fill="url(#gradient)"
                />

                {/* Line */}
                <path
                  d={`M0,${150 - (activeData[0] / 100) * 150} ${activeData
                    .map((value, index) => {
                      const x = (index / (activeData.length - 1)) * 300
                      const y = 150 - (value / 100) * 150
                      return `L${x},${y}`
                    })
                    .join(" ")}`}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />

                {/* Data points */}
                {activeData.map((value, index) => {
                  const x = (index / (activeData.length - 1)) * 300
                  const y = 150 - (value / 100) * 150
                  return <circle key={index} cx={x} cy={y} r="3" fill="#3B82F6" />
                })}
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Peak Time</h4>
                  <p className="text-lg font-semibold">10:00 - 14:00</p>
                </div>
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Highest activity detected during these hours</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Threshold</h4>
                  <p className="text-lg font-semibold">75%</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Alert will trigger when level exceeds this value
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  {percentage > 50
                    ? "Consider adjusting your threshold settings to reduce false positives"
                    : "Current settings are optimal for your traffic patterns"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  {percentage > 70
                    ? "Enable advanced filtering to improve detection accuracy"
                    : "Monitor patterns during peak hours for better insights"}
                </span>
              </li>
            </ul>
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
