"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Edit2 } from "lucide-react"

export default function StaffConfiguration() {
  const [fohPositions, setFohPositions] = useState([
    { id: 1, title: "Server/Waiter", baseSalary: 3500, department: "FOH" },
    { id: 2, title: "Runner/Busser", baseSalary: 2800, department: "FOH" },
    { id: 3, title: "Host/Hostess", baseSalary: 3200, department: "FOH" },
    { id: 4, title: "Restaurant Manager", baseSalary: 8000, department: "FOH" },
    { id: 5, title: "Cashier", baseSalary: 3000, department: "FOH" },
  ])

  const [bohPositions, setBohPositions] = useState([
    { id: 6, title: "Executive Chef", baseSalary: 12000, department: "BOH" },
    { id: 7, title: "Sous Chef", baseSalary: 8000, department: "BOH" },
    { id: 8, title: "Line Cook", baseSalary: 4500, department: "BOH" },
    { id: 9, title: "Prep Cook", baseSalary: 3500, department: "BOH" },
    { id: 10, title: "Kitchen Helper", baseSalary: 2800, department: "BOH" },
    { id: 11, title: "Dishwasher", baseSalary: 2500, department: "BOH" },
  ])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="foh">
        <TabsList>
          <TabsTrigger value="foh">Front of House (FOH)</TabsTrigger>
          <TabsTrigger value="boh">Back of House (BOH)</TabsTrigger>
        </TabsList>

        <TabsContent value="foh" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>FOH Staff Positions</CardTitle>
              <CardDescription>Configure front of house staff positions and salaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add FOH Position
                  </Button>
                </div>

                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Position Title</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Base Salary (SAR)</th>
                        <th className="h-12 px-4 text-left align-middle font-medium w-[100px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fohPositions.map((position) => (
                        <tr
                          key={position.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{position.title}</td>
                          <td className="p-4 align-middle">{position.baseSalary.toLocaleString()}</td>
                          <td className="p-4 align-middle">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boh" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>BOH Staff Positions</CardTitle>
              <CardDescription>Configure back of house staff positions and salaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add BOH Position
                  </Button>
                </div>

                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Position Title</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Base Salary (SAR)</th>
                        <th className="h-12 px-4 text-left align-middle font-medium w-[100px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bohPositions.map((position) => (
                        <tr
                          key={position.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{position.title}</td>
                          <td className="p-4 align-middle">{position.baseSalary.toLocaleString()}</td>
                          <td className="p-4 align-middle">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Staff Cost Parameters</CardTitle>
          <CardDescription>Configure additional staff cost parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="benefits-percentage">Benefits Percentage (%)</Label>
              <Input id="benefits-percentage" type="number" defaultValue="15" />
              <p className="text-xs text-muted-foreground">Percentage of base salary allocated for benefits</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="training-cost">Training Cost per Staff (SAR)</Label>
              <Input id="training-cost" type="number" defaultValue="1500" />
              <p className="text-xs text-muted-foreground">One-time cost for training new staff</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recruitment-cost">Recruitment Cost per Staff (SAR)</Label>
              <Input id="recruitment-cost" type="number" defaultValue="2000" />
              <p className="text-xs text-muted-foreground">One-time cost for recruiting new staff</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="staff-meal-cost">Staff Meal Cost per Day (SAR)</Label>
              <Input id="staff-meal-cost" type="number" defaultValue="25" />
              <p className="text-xs text-muted-foreground">Daily cost for providing staff meals</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="overtime-multiplier">Overtime Pay Multiplier</Label>
              <Input id="overtime-multiplier" type="number" defaultValue="1.5" step="0.1" />
              <p className="text-xs text-muted-foreground">Multiplier for overtime hours (e.g., 1.5x regular pay)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="turnover-rate">Annual Turnover Rate (%)</Label>
              <Input id="turnover-rate" type="number" defaultValue="30" />
              <p className="text-xs text-muted-foreground">
                Expected percentage of staff that will need to be replaced annually
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save Cost Parameters</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

