"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WhatIfAnalysis from "./what-if-analysis"

export default function Scenarios({ onLoadScenario }) {
  const { toast } = useToast()
  const [selectedScenarios, setSelectedScenarios] = useState([])
  const [deleteScenarioId, setDeleteScenarioId] = useState(null)
  const [activeTab, setActiveTab] = useState("saved")

  // Sample scenarios data
  const scenarios = [
    {
      id: 1,
      name: "Current Operation",
      brand: "Burger Boutique",
      outlet: "Mall of Dhahran",
      totalStaff: 33,
      laborCost: 165500,
      laborPercentage: 24.8,
      createdAt: "2023-10-15",
    },
    {
      id: 2,
      name: "Optimized Staffing",
      brand: "Burger Boutique",
      outlet: "Mall of Dhahran",
      totalStaff: 29,
      laborCost: 148000,
      laborPercentage: 22.1,
      createdAt: "2023-10-16",
    },
    {
      id: 3,
      name: "Ramadan Schedule",
      brand: "Burger Boutique",
      outlet: "Mall of Dhahran",
      totalStaff: 25,
      laborCost: 127500,
      laborPercentage: 25.5,
      createdAt: "2023-10-17",
    },
    {
      id: 4,
      name: "New Menu Launch",
      brand: "Burger Boutique",
      outlet: "Mall of Dhahran",
      totalStaff: 35,
      laborCost: 178500,
      laborPercentage: 26.2,
      createdAt: "2023-10-18",
    },
  ]

  // Comparison chart data
  const comparisonData = [
    {
      name: "Total Staff",
      "Current Operation": 33,
      "Optimized Staffing": 29,
      "Ramadan Schedule": 25,
      "New Menu Launch": 35,
    },
    {
      name: "Labor Cost (K SAR)",
      "Current Operation": 165.5,
      "Optimized Staffing": 148,
      "Ramadan Schedule": 127.5,
      "New Menu Launch": 178.5,
    },
    {
      name: "Labor % of Revenue",
      "Current Operation": 24.8,
      "Optimized Staffing": 22.1,
      "Ramadan Schedule": 25.5,
      "New Menu Launch": 26.2,
    },
  ]

  const handleScenarioSelection = (scenarioId) => {
    setSelectedScenarios((prev) => {
      if (prev.includes(scenarioId)) {
        return prev.filter((id) => id !== scenarioId)
      } else {
        return [...prev, scenarioId]
      }
    })
  }

  const handleLoadScenario = (scenarioId) => {
    toast({
      title: "Scenario Loaded",
      description: `Scenario "${scenarios.find((s) => s.id === scenarioId).name}" has been loaded.`,
    })
    if (onLoadScenario) onLoadScenario()
  }

  const handleDeleteScenario = () => {
    toast({
      title: "Scenario Deleted",
      description: `Scenario "${scenarios.find((s) => s.id === deleteScenarioId).name}" has been deleted.`,
    })
    setDeleteScenarioId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scenarios</h2>
          <p className="text-muted-foreground">Create, compare, and manage staffing scenarios</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="saved">Saved Scenarios</TabsTrigger>
          <TabsTrigger value="what-if">What-If Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Scenarios</CardTitle>
              <CardDescription>Select scenarios to compare or manage individual scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedScenarios.length === scenarios.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedScenarios(scenarios.map((s) => s.id))
                          } else {
                            setSelectedScenarios([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Outlet</TableHead>
                    <TableHead className="text-right">Total Staff</TableHead>
                    <TableHead className="text-right">Labor Cost (SAR)</TableHead>
                    <TableHead className="text-right">Labor %</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scenarios.map((scenario) => (
                    <TableRow key={scenario.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedScenarios.includes(scenario.id)}
                          onCheckedChange={() => handleScenarioSelection(scenario.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{scenario.name}</TableCell>
                      <TableCell>{scenario.brand}</TableCell>
                      <TableCell>{scenario.outlet}</TableCell>
                      <TableCell className="text-right">{scenario.totalStaff}</TableCell>
                      <TableCell className="text-right">{scenario.laborCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{scenario.laborPercentage}%</TableCell>
                      <TableCell className="text-right">{scenario.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleLoadScenario(scenario.id)}>
                            Load
                          </Button>
                          <AlertDialog
                            open={deleteScenarioId === scenario.id}
                            onOpenChange={(open) => {
                              if (!open) setDeleteScenarioId(null)
                            }}
                          >
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setDeleteScenarioId(scenario.id)}>
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the scenario "{scenario.name}". This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteScenario}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedScenarios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Scenario Comparison</CardTitle>
                <CardDescription>Comparing {selectedScenarios.length} selected scenarios</CardDescription>
              </CardHeader>
              <CardContent>
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
                      {selectedScenarios.map((id) => {
                        const scenario = scenarios.find((s) => s.id === id)
                        return (
                          <Bar
                            key={scenario.id}
                            dataKey={scenario.name}
                            fill={id === 1 ? "#4f46e5" : id === 2 ? "#10b981" : id === 3 ? "#f59e0b" : "#ef4444"}
                          />
                        )
                      })}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="what-if" className="mt-6">
          <WhatIfAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  )
}

