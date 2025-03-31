"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function PLIntegration() {
  const [selectedScenario, setSelectedScenario] = useState("current")
  const [selectedView, setSelectedView] = useState("monthly")

  // Sample P&L data
  const plData = {
    monthly: {
      revenue: 2500000,
      cogs: 750000,
      grossProfit: 1750000,
      laborCost: 600000,
      rent: 200000,
      utilities: 75000,
      marketing: 50000,
      other: 125000,
      totalExpenses: 1050000,
      operatingProfit: 700000,
      taxes: 140000,
      netProfit: 560000,
    },
    quarterly: {
      revenue: 7500000,
      cogs: 2250000,
      grossProfit: 5250000,
      laborCost: 1800000,
      rent: 600000,
      utilities: 225000,
      marketing: 150000,
      other: 375000,
      totalExpenses: 3150000,
      operatingProfit: 2100000,
      taxes: 420000,
      netProfit: 1680000,
    },
    annual: {
      revenue: 30000000,
      cogs: 9000000,
      grossProfit: 21000000,
      laborCost: 7200000,
      rent: 2400000,
      utilities: 900000,
      marketing: 600000,
      other: 1500000,
      totalExpenses: 12600000,
      operatingProfit: 8400000,
      taxes: 1680000,
      netProfit: 6720000,
    },
  }

  // Comparison data for different scenarios
  const scenarioComparison = {
    revenue: [
      { name: "Revenue", current: 30000000, optimized: 30000000, ramadan: 27000000, newMenu: 33000000 },
      { name: "COGS", current: 9000000, optimized: 9000000, ramadan: 8100000, newMenu: 10230000 },
      { name: "Gross Profit", current: 21000000, optimized: 21000000, ramadan: 18900000, newMenu: 22770000 },
    ],
    expenses: [
      { name: "Labor", current: 7200000, optimized: 6480000, ramadan: 6120000, newMenu: 7920000 },
      { name: "Rent", current: 2400000, optimized: 2400000, ramadan: 2400000, newMenu: 2400000 },
      { name: "Utilities", current: 900000, optimized: 900000, ramadan: 810000, newMenu: 990000 },
      { name: "Marketing", current: 600000, optimized: 600000, ramadan: 540000, newMenu: 900000 },
      { name: "Other", current: 1500000, optimized: 1500000, ramadan: 1350000, newMenu: 1650000 },
    ],
    profit: [
      { name: "Operating Profit", current: 8400000, optimized: 9120000, ramadan: 7680000, newMenu: 8910000 },
      { name: "Taxes", current: 1680000, optimized: 1824000, ramadan: 1536000, newMenu: 1782000 },
      { name: "Net Profit", current: 6720000, optimized: 7296000, ramadan: 6144000, newMenu: 7128000 },
    ],
  }

  const selectedData = plData[selectedView]

  // Calculate percentages
  const percentages = {
    cogs: ((selectedData.cogs / selectedData.revenue) * 100).toFixed(1),
    grossProfit: ((selectedData.grossProfit / selectedData.revenue) * 100).toFixed(1),
    laborCost: ((selectedData.laborCost / selectedData.revenue) * 100).toFixed(1),
    rent: ((selectedData.rent / selectedData.revenue) * 100).toFixed(1),
    utilities: ((selectedData.utilities / selectedData.revenue) * 100).toFixed(1),
    marketing: ((selectedData.marketing / selectedData.revenue) * 100).toFixed(1),
    other: ((selectedData.other / selectedData.revenue) * 100).toFixed(1),
    totalExpenses: ((selectedData.totalExpenses / selectedData.revenue) * 100).toFixed(1),
    operatingProfit: ((selectedData.operatingProfit / selectedData.revenue) * 100).toFixed(1),
    taxes: ((selectedData.taxes / selectedData.revenue) * 100).toFixed(1),
    netProfit: ((selectedData.netProfit / selectedData.revenue) * 100).toFixed(1),
  }

  const handleExportPDF = () => {
    alert("Exporting P&L statement as PDF...")
  }

  const handleExportExcel = () => {
    alert("Exporting P&L statement as Excel...")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Profit & Loss Integration</CardTitle>
            <CardDescription>Financial impact of staffing scenarios on P&L</CardDescription>
          </div>
          <div className="flex gap-4">
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Operation</SelectItem>
                <SelectItem value="optimized">Optimized Staffing</SelectItem>
                <SelectItem value="ramadan">Ramadan Schedule</SelectItem>
                <SelectItem value="newMenu">New Menu Launch</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedView} onValueChange={setSelectedView}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>

        <Tabs defaultValue="statement">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="statement">P&L Statement</TabsTrigger>
            <TabsTrigger value="comparison">Scenario Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="statement" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Item</TableHead>
                  <TableHead className="text-right">Amount (SAR)</TableHead>
                  <TableHead className="text-right">% of Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="font-medium">
                  <TableCell>Revenue</TableCell>
                  <TableCell className="text-right">{selectedData.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">100.0%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cost of Goods Sold (COGS)</TableCell>
                  <TableCell className="text-right">{selectedData.cogs.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{percentages.cogs}%</TableCell>
                </TableRow>
                <TableRow className="font-medium bg-muted/50">
                  <TableCell>Gross Profit</TableCell>
                  <TableCell className="text-right">{selectedData.grossProfit.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{percentages.grossProfit}%</TableCell>
                </TableRow>
                <TableRow className="border-t-2">
                  <TableCell className="font-medium">Operating Expenses</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow className="bg-amber-50">
                  <TableCell className="pl-6">Labor Cost</TableCell>
                  <TableCell className="text-right">{selectedData.laborCost.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{percentages.laborCost}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Rent</TableCell>
                  <TableCell className="text-right">{selectedData.rent.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{percentages.rent}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Utilities</TableCell>
                  <TableCell className="text-right">{selectedData.utilities.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{percentages.utilities}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Marketing</TableCell>
                  <TableCell className="text-right">{selectedData.marketing.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{percentages.marketing}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Other Expenses</TableCell>
                  <TableCell className="text-right">{selectedData.other.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{percentages.other}%</TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell>Total Operating Expenses</TableCell>
                  <TableCell className="text-right">{selectedData.totalExpenses.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{percentages.totalExpenses}%</TableCell>
                </TableRow>
                <TableRow className="font-medium bg-muted/50">
                  <TableCell>Operating Profit</TableCell>
                  <TableCell className="text-right">{selectedData.operatingProfit.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{percentages.operatingProfit}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Taxes</TableCell>
                  <TableCell className="text-right">{selectedData.taxes.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{percentages.taxes}%</TableCell>
                </TableRow>
                <TableRow className="font-medium text-lg bg-green-50">
                  <TableCell>Net Profit</TableCell>
                  <TableCell className="text-right">{selectedData.netProfit.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{percentages.netProfit}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="comparison" className="mt-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Revenue & Gross Profit Comparison</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scenarioComparison.revenue}
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
                      <Tooltip formatter={(value) => [`SAR ${(value / 1000000).toFixed(2)}M`, ""]} />
                      <Legend />
                      <Bar dataKey="current" name="Current Operation" fill="#4f46e5" />
                      <Bar dataKey="optimized" name="Optimized Staffing" fill="#10b981" />
                      <Bar dataKey="ramadan" name="Ramadan Schedule" fill="#f59e0b" />
                      <Bar dataKey="newMenu" name="New Menu Launch" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Operating Expenses Comparison</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scenarioComparison.expenses}
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
                      <Tooltip formatter={(value) => [`SAR ${(value / 1000000).toFixed(2)}M`, ""]} />
                      <Legend />
                      <Bar dataKey="current" name="Current Operation" fill="#4f46e5" />
                      <Bar dataKey="optimized" name="Optimized Staffing" fill="#10b981" />
                      <Bar dataKey="ramadan" name="Ramadan Schedule" fill="#f59e0b" />
                      <Bar dataKey="newMenu" name="New Menu Launch" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Profit Comparison</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scenarioComparison.profit}
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
                      <Tooltip formatter={(value) => [`SAR ${(value / 1000000).toFixed(2)}M`, ""]} />
                      <Legend />
                      <Bar dataKey="current" name="Current Operation" fill="#4f46e5" />
                      <Bar dataKey="optimized" name="Optimized Staffing" fill="#10b981" />
                      <Bar dataKey="ramadan" name="Ramadan Schedule" fill="#f59e0b" />
                      <Bar dataKey="newMenu" name="New Menu Launch" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Key Insights:</h3>
                <ul className="text-sm space-y-1">
                  <li>• Optimized Staffing scenario reduces labor costs by 10% while maintaining revenue</li>
                  <li>• Ramadan Schedule shows 10% lower revenue but only 15% lower labor costs</li>
                  <li>• New Menu Launch increases revenue by 10% but requires 10% more labor</li>
                  <li>• Optimized Staffing provides the highest net profit margin at 24.3%</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

