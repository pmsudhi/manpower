"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Sample brand data
const brands = [
  {
    id: "burger-boutique",
    name: "Burger Boutique",
    type: "Fast Casual",
    locations: ["Riyadh Mall", "Jeddah Waterfront", "Dammam City Center"],
    color: "bg-amber-500",
  },
  {
    id: "lazy-cat",
    name: "Lazy Cat",
    type: "Casual Dining",
    locations: ["Riyadh Park", "Jeddah Stars Avenue"],
    color: "bg-indigo-500",
  },
  {
    id: "nomad",
    name: "Nomad",
    type: "Premium Dining",
    locations: ["Riyadh Front", "Jeddah Corniche"],
    color: "bg-emerald-500",
  },
  {
    id: "swaikhat",
    name: "Swaikhat",
    type: "Casual Dining",
    locations: ["Riyadh Tahlia Street", "Al Khobar Corniche"],
    color: "bg-rose-500",
  },
  {
    id: "white-robata",
    name: "White Robata",
    type: "Premium Dining",
    locations: ["Riyadh Kingdom Centre", "Jeddah Red Sea Mall"],
    color: "bg-sky-500",
  },
]

interface BrandSelectorProps {
  onBrandSelect?: (brand: string, location: string) => void
  className?: string
}

export function BrandSelector({ onBrandSelect, className }: BrandSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrand(brandId)
    setSelectedLocation("")
  }

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
    if (onBrandSelect && selectedBrand) {
      onBrandSelect(selectedBrand, location)
    }
  }

  const selectedBrandData = brands.find((brand) => brand.id === selectedBrand)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Brand & Location Selector</CardTitle>
        <CardDescription>Select a brand and location to model staffing requirements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Select Brand</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedBrand === brand.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleBrandSelect(brand.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${brand.color}`}></div>
                    <div className="font-medium truncate">{brand.name}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{brand.type}</div>
                  <div className="text-xs mt-2">{brand.locations.length} locations</div>
                </div>
              ))}
            </div>
          </div>

          {selectedBrand && (
            <div>
              <h3 className="text-sm font-medium mb-3">Select Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {selectedBrandData?.locations.map((location) => (
                  <div
                    key={location}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedLocation === location
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="font-medium">{location}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedBrandData.name} - {selectedBrandData.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedBrand && selectedLocation && (
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Selected Configuration:</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className={`${selectedBrandData?.color} bg-opacity-10`}>
                  {selectedBrandData?.name}
                </Badge>
                <Badge variant="outline">{selectedBrandData?.type}</Badge>
                <Badge variant="outline">{selectedLocation}</Badge>
              </div>
              <Button className="w-full sm:w-auto">Load Configuration</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

