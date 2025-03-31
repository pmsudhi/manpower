"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Calculator, FileSpreadsheet, Edit, Save } from "lucide-react"

export function PLIntegration({ className }) {
  const [timeframe, setTimeframe] = useState("monthly")
  const [selectedMonth, setSelectedMonth] = useState("current")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedOutlet, setSelectedOutlet] = useState("all")
  const [chartType, setChartType] = useState("bar")
  const [editMode, setEditMode] = useState(false)

  // P&L parameters
  const [foodCostPercentage, setFoodCostPercentage] = useState(28)
  const [beverageCostPercentage, setBeverageCostPercentage] = useState(22)
  const [laborCostPercentage, setLaborCostPercentage] = useState(25)
  const [rentPercentage, setRentPercentage] = useState(10)
  const [marketingPercentage, setMarketingPercentage] = useState(3)
  const [utilitiesPercentage, setUtilitiesPercentage] = useState(4)
  const [otherExpensesPercentage, setOtherExpensesPercentage] = useState(8)

  // Sample revenue data
  const monthlyRevenue = 1200000 // SAR 1.2M monthly revenue
  const foodRevenue = monthlyRevenue * 0.7 // 70% food
  const beverageRevenue = monthlyRevenue * 0.3 // 30% beverage

  // Calculate P&L items
  const calculatePL = () => {
    // Revenue
    const totalRevenue = monthlyRevenue

    // Cost of Goods Sold (COGS)
    const foodCost = foodRevenue * (foodCostPercentage / 100)
    const beverageCost = beverageRevenue * (beverageCostPercentage / 100)
    const totalCOGS = foodCost + beverageCost

    // Gross Profit
    const grossProfit = totalRevenue - totalCOGS
    const grossProfitMargin = (grossProfit / totalRevenue) * 100

    // Operating Expenses
    const laborCost = totalRevenue * (laborCostPercentage / 100)
    const rent = totalRevenue * (rentPercentage / 100)
    const marketing = totalRevenue * (marketingPercentage / 100)
    const utilities = totalRevenue * (utilitiesPercentage / 100)
    const otherExpenses = totalRevenue * (otherExpensesPercentage / 100)
    const totalOperatingExpenses = laborCost + rent + marketing + utilities + otherExpenses

    // Operating Profit (EBITDA)
    const operatingProfit = grossProfit - totalOperatingExpenses
    const operatingProfitMargin = (operatingProfit / totalRevenue) * 100

    // Depreciation & Amortization (assumed 3% of revenue for this example)
    const depreciationAmortization = totalRevenue * 0.03

    // EBIT (Earnings Before Interest and Taxes)
    const ebit = operatingProfit - depreciationAmortization

    // Interest Expense (assumed 1% of revenue for this example)
    const interestExpense = totalRevenue * 0.01

    // EBT (Earnings Before Taxes)
    const ebt = ebit - interestExpense

    // Taxes (assumed 15% corporate tax rate for Saudi Arabia)
    const taxes = Math.max(0, ebt * 0.15)

    // Net Profit
    const netProfit = ebt - taxes
    const netProfitMargin = (netProfit / totalRevenue) * 100

    return {
      totalRevenue,
      foodRevenue,
      beverageRevenue,
      foodCost,
      beverageCost,
      totalCOGS,
      grossProfit,
      grossProfitMargin,
      laborCost,
      rent,
      marketing,
      utilities,
      otherExpenses,
      totalOperatingExpenses,
      operatingProfit,
      operatingProfitMargin,
      depreciationAmortization,
      ebit,
      interestExpense,
      ebt,
      taxes,
      netProfit,
      netProfitMargin,
    }
  }

  const plData = calculatePL()

  // Generate historical data for charts
  const generateHistoricalData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date().getMonth()

    // Generate 12 months of data
    const data = {
      labels: [],
      revenue: [],
      cogs: [],
      operatingExpenses: [],
      operatingProfit: [],
      netProfit: [],
    }

    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - 11 + i) % 12
      data.labels.push(months[monthIndex])

      // Add some variation to the data
      const seasonalFactor = 1 + Math.sin((i / 11) * Math.PI * 2) * 0.2
      const randomFactor = 0.9 + Math.random() * 0.2
      const monthlyFactor = seasonalFactor * randomFactor

      const monthRevenue = monthlyRevenue * monthlyFactor
      const monthCOGS = monthRevenue * ((foodCostPercentage * 0.7 + beverageCostPercentage * 0.3) / 100)
      const monthOpEx =
        monthRevenue *
        ((laborCostPercentage + rentPercentage + marketingPercentage + utilitiesPercentage + otherExpensesPercentage) /
          100)
      const monthOpProfit = monthRevenue - monthCOGS - monthOpEx
      const monthNetProfit = monthOpProfit * 0.85 // Simplified calculation

      data.revenue.push(Math.round(monthRevenue))
      data.cogs.push(Math.round(monthCOGS))
      data.operatingExpenses.push(Math.round(monthOpEx))
      data.operatingProfit.push(Math.round(monthOpProfit))
      data.netProfit.push(Math.round(monthNetProfit))
    }

    return data
  }

  const historicalData = generateHistoricalData()

  // Prepare chart data
  const profitLossChartData = {
    labels: historicalData.labels,
    datasets: [
      {
        label: "Revenue",
        data: historicalData.revenue,
        backgroundColor: "hsl(var(--primary) / 0.8)",
        borderColor: "hsl(var(--primary))",
      },
      {
        label: "COGS",
        data: historicalData.cogs,
        backgroundColor: "hsl(var(--destructive) / 0.8)",
        borderColor: "hsl(var(--destructive))",
      },
      {
        label: "Operating Expenses",
        data: historicalData.operatingExpenses,
        backgroundColor: "hsl(var(--secondary) / 0.8)",
        borderColor: "hsl(var(--secondary))",
      },
    ],
  }

  const profitMarginChartData = {
    labels: historicalData.labels,
    datasets: [
      {
        label: "Operating Profit",
        data: historicalData.operatingProfit.map(
          (val) => (val / historicalData.revenue[historicalData.operatingProfit.indexOf(val)]) * 100,
        ),
        borderColor: "hsl(var(--primary))",
        backgroundColor: "transparent",
        tension: 0.3,
      },
      {
        label: "Net Profit",
        data: historicalData.netProfit.map(
          (val) => (val / historicalData.revenue[historicalData.netProfit.indexOf(val)]) * 100,
        ),
        borderColor: "hsl(var(--secondary))",
        backgroundColor: "transparent",
        tension: 0.3,
      },
    ],
  }

  const expenseBreakdownData = {
    labels: ["Food Cost", "Beverage Cost", "Labor", "Rent", "Marketing", "Utilities", "Other"],
    datasets: [
      {
        label: "Expense Breakdown",
        data: [
          plData.foodCost,
          plData.beverageCost,
          plData.laborCost,
          plData.rent,
          plData.marketing,
          plData.utilities,
          plData.otherExpenses,
        ],
        backgroundColor: [
          "hsl(var(--primary) / 0.8)",
          "hsl(var(--primary) / 0.6)",
          "hsl(var(--secondary) / 0.8)",
          "hsl(var(--secondary) / 0.6)",
          "hsl(var(--accent) / 0.8)",
          "hsl(var(--accent) / 0.6)",
          "hsl(var(--muted) / 0.8)",
        ],
        borderColor: [
          "hsl(var(--primary))",
          "hsl(var(--primary))",
          "hsl(var(--secondary))",
          "hsl(var(--secondary))",
          "hsl(var(--accent))",
          "hsl(var(--accent))",
          "hsl(var(--muted))",
        ],
      },
    ],
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>P&L Integration</CardTitle>
            <CardDescription>Profit and loss statement with financial projections</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={editMode ? "default" : "outline"}
              size="sm"
              className="h-8 gap-1"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? <Save className="h-3.5 w-3.5" /> : <Edit className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{editMode ? "Save" : "Edit"}</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Period</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Period</SelectItem>
                  <SelectItem value="previous">Previous Period</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">P&L Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="food-cost">Food Cost Percentage (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="food-cost"
                      min={20}
                      max={40}
                      step={0.5}
                      value={[foodCostPercentage]}
                      onValueChange={(value) => setFoodCostPercentage(value[0])}
                      disabled={!editMode}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={foodCostPercentage}
                      onChange={(e) => setFoodCostPercentage(Number(e.target.value))}
                      className="w-20"
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beverage-cost">Beverage Cost Percentage (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="beverage-cost"
                      min={15}
                      max={35}
                      step={0.5}
                      value={[beverageCostPercentage]}
                      onValueChange={(value) => setBeverageCostPercentage(value[0])}
                      disabled={!editMode}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={beverageCostPercentage}
                      onChange={(e) => setBeverageCostPercentage(Number(e.target.value))}
                      className="w-20"
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="labor-cost">Labor Cost Percentage (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="labor-cost"
                      min={15}
                      max={35}
                      step={0.5}
                      value={[laborCostPercentage]}
                      onValueChange={(value) => setLaborCostPercentage(value[0])}
                      disabled={!editMode}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={laborCostPercentage}
                      onChange={(e) => setLaborCostPercentage(Number(e.target.value))}
                      className="w-20"
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rent">Rent Percentage (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="rent"
                      min={5}
                      max={20}
                      step={0.5}
                      value={[rentPercentage]}
                      onValueChange={(value) => setRentPercentage(value[0])}
                      disabled={!editMode}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={rentPercentage}
                      onChange={(e) => setRentPercentage(Number(e.target.value))}
                      className="w-20"
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marketing">Marketing Percentage (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="marketing"
                      min={1}
                      max={10}
                      step={0.5}
                      value={[marketingPercentage]}
                      onValueChange={(value) => setMarketingPercentage(value[0])}
                      disabled={!editMode}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={marketingPercentage}
                      onChange={(e) => setMarketingPercentage(Number(e.target.value))}
                      className="w-20"
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utilities">Utilities Percentage (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="utilities"
                      min={1}
                      max={10}
                      step={0.5}
                      value={[utilitiesPercentage]}
                      onValueChange={(value) => setUtilitiesPercentage(value[0])}
                      disabled={!editMode}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={utilitiesPercentage}
                      onChange={(e) => setUtilitiesPercentage(Number(e.target.value))}
                      className="w-20"
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="other-expenses">Other Expenses Percentage (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="other-expenses"
                      min={1}
                      max={15}
                      step={0.5}
                      value={[otherExpensesPercentage]}
                      onValueChange={(value) => setOtherExpensesPercentage(value[0])}
                      disabled={!editMode}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={otherExpensesPercentage}
                      onChange={(e) => setOtherExpensesPercentage(Number(e.target.value))}
                      className="w-20"
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profit & Loss Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Item</th>
                        <th className="text-right py-2 font-medium">Amount (SAR)</th>
                        <th className="text-right py-2 font-medium">% of Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Revenue</td>
                        <td className="text-right py-2">{plData.totalRevenue.toLocaleString()}</td>
                        <td className="text-right py-2">100.0%</td>
                      </tr>
                      <tr className="border-b text-sm">
                        <td className="py-1 pl-4">Food Revenue</td>
                        <td className="text-right py-1">{plData.foodRevenue.toLocaleString()}</td>
                        <td className="text-right py-1">
                          {((plData.foodRevenue / plData.totalRevenue) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="border-b text-sm">
                        <td className="py-1 pl-4">Beverage Revenue</td>
                        <td className="text-right py-1">{plData.beverageRevenue.toLocaleString()}</td>
                        <td className="text-right py-1">
                          {((plData.beverageRevenue / plData.totalRevenue) * 100).toFixed(1)}%
                        </td>
                      </tr>

                      <tr className="border-b">
                        <td className="py-2 font-medium">Cost of Goods Sold</td>
                        <td className="text-right py-2">{plData.totalCOGS.toLocaleString()}</td>
                        <td className="text-right py-2">
                          {((plData.totalCOGS / plData.totalRevenue) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="border-b text-sm">
                        <td className="py-1 pl-4">Food Cost</td>
                        <td className="text-right py-1">{plData.foodCost.toLocaleString()}</td>
                        <td className="text-right py-1">{foodCostPercentage.toFixed(1)}%</td>
                      </tr>
                      <tr className="border-b text-sm">
                        <td className="py-1 pl-4">Beverage Cost</td>
                        <td className="text-right py-1">{plData.beverageCost.toLocaleString()}</td>
                        <td className="text-right py-1">{beverageCostPercentage.toFixed(1)}%</td>
                      </tr>

                      <tr className="border-b bg-muted/30">
                        <td className="py-2 font-medium">Gross Profit</td>
                        <td className="text-right py-2 font-medium">{plData.grossProfit.toLocaleString()}</td>
                        <td className="text-right py-2 font-medium">{plData.grossProfitMargin.toFixed(1)}%</td>
                      </tr>

                      <tr className="border-b">
                        <td className="py-2 font-medium">Operating Expenses</td>
                        <td className="text-right py-2">{plData.totalOperatingExpenses.toLocaleString()}</td>
                        <td className="text-right py-2">
                          {((plData.totalOperatingExpenses / plData.totalRevenue) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="border-b text-sm">
                        <td className="py-1 pl-4">Labor Cost</td>
                        <td className="text-right py-1">{plData.laborCost.toLocaleString()}</td>
                        <td className="text-right py-1">{laborCostPercentage.toFixed(1)}%</td>
                      </tr>
                      <tr className="border-b text-sm">
                        <td className="py-1 pl-4">Rent</td>
                        <td className="text-right py-1">{plData.rent.toLocaleString()}</td>
                        <td className="text-right py-1">{rentPercentage.toFixed(1)}%</td>
                      </tr>
                      <tr className="border-b text-sm">
                        <td className="py-1 pl-4">Marketing</td>
                        <td className="text-right py-1">{plData.marketing.toLocaleString()}</td>
                        <td className="text-right py-1">{marketingPercentage.toFixed(1)}%</td>
                      </tr>
                      <tr className="border-b text-sm">
                        <td className="py-1 pl-4">Utilities</td>
                        <td className="text-right py-1">{plData.utilities.toLocaleString()}</td>
                        <td className="text-right py-1">{utilitiesPercentage.toFixed(1)}%</td>
                      </tr>
                      <tr className="border-b text-sm">
                        <td className="py-1 pl-4">Other Expenses</td>
                        <td className="text-right py-1">{plData.otherExpenses.toLocaleString()}</td>
                        <td className="text-right py-1">{otherExpensesPercentage.toFixed(1)}%</td>
                      </tr>

                      <tr className="border-b bg-muted/30">
                        <td className="py-2 font-medium">Operating Profit (EBITDA)</td>
                        <td className="text-right py-2 font-medium">{plData.operatingProfit.toLocaleString()}</td>
                        <td className="text-right py-2 font-medium">{plData.operatingProfitMargin.toFixed(1)}%</td>
                      </tr>

                      <tr className="border-b text-sm">
                        <td className="py-1">Depreciation & Amortization</td>
                        <td className="text-right py-1">{plData.depreciationAmortization.toLocaleString()}</td>
                        <td className="text-right py-1">
                          {((plData.depreciationAmortization / plData.totalRevenue) * 100).toFixed(1)}%
                        </td>
                      </tr>

                      <tr className="border-b">
                        <td className="py-2">EBIT</td>
                        <td className="text-right py-2">{plData.ebit.toLocaleString()}</td>
                        <td className="text-right py-2">{((plData.ebit / plData.totalRevenue) * 100).toFixed(1)}%</td>
                      </tr>

                      <tr className="border-b text-sm">
                        <td className="py-1">Interest Expense</td>
                        <td className="text-right py-1">{plData.interestExpense.toLocaleString()}</td>
                        <td className="text-right py-1">
                          {((plData.interestExpense / plData.totalRevenue) * 100).toFixed(1)}%
                        </td>
                      </tr>

                      <tr className="border-b">
                        <td className="py-2">EBT</td>
                        <td className="text-right py-2">{plData.ebt.toLocaleString()}</td>
                        <td className="text-right py-2">{((plData.ebt / plData.totalRevenue) * 100).toFixed(1)}%</td>
                      </tr>

                      <tr className="border-b text-sm">
                        <td className="py-1">Taxes</td>
                        <td className="text-right py-1">{plData.taxes.toLocaleString()}</td>
                        <td className="text-right py-1">{((plData.taxes / plData.totalRevenue) * 100).toFixed(1)}%</td>
                      </tr>

                      <tr className="bg-muted/30">
                        <td className="py-2 font-bold">Net Profit</td>
                        <td className="text-right py-2 font-bold">{plData.netProfit.toLocaleString()}</td>
                        <td className="text-right py-2 font-bold">{plData.netProfitMargin.toFixed(1)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue & Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {chartType === "bar" && (
                    <BarChart
                      data={profitLossChartData}
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
                              text: "Amount (SAR)",
                            },
                          },
                        },
                      }}
                    />
                  )}

                  {chartType === "stacked" && (
                    <BarChart
                      data={profitLossChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
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
                              text: "Amount (SAR)",
                            },
                          },
                        },
                      }}
                    />
                  )}

                  {chartType === "line" && (
                    <LineChart
                      data={{
                        labels: historicalData.labels,
                        datasets: [
                          {
                            label: "Revenue",
                            data: historicalData.revenue,
                            borderColor: "hsl(var(--primary))",
                            backgroundColor: "transparent",
                            tension: 0.3,
                          },
                          {
                            label: "Net Profit",
                            data: historicalData.netProfit,
                            borderColor: "hsl(var(--secondary))",
                            backgroundColor: "transparent",
                            tension: 0.3,
                          },
                        ],
                      }}
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
                              text: "Amount (SAR)",
                            },
                          },
                        },
                      }}
                    />
                  )}

                  {chartType === "pie" && (
                    <PieChart
                      data={expenseBreakdownData}
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
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profit Margins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart
                    data={profitMarginChartData}
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
                            text: "Margin (%)",
                          },
                          max: 40,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Financial Insights</h3>
              <ul className="text-sm space-y-1">
                <li>
                  • Gross profit margin of {plData.grossProfitMargin.toFixed(1)}% is{" "}
                  {plData.grossProfitMargin > 70
                    ? "excellent"
                    : plData.grossProfitMargin > 65
                      ? "good"
                      : plData.grossProfitMargin > 60
                        ? "average"
                        : "below average"}{" "}
                  for the F&B industry
                </li>
                <li>
                  • Operating profit (EBITDA) of {plData.operatingProfitMargin.toFixed(1)}% is{" "}
                  {plData.operatingProfitMargin > 25
                    ? "excellent"
                    : plData.operatingProfitMargin > 20
                      ? "good"
                      : plData.operatingProfitMargin > 15
                        ? "average"
                        : "below average"}{" "}
                  for the F&B industry
                </li>
                <li>
                  • Net profit margin of {plData.netProfitMargin.toFixed(1)}% is{" "}
                  {plData.netProfitMargin > 15
                    ? "excellent"
                    : plData.netProfitMargin > 10
                      ? "good"
                      : plData.netProfitMargin > 5
                        ? "average"
                        : "below average"}{" "}
                  for the F&B industry
                </li>
                <li>
                  • Labor cost at {laborCostPercentage}% of revenue is{" "}
                  {laborCostPercentage < 22
                    ? "excellent"
                    : laborCostPercentage < 25
                      ? "good"
                      : laborCostPercentage < 30
                        ? "average"
                        : "high"}{" "}
                  for the F&B industry
                </li>
                <li>
                  • Combined food and beverage cost of {((plData.totalCOGS / plData.totalRevenue) * 100).toFixed(1)}% is{" "}
                  {plData.totalCOGS / plData.totalRevenue < 0.25
                    ? "excellent"
                    : plData.totalCOGS / plData.totalRevenue < 0.28
                      ? "good"
                      : plData.totalCOGS / plData.totalRevenue < 0.32
                        ? "average"
                        : "high"}
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Optimization Opportunities</h3>
              <ul className="text-sm space-y-1">
                <li>
                  • Reducing food cost by 2% would increase gross profit by SAR {(foodRevenue * 0.02).toLocaleString()}{" "}
                  monthly
                </li>
                <li>
                  • Reducing labor cost by 2% would increase operating profit by SAR{" "}
                  {(plData.totalRevenue * 0.02).toLocaleString()} monthly
                </li>
                <li>• Increasing beverage sales by 5% would improve overall margins due to higher profitability</li>
                <li>• Implementing energy efficiency measures could reduce utilities by 1% of revenue</li>
                <li>• Optimizing staffing during non-peak hours could reduce labor costs by 3-5%</li>
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
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </CardFooter>
    </Card>
  )
}

