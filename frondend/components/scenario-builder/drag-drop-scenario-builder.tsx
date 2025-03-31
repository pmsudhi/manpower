"use client"

import { useState, useRef } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Copy, Trash2, Plus, GripVertical, Download, Upload, Minus } from "lucide-react"

// Define item types for drag and drop
const ItemTypes = {
  STAFF_POSITION: "staffPosition",
}

// Define staff position types
const positionTypes = {
  FOH: [
    { id: "restaurant-manager", title: "Restaurant Manager", salary: 12000, department: "FOH", level: 0 },
    { id: "assistant-manager", title: "Assistant Manager", salary: 8000, department: "FOH", level: 1 },
    { id: "shift-supervisor", title: "Shift Supervisor", salary: 6000, department: "FOH", level: 2 },
    { id: "host", title: "Host/Hostess", salary: 4000, department: "FOH", level: 3 },
    { id: "waiter", title: "Waiter", salary: 3500, department: "FOH", level: 3 },
    { id: "runner", title: "Runner", salary: 3000, department: "FOH", level: 4 },
    { id: "cashier", title: "Cashier", salary: 3500, department: "FOH", level: 3 },
    { id: "barista", title: "Barista", salary: 3800, department: "FOH", level: 3 },
    { id: "bartender", title: "Bartender", salary: 4200, department: "FOH", level: 3 },
  ],
  BOH: [
    { id: "executive-chef", title: "Executive Chef", salary: 10000, department: "BOH", level: 0 },
    { id: "sous-chef", title: "Sous Chef", salary: 7000, department: "BOH", level: 1 },
    { id: "line-cook", title: "Line Cook", salary: 4500, department: "BOH", level: 2 },
    { id: "prep-cook", title: "Prep Cook", salary: 3500, department: "BOH", level: 3 },
    { id: "kitchen-helper", title: "Kitchen Helper", salary: 3000, department: "BOH", level: 3 },
    { id: "dishwasher", title: "Dishwasher", salary: 2800, department: "BOH", level: 3 },
    { id: "pastry-chef", title: "Pastry Chef", salary: 5500, department: "BOH", level: 2 },
    { id: "butcher", title: "Butcher", salary: 4800, department: "BOH", level: 2 },
    { id: "inventory-manager", title: "Inventory Manager", salary: 5000, department: "BOH", level: 2 },
  ],
}

