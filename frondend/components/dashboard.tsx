"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import StaffingChart from "./charts/staffing-chart"
import LaborCostChart from "./charts/labor-cost-chart"
import EfficiencyMetricsChart from "./charts/efficiency-metrics-chart"
import RevenueChart from "./charts/revenue-chart"

export default function Dashboard() {
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedOutlet, setSelectedOutlet] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Operational Dashboard</h2>
          <p className="text-muted-foreground">Overview of your F&B operations and staffing metrics</p>
        </div>

        <div className="flex gap-4">
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="burger-boutique">Burger Boutique</SelectItem>
              <SelectItem value="lazy-cat">Lazy Cat</SelectItem>
              <SelectItem value="nomad">Nomad</SelectItem>
              <SelectItem value="swaikhat">Swaikhat</SelectItem>
              <SelectItem value="white-robata">White Robata</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Outlet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outlets</SelectItem>
              <SelectItem value="mall-of-dhahran">Mall of Dhahran</SelectItem>
              <SelectItem value="riyadh-park">Riyadh Park</SelectItem>
              <SelectItem value="jeddah-corniche">Jeddah Corniche</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <CardDescription>Across all outlets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Labor Cost</CardTitle>
            <CardDescription>% of Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3%</div>
            <p className="text-xs text-muted-foreground">-0.8% from last month</p>
          </CardContent>
        </Card>

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
            <CardTitle className="text-sm font-medium">Revenue per sqm</CardTitle>
            <CardDescription>Space efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SAR 4,250</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="staffing">
        <TabsList>
          <TabsTrigger value="staffing">Staffing Structure</TabsTrigger>
          <TabsTrigger value="labor-cost">Labor Cost</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency Metrics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="staffing" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <StaffingChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labor-cost" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <LaborCostChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <EfficiencyMetricsChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <RevenueChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

