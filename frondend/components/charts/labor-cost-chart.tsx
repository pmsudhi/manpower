"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const laborCostData = [
  { month: "Jan", cost: 580000, percentage: 23.2 },
  { month: "Feb", cost: 595000, percentage: 23.8 },
  { month: "Mar", cost: 610000, percentage: 24.4 },
  { month: "Apr", cost: 625000, percentage: 25.0 },
  { month: "May", cost: 615000, percentage: 24.6 },
  { month: "Jun", cost: 605000, percentage: 24.2 },
  { month: "Jul", cost: 600000, percentage: 24.0 },
  { month: "Aug", cost: 590000, percentage: 23.6 },
  { month: "Sep", cost: 585000, percentage: 23.4 },
  { month: "Oct", cost: 595000, percentage: 23.8 },
  { month: "Nov", cost: 605000, percentage: 24.2 },
  { month: "Dec", cost: 620000, percentage: 24.8 },
]

const laborBreakdownData = [
  { position: "Servers", cost: 120000, percentage: 20 },
  { position: "Chefs", cost: 90000, percentage: 15 },
  { position: "Line Cooks", cost: 108000, percentage: 18 },
  { position: "Managers", cost: 72000, percentage: 12 },
  { position: "Hosts", cost: 36000, percentage: 6 },
  { position: "Bartenders", cost: 42000, percentage: 7 },
  { position: "Dishwashers", cost: 54000, percentage: 9 },
  { position: "Others", cost: 78000, percentage: 13 },
]

export default function LaborCostChart() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Labor Cost Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={laborCostData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="cost"
                name="Labor Cost (SAR)"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line yAxisId="right" type="monotone" dataKey="percentage" name="% of Revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Labor Cost by Position</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={laborBreakdownData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 80,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="position" type="category" />
                <Tooltip formatter={(value) => [`SAR ${value.toLocaleString()}`, ""]} />
                <Legend />
                <Bar dataKey="cost" name="Monthly Cost (SAR)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Monthly Labor Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">SAR 600,000</div>
              <p className="text-xs text-muted-foreground">24.3% of total revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Cost per Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">SAR 2,429</div>
              <p className="text-xs text-muted-foreground">Per month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Labor Cost per Cover</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">SAR 28.50</div>
              <p className="text-xs text-muted-foreground">Average across all outlets</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

