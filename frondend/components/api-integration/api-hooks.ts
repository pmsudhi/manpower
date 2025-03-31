"use client"

import { useState, useEffect, useCallback } from "react"
import * as apiService from "./api-service"

// Hook for fetching scenarios
export function useScenarios() {
  const [scenarios, setScenarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchScenarios = useCallback(async () => {
    try {
      setLoading(true)
      const data = await apiService.getScenarios()
      setScenarios(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchScenarios()
  }, [fetchScenarios])

  const saveScenario = useCallback(async (scenarioData) => {
    try {
      setLoading(true)
      const savedScenario = await apiService.saveScenario(scenarioData)
      setScenarios((prevScenarios) => [...prevScenarios, savedScenario])
      setError(null)
      return savedScenario
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateScenario = useCallback(async (id, scenarioData) => {
    try {
      setLoading(true)
      const updatedScenario = await apiService.updateScenario(id, scenarioData)
      setScenarios((prevScenarios) =>
        prevScenarios.map((scenario) => (scenario.id === id ? updatedScenario : scenario)),
      )
      setError(null)
      return updatedScenario
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteScenario = useCallback(async (id) => {
    try {
      setLoading(true)
      await apiService.deleteScenario(id)
      setScenarios((prevScenarios) => prevScenarios.filter((scenario) => scenario.id !== id))
      setError(null)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    scenarios,
    loading,
    error,
    fetchScenarios,
    saveScenario,
    updateScenario,
    deleteScenario,
  }
}

// Hook for staffing calculations
export function useStaffingCalculations() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const calculateStaffing = useCallback(async (params) => {
    try {
      setLoading(true)
      const data = await apiService.calculateStaffingRequirements(params)
      setResult(data)
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const optimizeStaffing = useCallback(async (params) => {
    try {
      setLoading(true)
      const data = await apiService.optimizeStaffing(params)
      setResult(data)
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    result,
    loading,
    error,
    calculateStaffing,
    optimizeStaffing,
  }
}

// Hook for revenue projections
export function useRevenueProjections() {
  const [projections, setProjections] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateProjections = useCallback(async (params) => {
    try {
      setLoading(true)
      const data = await apiService.generateRevenueProjections(params)
      setProjections(data)
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    projections,
    loading,
    error,
    generateProjections,
  }
}

// Hook for P&L calculations
export function useProfitLoss() {
  const [plData, setPLData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const calculatePL = useCallback(async (params) => {
    try {
      setLoading(true)
      const data = await apiService.calculateProfitLoss(params)
      setPLData(data)
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    plData,
    loading,
    error,
    calculatePL,
  }
}

// Hook for peak hour analysis
export function usePeakHourAnalysis() {
  const [peakHourData, setPeakHourData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyzePeakHours = useCallback(async (params) => {
    try {
      setLoading(true)
      const data = await apiService.analyzePeakHours(params)
      setPeakHourData(data)
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    peakHourData,
    loading,
    error,
    analyzePeakHours,
  }
}

// Hook for scenario comparison
export function useScenarioComparison() {
  const [comparisonResult, setComparisonResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const compareScenarios = useCallback(async (scenarioIds) => {
    try {
      setLoading(true)
      const data = await apiService.compareScenarios(scenarioIds)
      setComparisonResult(data)
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    comparisonResult,
    loading,
    error,
    compareScenarios,
  }
}

// Hook for what-if analysis
export function useWhatIfAnalysis() {
  const [whatIfResult, setWhatIfResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const runWhatIfAnalysis = useCallback(async (params) => {
    try {
      setLoading(true)
      const data = await apiService.runWhatIfAnalysis(params)
      setWhatIfResult(data)
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    whatIfResult,
    loading,
    error,
    runWhatIfAnalysis,
  }
}

