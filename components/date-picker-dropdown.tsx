"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Simple date formatter function to avoid using date-fns
function formatDate(date: Date | undefined): string {
  if (!date) return ""

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${month} ${day}, ${year}`
}

// Format time as HH:MM AM/PM
function formatTime(hours: number, minutes: number): string {
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, "0")
  return `${displayHours}:${displayMinutes} ${period}`
}

export function DatePickerDropdown() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [singleDateMode, setSingleDateMode] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isDateRangeValid, setIsDateRangeValid] = useState(true)
  const isMobile = useIsMobile()

  // Time state
  const [startHours, setStartHours] = useState(9)
  const [startMinutes, setStartMinutes] = useState(0)
  const [endHours, setEndHours] = useState(17)
  const [endMinutes, setEndMinutes] = useState(0)
  const [hours, setHours] = useState(12)
  const [minutes, setMinutes] = useState(0)
  const [includeTime, setIncludeTime] = useState(false)

  // Validate date range whenever start or end date changes
  useEffect(() => {
    if (startDate && endDate) {
      setIsDateRangeValid(startDate.getTime() <= endDate.getTime())
    } else {
      setIsDateRangeValid(true)
    }
  }, [startDate, endDate])

  const handleSingleDateModeChange = (checked: boolean) => {
    setSingleDateMode(checked)
  }

  const handleIncludeTimeChange = (checked: boolean) => {
    setIncludeTime(checked)
  }

  const handleApply = () => {
    // Here you would typically handle the date selection
    // For now, we'll just close the popover
    document.body.click() // This will close the popover
  }

  // Generate hours and minutes options
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i)
  const minutesOptions = Array.from({ length: 60 }, (_, i) => i)

  // Format display text with time if included
  const getDisplayText = () => {
    if (singleDateMode) {
      if (!date) return "Select date"
      const dateText = formatDate(date)
      return includeTime ? `${dateText} ${formatTime(hours, minutes)}` : dateText
    } else {
      if (!startDate || !endDate) return "Select date range"
      const startText = formatDate(startDate)
      const endText = formatDate(endDate)

      if (includeTime) {
        return `${startText} ${formatTime(startHours, startMinutes)} - ${endText} ${formatTime(endHours, endMinutes)}`
      } else {
        return `${startText} - ${endText}`
      }
    }
  }

  const displayText = getDisplayText()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-transparent border-none hover:bg-gray-100 dark:hover:bg-gray-800 w-full md:w-auto justify-start md:justify-center"
        >
          <CalendarIcon className="h-5 w-5" />
          <span className="truncate">{displayText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700"
        align="end"
        side={isMobile ? "bottom" : "bottom"}
        sideOffset={isMobile ? 5 : 5}
        alignOffset={isMobile ? 0 : 0}
        avoidCollisions={!isMobile}
      >
        <div className="p-4 space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="single-date" checked={singleDateMode} onCheckedChange={handleSingleDateModeChange} />
              <Label htmlFor="single-date" className="dark:text-gray-300">
                Select single date
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="include-time" checked={includeTime} onCheckedChange={handleIncludeTimeChange} />
              <Label htmlFor="include-time" className="dark:text-gray-300">
                Include time
              </Label>
            </div>
          </div>

          {singleDateMode ? (
            <div className="space-y-4">
              <div className="border rounded-md p-2 dark:border-gray-700">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="dark:bg-gray-800"
                  classNames={{
                    day_today: "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
                    day_selected:
                      "bg-blue-600 text-white hover:bg-blue-600 hover:text-white dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700",
                    day_outside: "text-gray-400 opacity-50 dark:text-gray-500",
                    day_disabled: "text-gray-400 opacity-50 dark:text-gray-600",
                    day_range_middle: "bg-gray-100 dark:bg-gray-700",
                    day_hidden: "invisible",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100",
                    caption: "text-sm font-medium dark:text-gray-200",
                    caption_label: "text-sm font-medium dark:text-gray-200",
                    nav_button: "border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700",
                    table: "border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400",
                    row: "flex w-full mt-2",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected])]:bg-gray-700",
                  }}
                />
              </div>

              {includeTime && (
                <div className="border rounded-md p-3 dark:border-gray-700">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium dark:text-gray-300">Time</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="hours" className="text-xs text-gray-500 dark:text-gray-400">
                        Hour
                      </Label>
                      <Select value={hours.toString()} onValueChange={(value) => setHours(Number.parseInt(value))}>
                        <SelectTrigger id="hours" className="h-8 text-xs">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {hoursOptions.map((hour) => (
                            <SelectItem key={hour} value={hour.toString()} className="text-xs">
                              {hour.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="minutes" className="text-xs text-gray-500 dark:text-gray-400">
                        Minute
                      </Label>
                      <Select value={minutes.toString()} onValueChange={(value) => setMinutes(Number.parseInt(value))}>
                        <SelectTrigger id="minutes" className="h-8 text-xs">
                          <SelectValue placeholder="Minute" />
                        </SelectTrigger>
                        <SelectContent>
                          {minutesOptions.map((minute) => (
                            <SelectItem key={minute} value={minute.toString()} className="text-xs">
                              {minute.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div
                  className={cn("border rounded-md p-2", !isDateRangeValid && "border-red-500", "dark:border-gray-700")}
                >
                  <div className="text-sm font-medium mb-2 dark:text-gray-300">Start Date</div>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="dark:bg-gray-800"
                    classNames={{
                      day_today: "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
                      day_selected:
                        "bg-blue-600 text-white hover:bg-blue-600 hover:text-white dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700",
                      day_outside: "text-gray-400 opacity-50 dark:text-gray-500",
                      day_disabled: "text-gray-400 opacity-50 dark:text-gray-600",
                      day_range_middle: "bg-gray-100 dark:bg-gray-700",
                      day_hidden: "invisible",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100",
                      caption: "text-sm font-medium dark:text-gray-200",
                      caption_label: "text-sm font-medium dark:text-gray-200",
                      nav_button: "border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700",
                      table: "border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected])]:bg-gray-700",
                    }}
                  />
                </div>
                <div
                  className={cn("border rounded-md p-2", !isDateRangeValid && "border-red-500", "dark:border-gray-700")}
                >
                  <div className="text-sm font-medium mb-2 dark:text-gray-300">End Date</div>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="dark:bg-gray-800"
                    classNames={{
                      day_today: "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
                      day_selected:
                        "bg-blue-600 text-white hover:bg-blue-600 hover:text-white dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700",
                      day_outside: "text-gray-400 opacity-50 dark:text-gray-500",
                      day_disabled: "text-gray-400 opacity-50 dark:text-gray-600",
                      day_range_middle: "bg-gray-100 dark:bg-gray-700",
                      day_hidden: "invisible",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100",
                      caption: "text-sm font-medium dark:text-gray-200",
                      caption_label: "text-sm font-medium dark:text-gray-200",
                      nav_button: "border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700",
                      table: "border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected])]:bg-gray-700",
                    }}
                  />
                </div>
              </div>

              {includeTime && (
                <div className="border rounded-md p-3 dark:border-gray-700">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium dark:text-gray-300">Time Range</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Start Time</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="start-hours" className="text-xs text-gray-500 dark:text-gray-400">
                            Hour
                          </Label>
                          <Select
                            value={startHours.toString()}
                            onValueChange={(value) => setStartHours(Number.parseInt(value))}
                          >
                            <SelectTrigger id="start-hours" className="h-8 text-xs">
                              <SelectValue placeholder="Hour" />
                            </SelectTrigger>
                            <SelectContent>
                              {hoursOptions.map((hour) => (
                                <SelectItem key={hour} value={hour.toString()} className="text-xs">
                                  {hour.toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="start-minutes" className="text-xs text-gray-500 dark:text-gray-400">
                            Minute
                          </Label>
                          <Select
                            value={startMinutes.toString()}
                            onValueChange={(value) => setStartMinutes(Number.parseInt(value))}
                          >
                            <SelectTrigger id="start-minutes" className="h-8 text-xs">
                              <SelectValue placeholder="Minute" />
                            </SelectTrigger>
                            <SelectContent>
                              {minutesOptions.map((minute) => (
                                <SelectItem key={minute} value={minute.toString()} className="text-xs">
                                  {minute.toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">End Time</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="end-hours" className="text-xs text-gray-500 dark:text-gray-400">
                            Hour
                          </Label>
                          <Select
                            value={endHours.toString()}
                            onValueChange={(value) => setEndHours(Number.parseInt(value))}
                          >
                            <SelectTrigger id="end-hours" className="h-8 text-xs">
                              <SelectValue placeholder="Hour" />
                            </SelectTrigger>
                            <SelectContent>
                              {hoursOptions.map((hour) => (
                                <SelectItem key={hour} value={hour.toString()} className="text-xs">
                                  {hour.toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="end-minutes" className="text-xs text-gray-500 dark:text-gray-400">
                            Minute
                          </Label>
                          <Select
                            value={endMinutes.toString()}
                            onValueChange={(value) => setEndMinutes(Number.parseInt(value))}
                          >
                            <SelectTrigger id="end-minutes" className="h-8 text-xs">
                              <SelectValue placeholder="Minute" />
                            </SelectTrigger>
                            <SelectContent>
                              {minutesOptions.map((minute) => (
                                <SelectItem key={minute} value={minute.toString()} className="text-xs">
                                  {minute.toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isDateRangeValid && !singleDateMode && (
            <div className="text-red-500 text-sm">Start date must be before or equal to end date</div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleApply}
              disabled={!singleDateMode && !isDateRangeValid}
              className={cn(
                !singleDateMode && !isDateRangeValid ? "bg-red-500 hover:bg-red-600" : "",
                "dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white",
              )}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
