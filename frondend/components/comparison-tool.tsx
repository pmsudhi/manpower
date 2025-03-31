"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRight, Download } from "lucide-react"
import StaffingComparisonChart from "./charts/staffing-comparison-chart"
import CostComparisonChart from "./charts/cost-comparison-chart"
import EfficiencyComparisonChart from "./charts/efficiency-comparison-chart"

export default function ComparisonTool() {
  const [scenarioA, setScenarioA] = useState("scenario-1")
  const [scenarioB, setScenarioB] = useState("scenario-2")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scenario Comparison</h2>
          <p className="text-muted-foreground">Compare different staffing scenarios side by side</p>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Comparison
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scenario A</CardTitle>
            <CardDescription>Select the first scenario to compare</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={scenarioA} onValueChange={setScenarioA}>
              <SelectTrigger>
                <SelectValue placeholder="Select Scenario A" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scenario-1">Burger Boutique - Mall of Dhahran (Current)</SelectItem>
                <SelectItem value="scenario-2">Burger Boutique - Mall of Dhahran (Optimized)</SelectItem>
                <SelectItem value="scenario-3">Lazy Cat - Riyadh Park (Current)</SelectItem>
                <SelectItem value="scenario-4">Nomad - Jeddah Corniche (Proposed)</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Staff:</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>FOH Staff:</span>
                <span className="font-medium">14</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>BOH Staff:</span>
                <span className="font-medium">10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Labor Cost (% of Revenue):</span>
                <span className="font-medium">26.4%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Monthly Labor Cost:</span>
                <span className="font-medium">SAR 184,500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Covers per Labor Hour:</span>
                <span className="font-medium">4.2</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scenario B</CardTitle>
            <CardDescription>Select the second scenario to compare</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={scenarioB} onValueChange={setScenarioB}>
              <SelectTrigger>
                <SelectValue placeholder="Select Scenario B" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scenario-1">Burger Boutique - Mall of Dhahran (Current)</SelectItem>
                <SelectItem value="scenario-2">Burger Boutique - Mall of Dhahran (Optimized)</SelectItem>
                <SelectItem value="scenario-3">Lazy Cat - Riyadh Park (Current)</SelectItem>
                <SelectItem value="scenario-4">Nomad - Jeddah Corniche (Proposed)</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Staff:</span>
                <span className="font-medium">21</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>FOH Staff:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>BOH Staff:</span>
                <span className="font-medium">9</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Labor Cost (% of Revenue):</span>
                <span className="font-medium">23.1%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Monthly Labor Cost:</span>
                <span className="font-medium">SAR 161,700</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Covers per Labor Hour:</span>
                <span className="font-medium">4.8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparison Results</CardTitle>
          <CardDescription>
            Comparing Burger Boutique - Mall of Dhahran (Current) with Burger Boutique - Mall of Dhahran (Optimized)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Staff Reduction</p>
                <p className="text-2xl font-bold text-green-600">-3</p>
                <p className="text-xs text-muted-foreground">-12.5% reduction</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Monthly Cost Savings</p>
                <p className="text-2xl font-bold text-green-600">SAR 22,800</p>
                <p className="text-xs text-muted-foreground">-12.4% reduction</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Efficiency Improvement</p>
                <p className="text-2xl font-bold text-green-600">+0.6</p>
                <p className="text-xs text-muted-foreground">+14.3% increase in covers per labor hour</p>
              </div>
            </div>

            <Tabs defaultValue="staffing">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="staffing">Staffing Comparison</TabsTrigger>
                <TabsTrigger value="cost">Cost Comparison</TabsTrigger>
                <TabsTrigger value="efficiency">Efficiency Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="staffing" className="mt-4">
                <StaffingComparisonChart />
              </TabsContent>

              <TabsContent value="cost" className="mt-4">
                <CostComparisonChart />
              </TabsContent>

              <TabsContent value="efficiency" className="mt-4">
                <EfficiencyComparisonChart />
              </TabsContent>
            </Tabs>

            <div className="pt-4">
              <h3 className="text-lg font-medium mb-2">Key Differences</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                  <span>
                    Increased covers per waiter from 16 to 20 through better training and service optimization
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                  <span>
                    Reduced runner to waiter ratio from 50% to 25% by implementing more efficient service patterns
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                  <span>Increased staff utilization rate from 80% to 85% through better scheduling</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                  <span>Implemented cross-training between stations to reduce kitchen staff requirements</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

