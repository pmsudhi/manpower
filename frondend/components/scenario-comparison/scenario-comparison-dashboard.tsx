"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, Minus, Download, RefreshCw } from "lucide-react"

// Sample data for scenarios
const sampleScenarios = [
  {
    id: "scenario1",
    name: "Base Case",
    description: "Standard operational parameters",
  },
  {
    id: "scenario2",
    name: "Optimized Service",
    description: "Improved service efficiency",
  },
  {
    id: "scenario3",
    name: "Peak Season",
    description: "High season adjustments",
  },
  {
    id: "scenario4",
    name: "Cost Reduction",
    description: "Focus on labor cost reduction",
  },
]

// Sample scenario data
const scenarioData = {
  scenario1: {
    spaceParameters: {
      totalArea: 250,
      fohPercentage: 65,
      areaPerCover: "1.67",
      externalSeating: 20,
      fohArea: 162.5,
      fohCapacity: 97,
      totalCapacity: 117,
    },
    serviceParameters: {
      coversPerWaiter: "16",
      runnerRatio: "50",
      kitchenStations: 4,
      serviceStyle: "casual",
      waitersRequired: 8,
      runnersRequired: 4,
    },
    revenueDrivers: {
      avgSpending: 120,
      dwellingTime: 75,
      tableTurnTime: 90,
      peakFactor: 1.5,
      tableTurns: 9.6,
      dailyCovers: 955,
      monthlyRevenue: 3438000,
    },
    operationalHours: {
      operatingDays: 350,
      dailyHours: 12,
      ramadanAdjustment: true,
    },
    efficiencyDrivers: {
      staffUtilization: 85,
      techImpact: 10,
      crossTraining: 15,
      seasonalityFactor: 1.0,
    },
    laborCosts: {
      fohLabor: 120000,
      bohLabor: 150000,
      managementLabor: 80000,
      totalLabor: 350000,
      laborPercentage: 10.2,
    },
  },
  scenario2: {
    spaceParameters: {
      totalArea: 250,
      fohPercentage: 65,
      areaPerCover: "1.67",
      externalSeating: 20,
      fohArea: 162.5,
      fohCapacity: 97,
      totalCapacity: 117,
    },
    serviceParameters: {
      coversPerWaiter: "20",
      runnerRatio: "25",
      kitchenStations: 4,
      serviceStyle: "casual",
      waitersRequired: 6,
      runnersRequired: 2,
    },
    revenueDrivers: {
      avgSpending: 120,
      dwellingTime: 65,
      tableTurnTime: 75,
      peakFactor: 1.5,
      tableTurns: 11.1,
      dailyCovers: 1102,
      monthlyRevenue: 3967200,
    },
    operationalHours: {
      operatingDays: 350,
      dailyHours: 12,
      ramadanAdjustment: true,
    },
    efficiencyDrivers: {
      staffUtilization: 90,
      techImpact: 15,
      crossTraining: 20,
      seasonalityFactor: 1.0,
    },
    laborCosts: {
      fohLabor: 90000,
      bohLabor: 150000,
      managementLabor: 80000,
      totalLabor: 320000,
      laborPercentage: 8.1,
    },
  },
  scenario3: {
    spaceParameters: {
      totalArea: 250,
      fohPercentage: 65,
      areaPerCover: "1.67",
      externalSeating: 30,
      fohArea: 162.5,
      fohCapacity: 97,
      totalCapacity: 127,
    },
    serviceParameters: {
      coversPerWaiter: "16",
      runnerRatio: "50",
      kitchenStations: 5,
      serviceStyle: "casual",
      waitersRequired: 8,
      runnersRequired: 4,
    },
    revenueDrivers: {
      avgSpending: 135,
      dwellingTime: 75,
      tableTurnTime: 90,
      peakFactor: 1.8,
      tableTurns: 9.6,
      dailyCovers: 1037,
      monthlyRevenue: 4199850,
    },
    operationalHours: {
      operatingDays: 350,
      dailyHours: 14,
      ramadanAdjustment: true,
    },
    efficiencyDrivers: {
      staffUtilization: 85,
      techImpact: 10,
      crossTraining: 15,
      seasonalityFactor: 1.2,
    },
    laborCosts: {
      fohLabor: 140000,
      bohLabor: 180000,
      managementLabor: 90000,
      totalLabor: 410000,
      laborPercentage: 9.8,
    },
  },
  scenario4: {
    spaceParameters: {
      totalArea: 250,
      fohPercentage: 70,
      areaPerCover: "1.5",
      externalSeating: 20,
      fohArea: 175,
      fohCapacity: 116,
      totalCapacity: 136,
    },
    serviceParameters: {
      coversPerWaiter: "24",
      runnerRatio: "25",
      kitchenStations: 4,
      serviceStyle: "fast",
      waitersRequired: 6,
      runnersRequired: 2,
    },
    revenueDrivers: {
      avgSpending: 100,
      dwellingTime: 60,
      tableTurnTime: 70,
      peakFactor: 1.5,
      tableTurns: 12,
      dailyCovers: 1387,
      monthlyRevenue: 4157100,
    },
    operationalHours: {
      operatingDays: 350,
      dailyHours: 12,
      ramadanAdjustment: true,
    },
    efficiencyDrivers: {
      staffUtilization: 95,
      techImpact: 20,
      crossTraining: 25,
      seasonalityFactor: 1.0,
    },
    laborCosts: {
      fohLabor: 80000,
      bohLabor: 120000,
      managementLabor: 70000,
      totalLabor: 270000,
      laborPercentage: 6.5,
    },
  },
}

