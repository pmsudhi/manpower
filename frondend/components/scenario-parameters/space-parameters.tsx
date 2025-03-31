"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function SpaceParameters() {
  const [totalArea, setTotalArea] = useState(300)
  const [fohPercentage, setFohPercentage] = useState(65)
  const [areaPerCover, setAreaPerCover] = useState("1.67")
  const [externalSeating, setExternalSeating] = useState(20)

  // Calculated values
  const fohArea = Math.round(totalArea * (fohPercentage / 100))
  const internalCapacity = Math.round(fohArea / Number.parseFloat(areaPerCover))
  const totalCapacity = internalCapacity + externalSeating

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="total-area">Total Restaurant Area (sqm)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="total-area"
                    min={100}
                    max={1000}
                    step={10}
                    value={[totalArea]}
                    onValueChange={(value) => setTotalArea(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={totalArea}
                    onChange={(e) => setTotalArea(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foh-percentage">FOH Area Percentage (%)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="foh-percentage"
                    min={40}
                    max={80}
                    step={1}
                    value={[fohPercentage]}
                    onValueChange={(value) => setFohPercentage(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={fohPercentage}
                    onChange={(e) => setFohPercentage(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area-per-cover">Area per Cover (sqm)</Label>
                <Select value={areaPerCover} onValueChange={setAreaPerCover}>
                  <SelectTrigger id="area-per-cover">
                    <SelectValue placeholder="Select Area per Cover" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.5">1.5 sqm (High Density)</SelectItem>
                    <SelectItem value="1.67">1.67 sqm (Standard)</SelectItem>
                    <SelectItem value="1.86">1.86 sqm (Comfortable)</SelectItem>
                    <SelectItem value="2.05">2.05 sqm (Spacious)</SelectItem>
                    <SelectItem value="2.32">2.32 sqm (Premium)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="external-seating">External Seating Capacity</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="external-seating"
                    min={0}
                    max={100}
                    step={1}
                    value={[externalSeating]}
                    onValueChange={(value) => setExternalSeating(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={externalSeating}
                    onChange={(e) => setExternalSeating(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>FOH Area (sqm)</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {fohArea}
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated as {totalArea} sqm × {fohPercentage}%
                </p>
              </div>

              <div className="space-y-2">
                <Label>Internal Seating Capacity</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {internalCapacity}
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated as {fohArea} sqm ÷ {areaPerCover} sqm per cover
                </p>
              </div>

              <div className="space-y-2">
                <Label>Total Seating Capacity</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center font-bold">
                  {totalCapacity}
                </div>
                <p className="text-xs text-muted-foreground">
                  Internal ({internalCapacity}) + External ({externalSeating})
                </p>
              </div>

              <div className="space-y-2">
                <Label>BOH Area (sqm)</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {totalArea - fohArea}
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated as {totalArea} sqm × {100 - fohPercentage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

