"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Edit2 } from "lucide-react"

export default function OutletConfiguration() {
  const [outlets, setOutlets] = useState([
    { id: 1, name: "Mall of Dhahran", brand: "Burger Boutique", location: "Dhahran, KSA", status: "Open" },
    { id: 2, name: "Riyadh Park", brand: "Lazy Cat", location: "Riyadh, KSA", status: "Open" },
    { id: 3, name: "Jeddah Corniche", brand: "Nomad", location: "Jeddah, KSA", status: "Construction" },
    { id: 4, name: "Al Nakheel Mall", brand: "Swaikhat", location: "Riyadh, KSA", status: "Open" },
    { id: 5, name: "The Avenues", brand: "White Robata", location: "Kuwait City, Kuwait", status: "Planning" },
  ])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Outlet Management</CardTitle>
          <CardDescription>Configure restaurant outlets across locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Outlet
              </Button>
            </div>

            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Outlet Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Brand</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Location</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {outlets.map((outlet) => (
                    <tr
                      key={outlet.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">{outlet.name}</td>
                      <td className="p-4 align-middle">{outlet.brand}</td>
                      <td className="p-4 align-middle">{outlet.location}</td>
                      <td className="p-4 align-middle">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            outlet.status === "Open"
                              ? "bg-green-100 text-green-800"
                              : outlet.status === "Construction"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {outlet.status}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outlet Parameters</CardTitle>
          <CardDescription>Configure specific parameters for each outlet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="outlet-select">Select Outlet</Label>
                <Select defaultValue="mall-of-dhahran">
                  <SelectTrigger id="outlet-select">
                    <SelectValue placeholder="Select Outlet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mall-of-dhahran">Mall of Dhahran</SelectItem>
                    <SelectItem value="riyadh-park">Riyadh Park</SelectItem>
                    <SelectItem value="jeddah-corniche">Jeddah Corniche</SelectItem>
                    <SelectItem value="al-nakheel-mall">Al Nakheel Mall</SelectItem>
                    <SelectItem value="the-avenues">The Avenues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="outlet-area">Total Restaurant Area (sqm)</Label>
                <Input id="outlet-area" type="number" defaultValue="300" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outlet-foh-percentage">FOH Area Percentage (%)</Label>
                <Input id="outlet-foh-percentage" type="number" defaultValue="65" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outlet-external-seating">External Seating Capacity</Label>
                <Input id="outlet-external-seating" type="number" defaultValue="20" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outlet-currency">Currency</Label>
                <Select defaultValue="sar">
                  <SelectTrigger id="outlet-currency">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sar">SAR (Saudi Riyal)</SelectItem>
                    <SelectItem value="aed">AED (UAE Dirham)</SelectItem>
                    <SelectItem value="kwd">KWD (Kuwaiti Dinar)</SelectItem>
                    <SelectItem value="bhd">BHD (Bahraini Dinar)</SelectItem>
                    <SelectItem value="qar">QAR (Qatari Riyal)</SelectItem>
                    <SelectItem value="omr">OMR (Omani Rial)</SelectItem>
                    <SelectItem value="usd">USD (US Dollar)</SelectItem>
                    <SelectItem value="gbp">GBP (British Pound)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="outlet-status">Outlet Status</Label>
                <Select defaultValue="open">
                  <SelectTrigger id="outlet-status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="construction">Under Construction</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="outlet-opening-date">Opening Date</Label>
                <Input id="outlet-opening-date" type="date" defaultValue="2023-01-15" />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Switch id="outlet-ramadan" defaultChecked />
              <Label htmlFor="outlet-ramadan">Apply Ramadan Adjustment (50% capacity)</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save Outlet Parameters</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