// Function to calculate difference and return appropriate icon
const getDifference = (value1: number, value2: number) => {
  const diff = ((value2 - value1) / value1) * 100

  if (Math.abs(diff) < 1) {
    return { icon: <Minus className="h-4 w-4 text-muted-foreground" />, value: "0%" }
  } else if (diff > 0) {
    return {
      icon: <ArrowUp className="h-4 w-4 text-green-500" />,
      value: `+${diff.toFixed(1)}%`,
      positive: true,
    }
  } else {
    return {
      icon: <ArrowDown className="h-4 w-4 text-red-500" />,
      value: `${diff.toFixed(1)}%`,
      positive: false,
    }
  }
}

interface ScenarioComparisonDashboardProps {
  className?: string
}

export function ScenarioComparisonDashboard({ className }: ScenarioComparisonDashboardProps) {
  const [scenario1, setScenario1] = useState("scenario1")
  const [scenario2, setScenario2] = useState("scenario2")
  const [activeTab, setActiveTab] = useState("overview")

  // Get the selected scenario data
  const scenarioData1 = scenarioData[scenario1 as keyof typeof scenarioData]
  const scenarioData2 = scenarioData[scenario2 as keyof typeof scenarioData]

  // Labor cost comparison data
  const laborCostData = {
    labels: ["FOH Labor", "BOH Labor", "Management"],
    datasets: [
      {
        label: sampleScenarios.find((s) => s.id === scenario1)?.name || "Scenario 1",
        data: [
          scenarioData1.laborCosts.fohLabor,
          scenarioData1.laborCosts.bohLabor,
          scenarioData1.laborCosts.managementLabor,
        ],
        backgroundColor: "hsl(var(--primary) / 0.8)",
        borderColor: "hsl(var(--primary))",
      },
      {
        label: sampleScenarios.find((s) => s.id === scenario2)?.name || "Scenario 2",
        data: [
          scenarioData2.laborCosts.fohLabor,
          scenarioData2.laborCosts.bohLabor,
          scenarioData2.laborCosts.managementLabor,
        ],
        backgroundColor: "hsl(var(--secondary) / 0.8)",
        borderColor: "hsl(var(--secondary))",
      },
    ],
  }

  // Revenue vs Labor cost data
  const revenueVsLaborData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: `${sampleScenarios.find((s) => s.id === scenario1)?.name || "Scenario 1"} - Revenue`,
        data: [3400000, 3450000, 3500000, 3550000, 3600000, 3650000],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "transparent",
        yAxisID: "y",
      },
      {
        label: `${sampleScenarios.find((s) => s.id === scenario1)?.name || "Scenario 1"} - Labor`,
        data: [350000, 355000, 360000, 365000, 370000, 375000],
        borderColor: "hsl(var(--primary) / 0.5)",
        backgroundColor: "transparent",
        borderDash: [5, 5],
        yAxisID: "y1",
      },
      {
        label: `${sampleScenarios.find((s) => s.id === scenario2)?.name || "Scenario 2"} - Revenue`,
        data: [3900000, 3950000, 4000000, 4050000, 4100000, 4150000],
        borderColor: "hsl(var(--secondary))",
        backgroundColor: "transparent",
        yAxisID: "y",
      },
      {
        label: `${sampleScenarios.find((s) => s.id === scenario2)?.name || "Scenario 2"} - Labor`,
        data: [320000, 325000, 330000, 335000, 340000, 345000],
        borderColor: "hsl(var(--secondary) / 0.5)",
        backgroundColor: "transparent",
        borderDash: [5, 5],
        yAxisID: "y1",
      },
    ],
  }

  // Staffing breakdown data
  const staffingBreakdownData = {
    labels: ["Waiters", "Runners", "Kitchen Staff", "Management"],
    datasets: [
      {
        label: sampleScenarios.find((s) => s.id === scenario1)?.name || "Scenario 1",
        data: [
          scenarioData1.serviceParameters.waitersRequired,
          scenarioData1.serviceParameters.runnersRequired,
          Math.ceil(scenarioData1.serviceParameters.kitchenStations * 2.5),
          3,
        ],
        backgroundColor: "hsl(var(--primary) / 0.8)",
        borderColor: "hsl(var(--primary))",
      },
      {
        label: sampleScenarios.find((s) => s.id === scenario2)?.name || "Scenario 2",
        data: [
          scenarioData2.serviceParameters.waitersRequired,
          scenarioData2.serviceParameters.runnersRequired,
          Math.ceil(scenarioData2.serviceParameters.kitchenStations * 2.5),
          3,
        ],
        backgroundColor: "hsl(var(--secondary) / 0.8)",
        borderColor: "hsl(var(--secondary))",
      },
    ],
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Scenario Comparison Dashboard</CardTitle>
            <CardDescription>Compare different operational scenarios side by side</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Scenario 1</label>
              <Select value={scenario1} onValueChange={setScenario1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  {sampleScenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name} - {scenario.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Scenario 2</label>
              <Select value={scenario2} onValueChange={setScenario2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  {sampleScenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name} - {scenario.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staffing">Staffing</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Labor Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {(scenarioData1.laborCosts.totalLabor / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {sampleScenarios.find((s) => s.id === scenario1)?.name}
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        {getDifference(scenarioData1.laborCosts.totalLabor, scenarioData2.laborCosts.totalLabor).icon}
                        <span className="text-sm ml-1">
                          {
                            getDifference(scenarioData1.laborCosts.totalLabor, scenarioData2.laborCosts.totalLabor)
                              .value
                          }
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {(scenarioData2.laborCosts.totalLabor / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {sampleScenarios.find((s) => s.id === scenario2)?.name}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Labor % of Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{scenarioData1.laborCosts.laborPercentage.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">
                          {sampleScenarios.find((s) => s.id === scenario1)?.name}
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        {
                          getDifference(
                            scenarioData1.laborCosts.laborPercentage,
                            scenarioData2.laborCosts.laborPercentage,
                          ).icon
                        }
                        <span className="text-sm ml-1">
                          {
                            getDifference(
                              scenarioData1.laborCosts.laborPercentage,
                              scenarioData2.laborCosts.laborPercentage,
                            ).value
                          }
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{scenarioData2.laborCosts.laborPercentage.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">
                          {sampleScenarios.find((s) => s.id === scenario2)?.name}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {(scenarioData1.revenueDrivers.monthlyRevenue / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {sampleScenarios.find((s) => s.id === scenario1)?.name}
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        {
                          getDifference(
                            scenarioData1.revenueDrivers.monthlyRevenue,
                            scenarioData2.revenueDrivers.monthlyRevenue,
                          ).icon
                        }
                        <span className="text-sm ml-1">
                          {
                            getDifference(
                              scenarioData1.revenueDrivers.monthlyRevenue,
                              scenarioData2.revenueDrivers.monthlyRevenue,
                            ).value
                          }
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {(scenarioData2.revenueDrivers.monthlyRevenue / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {sampleScenarios.find((s) => s.id === scenario2)?.name}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Labor Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <BarChart
                        data={laborCostData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top",
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: "Cost (SAR)",
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Staffing Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <BarChart
                        data={staffingBreakdownData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top",
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: "Number of Staff",
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Revenue vs Labor Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <LineChart
                      data={revenueVsLaborData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                        },
                        scales: {
                          y: {
                            type: "linear",
                            display: true,
                            position: "left",
                            title: {
                              display: true,
                              text: "Revenue (SAR)",
                            },
                          },
                          y1: {
                            type: "linear",
                            display: true,
                            position: "right",
                            title: {
                              display: true,
                              text: "Labor Cost (SAR)",
                            },
                            grid: {
                              drawOnChartArea: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Staffing Tab */}
            <TabsContent value="staffing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">FOH Staffing Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium">Position</div>
                        <div className="font-medium text-center">
                          {sampleScenarios.find((s) => s.id === scenario1)?.name}
                        </div>
                        <div className="font-medium text-center">
                          {sampleScenarios.find((s) => s.id === scenario2)?.name}
                        </div>

                        <div>Waiters</div>
                        <div className="text-center">{scenarioData1.serviceParameters.waitersRequired}</div>
                        <div className="text-center">{scenarioData2.serviceParameters.waitersRequired}</div>

                        <div>Runners</div>
                        <div className="text-center">{scenarioData1.serviceParameters.runnersRequired}</div>
                        <div className="text-center">{scenarioData2.serviceParameters.runnersRequired}</div>

                        <div>Hosts</div>
                        <div className="text-center">2</div>
                        <div className="text-center">2</div>

                        <div>Cashiers</div>
                        <div className="text-center">2</div>
                        <div className="text-center">1</div>

                        <div>Managers</div>
                        <div className="text-center">2</div>
                        <div className="text-center">2</div>

                        <div className="font-medium">Total FOH</div>
                        <div className="text-center font-medium">
                          {scenarioData1.serviceParameters.waitersRequired +
                            scenarioData1.serviceParameters.runnersRequired +
                            6}
                        </div>
                        <div className="text-center font-medium">
                          {scenarioData2.serviceParameters.waitersRequired +
                            scenarioData2.serviceParameters.runnersRequired +
                            5}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">BOH Staffing Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium">Position</div>
                        <div className="font-medium text-center">
                          {sampleScenarios.find((s) => s.id === scenario1)?.name}
                        </div>
                        <div className="font-medium text-center">
                          {sampleScenarios.find((s) => s.id === scenario2)?.name}
                        </div>

                        <div>Executive Chef</div>
                        <div className="text-center">1</div>
                        <div className="text-center">1</div>

                        <div>Sous Chef</div>
                        <div className="text-center">1</div>
                        <div className="text-center">1</div>

                        <div>Line Cooks</div>
                        <div className="text-center">{scenarioData1.serviceParameters.kitchenStations}</div>
                        <div className="text-center">{scenarioData2.serviceParameters.kitchenStations}</div>

                        <div>Prep Cooks</div>
                        <div className="text-center">3</div>
                        <div className="text-center">3</div>

                        <div>Kitchen Helpers</div>
                        <div className="text-center">2</div>
                        <div className="text-center">2</div>

                        <div>Dishwashers</div>
                        <div className="text-center">2</div>
                        <div className="text-center">2</div>

                        <div className="font-medium">Total BOH</div>
                        <div className="text-center font-medium">
                          {scenarioData1.serviceParameters.kitchenStations + 9}
                        </div>
                        <div className="text-center font-medium">
                          {scenarioData2.serviceParameters.kitchenStations + 9}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Key Staffing Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Covers per Waiter</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/50 p-2 rounded-md text-center">
                          <div className="text-lg font-bold">{scenarioData1.serviceParameters.coversPerWaiter}</div>
                          <div className="text-xs text-muted-foreground">Scenario 1</div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded-md text-center">
                          <div className="text-lg font-bold">{scenarioData2.serviceParameters.coversPerWaiter}</div>
                          <div className="text-xs text-muted-foreground">Scenario 2</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Runner to Waiter Ratio</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/50 p-2 rounded-md text-center">
                          <div className="text-lg font-bold">{scenarioData1.serviceParameters.runnerRatio}%</div>
                          <div className="text-xs text-muted-foreground">Scenario 1</div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded-md text-center">
                          <div className="text-lg font-bold">{scenarioData2.serviceParameters.runnerRatio}%</div>
                          <div className="text-xs text-muted-foreground">Scenario 2</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">BOH to FOH Ratio</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/50 p-2 rounded-md text-center">
                          <div className="text-lg font-bold">
                            {(
                              ((scenarioData1.serviceParameters.kitchenStations + 9) /
                                (scenarioData1.serviceParameters.waitersRequired +
                                  scenarioData1.serviceParameters.runnersRequired +
                                  6)) *
                              100
                            ).toFixed(0)}
                            %
                          </div>
                          <div className="text-xs text-muted-foreground">Scenario 1</div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded-md text-center">
                          <div className="text-lg font-bold">
                            {(
                              ((scenarioData2.serviceParameters.kitchenStations + 9) /
                                (scenarioData2.serviceParameters.waitersRequired +
                                  scenarioData2.serviceParameters.runnersRequired +
                                  5)) *
                              100
                            ).toFixed(0)}
                            %
                          </div>
                          <div className="text-xs text-muted-foreground">Scenario 2</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Staff per 100 Covers</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/50 p-2 rounded-md text-center">
                          <div className="text-lg font-bold">
                            {(
                              (scenarioData1.serviceParameters.waitersRequired +
                                scenarioData1.serviceParameters.runnersRequired +
                                6 +
                                (scenarioData1.serviceParameters.kitchenStations + 9)) /
                              (scenarioData1.revenueDrivers.dailyCovers / 100)
                            ).toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">Scenario 1</div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded-md text-center">
                          <div className="text-lg font-bold">
                            {(
                              (scenarioData2.serviceParameters.waitersRequired +
                                scenarioData2.serviceParameters.runnersRequired +
                                5 +
                                (scenarioData2.serviceParameters.kitchenStations + 9)) /
                              (scenarioData2.revenueDrivers.dailyCovers / 100)
                            ).toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">Scenario 2</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Labor Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <PieChart
                        data={{
                          labels: ["FOH Labor", "BOH Labor", "Management"],
                          datasets: [
                            {
                              label: sampleScenarios.find((s) => s.id === scenario1)?.name || "Scenario 1",
                              data: [
                                scenarioData1.laborCosts.fohLabor,
                                scenarioData1.laborCosts.bohLabor,
                                scenarioData1.laborCosts.managementLabor,
                              ],
                              backgroundColor: [
                                "hsl(var(--primary) / 0.8)",
                                "hsl(var(--primary) / 0.6)",
                                "hsl(var(--primary) / 0.4)",
                              ],
                              borderColor: ["hsl(var(--primary))", "hsl(var(--primary))", "hsl(var(--primary))"],
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                            },
                            title: {
                              display: true,
                              text: sampleScenarios.find((s) => s.id === scenario1)?.name || "Scenario 1",
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Labor Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <PieChart
                        data={{
                          labels: ["FOH Labor", "BOH Labor", "Management"],
                          datasets: [
                            {
                              label: sampleScenarios.find((s) => s.id === scenario2)?.name || "Scenario 2",
                              data: [
                                scenarioData2.laborCosts.fohLabor,
                                scenarioData2.laborCosts.bohLabor,
                                scenarioData2.laborCosts.managementLabor,
                              ],
                              backgroundColor: [
                                "hsl(var(--secondary) / 0.8)",
                                "hsl(var(--secondary) / 0.6)",
                                "hsl(var(--secondary) / 0.4)",
                              ],
                              borderColor: ["hsl(var(--secondary))", "hsl(var(--secondary))", "hsl(var(--secondary))"],
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                            },
                            title: {
                              display: true,
                              text: sampleScenarios.find((s) => s.id === scenario2)?.name || "Scenario 2",
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Financial Metrics Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="font-medium">Metric</div>
                      <div className="font-medium text-center">
                        {sampleScenarios.find((s) => s.id === scenario1)?.name}
                      </div>
                      <div className="font-medium text-center">
                        {sampleScenarios.find((s) => s.id === scenario2)?.name}
                      </div>

                      <div>Monthly Revenue</div>
                      <div className="text-center">
                        SAR {Math.round(scenarioData1.revenueDrivers.monthlyRevenue).toLocaleString()}
                      </div>
                      <div className="text-center">
                        SAR {Math.round(scenarioData2.revenueDrivers.monthlyRevenue).toLocaleString()}
                      </div>

                      <div>Total Labor Cost</div>
                      <div className="text-center">SAR {scenarioData1.laborCosts.totalLabor.toLocaleString()}</div>
                      <div className="text-center">SAR {scenarioData2.laborCosts.totalLabor.toLocaleString()}</div>

                      <div>Labor % of Revenue</div>
                      <div className="text-center">{scenarioData1.laborCosts.laborPercentage.toFixed(1)}%</div>
                      <div className="text-center">{scenarioData2.laborCosts.laborPercentage.toFixed(1)}%</div>

                      <div>Revenue per Labor Hour</div>
                      <div className="text-center">
                        SAR{" "}
                        {Math.round(
                          scenarioData1.revenueDrivers.monthlyRevenue /
                            (30 *
                              8 *
                              (scenarioData1.serviceParameters.waitersRequired +
                                scenarioData1.serviceParameters.runnersRequired +
                                scenarioData1.serviceParameters.kitchenStations +
                                15)),
                        )}
                      </div>
                      <div className="text-center">
                        SAR{" "}
                        {Math.round(
                          scenarioData2.revenueDrivers.monthlyRevenue /
                            (30 *
                              8 *
                              (scenarioData2.serviceParameters.waitersRequired +
                                scenarioData2.serviceParameters.runnersRequired +
                                scenarioData2.serviceParameters.kitchenStations +
                                14)),
                        )}
                      </div>

                      <div>Labor Cost per Cover</div>
                      <div className="text-center">
                        SAR{" "}
                        {Math.round(
                          scenarioData1.laborCosts.totalLabor / (30 * scenarioData1.revenueDrivers.dailyCovers),
                        )}
                      </div>
                      <div className="text-center">
                        SAR{" "}
                        {Math.round(
                          scenarioData2.laborCosts.totalLabor / (30 * scenarioData2.revenueDrivers.dailyCovers),
                        )}
                      </div>

                      <div>Estimated EBITDA</div>
                      <div className="text-center">
                        SAR {Math.round(scenarioData1.revenueDrivers.monthlyRevenue * 0.25).toLocaleString()}
                      </div>
                      <div className="text-center">
                        SAR {Math.round(scenarioData2.revenueDrivers.monthlyRevenue * 0.28).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Efficiency Tab */}
            <TabsContent value="efficiency" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Efficiency Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium">Metric</div>
                        <div className="font-medium text-center">
                          {sampleScenarios.find((s) => s.id === scenario1)?.name}
                        </div>
                        <div className="font-medium text-center">
                          {sampleScenarios.find((s) => s.id === scenario2)?.name}
                        </div>

                        <div>Staff Utilization</div>
                        <div className="text-center">{scenarioData1.efficiencyDrivers.staffUtilization}%</div>
                        <div className="text-center">{scenarioData2.efficiencyDrivers.staffUtilization}%</div>

                        <div>Technology Impact</div>
                        <div className="text-center">{scenarioData1.efficiencyDrivers.techImpact}%</div>
                        <div className="text-center">{scenarioData2.efficiencyDrivers.techImpact}%</div>

                        <div>Cross-Training</div>
                        <div className="text-center">{scenarioData1.efficiencyDrivers.crossTraining}%</div>
                        <div className="text-center">{scenarioData2.efficiencyDrivers.crossTraining}%</div>

                        <div>Seasonality Factor</div>
                        <div className="text-center">
                          {(scenarioData1.efficiencyDrivers.seasonalityFactor * 100).toFixed(0)}%
                        </div>
                        <div className="text-center">
                          {(scenarioData2.efficiencyDrivers.seasonalityFactor * 100).toFixed(0)}%
                        </div>

                        <div>Table Turns per Day</div>
                        <div className="text-center">{scenarioData1.revenueDrivers.tableTurns.toFixed(1)}</div>
                        <div className="text-center">{scenarioData2.revenueDrivers.tableTurns.toFixed(1)}</div>

                        <div>Covers per Labor Hour</div>
                        <div className="text-center">
                          {(
                            scenarioData1.revenueDrivers.dailyCovers /
                            (8 *
                              (scenarioData1.serviceParameters.waitersRequired +
                                scenarioData1.serviceParameters.runnersRequired +
                                scenarioData1.serviceParameters.kitchenStations +
                                15))
                          ).toFixed(1)}
                        </div>
                        <div className="text-center">
                          {(
                            scenarioData2.revenueDrivers.dailyCovers /
                            (8 *
                              (scenarioData2.serviceParameters.waitersRequired +
                                scenarioData2.serviceParameters.runnersRequired +
                                scenarioData2.serviceParameters.kitchenStations +
                                14))
                          ).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Space Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium">Metric</div>
                        <div className="font-medium text-center">
                          {sampleScenarios.find((s) => s.id === scenario1)?.name}
                        </div>
                        <div className="font-medium text-center">
                          {sampleScenarios.find((s) => s.id === scenario2)?.name}
                        </div>

                        <div>Total Area</div>
                        <div className="text-center">{scenarioData1.spaceParameters.totalArea} sqm</div>
                        <div className="text-center">{scenarioData2.spaceParameters.totalArea} sqm</div>

                        <div>FOH Area</div>
                        <div className="text-center">{scenarioData1.spaceParameters.fohArea.toFixed(1)} sqm</div>
                        <div className="text-center">{scenarioData2.spaceParameters.fohArea.toFixed(1)} sqm</div>

                        <div>FOH Percentage</div>
                        <div className="text-center">{scenarioData1.spaceParameters.fohPercentage}%</div>
                        <div className="text-center">{scenarioData2.spaceParameters.fohPercentage}%</div>

                        <div>Area per Cover</div>
                        <div className="text-center">{scenarioData1.spaceParameters.areaPerCover} sqm</div>
                        <div className="text-center">{scenarioData2.spaceParameters.areaPerCover} sqm</div>

                        <div>Total Capacity</div>
                        <div className="text-center">{scenarioData1.spaceParameters.totalCapacity} covers</div>
                        <div className="text-center">{scenarioData2.spaceParameters.totalCapacity} covers</div>

                        <div>Revenue per sqm</div>
                        <div className="text-center">
                          SAR{" "}
                          {Math.round(
                            scenarioData1.revenueDrivers.monthlyRevenue / scenarioData1.spaceParameters.totalArea,
                          )}
                        </div>
                        <div className="text-center">
                          SAR{" "}
                          {Math.round(
                            scenarioData2.revenueDrivers.monthlyRevenue / scenarioData2.spaceParameters.totalArea,
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Efficiency Improvement Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-4 rounded-md">
                        <h3 className="text-sm font-medium mb-2">
                          {sampleScenarios.find((s) => s.id === scenario1)?.name}
                        </h3>
                        <ul className="text-sm space-y-1">
                          {scenarioData1.serviceParameters.coversPerWaiter < 20 && (
                            <li>• Increase covers per waiter to improve service efficiency</li>
                          )}
                          {scenarioData1.efficiencyDrivers.techImpact < 15 && (
                            <li>• Implement technology solutions to reduce manual tasks</li>
                          )}
                          {scenarioData1.efficiencyDrivers.crossTraining < 20 && (
                            <li>• Enhance cross-training program to improve staff flexibility</li>
                          )}
                          {scenarioData1.revenueDrivers.tableTurnTime > 80 && (
                            <li>• Optimize table turn time to increase daily covers</li>
                          )}
                          {scenarioData1.efficiencyDrivers.staffUtilization < 90 && (
                            <li>• Improve staff scheduling to increase utilization rate</li>
                          )}
                        </ul>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-md">
                        <h3 className="text-sm font-medium mb-2">
                          {sampleScenarios.find((s) => s.id === scenario2)?.name}
                        </h3>
                        <ul className="text-sm space-y-1">
                          {scenarioData2.serviceParameters.coversPerWaiter < 20 && (
                            <li>• Increase covers per waiter to improve service efficiency</li>
                          )}
                          {scenarioData2.efficiencyDrivers.techImpact < 15 && (
                            <li>• Implement technology solutions to reduce manual tasks</li>
                          )}
                          {scenarioData2.efficiencyDrivers.crossTraining < 20 && (
                            <li>• Enhance cross-training program to improve staff flexibility</li>
                          )}
                          {scenarioData2.revenueDrivers.tableTurnTime > 80 && (
                            <li>• Optimize table turn time to increase daily covers</li>
                          )}
                          {scenarioData2.efficiencyDrivers.staffUtilization < 90 && (
                            <li>• Improve staff scheduling to increase utilization rate</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

