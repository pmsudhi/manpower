import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Save, Plus } from "lucide-react"
import BrandConfiguration from "./configuration/brand-configuration"
import OutletConfiguration from "./configuration/outlet-configuration"
import StaffConfiguration from "./configuration/staff-configuration"
import BenchmarkConfiguration from "./configuration/benchmark-configuration"

export default function ConfigurationPanel() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Configuration</h2>
          <p className="text-muted-foreground">Configure global settings for the manpower modeling system</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="brands">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="outlets">Outlets</TabsTrigger>
          <TabsTrigger value="staff">Staff Positions</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="mt-6">
          <BrandConfiguration />
        </TabsContent>

        <TabsContent value="outlets" className="mt-6">
          <OutletConfiguration />
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <StaffConfiguration />
        </TabsContent>

        <TabsContent value="benchmarks" className="mt-6">
          <BenchmarkConfiguration />
        </TabsContent>
      </Tabs>
    </div>
  )
}

