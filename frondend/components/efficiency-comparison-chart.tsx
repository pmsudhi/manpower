"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Download, RefreshCw } from "lucide-react"

// Sample data for the charts
const efficiencyData = {
  monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "System A",
        data: [65, 72, 78, 81, 85, 88],
        backgroundColor: "hsl(var(--primary) / 0.8)",
        borderColor: "hsl(var(--primary))",
      },
      {
        label: "System B",
        data: [55, 61, 67, 73, 79, 85],
        backgroundColor: "hsl(var(--destructive) / 0.8)",
        borderColor: "hsl(var(--destructive))",
      },
      {
        label: "System C",
        data: [70, 75, 73, 78, 83, 89],
        backgroundColor: "hsl(var(--secondary) / 0.8)",
        borderColor: "hsl(var(--secondary))",
      },
    ],
  },
  quarterly: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "System A",
        data: [72, 84, 89, 91],
        backgroundColor: "hsl(var(--primary) / 0.8)",
        borderColor: "hsl(var(--primary))",
      },
      {
        label: "System B",
        data: [61, 73, 82, 88],
        backgroundColor: "hsl(var(--destructive) / 0.8)",
        borderColor: "hsl(var(--destructive))",
      },
      {
        label: "System C",
        data: [73, 79, 85, 92],
        backgroundColor: "hsl(var(--secondary) / 0.8)",
        borderColor: "hsl(var(--secondary))",
      },
    ],
  },
  yearly: {
    labels: ["2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "System A",
        data: [75, 82, 87, 90],
        backgroundColor: "hsl(var(--primary) / 0.8)",
        borderColor: "hsl(var(--primary))",
      },
      {
        label: "System B",
        data: [65, 72, 79, 86],
        backgroundColor: "hsl(var(--destructive) / 0.8)",
        borderColor: "hsl(var(--destructive))",
      },
      {
        label: "System C",
        data: [70, 77, 83, 91],
        backgroundColor: "hsl(var(--secondary) / 0.8)",
        borderColor: "hsl(var(--secondary))",
      },
    ],
  },
}

// Resource utilization data for pie chart
const resourceUtilizationData = {
  labels: ["CPU", "Memory", "Storage", "Network", "Idle"],
  datasets: [
    {
      label: "Resource Utilization",
      data: [35, 25, 15, 20, 5],
      backgroundColor: [
        "hsl(var(--primary) / 0.8)",
        "hsl(var(--destructive) / 0.8)",
        "hsl(var(--secondary) / 0.8)",
        "hsl(var(--accent) / 0.8)",
        "hsl(var(--muted) / 0.8)",
      ],
      borderColor: [
        "hsl(var(--primary))",
        "hsl(var(--destructive))",
        "hsl(var(--secondary))",
        "hsl(var(--accent))",
        "hsl(var(--muted))",
      ],
      borderWidth: 1,
    },
  ],
}

// Performance trend data for line chart
const performanceTrendData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
  datasets: [
    {
      label: "System A",
      data: [65, 68, 72, 75, 79, 82],
      borderColor: "hsl(var(--primary))",
      backgroundColor: "transparent",
      tension: 0.3,
    },
    {
      label: "System B",
      data: [55, 59, 63, 67, 72, 76],
      borderColor: "hsl(var(--destructive))",
      backgroundColor: "transparent",
      tension: 0.3,
    },
    {
      label: "System C",
      data: [70, 72, 71, 75, 80, 85],
      borderColor: "hsl(var(--secondary))",
      backgroundColor: "transparent",
      tension: 0.3,
    },
  ],
}

export function EfficiencyComparisonChart() {
  const [timeframe, setTimeframe] = useState("monthly")
  const [chartType, setChartType] = useState("bar")

  const handleRefresh = () => {
    // In a real application, this would fetch fresh data
    alert("Refreshing data...")
  }

  const handleDownload = () => {
    // In a real application, this would download the chart as an image or CSV
    alert("Downloading chart data...")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Efficiency Comparison</CardTitle>
            <CardDescription>Compare efficiency metrics across different systems</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="h-8 gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Tabs defaultValue="bar" value={chartType} onValueChange={setChartType} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                <TabsTrigger value="line">Line Chart</TabsTrigger>
                <TabsTrigger value="pie">Pie Chart</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={timeframe} onValueChange={setTimeframe} disabled={chartType === "pie"}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-[400px] w-full">
            {chartType === "bar" && (
              <BarChart
                data={efficiencyData[timeframe as keyof typeof efficiencyData]}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Efficiency Comparison by System",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Efficiency Score (%)",
                      },
                    },
                  },
                }}
              />
            )}

            {chartType === "line" && (
              <LineChart
                data={performanceTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Performance Trend Over Time",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Performance Score (%)",
                      },
                    },
                  },
                }}
              />
            )}

            {chartType === "pie" && (
              <PieChart
                data={resourceUtilizationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                    title: {
                      display: true,
                      text: "Resource Utilization",
                    },
                  },
                }}
              />
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Key Insights:</h3>
            <ul className="text-sm space-y-1">
              <li>• System A consistently shows the highest efficiency across all timeframes</li>
              <li>• System B has shown the most improvement over time (15% increase)</li>
              <li>• CPU and Network resources are the most utilized components</li>
              <li>• All systems show an upward trend in performance over the last 6 weeks</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

