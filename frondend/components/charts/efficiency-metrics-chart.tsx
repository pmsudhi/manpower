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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const efficiencyTrendData = [
  { month: "Jan", covers: 4.2, revenue: 3800, labor: 92 },
  { month: "Feb", covers: 4.3, revenue: 3850, labor: 93 },
  { month: "Mar", covers: 4.4, revenue: 3900, labor: 94 },
  { month: "Apr", covers: 4.5, revenue: 3950, labor: 95 },
  { month: "May", covers: 4.6, revenue: 4000, labor: 96 },
  { month: "Jun", covers: 4.7, revenue: 4050, labor: 97 },
  { month: "Jul", covers: 4.8, revenue: 4100, labor: 98 },
  { month: "Aug", covers: 4.7, revenue: 4050, labor: 97 },
  { month: "Sep", covers: 4.6, revenue: 4000, labor: 96 },
  { month: "Oct", covers: 4.5, revenue: 3950, labor: 95 },
  { month: "Nov", covers: 4.6, revenue: 4000, labor: 96 },
  { month: "Dec", covers: 4.7, revenue: 4050, labor: 97 },
]

const outletComparisonData = [
  { outlet: "Mall of Dhahran", covers: 4.9, revenue: 4200, labor: 98 },
  { outlet: "Riyadh Park", covers: 4.7, revenue: 4050, labor: 97 },
  { outlet: "Jeddah Corniche", covers: 4.5, revenue: 3900, labor: 95 },
  { outlet: "Al Nakheel Mall", covers: 4.3, revenue: 3750, labor: 93 },
  { outlet: "Red Sea Mall", covers: 4.1, revenue: 3600, labor: 91 },
]

const radarData = [
  { metric: "Covers per Labor Hour", current: 4.7, benchmark: 5.2, fullMark: 6 },
  { metric: "Revenue per Labor Hour", current: 4050, benchmark: 4500, fullMark: 5000 },
  { metric: "Labor Utilization", current: 97, benchmark: 98, fullMark: 100 },
  { metric: "Turnover Time", current: 85, benchmark: 90, fullMark: 100 },
  { metric: "Customer Satisfaction", current: 88, benchmark: 92, fullMark: 100 },
  { metric: "Staff Retention", current: 82, benchmark: 85, fullMark: 100 },
]

export default function EfficiencyMetricsChart() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Efficiency Metrics Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={efficiencyTrendData}
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
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="covers"
                name="Covers per Labor Hour"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="revenue" name="Revenue per Labor Hour (SAR)" stroke="#82ca9d" />
              <Line type="monotone" dataKey="labor" name="Labor Utilization (%)" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Outlet Comparison</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={outletComparisonData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="outlet" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="covers" name="Covers per Labor Hour" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Performance vs Benchmark</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis />
                <Radar name="Current Performance" dataKey="current" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar
                  name="Industry Benchmark"
                  dataKey="benchmark"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Covers per Labor Hour</CardTitle>
            <CardDescription>Efficiency metric</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">+0.3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue per Labor Hour</CardTitle>
            <CardDescription>Financial efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SAR 4,050</div>
            <p className="text-xs text-muted-foreground">+50 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Labor Utilization</CardTitle>
            <CardDescription>Staff productivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97%</div>
            <p className="text-xs text-muted-foreground">+1% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

