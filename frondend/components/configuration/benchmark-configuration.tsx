import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BenchmarkConfiguration() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="labor-cost">
        <TabsList>
          <TabsTrigger value="labor-cost">Labor Cost</TabsTrigger>
          <TabsTrigger value="service-ratios">Service Ratios</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="labor-cost" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Labor Cost Benchmarks</CardTitle>
              <CardDescription>Industry benchmarks for labor cost as percentage of revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="benchmark-service-style">Service Style</Label>
                    <Select defaultValue="fast-casual">
                      <SelectTrigger id="benchmark-service-style">
                        <SelectValue placeholder="Select Service Style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast-casual">Fast Casual</SelectItem>
                        <SelectItem value="casual">Casual Dining</SelectItem>
                        <SelectItem value="premium">Premium Dining</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="benchmark-labor-min">Minimum Benchmark (%)</Label>
                    <Input id="benchmark-labor-min" type="number" defaultValue="18" />
                    <p className="text-xs text-muted-foreground">Lower bound of acceptable labor cost percentage</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benchmark-labor-target">Target Benchmark (%)</Label>
                    <Input id="benchmark-labor-target" type="number" defaultValue="22" />
                    <p className="text-xs text-muted-foreground">Ideal labor cost percentage to aim for</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benchmark-labor-max">Maximum Benchmark (%)</Label>
                    <Input id="benchmark-labor-max" type="number" defaultValue="26" />
                    <p className="text-xs text-muted-foreground">Upper bound of acceptable labor cost percentage</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Labor Cost Benchmarks</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="service-ratios" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Ratio Benchmarks</CardTitle>
              <CardDescription>Industry benchmarks for service ratios by concept type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="benchmark-service-style-ratio">Service Style</Label>
                    <Select defaultValue="fast-casual">
                      <SelectTrigger id="benchmark-service-style-ratio">
                        <SelectValue placeholder="Select Service Style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast-casual">Fast Casual</SelectItem>
                        <SelectItem value="casual">Casual Dining</SelectItem>
                        <SelectItem value="premium">Premium Dining</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="benchmark-covers-per-waiter">Covers per Waiter</Label>
                    <Input id="benchmark-covers-per-waiter" type="number" defaultValue="24" />
                    <p className="text-xs text-muted-foreground">Industry standard for fast casual concepts</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benchmark-runner-ratio">Runner to Waiter Ratio (%)</Label>
                    <Input id="benchmark-runner-ratio" type="number" defaultValue="25" />
                    <p className="text-xs text-muted-foreground">Industry standard for fast casual concepts</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benchmark-boh-foh-ratio">BOH to FOH Ratio (%)</Label>
                    <Input id="benchmark-boh-foh-ratio" type="number" defaultValue="70" />
                    <p className="text-xs text-muted-foreground">BOH staff as percentage of FOH staff</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Service Ratio Benchmarks</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Efficiency Metric Benchmarks</CardTitle>
              <CardDescription>Industry benchmarks for operational efficiency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="benchmark-efficiency-service-style">Service Style</Label>
                    <Select defaultValue="fast-casual">
                      <SelectTrigger id="benchmark-efficiency-service-style">
                        <SelectValue placeholder="Select Service Style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast-casual">Fast Casual</SelectItem>
                        <SelectItem value="casual">Casual Dining</SelectItem>
                        <SelectItem value="premium">Premium Dining</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="benchmark-covers-per-labor-hour">Covers per Labor Hour</Label>
                    <Input id="benchmark-covers-per-labor-hour" type="number" defaultValue="5.2" step="0.1" />
                    <p className="text-xs text-muted-foreground">Number of guests served per labor hour</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benchmark-revenue-per-labor-hour">Revenue per Labor Hour (SAR)</Label>
                    <Input id="benchmark-revenue-per-labor-hour" type="number" defaultValue="625" />
                    <p className="text-xs text-muted-foreground">Revenue generated per labor hour</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benchmark-revenue-per-sqm">Revenue per sqm (SAR)</Label>
                    <Input id="benchmark-revenue-per-sqm" type="number" defaultValue="4500" />
                    <p className="text-xs text-muted-foreground">Monthly revenue per square meter</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benchmark-table-turn-time">Table Turn Time (minutes)</Label>
                    <Input id="benchmark-table-turn-time" type="number" defaultValue="45" />
                    <p className="text-xs text-muted-foreground">Average time from seating to next guest</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benchmark-kitchen-efficiency">Kitchen Efficiency (dishes per hour)</Label>
                    <Input id="benchmark-kitchen-efficiency" type="number" defaultValue="18" />
                    <p className="text-xs text-muted-foreground">Number of dishes prepared per kitchen staff hour</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benchmark-staff-utilization">Staff Utilization Rate (%)</Label>
                    <Input id="benchmark-staff-utilization" type="number" defaultValue="85" />
                    <p className="text-xs text-muted-foreground">Percentage of staff time spent on productive tasks</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Efficiency Benchmarks</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

