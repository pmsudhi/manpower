"use client"

import { createContext, useContext, type ReactNode } from "react"
import {
  useScenarios,
  useStaffingCalculations,
  useRevenueProjections,
  useProfitLoss,
  usePeakHourAnalysis,
  useScenarioComparison,
  useWhatIfAnalysis,
} from "./api-hooks"

// Create context
const ApiContext = createContext<any>(null)

// Provider component
export function ApiProvider({ children }: { children: ReactNode }) {
  const scenarios = useScenarios()
  const staffing = useStaffingCalculations()
  const revenue = useRevenueProjections()
  const profitLoss = useProfitLoss()
  const peakHours = usePeakHourAnalysis()
  const comparison = useScenarioComparison()
  const whatIf = useWhatIfAnalysis()

  const value = {
    scenarios,
    staffing,
    revenue,
    profitLoss,
    peakHours,
    comparison,
    whatIf,
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

// Hook to use the API context
export function useApi() {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider")
  }
  return context
}

