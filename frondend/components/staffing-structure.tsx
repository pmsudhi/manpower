"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Printer, FileText } from "lucide-react"

export default function StaffingStructure() {
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedOutlet, setSelectedOutlet] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for staffing structure
  const staffingData = [
    { name: "FOH Management", value: 28, color: "#4f46e5" },
    { name: "FOH Service", value: 63, color: "#06b6d4" },
    { name: "BOH Management", value: 15, color: "#10b981" },
    { name: "BOH Kitchen", value: 43, color: "#f59e0b" },
    { name: "BOH Support", value: 16, color: "#ef4444" },
  ]

  const COLORS = staffingData.map((item) => item.color)

  // Detailed position data
  const positionData = {
    foh: [
      { position: "Restaurant Manager", count: 5, monthlyCost: 60000, avgSalary: 12000 },
      { position: "Assistant Manager", count: 10, monthlyCost: 90000, avgSalary: 9000 },
      { position: "Host/Hostess", count: 12, monthlyCost: 54000, avgSalary: 4500 },
      { position: "Waiter/Waitress", count: 42, monthlyCost: 168000, avgSalary: 4000 },
      { position: "Runner", count: 15, monthlyCost: 52500, avgSalary: 3500 },
      { position: "Bartender", count: 8, monthlyCost: 40000, avgSalary: 5000 },
      { position: "Cashier", count: 9, monthlyCost: 36000, avgSalary: 4000 },
    ],
    boh: [
      { position: "Executive Chef", count: 5, monthlyCost: 75000, avgSalary: 15000 },
      { position: "Sous Chef", count: 10, monthlyCost: 100000, avgSalary: 10000 },
      { position: "Line Cook", count: 20, monthlyCost: 120000, avgSalary: 6000 },
      { position: "Prep Cook", count: 15, monthlyCost: 67500, avgSalary: 4500 },
      { position: "Dishwasher", count: 12, monthlyCost: 42000, avgSalary: 3500 },
      { position: "Kitchen Helper", count: 12, monthlyCost: 42000, avgSalary: 3500 },
    ],
  }

  // Cost by department data
  const costByDepartmentData = [
    { department: "FOH Management", cost: 150000 },
    { department: "FOH Service", cost: 350500 },
    { department: "BOH Management", cost: 175000 },
    { department: "BOH Kitchen", cost: 329500 },
    { department: "BOH Support", cost: 42000 },
  ]

  // Calculate totals
  const totalFOHCount = positionData.foh.reduce((sum, pos) => sum + pos.count, 0)
  const totalBOHCount = positionData.boh.reduce((sum, pos) => sum + pos.count, 0)
  const totalFOHCost = positionData.foh.reduce((sum, pos) => sum + pos.monthlyCost, 0)
  const totalBOHCost = positionData.boh.reduce((sum, pos) => sum + pos.monthlyCost, 0)
  const totalStaff = totalFOHCount + totalBOHCount
  const totalCost = totalFOHCost + totalBOHCost

  const handleExportPDF = () => {
    alert("Exporting staffing structure as PDF...")
  }

  const handlePrint = () => {
    alert("Printing staffing structure...")
  }

  const handleExportExcel = () => {
    alert("Exporting staffing structure as Excel...")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Staffing Structure</h2>
          <p className="text-muted-foreground">Detailed breakdown of staff positions and costs</p>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">Across all outlets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">FOH/BOH Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalFOHCount / totalBOHCount).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {totalFOHCount} FOH / {totalBOHCount} BOH
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Labor Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SAR {totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Average SAR {Math.round(totalCost / totalStaff).toLocaleString()} per employee
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Distribution</CardTitle>
              <CardDescription>Breakdown by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={staffingData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {staffingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} staff`, ""]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Department Summary</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Staff Count</TableHead>
                        <TableHead className="text-right">% of Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffingData.map((dept, index) => (
                        <TableRow key={index}>
                          <TableCell>{dept.name}</TableCell>
                          <TableCell className="text-right">{dept.value}</TableCell>
                          <TableCell className="text-right">{((dept.value / totalStaff) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">{totalStaff}</TableCell>
                        <TableCell className="text-right">100%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Position Breakdown</CardTitle>
                  <CardDescription>Detailed staff positions and costs</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportExcel}>
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Front of House (FOH)</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Avg. Salary (SAR)</TableHead>
                        <TableHead className="text-right">Monthly Cost (SAR)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {positionData.foh.map((pos, index) => (
                        <TableRow key={index}>
                          <TableCell>{pos.position}</TableCell>
                          <TableCell className="text-right">{pos.count}</TableCell>
                          <TableCell className="text-right">{pos.avgSalary.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{pos.monthlyCost.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell>Total FOH</TableCell>
                        <TableCell className="text-right">{totalFOHCount}</TableCell>
                        <TableCell className="text-right">
                          {Math.round(totalFOHCost / totalFOHCount).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">{totalFOHCost.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Back of House (BOH)</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Avg. Salary (SAR)</TableHead>
                        <TableHead className="text-right">Monthly Cost (SAR)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {positionData.boh.map((pos, index) => (
                        <TableRow key={index}>
                          <TableCell>{pos.position}</TableCell>
                          <TableCell className="text-right">{pos.count}</TableCell>
                          <TableCell className="text-right">{pos.avgSalary.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{pos.monthlyCost.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell>Total BOH</TableCell>
                        <TableCell className="text-right">{totalBOHCount}</TableCell>
                        <TableCell className="text-right">
                          {Math.round(totalBOHCost / totalBOHCount).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">{totalBOHCost.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Labor Cost Analysis</CardTitle>
              <CardDescription>Cost breakdown by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={costByDepartmentData}
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
                      <Tooltip formatter={(value) => [`SAR ${value.toLocaleString()}`, ""]} />
                      <Bar dataKey="cost" name="Monthly Cost" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Cost Summary</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Monthly Cost (SAR)</TableHead>
                        <TableHead className="text-right">% of Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costByDepartmentData.map((dept, index) => (
                        <TableRow key={index}>
                          <TableCell>{dept.department}</TableCell>
                          <TableCell className="text-right">{dept.cost.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            {((dept.cost / costByDepartmentData.reduce((sum, d) => sum + d.cost, 0)) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                          {costByDepartmentData.reduce((sum, dept) => sum + dept.cost, 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">100%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

