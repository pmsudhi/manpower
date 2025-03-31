"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Plus, Minus } from "lucide-react"

interface StaffingStructureVisualizationProps {
  className?: string
}

export function StaffingStructureVisualization({ className }: StaffingStructureVisualizationProps) {
  const [activeTab, setActiveTab] = useState("foh")

  // Sample FOH staffing data
  const fohStaffing = [
    {
      position: "Restaurant Manager",
      count: 1,
      level: 0,
      salary: 12000,
      color: "bg-primary",
    },
    {
      position: "Assistant Manager",
      count: 1,
      level: 1,
      salary: 8000,
      color: "bg-primary/80",
    },
    {
      position: "Shift Supervisor",
      count: 2,
      level: 2,
      salary: 6000,
      color: "bg-primary/60",
    },
    {
      position: "Host/Hostess",
      count: 2,
      level: 3,
      salary: 4000,
      color: "bg-secondary",
      reportTo: "Shift Supervisor",
    },
    {
      position: "Waiters",
      count: 8,
      level: 3,
      salary: 3500,
      color: "bg-secondary",
      reportTo: "Shift Supervisor",
    },
    {
      position: "Runners",
      count: 4,
      level: 4,
      salary: 3000,
      color: "bg-secondary/80",
      reportTo: "Waiters",
    },
    {
      position: "Cashiers",
      count: 2,
      level: 3,
      salary: 3500,
      color: "bg-secondary",
      reportTo: "Shift Supervisor",
    },
  ]

  // Sample BOH staffing data
  const bohStaffing = [
    {
      position: "Executive Chef",
      count: 1,
      level: 0,
      salary: 10000,
      color: "bg-destructive",
    },
    {
      position: "Sous Chef",
      count: 1,
      level: 1,
      salary: 7000,
      color: "bg-destructive/80",
    },
    {
      position: "Line Cooks",
      count: 4,
      level: 2,
      salary: 4500,
      color: "bg-destructive/60",
      reportTo: "Sous Chef",
    },
    {
      position: "Prep Cooks",
      count: 3,
      level: 3,
      salary: 3500,
      color: "bg-destructive/50",
      reportTo: "Line Cooks",
    },
    {
      position: "Kitchen Helpers",
      count: 2,
      level: 3,
      salary: 3000,
      color: "bg-destructive/40",
      reportTo: "Sous Chef",
    },
    {
      position: "Dishwashers",
      count: 2,
      level: 3,
      salary: 2800,
      color: "bg-destructive/40",
      reportTo: "Kitchen Helpers",
    },
  ]

  // Calculate total staff and labor cost
  const calculateTotals = (staffing: any[]) => {
    const totalStaff = staffing.reduce((sum, staff) => sum + staff.count, 0)
    const totalLabor = staffing.reduce((sum, staff) => sum + staff.salary * staff.count, 0)
    return { totalStaff, totalLabor }
  }

  const fohTotals = calculateTotals(fohStaffing)
  const bohTotals = calculateTotals(bohStaffing)
  const grandTotals = {
    totalStaff: fohTotals.totalStaff + bohTotals.totalStaff,
    totalLabor: fohTotals.totalLabor + bohTotals.totalLabor,
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Staffing Structure</CardTitle>
            <CardDescription>Visualize the organizational structure and staffing requirements</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="foh">Front of House</TabsTrigger>
            <TabsTrigger value="boh">Back of House</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          {/* FOH Tab */}
          <TabsContent value="foh" className="space-y-4">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="space-y-6">
                  {/* Organization Chart */}
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <div className="flex flex-col items-center">
                      {fohStaffing.map((staff, index) => (
                        <div
                          key={index}
                          className={`${staff.level > 0 ? "mt-4" : "mt-0"} ${staff.level > 0 ? "ml-" + (staff.level * 8) : ""}`}
                          style={{ marginLeft: `${staff.level * 2}rem` }}
                        >
                          <div className={`flex items-center gap-2 ${staff.color} text-white rounded-md px-3 py-2`}>
                            <div className="font-medium">{staff.position}</div>
                            <Badge variant="outline" className="bg-white/20 text-white">
                              {staff.count}
                            </Badge>
                          </div>
                          {staff.reportTo && (
                            <div className="text-xs text-muted-foreground ml-2 mt-1">Reports to: {staff.reportTo}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staffing Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">Position</th>
                          <th className="text-center p-3 font-medium">Count</th>
                          <th className="text-center p-3 font-medium">Monthly Salary</th>
                          <th className="text-center p-3 font-medium">Total Cost</th>
                          <th className="text-center p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fohStaffing.map((staff, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-3">{staff.position}</td>
                            <td className="p-3 text-center">{staff.count}</td>
                            <td className="p-3 text-center">SAR {staff.salary.toLocaleString()}</td>
                            <td className="p-3 text-center">SAR {(staff.salary * staff.count).toLocaleString()}</td>
                            <td className="p-3 text-center">
                              <div className="flex justify-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t bg-muted/30">
                          <td className="p-3 font-medium">Total</td>
                          <td className="p-3 text-center font-medium">{fohTotals.totalStaff}</td>
                          <td className="p-3 text-center"></td>
                          <td className="p-3 text-center font-medium">SAR {fohTotals.totalLabor.toLocaleString()}</td>
                          <td className="p-3 text-center"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* BOH Tab */}
          <TabsContent value="boh" className="space-y-4">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="space-y-6">
                  {/* Organization Chart */}
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <div className="flex flex-col items-center">
                      {bohStaffing.map((staff, index) => (
                        <div
                          key={index}
                          className={`${staff.level > 0 ? "mt-4" : "mt-0"} ${staff.level > 0 ? "ml-" + (staff.level * 8) : ""}`}
                          style={{ marginLeft: `${staff.level * 2}rem` }}
                        >
                          <div className={`flex items-center gap-2 ${staff.color} text-white rounded-md px-3 py-2`}>
                            <div className="font-medium">{staff.position}</div>
                            <Badge variant="outline" className="bg-white/20 text-white">
                              {staff.count}
                            </Badge>
                          </div>
                          {staff.reportTo && (
                            <div className="text-xs text-muted-foreground ml-2 mt-1">Reports to: {staff.reportTo}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staffing Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">Position</th>
                          <th className="text-center p-3 font-medium">Count</th>
                          <th className="text-center p-3 font-medium">Monthly Salary</th>
                          <th className="text-center p-3 font-medium">Total Cost</th>
                          <th className="text-center p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bohStaffing.map((staff, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-3">{staff.position}</td>
                            <td className="p-3 text-center">{staff.count}</td>
                            <td className="p-3 text-center">SAR {staff.salary.toLocaleString()}</td>
                            <td className="p-3 text-center">SAR {(staff.salary * staff.count).toLocaleString()}</td>
                            <td className="p-3 text-center">
                              <div className="flex justify-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t bg-muted/30">
                          <td className="p-3 font-medium">Total</td>
                          <td className="p-3 text-center font-medium">{bohTotals.totalStaff}</td>
                          <td className="p-3 text-center"></td>
                          <td className="p-3 text-center font-medium">SAR {bohTotals.totalLabor.toLocaleString()}</td>
                          <td className="p-3 text-center"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Staff Count Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-primary/10 p-3 rounded-md">
                        <div className="text-xs text-muted-foreground">Front of House</div>
                        <div className="text-2xl font-bold">{fohTotals.totalStaff}</div>
                        <div className="text-xs text-muted-foreground">Staff Members</div>
                      </div>
                      <div className="bg-destructive/10 p-3 rounded-md">
                        <div className="text-xs text-muted-foreground">Back of House</div>
                        <div className="text-2xl font-bold">{bohTotals.totalStaff}</div>
                        <div className="text-xs text-muted-foreground">Staff Members</div>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="text-xs text-muted-foreground">Total Staff</div>
                      <div className="text-2xl font-bold">{grandTotals.totalStaff}</div>
                      <div className="text-xs text-muted-foreground">Staff Members</div>
                    </div>
                    <div className="text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <div>BOH to FOH Ratio:</div>
                        <div className="font-medium">{(bohTotals.totalStaff / fohTotals.totalStaff).toFixed(2)}</div>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <div>Management to Staff Ratio:</div>
                        <div className="font-medium">{(4 / (grandTotals.totalStaff - 4)).toFixed(2)}</div>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <div>Waiter to Runner Ratio:</div>
                        <div className="font-medium">{(8 / 4).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Labor Cost Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-primary/10 p-3 rounded-md">
                        <div className="text-xs text-muted-foreground">Front of House</div>
                        <div className="text-2xl font-bold">SAR {(fohTotals.totalLabor / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-muted-foreground">Monthly Labor Cost</div>
                      </div>
                      <div className="bg-destructive/10 p-3 rounded-md">
                        <div className="text-xs text-muted-foreground">Back of House</div>
                        <div className="text-2xl font-bold">SAR {(bohTotals.totalLabor / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-muted-foreground">Monthly Labor Cost</div>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="text-xs text-muted-foreground">Total Labor Cost</div>
                      <div className="text-2xl font-bold">SAR {(grandTotals.totalLabor / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-muted-foreground">Monthly Labor Cost</div>
                    </div>
                    <div className="text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <div>Average Salary per Staff:</div>
                        <div className="font-medium">
                          SAR {Math.round(grandTotals.totalLabor / grandTotals.totalStaff).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <div>Labor as % of Revenue (Est.):</div>
                        <div className="font-medium">9.8%</div>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <div>Annual Labor Cost:</div>
                        <div className="font-medium">SAR {((grandTotals.totalLabor * 12) / 1000000).toFixed(2)}M</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Staffing Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Industry Benchmarks</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Casual Dining: Labor cost should be 8-10% of revenue</li>
                      <li>• Recommended BOH to FOH ratio: 0.6-0.8</li>
                      <li>• Optimal management span of control: 8-12 staff per manager</li>
                      <li>• Recommended covers per waiter: 16-20 for casual dining</li>
                    </ul>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Optimization Opportunities</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Consider increasing covers per waiter from 16 to 20 to reduce FOH costs</li>
                      <li>• Implement cross-training between prep cooks and line cooks to improve flexibility</li>
                      <li>• Evaluate runner to waiter ratio - current 1:2 could be optimized to 1:3</li>
                      <li>• Consider technology solutions to improve order taking efficiency</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

