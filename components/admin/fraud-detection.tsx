"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, AlertTriangle, Check, Settings, Save } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function FraudDetection() {
  const [activeTab, setActiveTab] = useState("aggressive")
  const [bounceRateThreshold, setBounceRateThreshold] = useState(6)
  const [clickRatioThreshold, setClickRatioThreshold] = useState(2)
  const [clickRatioTimeUnit, setClickRatioTimeUnit] = useState("hour")
  const [spamClicksCount, setSpamClicksCount] = useState(6)
  const [spamClicksTimeValue, setSpamClicksTimeValue] = useState(3)
  const [spamClicksTimeUnit, setSpamClicksTimeUnit] = useState("seconds")
  const [allowVpn, setAllowVpn] = useState(false)

  // Smart mode settings
  const [smartBounceRateThreshold, setSmartBounceRateThreshold] = useState(10)
  const [smartClickRatioThreshold, setSmartClickRatioThreshold] = useState(5)
  const [smartClickRatioTimeUnit, setSmartClickRatioTimeUnit] = useState("hour")

  const timeUnitOptions = [
    { value: "seconds", label: "Seconds" },
    { value: "minutes", label: "Minutes" },
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
  ]

  const spamClickPresets = [
    { count: 6, time: 3, unit: "seconds" },
    { count: 16, time: 2, unit: "hours" },
    { count: 70, time: 4, unit: "days" },
    { count: 200, time: 2, unit: "weeks" },
  ]

  const handleSpamClickPresetChange = (preset: any) => {
    setSpamClicksCount(preset.count)
    setSpamClicksTimeValue(preset.time)
    setSpamClicksTimeUnit(preset.unit)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fraud Detection</h1>
          <p className="text-muted-foreground">Configure fraud detection algorithms and blocking rules</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
          <Button size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="aggressive" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="aggressive" className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" />
            Aggressive Mode
          </TabsTrigger>
          <TabsTrigger value="smart" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Smart Mode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="aggressive" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Aggressive Mode
              </CardTitle>
              <CardDescription>
                Triggers immediate blocking for suspicious activities. This mode is more strict and may block some
                legitimate users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Immediate Blocking Triggers</h3>

                  <div className="space-y-2">
                    {[
                      "VPN/Proxy Detected",
                      "IP ≠ Geo Location (e.g., claims USA but IP is Egypt)",
                      "Headless Browser (Puppeteer, PhantomJS)",
                      "Pixel-Perfect Clicks (identical coordinates)",
                      "Device Spoofing (fake mobile/tablet signatures)",
                      "Emulator Detected (Bluestacks, Genymotion)",
                      "No JavaScript Load",
                      "No Dom",
                      "Impossible Screen Resolution (e.g., desktop browser too small)",
                      'OS/Browser Mismatch (e.g., "Safari" on Windows)',
                      "Incognito Mode",
                      "Language ≠ Geo Country",
                      "No Mouse Movement",
                      "No Scroll",
                      "Superhuman Typing Speed",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Configurable Parameters</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="bounce-rate">Bounce Rate Threshold</Label>
                          <span className="text-sm font-medium">{bounceRateThreshold} seconds</span>
                        </div>
                        <Slider
                          id="bounce-rate"
                          min={1}
                          max={30}
                          step={1}
                          value={[bounceRateThreshold]}
                          onValueChange={(value) => setBounceRateThreshold(value[0])}
                        />
                        <p className="text-xs text-muted-foreground">
                          Visits shorter than this duration will be considered suspicious
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <Label>VPN/Proxy Detection</Label>
                        <div className="flex items-center space-x-2">
                          <Switch id="allow-vpn" checked={allowVpn} onCheckedChange={setAllowVpn} />
                          <Label htmlFor="allow-vpn">Allow VPN/Proxy connections</Label>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <Label>High Click/IP Ratio Threshold</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            max={100}
                            value={clickRatioThreshold}
                            onChange={(e) => setClickRatioThreshold(Number.parseInt(e.target.value))}
                            className="w-20"
                          />
                          <span>or more clicks in</span>
                          <Input type="number" min={1} max={24} value={1} className="w-20" readOnly />
                          <Select value={clickRatioTimeUnit} onValueChange={setClickRatioTimeUnit}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeUnitOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span>from same IP</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <Label>Spam Clicks Detection</Label>
                        <RadioGroup defaultValue="preset1" className="space-y-2">
                          {spamClickPresets.map((preset, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={`preset${index + 1}`}
                                id={`preset${index + 1}`}
                                onClick={() => handleSpamClickPresetChange(preset)}
                              />
                              <Label htmlFor={`preset${index + 1}`}>
                                {preset.count} or more clicks in under {preset.time} {preset.unit}
                              </Label>
                            </div>
                          ))}
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="custom" />
                            <Label htmlFor="custom">Custom:</Label>
                          </div>
                        </RadioGroup>

                        <div className="flex items-center gap-2 pl-6">
                          <Input
                            type="number"
                            min={1}
                            value={spamClicksCount}
                            onChange={(e) => setSpamClicksCount(Number.parseInt(e.target.value))}
                            className="w-20"
                          />
                          <span>or more clicks in under</span>
                          <Input
                            type="number"
                            min={1}
                            value={spamClicksTimeValue}
                            onChange={(e) => setSpamClicksTimeValue(Number.parseInt(e.target.value))}
                            className="w-20"
                          />
                          <Select value={spamClicksTimeUnit} onValueChange={setSpamClicksTimeUnit}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeUnitOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smart" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Smart Mode
              </CardTitle>
              <CardDescription>
                Triggers review or soft block for suspicious activities. This mode is less strict and focuses on
                reviewing suspicious behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Review or Soft Block Triggers</h3>

                  <div className="space-y-2">
                    {[
                      "No Mouse Movement",
                      "No Scroll",
                      "Superhuman Typing Speed",
                      "Timezone Mismatch",
                      "Emulator Detected (Bluestacks, Genymotion)",
                      "IP ≠ Geo Location",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Configurable Parameters</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="smart-bounce-rate">Bounce Rate Threshold</Label>
                          <span className="text-sm font-medium">{smartBounceRateThreshold} seconds</span>
                        </div>
                        <Slider
                          id="smart-bounce-rate"
                          min={1}
                          max={30}
                          step={1}
                          value={[smartBounceRateThreshold]}
                          onValueChange={(value) => setSmartBounceRateThreshold(value[0])}
                        />
                        <p className="text-xs text-muted-foreground">
                          Visits shorter than this duration will be flagged for review
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <Label>High Click/IP Ratio Threshold</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            max={100}
                            value={smartClickRatioThreshold}
                            onChange={(e) => setSmartClickRatioThreshold(Number.parseInt(e.target.value))}
                            className="w-20"
                          />
                          <span>or more clicks in</span>
                          <Input type="number" min={1} max={24} value={1} className="w-20" readOnly />
                          <Select value={smartClickRatioTimeUnit} onValueChange={setSmartClickRatioTimeUnit}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeUnitOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span>from same IP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Actions</CardTitle>
              <CardDescription>Configure what happens when suspicious activity is detected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="notify-admin" defaultChecked />
                  <Label htmlFor="notify-admin">Notify administrators</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="log-activity" defaultChecked />
                  <Label htmlFor="log-activity">Log detailed activity for review</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="challenge-user" defaultChecked />
                  <Label htmlFor="challenge-user">Present CAPTCHA challenge</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="temp-block" />
                  <Label htmlFor="temp-block">Temporarily block for 24 hours</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Whitelist Configuration</CardTitle>
          <CardDescription>Configure exceptions to the fraud detection rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="whitelist-ips">Whitelisted IPs (one per line)</Label>
                <textarea
                  id="whitelist-ips"
                  className="mt-2 w-full min-h-[100px] p-2 rounded-md border border-input bg-background"
                  placeholder="192.168.1.1&#10;10.0.0.1"
                />
              </div>
              <div>
                <Label htmlFor="whitelist-users">Whitelisted User IDs (one per line)</Label>
                <textarea
                  id="whitelist-users"
                  className="mt-2 w-full min-h-[100px] p-2 rounded-md border border-input bg-background"
                  placeholder="user_123&#10;admin_456"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="whitelist-internal" defaultChecked />
              <Label htmlFor="whitelist-internal">Automatically whitelist internal company IPs</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
