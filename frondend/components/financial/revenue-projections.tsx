"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Download, RefreshCw, Calculator } from "lucide-react"

export function RevenueProjections({ className }) {
  const [projectionPeriod, setProjectionPeriod] = useState("monthly")
  const [projectionLength, setProjectionLength] = useState("12")
  const [chartType, setChartType] = useState("bar")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedOutlet, setSelectedOutlet] = useState("all")

  // Revenue drivers
  const [avgCheck, setAvgCheck] = useState(120)
  const [dailyCovers, setDailyCovers] = useState(250)
  const [foodBevRatio, setFoodBevRatio] = useState(70)
  const [seasonalityFactor, setSeasonalityFactor] = useState(1.0)
  const [growthRate, setGrowthRate] = useState(5)
  const [applyRamadan, setApplyRamadan] = useState(true)

  // Generate time periods based on projection settings
  const generateTimePeriods = () => {
    const periods = []
    const now = new Date()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const length = Number.parseInt(projectionLength)

    if (projectionPeriod === "monthly") {
      for (let i = 0; i < length; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
        periods.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`)
      }
    } else if (projectionPeriod === "quarterly") {
      for (let i = 0; i < length; i++) {
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3
        const date = new Date(now.getFullYear(), quarterMonth + i * 3, 1)
        const quarter = Math.floor(date.getMonth() / 3) + 1
        periods.push(`Q${quarter} ${date.getFullYear()}`)
      }
    } else {
      // yearly
      for (let i = 0; i < length; i++) {
        periods.push(`${now.getFullYear() + i}`)
      }
    }

    return periods
  }

  // Generate revenue projections
  const generateRevenueProjections = () => {
    const periods = generateTimePeriods()
    const projections = {
      food: [],
      beverage: [],
      total: [],
    }

    // Define seasonality factors by month (1.0 = baseline)
    const monthlySeasonality = {
      0: 0.9, // Jan
      1: 0.95, // Feb
      2: 1.0, // Mar
      3: 1.05, // Apr
      4: 1.1, // May
      5: 0.9, // Jun
      6: 0.85, // Jul
      7: 0.9, // Aug
      8: 1.0, // Sep
      9: 1.1, // Oct
      10: 1.15, // Nov
      11: 1.2, // Dec
    }

    // Ramadan adjustment (assuming Ramadan is in month 8 (Sep) for this example)
    // In reality, this would need to be calculated based on the Islamic calendar
    const ramadanMonth = 8 // September for this example

    // Calculate base daily revenue
    const baseDailyRevenue = avgCheck * dailyCovers
    const baseFoodRevenue = baseDailyRevenue * (foodBevRatio / 100)
    const baseBevRevenue = baseDailyRevenue * (1 - foodBevRatio / 100)

    // Calculate monthly revenue for each period
    const now = new Date()
    periods.forEach((period, index) => {
      // Apply growth rate
      const growthFactor = Math.pow(
        1 + growthRate / 100,
        index / (projectionPeriod === "monthly" ? 12 : projectionPeriod === "quarterly" ? 4 : 1),
      )

      // Determine month for seasonality
      let month
      if (projectionPeriod === "monthly") {
        month = (now.getMonth() + index) % 12
      } else if (projectionPeriod === "quarterly") {
        month = (Math.floor(now.getMonth() / 3) * 3 + index * 3) % 12
      } else {
        // yearly
        month = now.getMonth() // Use current month for yearly projections
      }

      // Apply seasonality
      let seasonalFactor = monthlySeasonality[month] * seasonalityFactor

      // Apply Ramadan adjustment if needed
      if (applyRamadan && month === ramadanMonth) {
        seasonalFactor *= 0.7 // 30% reduction during Ramadan
      }

      // Calculate period days
      let periodDays
      if (projectionPeriod === "monthly") {
        // Days in the month
        const year = now.getFullYear() + Math.floor((now.getMonth() + index) / 12)
        const monthIndex = (now.getMonth() + index) % 12
        periodDays = new Date(year, monthIndex + 1, 0).getDate()
      } else if (projectionPeriod === "quarterly") {
        // Approximately 90 days per quarter
        periodDays = 90
      } else {
        // yearly
        // 365 days per year (ignoring leap years for simplicity)
        periodDays = 365
      }

      // Calculate revenue for this period
      const foodRevenue = baseFoodRevenue * periodDays * seasonalFactor * growthFactor
      const bevRevenue = baseBevRevenue * periodDays * seasonalFactor * growthFactor
      const totalRevenue = foodRevenue + bevRevenue

      projections.food.push(Math.round(foodRevenue))
      projections.beverage.push(Math.round(bevRevenue))
      projections.total.push(Math.round(totalRevenue))
    })

    return { periods, projections }
  }

  const { periods, projections } = generateRevenueProjections()

  // Calculate summary metrics
  const calculateSummaryMetrics = () => {
    const totalRevenue = projections.total.reduce((sum, val) => sum + val, 0)
    const totalFood = projections.food.reduce((sum, val) => sum + val, 0)
    const totalBeverage = projections.beverage.reduce((sum, val) => sum + val, 0)

    const averageMonthlyRevenue = totalRevenue / projections.total.length

    // Calculate year-over-year growth if we have enough data
    let yoyGrowth = null
    if (projectionPeriod === "monthly" && projections.total.length >= 12) {
      const firstYear = projections.total.slice(0, 12).reduce((sum, val) => sum + val, 0)
      const secondYear = projections.total.slice(12, 24).reduce((sum, val) => sum + val, 0)
      yoyGrowth = (secondYear / firstYear - 1) * 100
    }

    return {
      totalRevenue,
      totalFood,
      totalBeverage,
      averageMonthlyRevenue,
      yoyGrowth,
      peakRevenue: Math.max(...projections.total),
      peakPeriod: periods[projections.total.indexOf(Math.max(...projections.total))],
      lowestRevenue: Math.min(...projections.total),
      lowestPeriod: periods[projections.total.indexOf(Math.min(...projections.total))],
    }
  }

  const summaryMetrics = calculateSummaryMetrics()

  // Prepare chart data
  const revenueChartData = {
    labels: periods,
    datasets: [
      {
        label: "Food Revenue",
        data: projections.food,
        backgroundColor: "hsl(var(--primary) / 0.8)",
        borderColor: "hsl(var(--primary))",
      },
      {
        label: "Beverage Revenue",
        data: projections.beverage,
        backgroundColor: "hsl(var(--secondary) / 0.8)",
        borderColor: "hsl(var(--secondary))",
      },
    ],
  }

  const totalRevenueChartData = {
    labels: periods,
    datasets: [
      {
        label: "Total Revenue",
        data: projections.total,
        backgroundColor: "hsl(var(--primary) / 0.8)",
        borderColor: "hsl(var(--primary))",
        tension: 0.3,
      },
    ],
  }

  const revenueBreakdownData = {
    labels: ["Food Revenue", "Beverage Revenue"],
    datasets: [
      {
        label: "Revenue Breakdown",
        data: [summaryMetrics.totalFood, summaryMetrics.totalBeverage],
        backgroundColor: ["hsl(var(--primary) / 0.8)", "hsl(var(--secondary) / 0.8)"],
        borderColor: ["hsl(var(--primary))", "hsl(var(--secondary))"],
      },
    ],
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Revenue Projections</CardTitle>
            <CardDescription>Detailed revenue forecasting with seasonality and growth factors</CardDescription>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Projection Period</label>
              <Select value={projectionPeriod} onValueChange={setProjectionPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Projection Length</label>
              <Select value={projectionLength} onValueChange={setProjectionLength}>
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">
                    6{" "}
                    {projectionPeriod === "monthly"
                      ? "Months"
                      : projectionPeriod === "quarterly"
                        ? "Quarters"
                        : "Years"}
                  </SelectItem>
                  <SelectItem value="12">
                    12{" "}
                    {projectionPeriod === "monthly"
                      ? "Months"
                      : projectionPeriod === "quarterly"
                        ? "Quarters"
                        : "Years"}
                  </SelectItem>
                  <SelectItem value="24">
                    24{" "}
                    {projectionPeriod === "monthly"
                      ? "Months"
                      : projectionPeriod === "quarterly"
                        ? "Quarters"
                        : "Years"}
                  </SelectItem>
                  <SelectItem value="36">
                    36{" "}
                    {projectionPeriod === "monthly"
                      ? "Months"
                      : projectionPeriod === "quarterly"
                        ? "Quarters"
                        : "Years"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Chart Type</label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="stacked">Stacked Bar Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue Drivers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avg-check">Average Check (SAR)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="avg-check"
                      min={50}
                      max={300}
                      step={5}
                      value={[avgCheck]}
                      onValueChange={(value) => setAvgCheck(value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={avgCheck}
                      onChange={(e) => setAvgCheck(Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="daily-covers">Daily Covers</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="daily-covers"
                      min={50}
                      max={500}
                      step={10}
                      value={[dailyCovers]}
                      onValueChange={(value) => setDailyCovers(value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={dailyCovers}
                      onChange={(e) => setDailyCovers(Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="food-bev-ratio">Food to Beverage Ratio (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="food-bev-ratio"
                      min={50}
                      max={90}
                      step={5}
                      value={[foodBevRatio]}
                      onValueChange={(value) => setFoodBevRatio(value[0])}
                      className="flex-1"
                    />
                    <div className="w-20 text-center">
                      {foodBevRatio}:{100 - foodBevRatio}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="growth-rate">Annual Growth Rate (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="growth-rate"
                      min={-10}
                      max={20}
                      step={1}
                      value={[growthRate]}
                      onValueChange={(value) => setGrowthRate(value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={growthRate}
                      onChange={(e) => setGrowthRate(Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seasonality-factor">Seasonality Factor</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="seasonality-factor"
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      value={[seasonalityFactor]}
                      onValueChange={(value) => setSeasonalityFactor(value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={seasonalityFactor}
                      onChange={(e) => setSeasonalityFactor(Number(e.target.value))}
                      className="w-20"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="ramadan-adjustment" checked={applyRamadan} onCheckedChange={setApplyRamadan} />
                  <Label htmlFor="ramadan-adjustment">Apply Ramadan Adjustment (30% reduction)</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground">Total Projected Revenue</div>
                    <div className="text-2xl font-bold">SAR {(summaryMetrics.totalRevenue / 1000000).toFixed(2)}M</div>
                    <div className="text-xs text-muted-foreground">
                      Over {projectionLength}{" "}
                      {projectionPeriod === "monthly"
                        ? "months"
                        : projectionPeriod === "quarterly"
                          ? "quarters"
                          : "years"}
                    </div>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground">
                      Average{" "}
                      {projectionPeriod === "monthly"
                        ? "Monthly"
                        : projectionPeriod === "quarterly"
                          ? "Quarterly"
                          : "Yearly"}{" "}
                      Revenue
                    </div>
                    <div className="text-2xl font-bold">
                      SAR {(summaryMetrics.averageMonthlyRevenue / 1000000).toFixed(2)}M
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {growthRate > 0
                        ? `Growing at ${growthRate}% annually`
                        : growthRate < 0
                          ? `Declining at ${Math.abs(growthRate)}% annually`
                          : "No growth projected"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Food Revenue:</span>
                    <span className="font-medium">
                      SAR {(summaryMetrics.totalFood / 1000000).toFixed(2)}M (
                      {((summaryMetrics.totalFood / summaryMetrics.totalRevenue) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Beverage Revenue:</span>
                    <span className="font-medium">
                      SAR {(summaryMetrics.totalBeverage / 1000000).toFixed(2)}M (
                      {((summaryMetrics.totalBeverage / summaryMetrics.totalRevenue) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Peak Revenue Period:</span>
                    <span className="font-medium">
                      {summaryMetrics.peakPeriod} (SAR {(summaryMetrics.peakRevenue / 1000000).toFixed(2)}M)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Lowest Revenue Period:</span>
                    <span className="font-medium">
                      {summaryMetrics.lowestPeriod} (SAR {(summaryMetrics.lowestRevenue / 1000000).toFixed(2)}M)
                    </span>
                  </div>
                  {summaryMetrics.yoyGrowth !== null && (
                    <div className="flex justify-between text-sm">
                      <span>Year-over-Year Growth:</span>
                      <span className="font-medium">{summaryMetrics.yoyGrowth.toFixed(1)}%</span>
                    </div>
                  )}
                </div>

                <div className="h-[200px]">
                  <PieChart
                    data={revenueBreakdownData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
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
              <CardTitle className="text-sm font-medium">Revenue Projection Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {chartType === "bar" && (
                  <BarChart
                    data={revenueChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        title: {
                          display: true,
                          text: "Revenue Projection by Category",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Revenue (SAR)",
                          },
                        },
                      },
                    }}
                  />
                )}

                {chartType === "line" && (
                  <LineChart
                    data={totalRevenueChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        title: {
                          display: true,
                          text: "Total Revenue Projection",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Revenue (SAR)",
                          },
                        },
                      },
                    }}
                  />
                )}

                {chartType === "stacked" && (
                  <BarChart
                    data={revenueChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        title: {
                          display: true,
                          text: "Revenue Projection by Category",
                        },
                      },
                      scales: {
                        x: {
                          stacked: true,
                        },
                        y: {
                          stacked: true,
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Revenue (SAR)",
                          },
                        },
                      },
                    }}
                  />
                )}

                {chartType === "pie" && (
                  <PieChart
                    data={revenueBreakdownData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                        },
                        title: {
                          display: true,
                          text: "Revenue Breakdown",
                        },
                      },
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Revenue Insights</h3>
              <ul className="text-sm space-y-1">
                <li>
                  •{" "}
                  {growthRate > 0
                    ? `Projected growth of ${growthRate}% annually will result in`
                    : growthRate < 0
                      ? `Projected decline of ${Math.abs(growthRate)}% annually will result in`
                      : "Flat growth will maintain"}{" "}
                  total revenue of SAR {(summaryMetrics.totalRevenue / 1000000).toFixed(2)}M over {projectionLength}{" "}
                  {projectionPeriod === "monthly" ? "months" : projectionPeriod === "quarterly" ? "quarters" : "years"}
                </li>
                <li>
                  • Food revenue accounts for{" "}
                  {((summaryMetrics.totalFood / summaryMetrics.totalRevenue) * 100).toFixed(1)}% of total revenue
                </li>
                <li>• Seasonal variations result in peak revenue during {summaryMetrics.peakPeriod}</li>
                <li>• Average daily revenue: SAR {Math.round(avgCheck * dailyCovers).toLocaleString()}</li>
                <li>
                  • Projected annual revenue: SAR {((avgCheck * dailyCovers * 365) / 1000000).toFixed(2)}M (without
                  seasonality)
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Revenue Optimization Opportunities</h3>
              <ul className="text-sm space-y-1">
                <li>
                  • Increase average check by 10% to achieve SAR{" "}
                  {((avgCheck * 1.1 * dailyCovers * 365) / 1000000).toFixed(2)}M annual revenue
                </li>
                <li>• Focus on beverage sales to improve overall margins</li>
                <li>• Implement seasonal promotions to boost revenue during {summaryMetrics.lowestPeriod}</li>
                <li>• Consider special Ramadan offerings to mitigate the 30% reduction in revenue</li>
                <li>
                  • Develop strategies to increase daily covers by 15% to achieve SAR{" "}
                  {((avgCheck * (dailyCovers * 1.15) * 365) / 1000000).toFixed(2)}M annual revenue
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          <Calculator className="mr-2 h-4 w-4" />
          Run What-If Analysis
        </Button>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Projections
        </Button>
      </CardFooter>
    </Card>
  )
}

