"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressDetailModal } from "./progress-detail-modal"

interface ProgressCardProps {
  title: string
  percentage: number
  color?: string
}

export function ProgressCard({ title, percentage, color = "bg-teal-500" }: ProgressCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card
        className="transition-transform duration-200 hover:scale-105 cursor-pointer hover:shadow-md"
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-6">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="mt-4">
            <div className="text-lg font-medium">{percentage}%</div>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <ProgressDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        percentage={percentage}
        color={color}
      />
    </>
  )
}
