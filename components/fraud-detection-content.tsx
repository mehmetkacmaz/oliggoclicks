"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/contexts/user-context"
import { Check, AlertTriangle, Flame, Zap } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

// Define time unit types
type TimeUnit = "seconds" | "minutes" | "hours" | "days" | "weeks"

// Define the settings interface
interface FraudDetectionSettings {
  mode: "aggressive" | "smart"
  bounceRateThreshold: {
    value: number
    timeUnits: {
      [key in TimeUnit]: {
        enabled: boolean
        value: number
      }
    }
  }
  highClickIpRatio: {
    value: number
    timeUnits: {
      [key in TimeUnit]: {
        enabled: boolean
        value: number
      }
    }
  }
  spamClicksDetection: {
    timeUnits: {
      [key in TimeUnit]: {
        enabled: boolean
        clicks: number
        time: number
      }
    }
  }
}

// Default settings
const defaultSettings: FraudDetectionSettings = {
  mode: "smart",
  bounceRateThreshold: {
    value: 70,
    timeUnits: {
      seconds: { enabled: false, value: 5 },
      minutes: { enabled: true, value: 2 },
      hours: { enabled: false, value: 1 },
      days: { enabled: false, value: 1 },
      weeks: { enabled: false, value: 1 },
    },
  },
  highClickIpRatio: {
    value: 80,
    timeUnits: {
      seconds: { enabled: false, value: 10 },
      minutes: { enabled: true, value: 5 },
      hours: { enabled: false, value: 2 },
      days: { enabled: false, value: 1 },
      weeks: { enabled: false, value: 1 },
    },
  },
  spamClicksDetection: {
    timeUnits: {
      seconds: { enabled: true, clicks: 6, time: 3 },
      minutes: { enabled: false, clicks: 20, time: 5 },
      hours: { enabled: false, clicks: 50, time: 1 },
      days: { enabled: false, clicks: 200, time: 1 },
      weeks: { enabled: false, clicks: 1000, time: 1 },
    },
  },
}

