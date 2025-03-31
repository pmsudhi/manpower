"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Edit2 } from "lucide-react"

export default function BrandConfiguration() {
  const [brands, setBrands] = useState([
    { id: 1, name: "Burger Boutique", serviceStyle: "fast-casual", description: "Fast casual burger concept" },
    { id: 2, name: "Lazy Cat", serviceStyle: "casual", description: "Casual dining concept" },
    { id: 3, name: "Nomad", serviceStyle: "premium", description: "Premium dining concept" },
    { id: 4, name: "Swaikhat", serviceStyle: "casual", description: "Casual dining concept" },
    { id: 5, name: "White Robata", serviceStyle: "premium", description: "Premium Japanese concept" },
  ])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand Management</CardTitle>
          <CardDescription>Configure F&B brands and their service styles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Brand
              </Button>
            </div>

            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Brand Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Service Style</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                    <th className="h-12 px-4 text-left align-middle font-medium w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr
                      key={brand.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">{brand.name}</td>
                      <td className="p-4 align-middle capitalize">{brand.serviceStyle}</td>
                      <td className="p-4 align-middle">{brand.description}</td>
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
          <CardTitle>Brand Parameters</CardTitle>
          <CardDescription>Default parameters for each brand concept</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand-select">Select Brand</Label>
                <Select defaultValue="burger-boutique">
                  <SelectTrigger id="brand-select">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="burger-boutique">Burger Boutique</SelectItem>
                    <SelectItem value="lazy-cat">Lazy Cat</SelectItem>
                    <SelectItem value="nomad">Nomad</SelectItem>
                    <SelectItem value="swaikhat">Swaikhat</SelectItem>
                    <SelectItem value="white-robata">White Robata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="default-area-per-cover">Default Area per Cover (sqm)</Label>
                <Select defaultValue="1.67">
                  <SelectTrigger id="default-area-per-cover">
                    <SelectValue placeholder="Select Area per Cover" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.5">1.5 sqm (High Density)</SelectItem>
                    <SelectItem value="1.67">1.67 sqm (Standard)</SelectItem>
                    <SelectItem value="1.86">1.86 sqm (Comfortable)</SelectItem>
                    <SelectItem value="2.05">2.05 sqm (Spacious)</SelectItem>
                    <SelectItem value="2.32">2.32 sqm (Premium)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-covers-per-waiter">Default Covers per Waiter</Label>
                <Select defaultValue="16">
                  <SelectTrigger id="default-covers-per-waiter">
                    <SelectValue placeholder="Select Covers per Waiter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 (Premium Service)</SelectItem>
                    <SelectItem value="16">16 (Standard Service)</SelectItem>
                    <SelectItem value="20">20 (Efficient Service)</SelectItem>
                    <SelectItem value="24">24 (Fast Casual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-runner-ratio">Default Runner to Waiter Ratio</Label>
                <Select defaultValue="50">
                  <SelectTrigger id="default-runner-ratio">
                    <SelectValue placeholder="Select Runner Ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100% (1:1 Ratio)</SelectItem>
                    <SelectItem value="75">75% (3:4 Ratio)</SelectItem>
                    <SelectItem value="50">50% (1:2 Ratio)</SelectItem>
                    <SelectItem value="25">25% (1:4 Ratio)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-kitchen-stations">Default Kitchen Stations</Label>
                <Input id="default-kitchen-stations" type="number" defaultValue="4" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-avg-check">Default Average Check (SAR)</Label>
                <Input id="default-avg-check" type="number" defaultValue="120" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-dwelling-time">Default Dwelling Time (min)</Label>
                <Input id="default-dwelling-time" type="number" defaultValue="90" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save Brand Parameters</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

