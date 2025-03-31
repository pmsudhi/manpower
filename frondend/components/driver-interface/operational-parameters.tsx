"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, RefreshCw } from "lucide-react"

interface OperationalParametersProps {
  onParametersChange?: (parameters: any) => void
  onSaveScenario?: (scenarioName: string, parameters: any) => void
  className?: string
}

export function OperationalParameters({ onParametersChange, onSaveScenario, className }: OperationalParametersProps) {
  // Space Parameters
  const [totalArea, setTotalArea] = useState(250)
  const [fohPercentage, setFohPercentage] = useState(65)
  const [areaPerCover, setAreaPerCover] = useState("1.67")
  const [externalSeating, setExternalSeating] = useState(20)

  // Service Parameters
  const [coversPerWaiter, setCoversPerWaiter] = useState("16")
  const [runnerRatio, setRunnerRatio] = useState("50")
  const [kitchenStations, setKitchenStations] = useState(4)
  const [serviceStyle, setServiceStyle] = useState("casual")

  // Revenue Drivers
  const [avgSpending, setAvgSpending] = useState(120)
  const [dwellingTime, setDwellingTime] = useState(75)
  const [tableTurnTime, setTableTurnTime] = useState(90)
  const [peakFactor, setPeakFactor] = useState(1.5)

  // Operational Hours
  const [operatingDays, setOperatingDays] = useState(350) // Accounting for Ramadan
  const [dailyHours, setDailyHours] = useState(12)
  const [ramadanAdjustment, setRamadanAdjustment] = useState(true)

  // Efficiency Drivers
  const [staffUtilization, setStaffUtilization] = useState(85)
  const [techImpact, setTechImpact] = useState(10)
  const [crossTraining, setCrossTraining] = useState(15)
  const [seasonalityFactor, setSeasonalityFactor] = useState(1.0)

  // Scenario name for saving
  const [scenarioName, setScenarioName] = useState("")

  // Calculate derived values
  const fohArea = (totalArea * fohPercentage) / 100
  const fohCapacity = Math.floor(fohArea / Number.parseFloat(areaPerCover))
  const totalCapacity = fohCapacity + externalSeating
  const waitersRequired = Math.ceil(totalCapacity / Number.parseInt(coversPerWaiter))
  const runnersRequired = Math.ceil((waitersRequired * Number.parseInt(runnerRatio)) / 100)
  const tableTurns = (dailyHours * 60) / dwellingTime
  const dailyCovers = totalCapacity * tableTurns * 0.85 // 85% occupancy
  const monthlyRevenue = dailyCovers * avgSpending * (operatingDays / 12)

  // Handle parameter changes
  const handleParameterChange = () => {
    if (onParametersChange) {
      onParametersChange({
        spaceParameters: {
          totalArea,
          fohPercentage,
          areaPerCover,
          externalSeating,
          fohArea,
          fohCapacity,
          totalCapacity,
        },
        serviceParameters: {
          coversPerWaiter,
          runnerRatio,
          kitchenStations,
          serviceStyle,
          waitersRequired,
          runnersRequired,
        },
        revenueDrivers: {
          avgSpending,
          dwellingTime,
          tableTurnTime,
          peakFactor,
          tableTurns,
          dailyCovers,
          monthlyRevenue,
        },
        operationalHours: {
          operatingDays,
          dailyHours,
          ramadanAdjustment,
        },
        efficiencyDrivers: {
          staffUtilization,
          techImpact,
          crossTraining,
          seasonalityFactor,
        },
      })
    }
  }

  // Handle save scenario
  const handleSaveScenario = () => {
    if (onSaveScenario && scenarioName) {
      onSaveScenario(scenarioName, {
        spaceParameters: {
          totalArea,
          fohPercentage,
          areaPerCover,
          externalSeating,
          fohArea,
          fohCapacity,
          totalCapacity,
        },
        serviceParameters: {
          coversPerWaiter,
          runnerRatio,
          kitchenStations,
          serviceStyle,
          waitersRequired,
          runnersRequired,
        },
        revenueDrivers: {
          avgSpending,
          dwellingTime,
          tableTurnTime,
          peakFactor,
          tableTurns,
          dailyCovers,
          monthlyRevenue,
        },
        operationalHours: {
          operatingDays,
          dailyHours,
          ramadanAdjustment,
        },
        efficiencyDrivers: {
          staffUtilization,
          techImpact,
          crossTraining,
          seasonalityFactor,
        },
      })
      setScenarioName("")
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Operational Parameters</CardTitle>
        <CardDescription>Adjust key operational drivers to model staffing requirements</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="space" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="space">Space</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          </TabsList>

          {/* Space Parameters */}
          <TabsContent value="space" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="totalArea">Total Restaurant Area (sqm)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="totalArea"
                      min={50}
                      max={500}
                      step={10}
                      value={[totalArea]}
                      onValueChange={(value) => {
                        setTotalArea(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={totalArea}
                      onChange={(e) => {
                        setTotalArea(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fohPercentage">FOH Area (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="fohPercentage"
                      min={40}
                      max={80}
                      step={5}
                      value={[fohPercentage]}
                      onValueChange={(value) => {
                        setFohPercentage(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={fohPercentage}
                      onChange={(e) => {
                        setFohPercentage(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="areaPerCover">Area per Cover (sqm)</Label>
                  <Select
                    value={areaPerCover}
                    onValueChange={(value) => {
                      setAreaPerCover(value)
                      handleParameterChange()
                    }}
                  >
                    <SelectTrigger id="areaPerCover">
                      <SelectValue placeholder="Select area per cover" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.5">1.5 sqm (Fast Casual)</SelectItem>
                      <SelectItem value="1.67">1.67 sqm (Casual Dining)</SelectItem>
                      <SelectItem value="1.86">1.86 sqm (Casual Premium)</SelectItem>
                      <SelectItem value="2.05">2.05 sqm (Premium Dining)</SelectItem>
                      <SelectItem value="2.32">2.32 sqm (Fine Dining)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="externalSeating">External Seating Capacity</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="externalSeating"
                      min={0}
                      max={50}
                      step={1}
                      value={[externalSeating]}
                      onValueChange={(value) => {
                        setExternalSeating(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={externalSeating}
                      onChange={(e) => {
                        setExternalSeating(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md space-y-3">
                <h3 className="text-sm font-medium">Calculated Values:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>FOH Area:</div>
                  <div className="font-medium">{fohArea.toFixed(1)} sqm</div>

                  <div>FOH Capacity:</div>
                  <div className="font-medium">{fohCapacity} covers</div>

                  <div>Total Capacity:</div>
                  <div className="font-medium">{totalCapacity} covers</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Service Parameters */}
          <TabsContent value="service" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coversPerWaiter">Covers per Waiter</Label>
                  <Select
                    value={coversPerWaiter}
                    onValueChange={(value) => {
                      setCoversPerWaiter(value)
                      handleParameterChange()
                    }}
                  >
                    <SelectTrigger id="coversPerWaiter">
                      <SelectValue placeholder="Select covers per waiter" />
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
                  <Label htmlFor="runnerRatio">Runner to Waiter Ratio (%)</Label>
                  <Select
                    value={runnerRatio}
                    onValueChange={(value) => {
                      setRunnerRatio(value)
                      handleParameterChange()
                    }}
                  >
                    <SelectTrigger id="runnerRatio">
                      <SelectValue placeholder="Select runner ratio" />
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
                  <Label htmlFor="kitchenStations">Kitchen Stations</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="kitchenStations"
                      min={1}
                      max={8}
                      step={1}
                      value={[kitchenStations]}
                      onValueChange={(value) => {
                        setKitchenStations(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={kitchenStations}
                      onChange={(e) => {
                        setKitchenStations(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceStyle">Service Style</Label>
                  <Select
                    value={serviceStyle}
                    onValueChange={(value) => {
                      setServiceStyle(value)
                      handleParameterChange()
                    }}
                  >
                    <SelectTrigger id="serviceStyle">
                      <SelectValue placeholder="Select service style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast">Fast Casual</SelectItem>
                      <SelectItem value="casual">Casual Dining</SelectItem>
                      <SelectItem value="premium">Premium Dining</SelectItem>
                      <SelectItem value="fine">Fine Dining</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md space-y-3">
                <h3 className="text-sm font-medium">Calculated Values:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Waiters Required:</div>
                  <div className="font-medium">{waitersRequired}</div>

                  <div>Runners Required:</div>
                  <div className="font-medium">{runnersRequired}</div>

                  <div>BOH Staff (Est.):</div>
                  <div className="font-medium">{Math.ceil(kitchenStations * 2.5)}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Revenue Drivers */}
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avgSpending">Average Spending per Guest (SAR)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="avgSpending"
                      min={50}
                      max={300}
                      step={5}
                      value={[avgSpending]}
                      onValueChange={(value) => {
                        setAvgSpending(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={avgSpending}
                      onChange={(e) => {
                        setAvgSpending(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dwellingTime">Guest Dwelling Time (minutes)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="dwellingTime"
                      min={30}
                      max={180}
                      step={5}
                      value={[dwellingTime]}
                      onValueChange={(value) => {
                        setDwellingTime(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={dwellingTime}
                      onChange={(e) => {
                        setDwellingTime(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tableTurnTime">Table Turn Time (minutes)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="tableTurnTime"
                      min={45}
                      max={200}
                      step={5}
                      value={[tableTurnTime]}
                      onValueChange={(value) => {
                        setTableTurnTime(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={tableTurnTime}
                      onChange={(e) => {
                        setTableTurnTime(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="peakFactor">Peak Hour Factor</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="peakFactor"
                      min={1}
                      max={2}
                      step={0.1}
                      value={[peakFactor]}
                      onValueChange={(value) => {
                        setPeakFactor(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={peakFactor}
                      onChange={(e) => {
                        setPeakFactor(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md space-y-3">
                <h3 className="text-sm font-medium">Calculated Values:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Table Turns per Day:</div>
                  <div className="font-medium">{tableTurns.toFixed(1)}</div>

                  <div>Daily Covers:</div>
                  <div className="font-medium">{Math.round(dailyCovers)}</div>

                  <div>Monthly Revenue:</div>
                  <div className="font-medium">SAR {Math.round(monthlyRevenue).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Operational Hours */}
          <TabsContent value="hours" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="operatingDays">Operating Days per Year</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="operatingDays"
                      min={300}
                      max={365}
                      step={1}
                      value={[operatingDays]}
                      onValueChange={(value) => {
                        setOperatingDays(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={operatingDays}
                      onChange={(e) => {
                        setOperatingDays(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyHours">Operating Hours per Day</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="dailyHours"
                      min={6}
                      max={24}
                      step={1}
                      value={[dailyHours]}
                      onValueChange={(value) => {
                        setDailyHours(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={dailyHours}
                      onChange={(e) => {
                        setDailyHours(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Switch
                    id="ramadanAdjustment"
                    checked={ramadanAdjustment}
                    onCheckedChange={(checked) => {
                      setRamadanAdjustment(checked)
                      handleParameterChange()
                    }}
                  />
                  <Label htmlFor="ramadanAdjustment">Apply Ramadan Adjustment (50% capacity)</Label>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md space-y-3">
                <h3 className="text-sm font-medium">Calculated Values:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Monthly Operating Days:</div>
                  <div className="font-medium">{Math.round(operatingDays / 12)}</div>

                  <div>Annual Operating Hours:</div>
                  <div className="font-medium">{operatingDays * dailyHours}</div>

                  <div>Ramadan Impact:</div>
                  <div className="font-medium">{ramadanAdjustment ? "Applied (50% capacity)" : "Not Applied"}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Efficiency Drivers */}
          <TabsContent value="efficiency" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="staffUtilization">Staff Utilization Rate (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="staffUtilization"
                      min={60}
                      max={95}
                      step={1}
                      value={[staffUtilization]}
                      onValueChange={(value) => {
                        setStaffUtilization(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={staffUtilization}
                      onChange={(e) => {
                        setStaffUtilization(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="techImpact">Technology Impact (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="techImpact"
                      min={0}
                      max={30}
                      step={1}
                      value={[techImpact]}
                      onValueChange={(value) => {
                        setTechImpact(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={techImpact}
                      onChange={(e) => {
                        setTechImpact(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crossTraining">Cross-Training Impact (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="crossTraining"
                      min={0}
                      max={30}
                      step={1}
                      value={[crossTraining]}
                      onValueChange={(value) => {
                        setCrossTraining(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={crossTraining}
                      onChange={(e) => {
                        setCrossTraining(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seasonalityFactor">Seasonality Factor</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="seasonalityFactor"
                      min={0.7}
                      max={1.3}
                      step={0.05}
                      value={[seasonalityFactor]}
                      onValueChange={(value) => {
                        setSeasonalityFactor(value[0])
                        handleParameterChange()
                      }}
                    />
                    <Input
                      type="number"
                      value={seasonalityFactor}
                      onChange={(e) => {
                        setSeasonalityFactor(Number(e.target.value))
                        handleParameterChange()
                      }}
                      className="w-20"
                      step="0.05"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md space-y-3">
                <h3 className="text-sm font-medium">Efficiency Impact:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Effective Staff Reduction:</div>
                  <div className="font-medium">
                    {Math.round(((techImpact + crossTraining) / 100) * waitersRequired)} staff
                  </div>

                  <div>Adjusted Waiter Requirement:</div>
                  <div className="font-medium">
                    {Math.ceil(waitersRequired * (1 - (techImpact + crossTraining) / 100))}
                  </div>

                  <div>Seasonal Adjustment:</div>
                  <div className="font-medium">
                    {seasonalityFactor < 1 ? "Low Season" : seasonalityFactor > 1 ? "High Season" : "Normal"} (
                    {(seasonalityFactor * 100).toFixed(0)}%)
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="w-full sm:w-1/2">
            <Input
              placeholder="Enter scenario name"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleParameterChange} className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              Update
            </Button>
            <Button onClick={handleSaveScenario} disabled={!scenarioName} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Scenario
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

