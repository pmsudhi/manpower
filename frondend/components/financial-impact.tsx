"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import RevenueProjections from "./revenue-projections"
import PLIntegration from "./pl-integration"

export default function FinancialImpact() {
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedOutlet, setSelectedOutlet] = useState("all")
  const [selectedScenario, setSelectedScenario] = useState("current")
  const [activeTab, setActiveTab] = useState("trends")

  // Sample financial data
  const monthlyData = [
    { month: "Jan", revenue: 650000, laborCost: 162500, laborPercentage: 25.0 },
    { month: "Feb", revenue: 680000, laborCost: 163200, laborPercentage: 24.0 },
    { month: "Mar", revenue: 720000, laborCost: 172800, laborPercentage: 24.0 },
    { month: "Apr", revenue: 700000, laborCost: 175000, laborPercentage: 25.0 },
    { month: "May", revenue: 750000, laborCost: 180000, laborPercentage: 24.0 },
    { month: "Jun", revenue: 800000, laborCost: 184000, laborPercentage: 23.0 },
    { month: "Jul", revenue: 850000, laborCost: 195500, laborPercentage: 23.0 },
    { month: "Aug", revenue: 820000, laborCost: 196800, laborPercentage: 24.0 },
    { month: "Sep", revenue: 780000, laborCost: 187200, laborPercentage: 24.0 },
    { month: "Oct", revenue: 760000, laborCost: 182400, laborPercentage: 24.0 },
    { month: "Nov", revenue: 800000, laborCost: 184000, laborPercentage: 23.0 },
    { month: "Dec", revenue: 900000, laborCost: 207000, laborPercentage: 23.0 },
  ]

  // Department cost breakdown
  const departmentCosts = [
    { department: "FOH Management", monthlyCost: 28000, percentage: 16.9 },
    { department: "FOH Service", monthlyCost: 63000, percentage: 38.1 },
    { department: "BOH Management", monthlyCost: 15000, percentage: 9.1 },
    { department: "BOH Kitchen", monthlyCost: 43500, percentage: 26.3 },
    { department: "BOH Support", monthlyCost: 16000, percentage: 9.7 },
  ]

  // Position cost breakdown
  const positionCosts = [
    { position: "Restaurant Manager", count: 1, monthlyCost: 12000, percentage: 7.3 },
    { position: "Assistant Manager", count: 2, monthlyCost: 16000, percentage: 9.7 },
    { position: "Host/Hostess", count: 2, monthlyCost: 9000, percentage: 5.4 },
    { position: "Waiter/Waitress", count: 8, monthlyCost: 32000, percentage: 19.3 },
    { position: "Runner", count: 4, monthlyCost: 14000, percentage: 8.5 },
    { position: "Bartender", count: 2, monthlyCost: 10000, percentage: 6.0 },
    { position: "Cashier", count: 2, monthlyCost: 8000, percentage: 4.8 },
    { position: "Executive Chef", count: 1, monthlyCost: 15000, percentage: 9.1 },
    { position: "Sous Chef", count: 2, monthlyCost: 20000, percentage: 12.1 },
    { position: "Line Cook", count: 4, monthlyCost: 24000, percentage: 14.5 },
    { position: "Prep Cook", count: 3, monthlyCost: 13500, percentage: 8.2 },
    { position: "Dishwasher", count: 2, monthlyCost: 7000, percentage: 4.2 },
    { position: "Kitchen Helper", count: 2, monthlyCost: 6000, percentage: 3.6 },
  ]

  // Calculate totals
  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0)
  const totalLaborCost = monthlyData.reduce((sum, month) => sum + month.laborCost, 0)
  const averageLaborPercentage = (totalLaborCost / totalRevenue) * 100
  const totalStaff = positionCosts.reduce((sum, position) => sum + position.count, 0)
  const costPerSeat = totalLaborCost / 12 / 120 // Assuming 120 seats

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Impact</h2>
          <p className="text-muted-foreground">Analyze how staffing affects your P&L</p>
        </div>

        <div className="flex gap-4">
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="burger-boutique">Burger Boutique</SelectItem>
              <SelectItem value="lazy-cat">Lazy Cat</SelectItem>
              <SelectItem value="nomad">Nomad</SelectItem>
              <SelectItem value="swaikhat">Swaikhat</SelectItem>
              <SelectItem value="white-robata">White Robata</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Outlet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outlets</SelectItem>
              <SelectItem value="mall-of-dhahran">Mall of Dhahran</SelectItem>
              <SelectItem value="riyadh-park">Riyadh Park</SelectItem>
              <SelectItem value="jeddah-corniche">Jeddah Corniche</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedScenario} onValueChange={setSelectedScenario}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Scenario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Operation</SelectItem>
              <SelectItem value="optimized">Optimized Staffing</SelectItem>
              <SelectItem value="ramadan">Ramadan Schedule</SelectItem>
              <SelectItem value="new-menu">New Menu Launch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annual Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SAR {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Based on 12-month projection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annual Labor Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SAR {totalLaborCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total staff cost for 12 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Labor % of Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageLaborPercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Industry benchmark: 25-30%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost per Seat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SAR {costPerSeat.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Based on 120 seats</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="trends">Revenue vs. Labor</TabsTrigger>
          <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Projections</TabsTrigger>
          <TabsTrigger value="pl">P&L Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue vs. Labor Cost</CardTitle>
              <CardDescription>12-month financial trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value) => [`SAR ${value.toLocaleString()}`, ""]} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#4f46e5"
                      activeDot={{ r: 8 }}
                    />
                    <Line yAxisId="right" type="monotone" dataKey="laborCost" name="Labor Cost" stroke="#ef4444" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Labor Cost Breakdown by Department</CardTitle>
              <CardDescription>Distribution of labor costs across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentCosts}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`SAR ${value.toLocaleString()}`, "Monthly Cost"]} />
                    <Legend />
                    <Bar dataKey="monthlyCost" name="Monthly Cost" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Monthly Cost (SAR)</TableHead>
                      <TableHead className="text-right">% of Total Labor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentCosts.map((dept, index) => (
                      <TableRow key={index}>
                        <TableCell>{dept.department}</TableCell>
                        <TableCell className="text-right">{dept.monthlyCost.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{dept.percentage}%</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {departmentCosts.reduce((sum, dept) => sum + dept.monthlyCost, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <RevenueProjections />
        </TabsContent>

        <TabsContent value="pl" className="mt-4">
          <PLIntegration />
        </TabsContent>
      </Tabs>
    </div>
  )
}

