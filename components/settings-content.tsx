"use client"

import { memo } from "react"
import { FilterDropdown } from "@/components/filter-dropdown"

function SettingsContentComponent() {
  return (
    <div className="p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        <div className="space-y-6 max-w-xl">
          <FilterDropdown label="Click Fraud Threshold" />
          <FilterDropdown label="JavaScript & Browser Blocking" />
          <FilterDropdown label="VPN Auto-Blocking:" />
          <FilterDropdown label="Time-Based Blocking" />
          <FilterDropdown label="Country-Based Blocking" />
          <FilterDropdown label="Fraud Database Protection" />
        </div>
      </div>
    </div>
  )
}

export const SettingsContent = memo(SettingsContentComponent)
