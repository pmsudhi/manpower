from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum

# Enum definitions
class ServiceStyle(str, Enum):
    FAST_CASUAL = "fast-casual"
    CASUAL = "casual"
    PREMIUM = "premium"
    FINE_DINING = "fine-dining"

class ProjectionPeriod(str, Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"

class StaffType(str, Enum):
    FOH = "foh"
    BOH = "boh"
    ALL = "all"

# Base models
class StaffPosition(BaseModel):
    id: str
    title: str
    salary: float
    department: str
    level: int
    count: int

class SpaceParameters(BaseModel):
    totalArea: float
    fohPercentage: float
    areaPerCover: str
    externalSeating: int
    fohArea: Optional[float] = None
    fohCapacity: Optional[int] = None
    totalCapacity: Optional[int] = None

class ServiceParameters(BaseModel):
    coversPerWaiter: str
    runnerRatio: str
    kitchenStations: int
    serviceStyle: str
    waitersRequired: Optional[int] = None
    runnersRequired: Optional[int] = None

class RevenueDrivers(BaseModel):
    avgSpending: float
    dwellingTime: int
    tableTurnTime: int
    peakFactor: float
    tableTurns: Optional[float] = None
    dailyCovers: Optional[int] = None
    monthlyRevenue: Optional[float] = None

class OperationalHours(BaseModel):
    operatingDays: int
    dailyHours: int
    ramadanAdjustment: bool

class EfficiencyDrivers(BaseModel):
    staffUtilization: float
    techImpact: float
    crossTraining: float
    seasonalityFactor: float

class Totals(BaseModel):
    foh: Dict[str, Any]
    boh: Dict[str, Any]
    grand: Dict[str, Any]

# Scenario model
class Scenario(BaseModel):
    id: Optional[str] = None
    name: str
    brand: Optional[str] = None
    outlet: Optional[str] = None
    fohPositions: List[StaffPosition]
    bohPositions: List[StaffPosition]
    spaceParameters: Optional[SpaceParameters] = None
    serviceParameters: Optional[ServiceParameters] = None
    revenueDrivers: Optional[RevenueDrivers] = None
    operationalHours: Optional[OperationalHours] = None
    efficiencyDrivers: Optional[EfficiencyDrivers] = None
    totals: Optional[Totals] = None
    createdAt: Optional[datetime] = Field(default_factory=datetime.now)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.now)

# Parameter models for calculations
class StaffingParams(BaseModel):
    spaceParameters: SpaceParameters
    serviceParameters: ServiceParameters
    efficiencyDrivers: EfficiencyDrivers
    operationalHours: OperationalHours

class RevenueParams(BaseModel):
    projectionPeriod: ProjectionPeriod
    projectionLength: int
    avgCheck: float
    dailyCovers: int
    foodBevRatio: float
    seasonalityFactor: float
    growthRate: float
    applyRamadan: bool
    brand: Optional[str] = None
    outlet: Optional[str] = None

class PLParams(BaseModel):
    timeframe: str
    selectedMonth: str
    foodCostPercentage: float
    beverageCostPercentage: float
    laborCostPercentage: float
    rentPercentage: float
    marketingPercentage: float
    utilitiesPercentage: float
    otherExpensesPercentage: float
    monthlyRevenue: float
    foodRevenue: float
    beverageRevenue: float
    brand: Optional[str] = None
    outlet: Optional[str] = None

class PeakHourParams(BaseModel):
    selectedDay: str = "All Days"
    selectedStaffType: StaffType = StaffType.ALL
    peakFactor: float = 1.0
    applyRamadan: bool = False
    brand: Optional[str] = None
    outlet: Optional[str] = None

class OptimizationParams(BaseModel):
    scenario_id: str
    optimizationTarget: str  # "labor_cost", "efficiency", "revenue"
    constraints: Dict[str, Any]

class WhatIfParams(BaseModel):
    baseScenarioId: str
    changes: Dict[str, Any]

# Result models
class StaffingResult(BaseModel):
    fohStaff: Dict[str, Any]
    bohStaff: Dict[str, Any]
    totalStaff: int
    laborCost: float
    staffingStructure: Dict[str, Any]
    recommendations: List[str]

class RevenueResult(BaseModel):
    periods: List[str]
    projections: Dict[str, List[float]]
    summaryMetrics: Dict[str, Any]
    insights: List[str]
    optimizationOpportunities: List[str]

class PLResult(BaseModel):
    plData: Dict[str, Any]
    historicalData: Dict[str, Any]
    insights: List[str]
    optimizationOpportunities: List[str]

class PeakHourResult(BaseModel):
    heatmapData: Dict[str, Dict[str, Dict[str, Any]]]
    staffingRequirements: Dict[str, Any]
    insights: List[str]
    optimizationOpportunities: List[str]

class OptimizationResult(BaseModel):
    originalScenario: Dict[str, Any]
    optimizedScenario: Dict[str, Any]
    improvements: Dict[str, Any]
    recommendations: List[str]

class WhatIfResult(BaseModel):
    baseScenario: Dict[str, Any]
    modifiedScenario: Dict[str, Any]
    impact: Dict[str, Any]
    insights: List[str]

class ComparisonResult(BaseModel):
    scenarios: List[Dict[str, Any]]
    differences: Dict[str, Any]
    insights: List[str]
    recommendations: List[str]

