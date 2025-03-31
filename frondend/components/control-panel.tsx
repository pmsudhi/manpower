"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save, Copy, Play } from "lucide-react"
import SpaceParameters from "./scenario-parameters/space-parameters"
import ServiceParameters from "./scenario-parameters/service-parameters"
import OperationalHours from "./scenario-parameters/operational-hours"
import EfficiencyDrivers from "./scenario-parameters/efficiency-drivers"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ScenarioBuilder from "./scenario-builder"
import PeakHourAnalysis from "./peak-hour-analysis"

export default function ControlPanel({ onSaveScenario }) {
  const { toast } = useToast()
  const [scenarioName, setScenarioName] = useState("New Scenario")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedOutlet, setSelectedOutlet] = useState("")
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("parameters")

  const handleSaveScenario = () => {
    toast({
      title: "Scenario Saved",
      description: `"${scenarioName}" has been saved successfully.`,
    })
    setSaveDialogOpen(false)
    if (onSaveScenario) onSaveScenario()
  }

  const handleRunScenario = () => {
    toast({
      title: "Scenario Calculated",
      description: "Staffing requirements have been calculated based on current parameters.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Control Panel</h2>
          <p className="text-muted-foreground">Adjust operational parameters to build different scenarios</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Scenario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Scenario</DialogTitle>
                <DialogDescription>Enter a descriptive name for your scenario.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="scenario-name-input">Scenario Name</Label>
                <Input
                  id="scenario-name-input"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveScenario}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size="sm" onClick={handleRunScenario}>
            <Play className="h-4 w-4 mr-2" />
            Run Calculation
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="parameters">Parameter Configuration</TabsTrigger>
          <TabsTrigger value="builder">Scenario Builder</TabsTrigger>
          <TabsTrigger value="peak-hours">Peak Hour Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Scenario Configuration</CardTitle>
                <CardDescription>Define your scenario parameters</CardDescription>
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

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="sar">
                    <SelectTrigger id="currency">
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

                <div className="flex items-center space-x-2 pt-4">
                  <Switch id="ramadan-adjustment" defaultChecked />
                  <Label htmlFor="ramadan-adjustment">Apply Ramadan Adjustment (50% capacity)</Label>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Parameter Configuration</CardTitle>
                <CardDescription>Adjust operational parameters for your scenario</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="space">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="space">Space Parameters</TabsTrigger>
                    <TabsTrigger value="service">Service Parameters</TabsTrigger>
                    <TabsTrigger value="hours">Operational Hours</TabsTrigger>
                    <TabsTrigger value="efficiency">Efficiency Drivers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="space" className="mt-4">
                    <SpaceParameters />
                  </TabsContent>

                  <TabsContent value="service" className="mt-4">
                    <ServiceParameters />
                  </TabsContent>

                  <TabsContent value="hours" className="mt-4">
                    <OperationalHours />
                  </TabsContent>

                  <TabsContent value="efficiency" className="mt-4">
                    <EfficiencyDrivers />
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={handleRunScenario}>Apply Changes</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="builder">
          <ScenarioBuilder />
        </TabsContent>

        <TabsContent value="peak-hours">
          <PeakHourAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  )
}

