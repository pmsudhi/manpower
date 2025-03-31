"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EfficiencyDrivers() {
  const [staffUtilization, setStaffUtilization] = useState(85)
  const [technologyImpact, setTechnologyImpact] = useState(10)
  const [crossTraining, setCrossTraining] = useState(15)
  const [seasonalityFactor, setSeasonalityFactor] = useState("moderate")

  // Calculated values
  const effectiveUtilization = staffUtilization / 100
  const technologySavings = technologyImpact / 100
  const crossTrainingSavings = crossTraining / 100

  // Seasonality factor mapping
  const seasonalityFactorMap = {
    low: 0.05,
    moderate: 0.15,
    high: 0.25,
    extreme: 0.35,
  }

  const seasonalityImpact = seasonalityFactorMap[seasonalityFactor]

  // Total efficiency impact
  const totalEfficiencyImpact = (
    effectiveUtilization *
    (1 - technologySavings) *
    (1 - crossTrainingSavings) *
    (1 + seasonalityImpact)
  ).toFixed(2)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staff-utilization">Staff Utilization Rate (%)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="staff-utilization"
                    min={60}
                    max={100}
                    step={1}
                    value={[staffUtilization]}
                    onValueChange={(value) => setStaffUtilization(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={staffUtilization}
                    onChange={(e) => setStaffUtilization(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Percentage of time staff are productively engaged</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technology-impact">Technology Impact (%)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="technology-impact"
                    min={0}
                    max={30}
                    step={1}
                    value={[technologyImpact]}
                    onValueChange={(value) => setTechnologyImpact(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={technologyImpact}
                    onChange={(e) => setTechnologyImpact(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Labor reduction from POS, kitchen display systems, etc.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cross-training">Cross-Training Benefits (%)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="cross-training"
                    min={0}
                    max={30}
                    step={1}
                    value={[crossTraining]}
                    onValueChange={(value) => setCrossTraining(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={crossTraining}
                    onChange={(e) => setCrossTraining(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Labor savings from multi-skilled staff</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seasonality-factor">Seasonality Factor</Label>
                <Select value={seasonalityFactor} onValueChange={setSeasonalityFactor}>
                  <SelectTrigger id="seasonality-factor">
                    <SelectValue placeholder="Select Seasonality Factor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (5% variation)</SelectItem>
                    <SelectItem value="moderate">Moderate (15% variation)</SelectItem>
                    <SelectItem value="high">High (25% variation)</SelectItem>
                    <SelectItem value="extreme">Extreme (35% variation)</SelectItem>
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
                <Label>Effective Staff Utilization</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {effectiveUtilization.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">{staffUtilization}% expressed as a decimal</p>
              </div>

              <div className="space-y-2">
                <Label>Technology Labor Savings</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {technologySavings.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">{technologyImpact}% expressed as a decimal</p>
              </div>

              <div className="space-y-2">
                <Label>Cross-Training Labor Savings</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {crossTrainingSavings.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">{crossTraining}% expressed as a decimal</p>
              </div>

              <div className="space-y-2">
                <Label>Total Efficiency Factor</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center font-bold">
                  {totalEfficiencyImpact}
                </div>
                <p className="text-xs text-muted-foreground">Combined impact of all efficiency drivers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

