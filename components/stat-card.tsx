"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { StatDetailModal } from "./stat-detail-modal"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  iconColor?: string
}

export function StatCard({ title, value, icon, iconColor = "bg-blue-500" }: StatCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card
        className="transition-transform duration-200 hover:scale-105 cursor-pointer hover:shadow-md"
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <h3 className="text-3xl font-bold mt-1">{value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center`}>{icon}</div>
          </div>
        </CardContent>
      </Card>

      <StatDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        value={value}
        icon={icon}
        iconColor={iconColor}
      />
    </>
  )
}
