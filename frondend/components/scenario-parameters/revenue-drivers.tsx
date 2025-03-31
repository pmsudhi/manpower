"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

export default function RevenueDrivers() {
  const [avgSpending, setAvgSpending] = useState(120)
  const [dwellingTime, setDwellingTime] = useState(90)
  const [tableTurnTime, setTableTurnTime] = useState(105)
  const [peakFactor, setPeakFactor] = useState(1.5)

  // Calculated values
  const turnsPerDay = Math.round(((12 * 60) / tableTurnTime) * 10) / 10 // Assuming 12 hours of operation
  const dailyCovers = Math.round(100 * turnsPerDay) // Assuming 100 seats
  const dailyRevenue = dailyCovers * avgSpending
  const monthlyRevenue = dailyRevenue * 30 // Assuming 30 days per month

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avg-spending">Average Spending per Guest (SAR)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="avg-spending"
                    min={50}
                    max={500}
                    step={5}
                    value={[avgSpending]}
                    onValueChange={(value) => setAvgSpending(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={avgSpending}
                    onChange={(e) => setAvgSpending(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dwelling-time">Guest Dwelling Time (minutes)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="dwelling-time"
                    min={30}
                    max={180}
                    step={5}
                    value={[dwellingTime]}
                    onValueChange={(value) => setDwellingTime(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={dwellingTime}
                    onChange={(e) => setDwellingTime(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="table-turn-time">Table Turn Time (minutes)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="table-turn-time"
                    min={30}
                    max={180}
                    step={5}
                    value={[tableTurnTime]}
                    onValueChange={(value) => setTableTurnTime(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={tableTurnTime}
                    onChange={(e) => setTableTurnTime(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Includes dining time plus table reset time</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="peak-factor">Peak Hour Factor</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="peak-factor"
                    min={1}
                    max={3}
                    step={0.1}
                    value={[peakFactor]}
                    onValueChange={(value) => setPeakFactor(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={peakFactor}
                    onChange={(e) => setPeakFactor(Number(e.target.value))}
                    className="w-20"
                    step={0.1}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Multiplier for peak hour staffing requirements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Table Turns per Day</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {turnsPerDay.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated as 12 hours ÷ {tableTurnTime} minutes per turn
                </p>
              </div>

              <div className="space-y-2">
                <Label>Daily Covers (100 seats)</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {dailyCovers}
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated as 100 seats × {turnsPerDay.toFixed(1)} turns
                </p>
              </div>

              <div className="space-y-2">
                <Label>Daily Revenue (SAR)</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {dailyRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated as {dailyCovers} covers × SAR {avgSpending} per cover
                </p>
              </div>

              <div className="space-y-2">
                <Label>Monthly Revenue (SAR)</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center font-bold">
                  {monthlyRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated as SAR {dailyRevenue.toLocaleString()} × 30 days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

