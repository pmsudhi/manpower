"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const revenueData = [
  { month: "Jan", actual: 2500000, projected: 2400000 },
  { month: "Feb", actual: 2600000, projected: 2500000 },
  { month: "Mar", actual: 2700000, projected: 2600000 },
  { month: "Apr", actual: 2800000, projected: 2700000 },
  { month: "May", actual: 2900000, projected: 2800000 },
  { month: "Jun", actual: 3000000, projected: 2900000 },
  { month: "Jul", actual: 3100000, projected: 3000000 },
  { month: "Aug", actual: 3000000, projected: 2900000 },
  { month: "Sep", actual: 2900000, projected: 2800000 },
  { month: "Oct", actual: 2800000, projected: 2700000 },
  { month: "Nov", actual: 2900000, projected: 2800000 },
  { month: "Dec", actual: 3200000, projected: 3100000 },
]

const revenueByOutlet = [
  { name: "Mall of Dhahran", value: 12000000, color: "#10b981" },
  { name: "Riyadh Park", value: 10500000, color: "#3b82f6" },
  { name: "Jeddah Corniche", value: 9800000, color: "#6366f1" },
  { name: "Al Nakheel Mall", value: 8200000, color: "#8b5cf6" },
  { name: "Red Sea Mall", value: 7500000, color: "#ec4899" },
]

const COLORS = revenueByOutlet.map((item) => item.color)

export default function RevenueChart() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Revenue Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`SAR ${(value / 1000000).toFixed(2)}M`, ""]} />
              <Legend />
              <Line type="monotone" dataKey="actual" name="Actual Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line
                type="monotone"
                dataKey="projected"
                name="Projected Revenue"
                stroke="#82ca9d"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Revenue by Outlet</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByOutlet}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueByOutlet.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`SAR ${(value / 1000000).toFixed(2)}M`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Annual Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">SAR 48,000,000</div>
              <p className="text-xs text-muted-foreground">+8.2% from previous year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">SAR 4,000,000</div>
              <p className="text-xs text-muted-foreground">Per month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue per Square Meter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">SAR 4,250</div>
              <p className="text-xs text-muted-foreground">Average across all outlets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+8.2%</div>
              <p className="text-xs text-muted-foreground">Year-over-year</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

