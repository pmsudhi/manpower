"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export default function OperationalHours() {
  const [operatingDays, setOperatingDays] = useState(350)
  const [dailyHours, setDailyHours] = useState(12)
  const [peakHourFactor, setPeakHourFactor] = useState(1.5)
  const [weekendBoost, setWeekendBoost] = useState(true)

  // Calculated values
  const totalAnnualHours = operatingDays * dailyHours
  const peakHoursPerDay = 4 // Assumption: 4 hours are peak hours
  const peakHoursPerYear = operatingDays * peakHoursPerDay
  const standardHoursPerYear = totalAnnualHours - peakHoursPerYear

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="operating-days">Operating Days per Year</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="operating-days"
                    min={300}
                    max={365}
                    step={1}
                    value={[operatingDays]}
                    onValueChange={(value) => setOperatingDays(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={operatingDays}
                    onChange={(e) => setOperatingDays(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Default is 350 days (accounts for Ramadan and other closures)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="daily-hours">Daily Operating Hours</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="daily-hours"
                    min={6}
                    max={24}
                    step={0.5}
                    value={[dailyHours]}
                    onValueChange={(value) => setDailyHours(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="peak-hour-factor">Peak Hour Staffing Factor</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="peak-hour-factor"
                    min={1}
                    max={2}
                    step={0.1}
                    value={[peakHourFactor]}
                    onValueChange={(value) => setPeakHourFactor(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={peakHourFactor}
                    onChange={(e) => setPeakHourFactor(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Multiplier for staff needed during peak hours</p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch id="weekend-boost" checked={weekendBoost} onCheckedChange={setWeekendBoost} />
                <Label htmlFor="weekend-boost">Apply Weekend Boost (25% more staff)</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Total Annual Operating Hours</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {totalAnnualHours}
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated as {operatingDays} days × {dailyHours} hours
                </p>
              </div>

              <div className="space-y-2">
                <Label>Standard Hours per Year</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {standardHoursPerYear}
                </div>
                <p className="text-xs text-muted-foreground">Total hours minus peak hours</p>
              </div>

              <div className="space-y-2">
                <Label>Peak Hours per Year</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {peakHoursPerYear}
                </div>
                <p className="text-xs text-muted-foreground">
                  {peakHoursPerDay} peak hours per day × {operatingDays} days
                </p>
              </div>

              <div className="space-y-2">
                <Label>Peak Hour Staffing Requirement</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center font-bold">
                  {peakHourFactor}× standard staffing
                </div>
                <p className="text-xs text-muted-foreground">During peak hours, staffing is increased by this factor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

