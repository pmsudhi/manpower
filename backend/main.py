from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import os

from models import (
    Scenario, 
    StaffingParams, 
    RevenueParams, 
    PLParams, 
    PeakHourParams,
    OptimizationParams,
    WhatIfParams,
    StaffingResult,
    RevenueResult,
    PLResult,
    PeakHourResult,
    ComparisonResult,
    OptimizationResult,
    WhatIfResult
)

from calculations import (
    calculate_staffing_requirements,
    generate_revenue_projections,
    calculate_profit_loss,
    analyze_peak_hours,
    optimize_staffing,
    run_what_if_analysis,
    compare_scenarios
)

from database import (
    get_db,
    init_db,
    get_scenarios,
    get_scenario_by_id,
    save_scenario,
    update_scenario,
    delete_scenario
)

from auth import (
    User,
    UserCreate,
    Token,
    get_current_active_user,
    is_superuser,
    authenticate_user,
    create_access_token,
    create_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

from ml_models import (
    get_demand_forecaster,
    get_staffing_optimizer
)

app = FastAPI(title="F&B Manpower Modeling API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# Root endpoint
@app.get("/")
async def root():
    return {"message": "F&B Manpower Modeling API"}

# Authentication endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=User)
async def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return create_user(db=db, user=user)

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

# Scenario endpoints
@app.get("/scenarios/", response_model=List[Scenario])
async def read_scenarios(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return await get_scenarios(db, current_user.id)

@app.get("/scenarios/{scenario_id}", response_model=Scenario)
async def read_scenario(
    scenario_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    scenario = await get_scenario_by_id(db, scenario_id)
    if scenario is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    # Check if user has access to this scenario
    if scenario.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to access this scenario")
    
    return scenario

@app.post("/scenarios/", response_model=Scenario)
async def create_scenario(
    scenario: Scenario,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Generate ID if not provided
    if not scenario.id:
        scenario.id = str(uuid.uuid4())
    
    # Set timestamps
    scenario.createdAt = datetime.now()
    scenario.updatedAt = datetime.now()
    
    return await save_scenario(db, scenario, current_user.id)

@app.put("/scenarios/{scenario_id}", response_model=Scenario)
async def update_scenario_endpoint(
    scenario_id: str,
    scenario: Scenario,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    existing_scenario = await get_scenario_by_id(db, scenario_id)
    if existing_scenario is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    # Check if user has access to this scenario
    if existing_scenario.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to update this scenario")
    
    scenario.id = scenario_id
    scenario.updatedAt = datetime.now()
    
    return await update_scenario(db, scenario)

@app.delete("/scenarios/{scenario_id}")
async def delete_scenario_endpoint(
    scenario_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    existing_scenario = await get_scenario_by_id(db, scenario_id)
    if existing_scenario is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    # Check if user has access to this scenario
    if existing_scenario.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to delete this scenario")
    
    success = await delete_scenario(db, scenario_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete scenario")
    
    return {"message": "Scenario deleted successfully"}

# Calculation endpoints
@app.post("/calculations/staffing", response_model=StaffingResult)
async def calculate_staffing_endpoint(
    params: StaffingParams,
    current_user: User = Depends(get_current_active_user)
):
    return calculate_staffing_requirements(params)

@app.post("/calculations/revenue", response_model=RevenueResult)
async def generate_revenue_endpoint(
    params: RevenueParams,
    current_user: User = Depends(get_current_active_user)
):
    return generate_revenue_projections(params)

@app.post("/calculations/pl", response_model=PLResult)
async def calculate_pl_endpoint(
    params: PLParams,
    current_user: User = Depends(get_current_active_user)
):
    return calculate_profit_loss(params)

@app.post("/calculations/peak-hours", response_model=PeakHourResult)
async def analyze_peak_hours_endpoint(
    params: PeakHourParams,
    current_user: User = Depends(get_current_active_user)
):
    return analyze_peak_hours(params)

@app.post("/calculations/optimize", response_model=OptimizationResult)
async def optimize_staffing_endpoint(
    params: OptimizationParams,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if scenario exists and user has access
    scenario = await get_scenario_by_id(db, params.scenario_id)
    if scenario is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    if scenario.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to access this scenario")
    
    # Use advanced optimization if available
    try:
        optimizer = get_staffing_optimizer()
        
        # Extract features from scenario
        features = {
            'covers': scenario.revenueDrivers.dailyCovers if scenario.revenueDrivers else 250,
            'service_style': scenario.serviceParameters.serviceStyle if scenario.serviceParameters else 'casual',
            'area_per_cover': float(scenario.spaceParameters.areaPerCover) if scenario.spaceParameters else 1.67,
            'avg_check': scenario.revenueDrivers.avgSpending if scenario.revenueDrivers else 120,
            'dwelling_time': scenario.revenueDrivers.dwellingTime if scenario.revenueDrivers else 75,
            'peak_factor': scenario.revenueDrivers.peakFactor if scenario.revenueDrivers else 1.5,
            'staff_utilization': scenario.efficiencyDrivers.staffUtilization if scenario.efficiencyDrivers else 85,
            'tech_impact': scenario.efficiencyDrivers.techImpact if scenario.efficiencyDrivers else 10,
            'cross_training': scenario.efficiencyDrivers.crossTraining if scenario.efficiencyDrivers else 15
        }
        
        # Run optimization
        optimization_result = optimizer.optimize(features, params.constraints)
        
        # Map to our result format
        return optimize_staffing(params)
    except Exception as e:
        # Fall back to basic optimization
        return optimize_staffing(params)

@app.post("/calculations/what-if", response_model=WhatIfResult)
async def what_if_analysis_endpoint(
    params: WhatIfParams,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if scenario exists and user has access
    scenario = await get_scenario_by_id(db, params.baseScenarioId)
    if scenario is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    if scenario.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to access this scenario")
    
    return run_what_if_analysis(params)

@app.post("/calculations/compare", response_model=ComparisonResult)
async def compare_scenarios_endpoint(
    data: Dict[str, List[str]],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    scenario_ids = data.get("scenario_ids", [])
    if not scenario_ids:
        raise HTTPException(status_code=400, detail="No scenario IDs provided")
    
    scenarios = []
    for scenario_id in scenario_ids:
        scenario = await get_scenario_by_id(db, scenario_id)
        if scenario is None:
            raise HTTPException(status_code=404, detail=f"Scenario with ID {scenario_id} not found")
        
        # Check if user has access to this scenario
        if scenario.owner_id != current_user.id and not current_user.is_superuser:
            raise HTTPException(status_code=403, detail=f"Not authorized to access scenario {scenario_id}")
        
        scenarios.append(scenario)
    
    return compare_scenarios(scenarios)

# Machine learning endpoints
@app.post("/ml/demand-forecast")
async def forecast_demand(
    features: Dict[str, Any],
    model_type: str = "random_forest",
    current_user: User = Depends(get_current_active_user)
):
    try:
        forecaster = get_demand_forecaster(model_type)
        result = forecaster.predict(features)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ml/train-demand-model")
async def train_demand_model(
    data: List[Dict[str, Any]],
    model_type: str = "random_forest",
    current_user: User = Depends(is_superuser)  # Only superusers can train models
):
    try:
        # Convert data to DataFrame
        df = pd.DataFrame(data)
        
        # Train model
        forecaster = get_demand_forecaster(model_type)
        result = forecaster.train(df)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ml/train-staffing-model")
async def train_staffing_model(
    data: List[Dict[str, Any]],
    model_type: str = "gradient_boosting",
    current_user: User = Depends(is_superuser)  # Only superusers can train models
):
    try:
        # Convert data to DataFrame
        df = pd.DataFrame(data)
        
        # Train model
        optimizer = get_staffing_optimizer(model_type)
        result = optimizer.train(df)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

