"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

export default function PeakHourAnalysis() {
  const { toast } = useToast()
  const [selectedDay, setSelectedDay] = useState("friday")
  const [selectedView, setSelectedView] = useState("heatmap")

  // Sample data for peak hour staffing
  const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayLabels = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  }

  // Hours of operation
  const hours = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 8 // Starting from 8 AM
    return hour < 12 ? `${hour} AM` : hour === 12 ? `${hour} PM` : `${hour - 12} PM`
  })

  // Sample peak hour data (staff needed per hour)
  const peakHourData = {
    monday: [0, 0, 2, 4, 6, 8, 12, 15, 18, 20, 16, 12, 8, 5, 2, 0],
    tuesday: [0, 0, 2, 4, 6, 8, 10, 14, 16, 18, 14, 10, 8, 5, 2, 0],
    wednesday: [0, 0, 2, 4, 6, 8, 10, 14, 16, 18, 14, 10, 8, 5, 2, 0],
    thursday: [0, 0, 2, 4, 6, 8, 12, 16, 20, 22, 18, 14, 10, 6, 3, 0],
    friday: [0, 0, 3, 5, 8, 10, 15, 20, 25, 28, 24, 18, 12, 8, 4, 0],
    saturday: [0, 0, 3, 5, 8, 10, 15, 20, 25, 28, 24, 18, 12, 8, 4, 0],
    sunday: [0, 0, 2, 4, 6, 8, 12, 16, 20, 22, 18, 14, 10, 6, 3, 0],
  }

  // Staff breakdown by position for the selected day
  const staffBreakdown = {
    friday: [
      { position: "Restaurant Manager", count: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0] },
      { position: "Assistant Manager", count: [0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0] },
      { position: "Host/Hostess", count: [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0, 0] },
      { position: "Waiter/Waitress", count: [0, 0, 0, 1, 2, 3, 5, 6, 8, 8, 7, 6, 4, 2, 1, 0] },
      { position: "Runner", count: [0, 0, 0, 0, 1, 1, 2, 3, 4, 4, 3, 2, 1, 1, 0, 0] },
      { position: "Bartender", count: [0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0, 0] },
      { position: "Executive Chef", count: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0] },
      { position: "Sous Chef", count: [0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0] },
      { position: "Line Cook", count: [0, 0, 0, 0, 1, 1, 2, 3, 4, 4, 3, 2, 1, 0, 0, 0] },
      { position: "Prep Cook", count: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0] },
      { position: "Dishwasher", count: [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 1, 1, 0, 0, 0] },
    ],
  }

  // Get color based on staff count (for heatmap)
  const getHeatmapColor = (count) => {
    if (count === 0) return "bg-gray-100"
    if (count <= 5) return "bg-green-100"
    if (count <= 10) return "bg-green-200"
    if (count <= 15) return "bg-yellow-100"
    if (count <= 20) return "bg-yellow-200"
    if (count <= 25) return "bg-orange-100"
    return "bg-orange-200"
  }

  const getHeatmapTextColor = (count) => {
    if (count === 0) return "text-gray-400"
    return "text-gray-900"
  }

  const optimizeStaffing = () => {
    toast({
      title: "Staffing Optimized",
      description: "Peak hour staffing has been optimized based on demand patterns.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h3 className="text-lg font-medium">Peak Hour Staffing Analysis</h3>
          <p className="text-sm text-muted-foreground">Analyze and optimize staffing levels throughout the day</p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Day" />
            </SelectTrigger>
            <SelectContent>
              {weekdays.map((day) => (
                <SelectItem key={day} value={day}>
                  {dayLabels[day]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="heatmap">Heatmap View</SelectItem>
              <SelectItem value="breakdown">Position Breakdown</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={optimizeStaffing}>Optimize Staffing</Button>
        </div>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Staffing Heatmap - {dayLabels[selectedDay]}</CardTitle>
              <CardDescription>Visual representation of staffing needs throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Hour</TableHead>
                      {hours.map((hour, index) => (
                        <TableHead key={index} className="text-center">
                          {hour}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Total Staff</TableCell>
                      {peakHourData[selectedDay].map((count, index) => (
                        <TableCell
                          key={index}
                          className={`text-center ${getHeatmapColor(count)} ${getHeatmapTextColor(count)}`}
                        >
                          {count}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-medium">Legend:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-100"></div>
                    <span className="text-xs">0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-100"></div>
                    <span className="text-xs">1-5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-200"></div>
                    <span className="text-xs">6-10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-yellow-100"></div>
                    <span className="text-xs">11-15</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-yellow-200"></div>
                    <span className="text-xs">16-20</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-orange-100"></div>
                    <span className="text-xs">21-25</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-orange-200"></div>
                    <span className="text-xs">26+</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Peak staffing: {Math.max(...peakHourData[selectedDay])} staff at{" "}
                    {hours[peakHourData[selectedDay].indexOf(Math.max(...peakHourData[selectedDay]))]}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Position Breakdown - {dayLabels[selectedDay]}</CardTitle>
              <CardDescription>Detailed staffing by position throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Position</TableHead>
                      {hours.map((hour, index) => (
                        <TableHead key={index} className="text-center">
                          {hour}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffBreakdown[selectedDay].map((position, posIndex) => (
                      <TableRow key={posIndex}>
                        <TableCell className="font-medium">{position.position}</TableCell>
                        {position.count.map((count, hourIndex) => (
                          <TableCell
                            key={hourIndex}
                            className={`text-center ${getHeatmapColor(count)} ${getHeatmapTextColor(count)}`}
                          >
                            {count}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total</TableCell>
                      {hours.map((_, hourIndex) => {
                        const total = staffBreakdown[selectedDay].reduce(
                          (sum, position) => sum + position.count[hourIndex],
                          0,
                        )
                        return (
                          <TableCell
                            key={hourIndex}
                            className={`text-center ${getHeatmapColor(total)} ${getHeatmapTextColor(total)}`}
                          >
                            {total}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

