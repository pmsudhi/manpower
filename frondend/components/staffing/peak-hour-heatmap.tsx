"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Download, Edit, Save } from "lucide-react"

// Sample data for the heatmap
const generateSampleData = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const hours = Array.from({ length: 16 }, (_, i) => i + 8) // 8 AM to 11 PM

  const data = {}

  days.forEach((day) => {
    data[day] = {}
    hours.forEach((hour) => {
      // Generate different patterns for different days
      let baseValue

      // Weekday pattern
      if (day === "Monday" || day === "Tuesday" || day === "Wednesday" || day === "Thursday") {
        if (hour >= 12 && hour <= 14) {
          // Lunch peak
          baseValue = 0.8
        } else if (hour >= 18 && hour <= 21) {
          // Dinner peak
          baseValue = 0.9
        } else {
          baseValue = 0.4
        }
      }
      // Weekend pattern
      else {
        if (hour >= 11 && hour <= 15) {
          // Extended lunch peak
          baseValue = 0.85
        } else if (hour >= 18 && hour <= 22) {
          // Extended dinner peak
          baseValue = 1.0
        } else {
          baseValue = 0.5
        }
      }

      // Add some randomness
      const randomFactor = 0.1
      const value = Math.min(1, Math.max(0, baseValue + (Math.random() * randomFactor * 2 - randomFactor)))

      data[day][hour] = {
        value,
        foh: Math.round(value * 15), // FOH staff needed
        boh: Math.round(value * 10), // BOH staff needed
      }
    })
  })

  return data
}

// Function to get color based on value
const getHeatmapColor = (value) => {
  // From light to dark
  if (value < 0.2) return "bg-green-100"
  if (value < 0.4) return "bg-green-200"
  if (value < 0.6) return "bg-amber-200"
  if (value < 0.8) return "bg-amber-300"
  return "bg-red-400"
}

