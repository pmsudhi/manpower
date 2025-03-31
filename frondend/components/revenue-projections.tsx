"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function RevenueProjections() {
  const [selectedScenario, setSelectedScenario] = useState("optimized")
  const [averageCheck, setAverageCheck] = useState(120)
  const [seatingCapacity, setSeatingCapacity] = useState(120)
  const [turnoverRate, setTurnoverRate] = useState(2.5)
  const [occupancyRate, setOccupancyRate] = useState(75)
  const [includeSeasonality, setIncludeSeasonality] = useState(true)

  // Sample revenue projection data
  const baselineData = [
    { month: "Jan", current: 650000, optimized: 650000, ramadan: 650000, newMenu: 650000 },
    { month: "Feb", current: 680000, optimized: 680000, ramadan: 680000, newMenu: 680000 },
    { month: "Mar", current: 720000, optimized: 720000, ramadan: 720000, newMenu: 720000 },
    { month: "Apr", current: 700000, optimized: 700000, ramadan: 350000, newMenu: 700000 },
    { month: "May", current: 750000, optimized: 750000, ramadan: 375000, newMenu: 750000 },
    { month: "Jun", current: 800000, optimized: 800000, ramadan: 800000, newMenu: 880000 },
    { month: "Jul", current: 850000, optimized: 850000, ramadan: 850000, newMenu: 935000 },
    { month: "Aug", current: 820000, optimized: 820000, ramadan: 820000, newMenu: 902000 },
    { month: "Sep", current: 780000, optimized: 780000, ramadan: 780000, newMenu: 858000 },
    { month: "Oct", current: 760000, optimized: 760000, ramadan: 760000, newMenu: 836000 },
    { month: "Nov", current: 800000, optimized: 800000, ramadan: 800000, newMenu: 880000 },
    { month: "Dec", current: 900000, optimized: 900000, ramadan: 900000, newMenu: 990000 },
  ]

  // Apply optimization factors based on scenario
  const getProjectedData = () => {
    const optimizationFactors = {
      current: 1.0,
      optimized: 1.05, // 5% increase due to optimized staffing
      ramadan: includeSeasonality ? 0.5 : 1.0, // 50% decrease during Ramadan months if seasonality is included
      newMenu: 1.1, // 10% increase due to new menu items
    }

    // Calculate daily revenue potential based on inputs
    const dailyRevenuePotential = seatingCapacity * turnoverRate * (occupancyRate / 100) * averageCheck
    const monthlyRevenuePotential = dailyRevenuePotential * 30 // Simplified calculation

    return baselineData.map((month) => {
      // Apply the optimization factor for the selected scenario
      const factor =
        month.month === "Apr" || month.month === "May"
          ? selectedScenario === "ramadan" && includeSeasonality
            ? optimizationFactors.ramadan
            : optimizationFactors[selectedScenario]
          : optimizationFactors[selectedScenario]

      // Calculate the projected revenue based on the potential and factor
      const projected = Math.round(monthlyRevenuePotential * factor)

      return {
        ...month,
        projected,
        baseline: month[selectedScenario],
        difference: projected - month[selectedScenario],
        percentChange: (((projected - month[selectedScenario]) / month[selectedScenario]) * 100).toFixed(1),
      }
    })
  }

  const projectedData = getProjectedData()

  // Calculate totals
  const totalBaseline = projectedData.reduce((sum, month) => sum + month.baseline, 0)
  const totalProjected = projectedData.reduce((sum, month) => sum + month.projected, 0)
  const totalDifference = totalProjected - totalBaseline
  const totalPercentChange = ((totalDifference / totalBaseline) * 100).toFixed(1)

  const recalculate = () => {
    // This function would trigger a recalculation in a real app
    // For now, the data is already reactive based on state changes
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Projections</CardTitle>
        <CardDescription>Project revenue based on staffing scenarios and operational parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="scenario-select">Staffing Scenario</Label>
              <Select id="scenario-select" value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Operation</SelectItem>
                  <SelectItem value="optimized">Optimized Staffing</SelectItem>
                  <SelectItem value="ramadan">Ramadan Schedule</SelectItem>
                  <SelectItem value="newMenu">New Menu Launch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="average-check">Average Check (SAR)</Label>
                <span className="text-sm font-medium">{averageCheck}</span>
              </div>
              <Slider
                id="average-check"
                value={[averageCheck]}
                min={50}
                max={300}
                step={5}
                onValueChange={(value) => setAverageCheck(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="seating-capacity">Seating Capacity</Label>
                <span className="text-sm font-medium">{seatingCapacity}</span>
              </div>
              <Slider
                id="seating-capacity"
                value={[seatingCapacity]}
                min={50}
                max={300}
                step={5}
                onValueChange={(value) => setSeatingCapacity(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="turnover-rate">Turnover Rate (per day)</Label>
                <span className="text-sm font-medium">{turnoverRate.toFixed(1)}</span>
              </div>
              <Slider
                id="turnover-rate"
                value={[turnoverRate]}
                min={1}
                max={5}
                step={0.1}
                onValueChange={(value) => setTurnoverRate(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="occupancy-rate">Occupancy Rate (%)</Label>
                <span className="text-sm font-medium">{occupancyRate}%</span>
              </div>
              <Slider
                id="occupancy-rate"
                value={[occupancyRate]}
                min={30}
                max={100}
                step={1}
                onValueChange={(value) => setOccupancyRate(value[0])}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="seasonality" checked={includeSeasonality} onCheckedChange={setIncludeSeasonality} />
              <Label htmlFor="seasonality">Include Seasonality Effects</Label>
            </div>

            <Button onClick={recalculate} className="w-full">
              Recalculate Projections
            </Button>
          </div>

          <div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={projectedData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`SAR ${value.toLocaleString()}`, ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#4f46e5" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="projected" name="Projected" stroke="#10b981" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Annual Baseline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">SAR {totalBaseline.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Annual Projected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">SAR {totalProjected.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {totalDifference >= 0 ? "+" : ""}
                    {totalDifference.toLocaleString()} ({totalPercentChange}%)
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Baseline (SAR)</TableHead>
              <TableHead className="text-right">Projected (SAR)</TableHead>
              <TableHead className="text-right">Difference (SAR)</TableHead>
              <TableHead className="text-right">Change (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectedData.map((month, index) => (
              <TableRow key={index}>
                <TableCell>{month.month}</TableCell>
                <TableCell className="text-right">{month.baseline.toLocaleString()}</TableCell>
                <TableCell className="text-right">{month.projected.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <span className={month.difference >= 0 ? "text-green-600" : "text-red-600"}>
                    {month.difference >= 0 ? "+" : ""}
                    {month.difference.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={month.difference >= 0 ? "text-green-600" : "text-red-600"}>
                    {month.difference >= 0 ? "+" : ""}
                    {month.percentChange}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{totalBaseline.toLocaleString()}</TableCell>
              <TableCell className="text-right">{totalProjected.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <span className={totalDifference >= 0 ? "text-green-600" : "text-red-600"}>
                  {totalDifference >= 0 ? "+" : ""}
                  {totalDifference.toLocaleString()}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className={totalDifference >= 0 ? "text-green-600" : "text-red-600"}>
                  {totalDifference >= 0 ? "+" : ""}
                  {totalPercentChange}%
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