// Draggable staff position component
const DraggableStaffPosition = ({ position, index, movePosition, removePosition, updateCount }) => {
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.STAFF_POSITION,
    item: { index, id: position.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ItemTypes.STAFF_POSITION,
    hover: (item, monitor) => {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Move the item
      movePosition(dragIndex, hoverIndex)

      // Update the item's index for future drags
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`flex items-center gap-2 p-3 border rounded-md mb-2 bg-card ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="cursor-move">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="font-medium">{position.title}</div>
        <div className="text-xs text-muted-foreground">
          SAR {position.salary.toLocaleString()} | {position.department}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateCount(index, Math.max(1, position.count - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{position.count}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateCount(index, position.count + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removePosition(index)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Position palette component
const PositionPalette = ({ addPosition, department }) => {
  return (
    <div className="border rounded-md p-3 bg-muted/30">
      <h3 className="text-sm font-medium mb-2">Available Positions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {positionTypes[department].map((position) => (
          <div
            key={position.id}
            className="border rounded-md p-2 bg-card cursor-pointer hover:border-primary transition-colors"
            onClick={() => addPosition({ ...position, count: 1 })}
          >
            <div className="font-medium text-sm truncate">{position.title}</div>
            <div className="text-xs text-muted-foreground">SAR {position.salary.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main scenario builder component
export function DragDropScenarioBuilder({ className }) {
  const [activeTab, setActiveTab] = useState("foh")
  const [scenarioName, setScenarioName] = useState("New Scenario")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedOutlet, setSelectedOutlet] = useState("")
  const [fohPositions, setFohPositions] = useState([])
  const [bohPositions, setBohPositions] = useState([])
  const [scenarios, setScenarios] = useState([])

  // Calculate totals
  const calculateTotals = (positions) => {
    const totalStaff = positions.reduce((sum, pos) => sum + pos.count, 0)
    const totalLabor = positions.reduce((sum, pos) => sum + pos.salary * pos.count, 0)
    return { totalStaff, totalLabor }
  }

  const fohTotals = calculateTotals(fohPositions)
  const bohTotals = calculateTotals(bohPositions)
  const grandTotals = {
    totalStaff: fohTotals.totalStaff + bohTotals.totalStaff,
    totalLabor: fohTotals.totalLabor + bohTotals.totalLabor,
  }

  // Move position in the list
  const movePosition = (fromIndex, toIndex, department) => {
    if (department === "FOH") {
      const updatedPositions = [...fohPositions]
      const [movedItem] = updatedPositions.splice(fromIndex, 1)
      updatedPositions.splice(toIndex, 0, movedItem)
      setFohPositions(updatedPositions)
    } else {
      const updatedPositions = [...bohPositions]
      const [movedItem] = updatedPositions.splice(fromIndex, 1)
      updatedPositions.splice(toIndex, 0, movedItem)
      setBohPositions(updatedPositions)
    }
  }

  // Add position to the list
  const addPosition = (position) => {
    if (position.department === "FOH") {
      // Check if position already exists
      const existingIndex = fohPositions.findIndex((p) => p.id === position.id)
      if (existingIndex >= 0) {
        // Update count if position exists
        const updatedPositions = [...fohPositions]
        updatedPositions[existingIndex].count += 1
        setFohPositions(updatedPositions)
      } else {
        setFohPositions([...fohPositions, position])
      }
    } else {
      // Check if position already exists
      const existingIndex = bohPositions.findIndex((p) => p.id === position.id)
      if (existingIndex >= 0) {
        // Update count if position exists
        const updatedPositions = [...bohPositions]
        updatedPositions[existingIndex].count += 1
        setBohPositions(updatedPositions)
      } else {
        setBohPositions([...bohPositions, position])
      }
    }
  }

  // Remove position from the list
  const removePosition = (index, department) => {
    if (department === "FOH") {
      const updatedPositions = [...fohPositions]
      updatedPositions.splice(index, 1)
      setFohPositions(updatedPositions)
    } else {
      const updatedPositions = [...bohPositions]
      updatedPositions.splice(index, 1)
      setBohPositions(updatedPositions)
    }
  }

  // Update position count
  const updateCount = (index, count, department) => {
    if (department === "FOH") {
      const updatedPositions = [...fohPositions]
      updatedPositions[index].count = count
      setFohPositions(updatedPositions)
    } else {
      const updatedPositions = [...bohPositions]
      updatedPositions[index].count = count
      setBohPositions(updatedPositions)
    }
  }

  // Save scenario
  const saveScenario = () => {
    const scenario = {
      id: Date.now().toString(),
      name: scenarioName,
      brand: selectedBrand,
      outlet: selectedOutlet,
      fohPositions: [...fohPositions],
      bohPositions: [...bohPositions],
      totals: {
        foh: { ...fohTotals },
        boh: { ...bohTotals },
        grand: { ...grandTotals },
      },
      createdAt: new Date().toISOString(),
    }

    setScenarios([...scenarios, scenario])
    alert(`Scenario "${scenarioName}" saved successfully!`)
  }

  // Load scenario
  const loadScenario = (scenario) => {
    setScenarioName(scenario.name)
    setSelectedBrand(scenario.brand)
    setSelectedOutlet(scenario.outlet)
    setFohPositions(scenario.fohPositions)
    setBohPositions(scenario.bohPositions)
  }

  // Duplicate scenario
  const duplicateScenario = () => {
    setScenarioName(`${scenarioName} (Copy)`)
  }

  // Clear scenario
  const clearScenario = () => {
    if (confirm("Are you sure you want to clear this scenario?")) {
      setFohPositions([])
      setBohPositions([])
    }
  }

  // Export scenario as JSON
  const exportScenario = () => {
    const scenario = {
      name: scenarioName,
      brand: selectedBrand,
      outlet: selectedOutlet,
      fohPositions,
      bohPositions,
      totals: {
        foh: fohTotals,
        boh: bohTotals,
        grand: grandTotals,
      },
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(scenario, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `${scenarioName.replace(/\s+/g, "-").toLowerCase()}-scenario.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Import scenario from JSON
  const importScenario = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const scenario = JSON.parse(e.target.result)
        setScenarioName(scenario.name)
        setSelectedBrand(scenario.brand)
        setSelectedOutlet(scenario.outlet)
        setFohPositions(scenario.fohPositions)
        setBohPositions(scenario.bohPositions)
        alert("Scenario imported successfully!")
      } catch (error) {
        alert("Error importing scenario: Invalid file format")
        console.error(error)
      }
    }
    reader.readAsText(file)

    // Reset the input
    event.target.value = null
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className={className}>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div>
              <CardTitle>Drag & Drop Scenario Builder</CardTitle>
              <CardDescription>Build your staffing scenario by dragging and dropping positions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={duplicateScenario}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm" onClick={clearScenario}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button size="sm" onClick={saveScenario}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Scenario Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scenario-name">Scenario Name</Label>
                  <Input id="scenario-name" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger id="brand">
                      <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="burger-boutique">Burger Boutique (Fast Casual)</SelectItem>
                      <SelectItem value="lazy-cat">Lazy Cat (Casual Dining)</SelectItem>
                      <SelectItem value="nomad">Nomad (Premium Dining)</SelectItem>
                      <SelectItem value="swaikhat">Swaikhat (Casual Dining)</SelectItem>
                      <SelectItem value="white-robata">White Robata (Premium Dining)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outlet">Outlet</Label>
                  <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
                    <SelectTrigger id="outlet">
                      <SelectValue placeholder="Select Outlet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mall-of-dhahran">Mall of Dhahran</SelectItem>
                      <SelectItem value="riyadh-park">Riyadh Park</SelectItem>
                      <SelectItem value="jeddah-corniche">Jeddah Corniche</SelectItem>
                      <SelectItem value="new-outlet">New Outlet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 space-y-2">
                  <Label>Scenario Summary</Label>
                  <div className="bg-muted/30 p-3 rounded-md space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total FOH Staff:</span>
                      <span className="font-medium">{fohTotals.totalStaff}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total BOH Staff:</span>
                      <span className="font-medium">{bohTotals.totalStaff}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Staff:</span>
                      <span className="font-medium">{grandTotals.totalStaff}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Labor Cost:</span>
                      <span className="font-medium">SAR {grandTotals.totalLabor.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between">
                    <Label>Import/Export</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={exportScenario}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <div className="relative w-full">
                      <Button variant="outline" size="sm" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                      </Button>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importScenario}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Staff Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="foh">Front of House</TabsTrigger>
                    <TabsTrigger value="boh">Back of House</TabsTrigger>
                  </TabsList>

                  <TabsContent value="foh" className="space-y-4">
                    <PositionPalette addPosition={addPosition} department="FOH" />

                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Current FOH Positions</h3>
                      <div className="max-h-[400px] overflow-y-auto pr-2">
                        {fohPositions.length === 0 ? (
                          <div className="text-center p-4 border rounded-md bg-muted/30">
                            <p className="text-muted-foreground">
                              No FOH positions added yet. Drag positions from above.
                            </p>
                          </div>
                        ) : (
                          fohPositions.map((position, index) => (
                            <DraggableStaffPosition
                              key={`${position.id}-${index}`}
                              position={position}
                              index={index}
                              movePosition={(fromIndex, toIndex) => movePosition(fromIndex, toIndex, "FOH")}
                              removePosition={() => removePosition(index, "FOH")}
                              updateCount={(index, count) => updateCount(index, count, "FOH")}
                            />
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-md">
                      <div className="flex justify-between text-sm">
                        <span>Total FOH Staff:</span>
                        <span className="font-medium">{fohTotals.totalStaff}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Monthly FOH Labor Cost:</span>
                        <span className="font-medium">SAR {fohTotals.totalLabor.toLocaleString()}</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="boh" className="space-y-4">
                    <PositionPalette addPosition={addPosition} department="BOH" />

                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Current BOH Positions</h3>
                      <div className="max-h-[400px] overflow-y-auto pr-2">
                        {bohPositions.length === 0 ? (
                          <div className="text-center p-4 border rounded-md bg-muted/30">
                            <p className="text-muted-foreground">
                              No BOH positions added yet. Drag positions from above.
                            </p>
                          </div>
                        ) : (
                          bohPositions.map((position, index) => (
                            <DraggableStaffPosition
                              key={`${position.id}-${index}`}
                              position={position}
                              index={index}
                              movePosition={(fromIndex, toIndex) => movePosition(fromIndex, toIndex, "BOH")}
                              removePosition={() => removePosition(index, "BOH")}
                              updateCount={(index, count) => updateCount(index, count, "BOH")}
                            />
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-md">
                      <div className="flex justify-between text-sm">
                        <span>Total BOH Staff:</span>
                        <span className="font-medium">{bohTotals.totalStaff}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Monthly BOH Labor Cost:</span>
                        <span className="font-medium">SAR {bohTotals.totalLabor.toLocaleString()}</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {scenarios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {scenarios.map((scenario) => (
                    <div
                      key={scenario.id}
                      className="border rounded-md p-3 hover:border-primary cursor-pointer transition-colors"
                      onClick={() => loadScenario(scenario)}
                    >
                      <div className="font-medium">{scenario.name}</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {new Date(scenario.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {scenario.brand && (
                          <Badge variant="outline" className="text-xs">
                            {scenario.brand}
                          </Badge>
                        )}
                        {scenario.outlet && (
                          <Badge variant="outline" className="text-xs">
                            {scenario.outlet}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs">
                        <div className="flex justify-between">
                          <span>Total Staff:</span>
                          <span>{scenario.totals.grand.totalStaff}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Labor:</span>
                          <span>SAR {scenario.totals.grand.totalLabor.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={clearScenario}>
            Reset
          </Button>
          <Button onClick={saveScenario}>Save Scenario</Button>
        </CardFooter>
      </Card>
    </DndProvider>
  )
}

