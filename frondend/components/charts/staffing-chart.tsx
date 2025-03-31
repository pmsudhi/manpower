"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const staffingData = [
  { name: "Kitchen Staff", value: 98, color: "#10b981" },
  { name: "Service Staff", value: 72, color: "#3b82f6" },
  { name: "Management", value: 28, color: "#6366f1" },
  { name: "Cleaning", value: 32, color: "#8b5cf6" },
  { name: "Security", value: 17, color: "#ec4899" },
]

const COLORS = staffingData.map((item) => item.color)

export default function StaffingChart() {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Staff Distribution by Department</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={staffingData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {staffingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} staff`, ""]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Staff Breakdown by Position</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Front of House (FOH)</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Servers</span>
                <span className="font-medium">42</span>
              </li>
              <li className="flex justify-between">
                <span>Hosts/Hostesses</span>
                <span className="font-medium">12</span>
              </li>
              <li className="flex justify-between">
                <span>Bartenders</span>
                <span className="font-medium">8</span>
              </li>
              <li className="flex justify-between">
                <span>Cashiers</span>
                <span className="font-medium">10</span>
              </li>
              <li className="flex justify-between">
                <span>Managers</span>
                <span className="font-medium">8</span>
              </li>
              <li className="flex justify-between font-medium text-primary">
                <span>Total FOH</span>
                <span>80</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Back of House (BOH)</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Chefs</span>
                <span className="font-medium">18</span>
              </li>
              <li className="flex justify-between">
                <span>Line Cooks</span>
                <span className="font-medium">36</span>
              </li>
              <li className="flex justify-between">
                <span>Prep Cooks</span>
                <span className="font-medium">24</span>
              </li>
              <li className="flex justify-between">
                <span>Dishwashers</span>
                <span className="font-medium">20</span>
              </li>
              <li className="flex justify-between">
                <span>Kitchen Managers</span>
                <span className="font-medium">10</span>
              </li>
              <li className="flex justify-between font-medium text-primary">
                <span>Total BOH</span>
                <span>108</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

