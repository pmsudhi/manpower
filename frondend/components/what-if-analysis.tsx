"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useToast } from "@/components/ui/use-toast"

export default function WhatIfAnalysis() {
  const { toast } = useToast()
  const [baseScenario, setBaseScenario] = useState("current")
  const [staffingLevel, setStaffingLevel] = useState(100)
  const [averageWage, setAverageWage] = useState(100)
  const [operatingHours, setOperatingHours] = useState(100)
  const [serviceEfficiency, setServiceEfficiency] = useState(100)
  const [customerVolume, setCustomerVolume] = useState(100)
  const [averageCheck, setAverageCheck] = useState(100)

  // Base scenario data
  const baseScenarioData = {
    current: {
      totalStaff: 33,
      laborCost: 165500,
      laborPercentage: 24.8,
      revenue: 667000,
      customersServed: 5560,
      averageCheck: 120,
      operatingHours: 12,
      serviceTime: 45,
    },
  }

  // Calculate impact based on sliders
  const calculateImpact = () => {
    const base = baseScenarioData[baseScenario]

    // Staff count impact
    const newStaffCount = Math.round(base.totalStaff * (staffingLevel / 100))

    // Labor cost impact
    const staffingFactor = staffingLevel / 100
    const wageFactor = averageWage / 100
    const hoursFactor = operatingHours / 100
    const newLaborCost = Math.round(base.laborCost * staffingFactor * wageFactor * hoursFactor)

    // Revenue impact
    const efficiencyFactor = serviceEfficiency / 100
    const volumeFactor = customerVolume / 100
    const checkFactor = averageCheck / 100
    const newRevenue = Math.round(base.revenue * efficiencyFactor * volumeFactor * checkFactor)

    // Customers served impact
    const newCustomersServed = Math.round(
      base.customersServed * volumeFactor * (staffingFactor > 0.8 ? 1 : staffingFactor / 0.8),
    )

    // Service time impact
    const newServiceTime = Math.round(base.serviceTime * (2 - efficiencyFactor) * (2 - staffingFactor))

    // Labor percentage impact
    const newLaborPercentage = ((newLaborCost / newRevenue) * 100).toFixed(1)

    return {
      totalStaff: newStaffCount,
      laborCost: newLaborCost,
      laborPercentage: newLaborPercentage,
      revenue: newRevenue,
      customersServed: newCustomersServed,
      serviceTime: newServiceTime,
      profitImpact: newRevenue - base.revenue - (newLaborCost - base.laborCost),
    }
  }

  const impact = calculateImpact()
  const base = baseScenarioData[baseScenario]

  // Prepare chart data
  const comparisonData = [
    {
      name: "Total Staff",
      "Base Scenario": base.totalStaff,
      "What-If Scenario": impact.totalStaff,
    },
    {
      name: "Labor Cost (K SAR)",
      "Base Scenario": base.laborCost / 1000,
      "What-If Scenario": impact.laborCost / 1000,
    },
    {
      name: "Revenue (K SAR)",
      "Base Scenario": base.revenue / 1000,
      "What-If Scenario": impact.revenue / 1000,
    },
    {
      name: "Customers Served",
      "Base Scenario": base.customersServed,
      "What-If Scenario": impact.customersServed,
    },
    {
      name: "Service Time (min)",
      "Base Scenario": base.serviceTime,
      "What-If Scenario": impact.serviceTime,
    },
  ]

  const handleSaveScenario = () => {
    toast({
      title: "What-If Scenario Saved",
      description: "Your what-if scenario has been saved for further analysis.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>What-If Analysis</CardTitle>
        <CardDescription>
          Adjust parameters to see how changes would impact your staffing and financial metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="base-scenario">Base Scenario</Label>
              <Select id="base-scenario" value={baseScenario} onValueChange={setBaseScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Base Scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Operation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="staffing-level">Staffing Level (%)</Label>
                <span className="text-sm font-medium">{staffingLevel}%</span>
              </div>
              <Slider
                id="staffing-level"
                value={[staffingLevel]}
                min={50}
                max={150}
                step={1}
                onValueChange={(value) => setStaffingLevel(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Adjust the total number of staff compared to the base scenario
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="average-wage">Average Wage (%)</Label>
                <span className="text-sm font-medium">{averageWage}%</span>
              </div>
              <Slider
                id="average-wage"
                value={[averageWage]}
                min={80}
                max={120}
                step={1}
                onValueChange={(value) => setAverageWage(value[0])}
              />
              <p className="text-xs text-muted-foreground">Adjust the average wage compared to the base scenario</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="operating-hours">Operating Hours (%)</Label>
                <span className="text-sm font-medium">{operatingHours}%</span>
              </div>
              <Slider
                id="operating-hours"
                value={[operatingHours]}
                min={80}
                max={120}
                step={1}
                onValueChange={(value) => setOperatingHours(value[0])}
              />
              <p className="text-xs text-muted-foreground">Adjust the operating hours compared to the base scenario</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="service-efficiency">Service Efficiency (%)</Label>
                <span className="text-sm font-medium">{serviceEfficiency}%</span>
              </div>
              <Slider
                id="service-efficiency"
                value={[serviceEfficiency]}
                min={80}
                max={120}
                step={1}
                onValueChange={(value) => setServiceEfficiency(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Adjust the service efficiency compared to the base scenario
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="customer-volume">Customer Volume (%)</Label>
                <span className="text-sm font-medium">{customerVolume}%</span>
              </div>
              <Slider
                id="customer-volume"
                value={[customerVolume]}
                min={80}
                max={120}
                step={1}
                onValueChange={(value) => setCustomerVolume(value[0])}
              />
              <p className="text-xs text-muted-foreground">Adjust the customer volume compared to the base scenario</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="average-check">Average Check (%)</Label>
                <span className="text-sm font-medium">{averageCheck}%</span>
              </div>
              <Slider
                id="average-check"
                value={[averageCheck]}
                min={80}
                max={120}
                step={1}
                onValueChange={(value) => setAverageCheck(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Adjust the average check amount compared to the base scenario
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Base Scenario" fill="#4f46e5" />
                  <Bar dataKey="What-If Scenario" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Impact on Labor Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">SAR {impact.laborCost.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {impact.laborCost > base.laborCost ? "+" : ""}
                    {(impact.laborCost - base.laborCost).toLocaleString()} (
                    {(((impact.laborCost - base.laborCost) / base.laborCost) * 100).toFixed(1)}%)
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Impact on Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">SAR {impact.revenue.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {impact.revenue > base.revenue ? "+" : ""}
                    {(impact.revenue - base.revenue).toLocaleString()} (
                    {(((impact.revenue - base.revenue) / base.revenue) * 100).toFixed(1)}%)
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Labor Percentage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{impact.laborPercentage}%</div>
                  <div className="text-xs text-muted-foreground">
                    {impact.laborPercentage > base.laborPercentage ? "+" : ""}
                    {(impact.laborPercentage - base.laborPercentage).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Profit Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">SAR {impact.profitImpact.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {impact.profitImpact > 0 ? "Positive" : "Negative"} impact on profit
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveScenario}>Save What-If Scenario</Button>
      </CardFooter>
    </Card>
  )
}

