/**
 * API service for communicating with the Python backend
 */

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Helper function for making API requests
async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Scenario API functions
export async function saveScenario(scenarioData: any) {
  return fetchFromAPI("/scenarios/", {
    method: "POST",
    body: JSON.stringify(scenarioData),
  })
}

export async function getScenarios() {
  return fetchFromAPI("/scenarios/")
}

export async function getScenarioById(id: string) {
  return fetchFromAPI(`/scenarios/${id}`)
}

export async function updateScenario(id: string, scenarioData: any) {
  return fetchFromAPI(`/scenarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(scenarioData),
  })
}

export async function deleteScenario(id: string) {
  return fetchFromAPI(`/scenarios/${id}`, {
    method: "DELETE",
  })
}

// Staffing calculation API functions
export async function calculateStaffingRequirements(params: any) {
  return fetchFromAPI("/calculations/staffing", {
    method: "POST",
    body: JSON.stringify(params),
  })
}

export async function optimizeStaffing(params: any) {
  return fetchFromAPI("/calculations/optimize", {
    method: "POST",
    body: JSON.stringify(params),
  })
}

// Revenue projection API functions
export async function generateRevenueProjections(params: any) {
  return fetchFromAPI("/calculations/revenue", {
    method: "POST",
    body: JSON.stringify(params),
  })
}

// P&L calculation API functions
export async function calculateProfitLoss(params: any) {
  return fetchFromAPI("/calculations/pl", {
    method: "POST",
    body: JSON.stringify(params),
  })
}

// Scenario comparison API functions
export async function compareScenarios(scenarioIds: string[]) {
  return fetchFromAPI("/calculations/compare", {
    method: "POST",
    body: JSON.stringify({ scenario_ids: scenarioIds }),
  })
}

// Peak hour analysis API functions
export async function analyzePeakHours(params: any) {
  return fetchFromAPI("/calculations/peak-hours", {
    method: "POST",
    body: JSON.stringify(params),
  })
}

// What-if analysis API functions
export async function runWhatIfAnalysis(params: any) {
  return fetchFromAPI("/calculations/what-if", {
    method: "POST",
    body: JSON.stringify(params),
  })
}