export function FraudDetectionContent() {
  const { toast } = useToast()
  const { user } = useUser()
  const [settings, setSettings] = useState<FraudDetectionSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = useIsMobile()

  // Load user settings on component mount
  useEffect(() => {
    if (user) {
      // In a real app, you would fetch the user's settings from an API
      // For now, we'll just use the default settings
      setSettings(defaultSettings)
    }
  }, [user])

  const handleModeChange = (mode: "aggressive" | "smart") => {
    setSettings((prev) => ({ ...prev, mode }))
  }

  const handleBounceRateChange = (value: number) => {
    setSettings((prev) => ({
      ...prev,
      bounceRateThreshold: {
        ...prev.bounceRateThreshold,
        value,
      },
    }))
  }

  const handleHighClickIpRatioChange = (value: number) => {
    setSettings((prev) => ({
      ...prev,
      highClickIpRatio: {
        ...prev.highClickIpRatio,
        value,
      },
    }))
  }

  const handleTimeUnitToggle = (
    section: "bounceRateThreshold" | "highClickIpRatio" | "spamClicksDetection",
    unit: TimeUnit,
    enabled: boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        timeUnits: {
          ...prev[section].timeUnits,
          [unit]: {
            ...prev[section].timeUnits[unit],
            enabled,
          },
        },
      },
    }))
  }

  const handleTimeUnitValueChange = (
    section: "bounceRateThreshold" | "highClickIpRatio",
    unit: TimeUnit,
    value: number,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        timeUnits: {
          ...prev[section].timeUnits,
          [unit]: {
            ...prev[section].timeUnits[unit],
            value,
          },
        },
      },
    }))
  }

  const handleSpamClicksValueChange = (unit: TimeUnit, field: "clicks" | "time", value: number) => {
    setSettings((prev) => ({
      ...prev,
      spamClicksDetection: {
        ...prev.spamClicksDetection,
        timeUnits: {
          ...prev.spamClicksDetection.timeUnits,
          [unit]: {
            ...prev.spamClicksDetection.timeUnits[unit],
            [field]: value,
          },
        },
      },
    }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would save the settings to an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your fraud detection settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Fraud Detection</h1>
            <p className="text-muted-foreground">
              Configure fraud detection settings to protect your accounts from suspicious activities.
            </p>
          </div>
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Configuration"}
          </Button>
        </div>

        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="settings" className="flex-1 md:flex-none">
              Settings
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex-1 md:flex-none">
              Detection Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detection Mode</CardTitle>
                <CardDescription>
                  Choose how aggressively the system should detect and block suspicious activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  defaultValue={settings.mode}
                  className="grid grid-cols-1 gap-4"
                  onValueChange={(value) => handleModeChange(value as "aggressive" | "smart")}
                >
                  <div>
                    <RadioGroupItem
                      value="aggressive"
                      id="aggressive"
                      className="peer sr-only"
                      checked={settings.mode === "aggressive"}
                    />
                    <Label
                      htmlFor="aggressive"
                      className="flex flex-col rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center gap-2 font-semibold text-lg">
                        <Flame className="h-5 w-5 text-red-500" />
                        <span>Aggressive Mode</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium">Triggers Immediate Blocking:</p>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>VPN/Proxy Detected</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>IP ≠ Geo Location (e.g., claims USA but IP is Egypt)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Bounce Rate &lt;6 sec</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Headless Browser (Puppeteer, PhantomJS)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Pixel-Perfect Clicks (identical coordinates)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Device Spoofing (fake mobile/tablet signatures)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Emulator Detected (Bluestacks, Genymotion)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>No JavaScript Load</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>No Dom</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Impossible Screen Resolution (e.g., desktop browser too small)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>OS/Browser Mismatch (e.g., "Safari" on Windows)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Incognito Mode</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Language ≠ Geo Country</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>High Click/IP Ratio Threshold (2 or more clicks in 1 hour from same IP)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>No Mouse Movement</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>No Scroll</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Superhuman Typing Speed</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Spam Clicks 6 or more clicks in under 3 seconds</span>
                          </li>
                        </ul>
                      </div>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="smart"
                      id="smart"
                      className="peer sr-only"
                      checked={settings.mode === "smart"}
                    />
                    <Label
                      htmlFor="smart"
                      className="flex flex-col rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center gap-2 font-semibold text-lg">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <span>Smart Mode</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium">Triggers Review or Soft Block:</p>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <span>Bounce Rate &lt;10 sec</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <span>No Mouse Movement</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <span>No Scroll</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <span>Superhuman Typing Speed</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <span>Timezone Mismatch</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <span>Emulator Detected (Bluestacks, Genymotion)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <span>High Click/IP Ratio (5 or more clicks in 1 hour from same IP)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <span>IP ≠ Geo Location</span>
                          </li>
                        </ul>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurable Parameters</CardTitle>
                <CardDescription>Fine-tune detection thresholds based on your traffic patterns.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bounce Rate Threshold */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Bounce Rate Threshold</h3>
                    <p className="text-sm text-muted-foreground">
                      Percentage of visits that leave without interaction.
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Threshold: {settings.bounceRateThreshold.value}%</span>
                    </div>
                    <Slider
                      value={[settings.bounceRateThreshold.value]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleBounceRateChange(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Time Units</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(Object.keys(settings.bounceRateThreshold.timeUnits) as TimeUnit[]).map((unit) => (
                        <div key={unit} className="flex items-center space-x-2 border p-3 rounded-md">
                          <Checkbox
                            id={`bounce-${unit}`}
                            checked={settings.bounceRateThreshold.timeUnits[unit].enabled}
                            onCheckedChange={(checked) =>
                              handleTimeUnitToggle("bounceRateThreshold", unit, checked as boolean)
                            }
                          />
                          <div className="grid gap-1.5 w-full">
                            <Label htmlFor={`bounce-${unit}`} className="capitalize">
                              {unit}
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id={`bounce-${unit}-value`}
                                type="number"
                                className="h-8"
                                value={settings.bounceRateThreshold.timeUnits[unit].value}
                                onChange={(e) =>
                                  handleTimeUnitValueChange(
                                    "bounceRateThreshold",
                                    unit,
                                    Number.parseInt(e.target.value) || 0,
                                  )
                                }
                                disabled={!settings.bounceRateThreshold.timeUnits[unit].enabled}
                              />
                              <Label htmlFor={`bounce-${unit}-value`} className="capitalize">
                                {unit}
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* High Click/IP Ratio Threshold */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">High Click/IP Ratio Threshold</h3>
                    <p className="text-sm text-muted-foreground">
                      Percentage of clicks coming from the same IP address.
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Threshold: {settings.highClickIpRatio.value}%</span>
                    </div>
                    <Slider
                      value={[settings.highClickIpRatio.value]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleHighClickIpRatioChange(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Time Units</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(Object.keys(settings.highClickIpRatio.timeUnits) as TimeUnit[]).map((unit) => (
                        <div key={unit} className="flex items-center space-x-2 border p-3 rounded-md">
                          <Checkbox
                            id={`ip-${unit}`}
                            checked={settings.highClickIpRatio.timeUnits[unit].enabled}
                            onCheckedChange={(checked) =>
                              handleTimeUnitToggle("highClickIpRatio", unit, checked as boolean)
                            }
                          />
                          <div className="grid gap-1.5 w-full">
                            <Label htmlFor={`ip-${unit}`} className="capitalize">
                              {unit}
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id={`ip-${unit}-value`}
                                type="number"
                                className="h-8"
                                value={settings.highClickIpRatio.timeUnits[unit].value}
                                onChange={(e) =>
                                  handleTimeUnitValueChange(
                                    "highClickIpRatio",
                                    unit,
                                    Number.parseInt(e.target.value) || 0,
                                  )
                                }
                                disabled={!settings.highClickIpRatio.timeUnits[unit].enabled}
                              />
                              <Label htmlFor={`ip-${unit}-value`} className="capitalize">
                                {unit}
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spam Clicks Detection */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Spam Clicks Detection</h3>
                    <p className="text-sm text-muted-foreground">
                      Detect rapid clicking patterns that indicate bot activity.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Detection Rules</Label>
                    <div className="grid grid-cols-1 gap-4">
                      {(Object.keys(settings.spamClicksDetection.timeUnits) as TimeUnit[]).map((unit) => (
                        <div key={unit} className="flex items-center space-x-2 border p-3 rounded-md">
                          <Checkbox
                            id={`spam-${unit}`}
                            checked={settings.spamClicksDetection.timeUnits[unit].enabled}
                            onCheckedChange={(checked) =>
                              handleTimeUnitToggle("spamClicksDetection", unit, checked as boolean)
                            }
                          />
                          <div className="grid gap-1.5 w-full">
                            <Label htmlFor={`spam-${unit}`} className="capitalize">
                              {unit}
                            </Label>
                            <div className={`flex items-center ${isMobile ? "flex-col space-y-2" : "space-x-2"}`}>
                              <div className="flex items-center space-x-2">
                                <Input
                                  id={`spam-${unit}-clicks`}
                                  type="number"
                                  className="h-8 w-20"
                                  value={settings.spamClicksDetection.timeUnits[unit].clicks}
                                  onChange={(e) =>
                                    handleSpamClicksValueChange(unit, "clicks", Number.parseInt(e.target.value) || 0)
                                  }
                                  disabled={!settings.spamClicksDetection.timeUnits[unit].enabled}
                                />
                                <span>or more clicks</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span>in under</span>
                                <Input
                                  id={`spam-${unit}-time`}
                                  type="number"
                                  className="h-8 w-20"
                                  value={settings.spamClicksDetection.timeUnits[unit].time}
                                  onChange={(e) =>
                                    handleSpamClicksValueChange(unit, "time", Number.parseInt(e.target.value) || 0)
                                  }
                                  disabled={!settings.spamClicksDetection.timeUnits[unit].enabled}
                                />
                                <Label htmlFor={`spam-${unit}-time`} className="capitalize">
                                  {unit}
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Detection Logs</CardTitle>
                <CardDescription>View recent fraud detection events and actions taken.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-8 flex items-center justify-center">
                  <p className="text-muted-foreground">No detection logs available yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
