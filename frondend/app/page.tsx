"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Dashboard from "@/components/dashboard"
import ControlPanel from "@/components/control-panel"
import StaffingStructure from "@/components/staffing-structure"
import Scenarios from "@/components/scenarios"
import FinancialImpact from "@/components/financial-impact"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dashboard")

  // Show welcome toast on first load
  useState(() => {
    toast({
      title: "Welcome to F&B Manpower Modeling Solution",
      description: "Navigate through the tabs to optimize your staffing requirements.",
    })
  })

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">F&B Manpower Modeling Solution</h1>
        <p className="text-muted-foreground">
          Optimize staffing requirements, costs, and operational efficiency across your multi-brand F&B chain
        </p>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="control-panel">Control Panel</TabsTrigger>
          <TabsTrigger value="staffing-structure">Staffing Structure</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="financial-impact">Financial Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>

        <TabsContent value="control-panel">
          <ControlPanel onSaveScenario={() => setActiveTab("scenarios")} />
        </TabsContent>

        <TabsContent value="staffing-structure">
          <StaffingStructure />
        </TabsContent>

        <TabsContent value="scenarios">
          <Scenarios onLoadScenario={() => setActiveTab("control-panel")} />
        </TabsContent>

        <TabsContent value="financial-impact">
          <FinancialImpact />
        </TabsContent>
      </Tabs>
    </main>
  )
}