// Function to format hour
const formatHour = (hour) => {
  const period = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour} ${period}`
}

export function PeakHourHeatmap({ className }) {
  const [heatmapData, setHeatmapData] = useState(generateSampleData())
  const [selectedDay, setSelectedDay] = useState("All Days")
  const [selectedStaffType, setSelectedStaffType] = useState("all")
  const [editMode, setEditMode] = useState(false)
  const [peakFactor, setPeakFactor] = useState(1.0)
  const [applyRamadan, setApplyRamadan] = useState(false)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const hours = Array.from({ length: 16 }, (_, i) => i + 8) // 8 AM to 11 PM

  // Filter data based on selected day
  const filteredDays = selectedDay === "All Days" ? days : [selectedDay]

  // Apply Ramadan adjustment if needed
  const getAdjustedValue = (value) => {
    let adjustedValue = value * peakFactor
    if (applyRamadan) {
      // During Ramadan, shift peak hours and reduce overall capacity
      adjustedValue = adjustedValue * 0.7
    }
    return Math.min(1, adjustedValue)
  }

  // Handle cell click in edit mode
  const handleCellClick = (day, hour) => {
    if (!editMode) return

    const currentValue = heatmapData[day][hour].value
    const newValue = currentValue >= 0.7 ? 0.3 : currentValue >= 0.4 ? 0.7 : 1.0

    setHeatmapData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: {
          value: newValue,
          foh: Math.round(newValue * 15),
          boh: Math.round(newValue * 10),
        },
      },
    }))
  }

  // Calculate staffing requirements
  const calculateStaffingRequirements = () => {
    const requirements = {
      byDay: {},
      byHour: {},
      total: {
        foh: 0,
        boh: 0,
        total: 0,
        peakFoh: 0,
        peakBoh: 0,
        peakTotal: 0,
      },
    }

    // Initialize
    days.forEach((day) => {
      requirements.byDay[day] = { foh: 0, boh: 0, total: 0, peak: 0 }
    })

    hours.forEach((hour) => {
      requirements.byHour[hour] = { foh: 0, boh: 0, total: 0, peak: 0 }
    })

    // Calculate
    days.forEach((day) => {
      hours.forEach((hour) => {
        const cellData = heatmapData[day][hour]
        const adjustedValue = getAdjustedValue(cellData.value)
        const fohNeeded = Math.round(adjustedValue * 15)
        const bohNeeded = Math.round(adjustedValue * 10)
        const totalNeeded = fohNeeded + bohNeeded

        requirements.byDay[day].foh += fohNeeded
        requirements.byDay[day].boh += bohNeeded
        requirements.byDay[day].total += totalNeeded
        requirements.byDay[day].peak = Math.max(requirements.byDay[day].peak, totalNeeded)

        requirements.byHour[hour].foh += fohNeeded
        requirements.byHour[hour].boh += bohNeeded
        requirements.byHour[hour].total += totalNeeded
        requirements.byHour[hour].peak = Math.max(requirements.byHour[hour].peak, totalNeeded)

        requirements.total.foh += fohNeeded
        requirements.total.boh += bohNeeded
        requirements.total.total += totalNeeded
        requirements.total.peakFoh = Math.max(requirements.total.peakFoh, fohNeeded)
        requirements.total.peakBoh = Math.max(requirements.total.peakBoh, bohNeeded)
        requirements.total.peakTotal = Math.max(requirements.total.peakTotal, totalNeeded)
      })
    })

    // Average by number of days
    Object.keys(requirements.byHour).forEach((hour) => {
      requirements.byHour[hour].foh = Math.round(requirements.byHour[hour].foh / days.length)
      requirements.byHour[hour].boh = Math.round(requirements.byHour[hour].boh / days.length)
      requirements.byHour[hour].total = Math.round(requirements.byHour[hour].total / days.length)
    })

    requirements.total.foh = Math.round(requirements.total.foh / (days.length * hours.length))
    requirements.total.boh = Math.round(requirements.total.boh / (days.length * hours.length))
    requirements.total.total = Math.round(requirements.total.total / (days.length * hours.length))

    return requirements
  }

  const staffingRequirements = calculateStaffingRequirements()

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Peak Hour Staffing Heatmap</CardTitle>
            <CardDescription>Visualize staffing requirements across different days and hours</CardDescription>
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
              <label className="text-sm font-medium mb-1 block">Day</label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Days">All Days</SelectItem>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Staff Type</label>
              <Select value={selectedStaffType} onValueChange={setSelectedStaffType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  <SelectItem value="foh">Front of House</SelectItem>
                  <SelectItem value="boh">Back of House</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Peak Factor</label>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[peakFactor * 100]}
                  min={50}
                  max={150}
                  step={5}
                  onValueChange={(value) => setPeakFactor(value[0] / 100)}
                />
                <span className="w-12 text-center">{(peakFactor * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="ramadan-adjustment" checked={applyRamadan} onCheckedChange={setApplyRamadan} />
            <Label htmlFor="ramadan-adjustment">Apply Ramadan Adjustment (70% capacity, shifted peak hours)</Label>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left font-medium">Day / Hour</th>
                      {hours.map((hour) => (
                        <th key={hour} className="p-2 text-center font-medium">
                          {formatHour(hour)}
                        </th>
                      ))}
                      <th className="p-2 text-center font-medium">Average</th>
                      <th className="p-2 text-center font-medium">Peak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDays.map((day) => (
                      <tr key={day} className="border-t">
                        <td className="p-2 font-medium">{day}</td>
                        {hours.map((hour) => {
                          const cellData = heatmapData[day][hour]
                          const adjustedValue = getAdjustedValue(cellData.value)

                          let displayValue
                          if (selectedStaffType === "foh") {
                            displayValue = Math.round(adjustedValue * 15)
                          } else if (selectedStaffType === "boh") {
                            displayValue = Math.round(adjustedValue * 10)
                          } else {
                            displayValue = Math.round(adjustedValue * 25)
                          }

                          return (
                            <td
                              key={hour}
                              className={`p-2 text-center ${getHeatmapColor(adjustedValue)} transition-colors ${editMode ? "cursor-pointer hover:opacity-80" : ""}`}
                              onClick={() => handleCellClick(day, hour)}
                            >
                              {displayValue}
                            </td>
                          )
                        })}
                        <td className="p-2 text-center font-medium bg-muted/30">
                          {selectedStaffType === "foh"
                            ? Math.round(staffingRequirements.byDay[day].foh / hours.length)
                            : selectedStaffType === "boh"
                              ? Math.round(staffingRequirements.byDay[day].boh / hours.length)
                              : Math.round(staffingRequirements.byDay[day].total / hours.length)}
                        </td>
                        <td className="p-2 text-center font-medium bg-muted/50">
                          {selectedStaffType === "foh"
                            ? Math.max(
                                ...hours.map((hour) => Math.round(getAdjustedValue(heatmapData[day][hour].value) * 15)),
                              )
                            : selectedStaffType === "boh"
                              ? Math.max(
                                  ...hours.map((hour) =>
                                    Math.round(getAdjustedValue(heatmapData[day][hour].value) * 10),
                                  ),
                                )
                              : Math.max(
                                  ...hours.map((hour) =>
                                    Math.round(getAdjustedValue(heatmapData[day][hour].value) * 25),
                                  ),
                                )}
                        </td>
                      </tr>
                    ))}
                    {selectedDay === "All Days" && (
                      <tr className="border-t bg-muted/30">
                        <td className="p-2 font-medium">Average</td>
                        {hours.map((hour) => (
                          <td key={hour} className="p-2 text-center font-medium">
                            {selectedStaffType === "foh"
                              ? staffingRequirements.byHour[hour].foh
                              : selectedStaffType === "boh"
                                ? staffingRequirements.byHour[hour].boh
                                : staffingRequirements.byHour[hour].total}
                          </td>
                        ))}
                        <td className="p-2 text-center font-medium">
                          {selectedStaffType === "foh"
                            ? staffingRequirements.total.foh
                            : selectedStaffType === "boh"
                              ? staffingRequirements.total.boh
                              : staffingRequirements.total.total}
                        </td>
                        <td className="p-2 text-center font-medium">
                          {selectedStaffType === "foh"
                            ? staffingRequirements.total.peakFoh
                            : selectedStaffType === "boh"
                              ? staffingRequirements.total.peakBoh
                              : staffingRequirements.total.peakTotal}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Staffing Insights</h3>
              <ul className="text-sm space-y-1">
                <li>
                  • Peak staffing requirements occur on{" "}
                  {Object.entries(staffingRequirements.byDay).sort((a, b) => b[1].peak - a[1].peak)[0][0]} at{" "}
                  {formatHour(
                    hours[
                      Object.entries(
                        heatmapData[
                          Object.entries(staffingRequirements.byDay).sort((a, b) => b[1].peak - a[1].peak)[0][0]
                        ],
                      ).reduce((maxHour, [hour, data]) => {
                        const currentHour = Number.parseInt(hour)
                        return getAdjustedValue(data.value) >
                          getAdjustedValue(
                            heatmapData[
                              Object.entries(staffingRequirements.byDay).sort((a, b) => b[1].peak - a[1].peak)[0][0]
                            ][maxHour].value,
                          )
                          ? currentHour
                          : maxHour
                      }, hours[0])
                    ],
                  )}
                </li>
                <li>
                  • Weekend staffing needs are{" "}
                  {Math.round(
                    ((staffingRequirements.byDay["Friday"].total +
                      staffingRequirements.byDay["Saturday"].total +
                      staffingRequirements.byDay["Sunday"].total) /
                      3 /
                      ((staffingRequirements.byDay["Monday"].total +
                        staffingRequirements.byDay["Tuesday"].total +
                        staffingRequirements.byDay["Wednesday"].total +
                        staffingRequirements.byDay["Thursday"].total) /
                        4)) *
                      100 -
                      100,
                  )}
                  % higher than weekdays
                </li>
                <li>
                  • Lunch peak requires{" "}
                  {Math.round(
                    Object.entries(staffingRequirements.byHour)
                      .filter(([hour]) => Number.parseInt(hour) >= 12 && Number.parseInt(hour) <= 14)
                      .reduce((sum, [_, data]) => sum + data.total, 0) / 3,
                  )}{" "}
                  staff on average
                </li>
                <li>
                  • Dinner peak requires{" "}
                  {Math.round(
                    Object.entries(staffingRequirements.byHour)
                      .filter(([hour]) => Number.parseInt(hour) >= 18 && Number.parseInt(hour) <= 21)
                      .reduce((sum, [_, data]) => sum + data.total, 0) / 4,
                  )}{" "}
                  staff on average
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Optimization Opportunities</h3>
              <ul className="text-sm space-y-1">
                <li>• Consider staggered shifts to cover peak hours more efficiently</li>
                <li>• Implement split shifts for staff during lunch and dinner peaks</li>
                <li>• Cross-train staff to flex between positions during peak hours</li>
                <li>
                  • Schedule {Math.round(staffingRequirements.total.total * 0.7)} core staff for all shifts and{" "}
                  {Math.round(staffingRequirements.total.peakTotal - staffingRequirements.total.total * 0.7)} flex staff
                  for peak hours
                </li>
                <li>• Adjust BOH prep schedule to align with peak service hours</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-100"></div>
              <span className="text-xs">Low (0-20%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-200"></div>
              <span className="text-xs">Moderate (20-40%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-amber-200"></div>
              <span className="text-xs">Medium (40-60%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-amber-300"></div>
              <span className="text-xs">High (60-80%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-400"></div>
              <span className="text-xs">Peak (80-100%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

