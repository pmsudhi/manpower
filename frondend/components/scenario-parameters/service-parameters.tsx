"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function ServiceParameters() {
  const [coversPerWaiter, setCoversPerWaiter] = useState("16")
  const [runnerRatio, setRunnerRatio] = useState("50")
  const [kitchenStations, setKitchenStations] = useState(4)
  const [serviceStyle, setServiceStyle] = useState("casual")

  // Calculated values based on 100 covers (for demonstration)
  const totalCovers = 100
  const waitersNeeded = Math.ceil(totalCovers / Number.parseInt(coversPerWaiter))
  const runnersNeeded = Math.ceil(waitersNeeded * (Number.parseInt(runnerRatio) / 100))
  const kitchenStaffNeeded = kitchenStations * (serviceStyle === "premium" ? 2 : serviceStyle === "casual" ? 1.5 : 1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="covers-per-waiter">Covers per Waiter</Label>
                <Select value={coversPerWaiter} onValueChange={setCoversPerWaiter}>
                  <SelectTrigger id="covers-per-waiter">
                    <SelectValue placeholder="Select Covers per Waiter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 (Premium Service)</SelectItem>
                    <SelectItem value="16">16 (Standard Service)</SelectItem>
                    <SelectItem value="20">20 (Efficient Service)</SelectItem>
                    <SelectItem value="24">24 (Fast Casual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="runner-ratio">Runner to Waiter Ratio (%)</Label>
                <Select value={runnerRatio} onValueChange={setRunnerRatio}>
                  <SelectTrigger id="runner-ratio">
                    <SelectValue placeholder="Select Runner Ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100% (1:1 Ratio)</SelectItem>
                    <SelectItem value="75">75% (3:4 Ratio)</SelectItem>
                    <SelectItem value="50">50% (1:2 Ratio)</SelectItem>
                    <SelectItem value="25">25% (1:4 Ratio)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kitchen-stations">Kitchen Stations</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="kitchen-stations"
                    min={1}
                    max={10}
                    step={1}
                    value={[kitchenStations]}
                    onValueChange={(value) => setKitchenStations(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={kitchenStations}
                    onChange={(e) => setKitchenStations(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-style">Service Style</Label>
                <Select value={serviceStyle} onValueChange={setServiceStyle}>
                  <SelectTrigger id="service-style">
                    <SelectValue placeholder="Select Service Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast-casual">Fast Casual</SelectItem>
                    <SelectItem value="casual">Casual Dining</SelectItem>
                    <SelectItem value="premium">Premium Dining</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Waiters Needed (for {totalCovers} covers)</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {waitersNeeded}
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated as {totalCovers} covers ÷ {coversPerWaiter} covers per waiter
                </p>
              </div>

              <div className="space-y-2">
                <Label>Runners Needed</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {runnersNeeded}
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated as {waitersNeeded} waiters × {runnerRatio}% (rounded up)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Kitchen Staff Needed</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {kitchenStaffNeeded.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated as {kitchenStations} stations ×{" "}
                  {serviceStyle === "premium" ? "2.0" : serviceStyle === "casual" ? "1.5" : "1.0"} staff per station
                </p>
              </div>

              <div className="space-y-2">
                <Label>Total FOH Staff</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center font-bold">
                  {waitersNeeded + runnersNeeded + 2} {/* +2 for host and manager */}
                </div>
                <p className="text-xs text-muted-foreground">
                  Waiters ({waitersNeeded}) + Runners ({runnersNeeded}) + Host (1) + Manager (1)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

