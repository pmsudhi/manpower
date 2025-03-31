from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, scoped_session
from sqlalchemy.sql import func
from datetime import datetime
import os
import json
from typing import List, Optional, Dict, Any
from models import Scenario, StaffPosition, SpaceParameters, ServiceParameters, RevenueDrivers, OperationalHours, EfficiencyDrivers

# Get database URL from environment variable or use default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/fb_manpower")

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

# Create base class for models
Base = declarative_base()

# Association tables for many-to-many relationships
scenario_foh_positions = Table(
    "scenario_foh_positions",
    Base.metadata,
    Column("scenario_id", String, ForeignKey("scenarios.id")),
    Column("position_id", Integer, ForeignKey("staff_positions.id")),
)

scenario_boh_positions = Table(
    "scenario_boh_positions",
    Base.metadata,
    Column("scenario_id", String, ForeignKey("scenarios.id")),
    Column("position_id", Integer, ForeignKey("staff_positions.id")),
)

# Database models
class DBUser(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    scenarios = relationship("DBScenario", back_populates="owner")

class DBScenario(Base):
    __tablename__ = "scenarios"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    brand = Column(String, nullable=True)
    outlet = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    owner = relationship("DBUser", back_populates="scenarios")
    foh_positions = relationship("DBStaffPosition", secondary=scenario_foh_positions)
    boh_positions = relationship("DBStaffPosition", secondary=scenario_boh_positions)
    space_parameters = relationship("DBSpaceParameters", uselist=False, back_populates="scenario")
    service_parameters = relationship("DBServiceParameters", uselist=False, back_populates="scenario")
    revenue_drivers = relationship("DBRevenueDrivers", uselist=False, back_populates="scenario")
    operational_hours = relationship("DBOperationalHours", uselist=False, back_populates="scenario")
    efficiency_drivers = relationship("DBEfficiencyDrivers", uselist=False, back_populates="scenario")
    totals = Column(JSON, nullable=True)

class DBStaffPosition(Base):
    __tablename__ = "staff_positions"
    
    id = Column(Integer, primary_key=True, index=True)
    position_id = Column(String, index=True)
    title = Column(String)
    salary = Column(Float)
    department = Column(String)
    level = Column(Integer)
    count = Column(Integer)

class DBSpaceParameters(Base):
    __tablename__ = "space_parameters"
    
    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(String, ForeignKey("scenarios.id"))
    total_area = Column(Float)
    foh_percentage = Column(Float)
    area_per_cover = Column(String)
    external_seating = Column(Integer)
    foh_area = Column(Float, nullable=True)
    foh_capacity = Column(Integer, nullable=True)
    total_capacity = Column(Integer, nullable=True)
    
    scenario = relationship("DBScenario", back_populates="space_parameters")

class DBServiceParameters(Base):
    __tablename__ = "service_parameters"
    
    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(String, ForeignKey("scenarios.id"))
    covers_per_waiter = Column(String)
    runner_ratio = Column(String)
    kitchen_stations = Column(Integer)
    service_style = Column(String)
    waiters_required = Column(Integer, nullable=True)
    runners_required = Column(Integer, nullable=True)
    
    scenario = relationship("DBScenario", back_populates="service_parameters")

class DBRevenueDrivers(Base):
    __tablename__ = "revenue_drivers"
    
    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(String, ForeignKey("scenarios.id"))
    avg_spending = Column(Float)
    dwelling_time = Column(Integer)
    table_turn_time = Column(Integer)
    peak_factor = Column(Float)
    table_turns = Column(Float, nullable=True)
    daily_covers = Column(Integer, nullable=True)
    monthly_revenue = Column(Float, nullable=True)
    
    scenario = relationship("DBScenario", back_populates="revenue_drivers")

class DBOperationalHours(Base):
    __tablename__ = "operational_hours"
    
    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(String, ForeignKey("scenarios.id"))
    operating_days = Column(Integer)
    daily_hours = Column(Integer)
    ramadan_adjustment = Column(Boolean)
    
    scenario = relationship("DBScenario", back_populates="operational_hours")

class DBEfficiencyDrivers(Base):
    __tablename__ = "efficiency_drivers"
    
    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(String, ForeignKey("scenarios.id"))
    staff_utilization = Column(Float)
    tech_impact = Column(Float)
    cross_training = Column(Float)
    seasonality_factor = Column(Float)
    
    scenario = relationship("DBScenario", back_populates="efficiency_drivers")

# Create all tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Convert database models to Pydantic models
def db_scenario_to_pydantic(db_scenario):
    # Convert staff positions
    foh_positions = [
        StaffPosition(
            id=pos.position_id,
            title=pos.title,
            salary=pos.salary,
            department=pos.department,
            level=pos.level,
            count=pos.count
        ) for pos in db_scenario.foh_positions
    ]
    
    boh_positions = [
        StaffPosition(
            id=pos.position_id,
            title=pos.title,
            salary=pos.salary,
            department=pos.department,
            level=pos.level,
            count=pos.count
        ) for pos in db_scenario.boh_positions
    ]
    
    # Convert space parameters
    space_parameters = None
    if db_scenario.space_parameters:
        space_parameters = SpaceParameters(
            totalArea=db_scenario.space_parameters.total_area,
            fohPercentage=db_scenario.space_parameters.foh_percentage,
            areaPerCover=db_scenario.space_parameters.area_per_cover,
            externalSeating=db_scenario.space_parameters.external_seating,
            fohArea=db_scenario.space_parameters.foh_area,
            fohCapacity=db_scenario.space_parameters.foh_capacity,
            totalCapacity=db_scenario.space_parameters.total_capacity
        )
    
    # Convert service parameters
    service_parameters = None
    if db_scenario.service_parameters:
        service_parameters = ServiceParameters(
            coversPerWaiter=db_scenario.service_parameters.covers_per_waiter,
            runnerRatio=db_scenario.service_parameters.runner_ratio,
            kitchenStations=db_scenario.service_parameters.kitchen_stations,
            serviceStyle=db_scenario.service_parameters.service_style,
            waitersRequired=db_scenario.service_parameters.waiters_required,
            runnersRequired=db_scenario.service_parameters.runners_required
        )
    
    # Convert revenue drivers
    revenue_drivers = None
    if db_scenario.revenue_drivers:
        revenue_drivers = RevenueDrivers(
            avgSpending=db_scenario.revenue_drivers.avg_spending,
            dwellingTime=db_scenario.revenue_drivers.dwelling_time,
            tableTurnTime=db_scenario.revenue_drivers.table_turn_time,
            peakFactor=db_scenario.revenue_drivers.peak_factor,
            tableTurns=db_scenario.revenue_drivers.table_turns,
            dailyCovers=db_scenario.revenue_drivers.daily_covers,
            monthlyRevenue=db_scenario.revenue_drivers.monthly_revenue
        )
    
    # Convert operational hours
    operational_hours = None
    if db_scenario.operational_hours:
        operational_hours = OperationalHours(
            operatingDays=db_scenario.operational_hours.operating_days,
            dailyHours=db_scenario.operational_hours.daily_hours,
            ramadanAdjustment=db_scenario.operational_hours.ramadan_adjustment
        )
    
    # Convert efficiency drivers
    efficiency_drivers = None
    if db_scenario.efficiency_drivers:
        efficiency_drivers = EfficiencyDrivers(
            staffUtilization=db_scenario.efficiency_drivers.staff_utilization,
            techImpact=db_scenario.efficiency_drivers.tech_impact,
            crossTraining=db_scenario.efficiency_drivers.cross_training,
            seasonalityFactor=db_scenario.efficiency_drivers.seasonality_factor
        )
    
    # Create Pydantic model
    return Scenario(
        id=db_scenario.id,
        name=db_scenario.name,
        brand=db_scenario.brand,
        outlet=db_scenario.outlet,
        fohPositions=foh_positions,
        bohPositions=boh_positions,
        spaceParameters=space_parameters,
        serviceParameters=service_parameters,
        revenueDrivers=revenue_drivers,
        operationalHours=operational_hours,
        efficiencyDrivers=efficiency_drivers,
        totals=db_scenario.totals,
        createdAt=db_scenario.created_at,
        updatedAt=db_scenario.updated_at
    )

# Convert Pydantic models to database models
def pydantic_to_db_scenario(scenario, db=None, existing_scenario=None):
    if existing_scenario:
        db_scenario = existing_scenario
    else:
        db_scenario = DBScenario(
            id=scenario.id,
            name=scenario.name,
            brand=scenario.brand,
            outlet=scenario.outlet,
            totals=scenario.totals
        )
    
    # Update basic fields
    db_scenario.name = scenario.name
    db_scenario.brand = scenario.brand
    db_scenario.outlet = scenario.outlet
    db_scenario.totals = scenario.totals
    
    # Clear existing relationships if updating
    if existing_scenario:
        db_scenario.foh_positions = []
        db_scenario.boh_positions = []
    
    # Create staff positions
    for pos in scenario.fohPositions:
        db_pos = DBStaffPosition(
            position_id=pos.id,
            title=pos.title,
            salary=pos.salary,
            department=pos.department,
            level=pos.level,
            count=pos.count
        )
        if db:
            db.add(db_pos)
        db_scenario.foh_positions.append(db_pos)
    
    for pos in scenario.bohPositions:
        db_pos = DBStaffPosition(
            position_id=pos.id,
            title=pos.title,
            salary=pos.salary,
            department=pos.department,
            level=pos.level,
            count=pos.count
        )
        if db:
            db.add(db_pos)
        db_scenario.boh_positions.append(db_pos)
    
    # Create or update space parameters
    if scenario.spaceParameters:
        if existing_scenario and existing_scenario.space_parameters:
            db_space = existing_scenario.space_parameters
            db_space.total_area = scenario.spaceParameters.totalArea
            db_space.foh_percentage = scenario.spaceParameters.fohPercentage
            db_space.area_per_cover = scenario.spaceParameters.areaPerCover
            db_space.external_seating = scenario.spaceParameters.externalSeating
            db_space.foh_area = scenario.spaceParameters.fohArea
            db_space.foh_capacity = scenario.spaceParameters.fohCapacity
            db_space.total_capacity = scenario.spaceParameters.totalCapacity
        else:
            db_space = DBSpaceParameters(
                total_area=scenario.spaceParameters.totalArea,
                foh_percentage=scenario.spaceParameters.fohPercentage,
                area_per_cover=scenario.spaceParameters.areaPerCover,
                external_seating=scenario.spaceParameters.externalSeating,
                foh_area=scenario.spaceParameters.fohArea,
                foh_capacity=scenario.spaceParameters.fohCapacity,
                total_capacity=scenario.spaceParameters.totalCapacity
            )
            db_scenario.space_parameters = db_space
            if db:
                db.add(db_space)
    
    # Create or update service parameters
    if scenario.serviceParameters:
        if existing_scenario and existing_scenario.service_parameters:
            db_service = existing_scenario.service_parameters
            db_service.covers_per_waiter = scenario.serviceParameters.coversPerWaiter
            db_service.runner_ratio = scenario.serviceParameters.runnerRatio
            db_service.kitchen_stations = scenario.serviceParameters.kitchenStations
            db_service.service_style = scenario.serviceParameters.serviceStyle
            db_service.waiters_required = scenario.serviceParameters.waitersRequired
            db_service.runners_required = scenario.serviceParameters.runnersRequired
        else:
            db_service = DBServiceParameters(
                covers_per_waiter=scenario.serviceParameters.coversPerWaiter,
                runner_ratio=scenario.serviceParameters.runnerRatio,
                kitchen_stations=scenario.serviceParameters.kitchenStations,
                service_style=scenario.serviceParameters.serviceStyle,
                waiters_required=scenario.serviceParameters.waitersRequired,
                runners_required=scenario.serviceParameters.runnersRequired
            )
            db_scenario.service_parameters = db_service
            if db:
                db.add(db_service)
    
    # Create or update revenue drivers
    if scenario.revenueDrivers:
        if existing_scenario and existing_scenario.revenue_drivers:
            db_revenue = existing_scenario.revenue_drivers
            db_revenue.avg_spending = scenario.revenueDrivers.avgSpending
            db_revenue.dwelling_time = scenario.revenueDrivers.dwellingTime
            db_revenue.table_turn_time = scenario.revenueDrivers.tableTurnTime
            db_revenue.peak_factor = scenario.revenueDrivers.peakFactor
            db_revenue.table_turns = scenario.revenueDrivers.tableTurns
            db_revenue.daily_covers = scenario.revenueDrivers.dailyCovers
            db_revenue.monthly_revenue = scenario.revenueDrivers.monthlyRevenue
        else:
            db_revenue = DBRevenueDrivers(
                avg_spending=scenario.revenueDrivers.avgSpending,
                dwelling_time=scenario.revenueDrivers.dwellingTime,
                table_turn_time=scenario.revenueDrivers.tableTurnTime,
                peak_factor=scenario.revenueDrivers.peakFactor,
                table_turns=scenario.revenueDrivers.tableTurns,
                daily_covers=scenario.revenueDrivers.dailyCovers,
                monthly_revenue=scenario.revenueDrivers.monthlyRevenue
            )
            db_scenario.revenue_drivers = db_revenue
            if db:
                db.add(db_revenue)
    
    # Create or update operational hours
    if scenario.operationalHours:
        if existing_scenario and existing_scenario.operational_hours:
            db_hours = existing_scenario.operational_hours
            db_hours.operating_days = scenario.operationalHours.operatingDays
            db_hours.daily_hours = scenario.operationalHours.dailyHours
            db_hours.ramadan_adjustment = scenario.operationalHours.ramadanAdjustment
        else:
            db_hours = DBOperationalHours(
                operating_days=scenario.operationalHours.operatingDays,
                daily_hours=scenario.operationalHours.dailyHours,
                ramadan_adjustment=scenario.operationalHours.ramadanAdjustment
            )
            db_scenario.operational_hours = db_hours
            if db:
                db.add(db_hours)
    
    # Create or update efficiency drivers
    if scenario.efficiencyDrivers:
        if existing_scenario and existing_scenario.efficiency_drivers:
            db_efficiency = existing_scenario.efficiency_drivers
            db_efficiency.staff_utilization = scenario.efficiencyDrivers.staffUtilization
            db_efficiency.tech_impact = scenario.efficiencyDrivers.techImpact
            db_efficiency.cross_training = scenario.efficiencyDrivers.crossTraining
            db_efficiency.seasonality_factor = scenario.efficiencyDrivers.seasonalityFactor
        else:
            db_efficiency = DBEfficiencyDrivers(
                staff_utilization=scenario.efficiencyDrivers.staffUtilization,
                tech_impact=scenario.efficiencyDrivers.techImpact,
                cross_training=scenario.efficiencyDrivers.crossTraining,
                seasonality_factor=scenario.efficiencyDrivers.seasonalityFactor
            )
            db_scenario.efficiency_drivers = db_efficiency
            if db:
                db.add(db_efficiency)
    
    return db_scenario

# Database operations
async def get_scenarios(db, user_id=None):
    """
    Get all scenarios from the database, optionally filtered by user_id
    """
    query = db.query(DBScenario)
    if user_id:
        query = query.filter(DBScenario.owner_id == user_id)
    
    db_scenarios = query.all()
    return [db_scenario_to_pydantic(db_scenario) for db_scenario in db_scenarios]

async def get_scenario_by_id(db, scenario_id: str):
    """
    Get a scenario by ID
    """
    db_scenario = db.query(DBScenario).filter(DBScenario.id == scenario_id).first()
    if db_scenario:
        return db_scenario_to_pydantic(db_scenario)
    return None

async def save_scenario(db, scenario: Scenario, user_id: int = None):
    """
    Save a new scenario to the database
    """
    # Convert Pydantic model to database model
    db_scenario = pydantic_to_db_scenario(scenario, db)
    
    # Set owner if provided
    if user_id:
        db_scenario.owner_id = user_id
    
    # Add to database
    db.add(db_scenario)
    db.commit()
    db.refresh(db_scenario)
    
    return db_scenario_to_pydantic(db_scenario)

async def update_scenario(db, scenario: Scenario):
    """
    Update an existing scenario
    """
    # Check if scenario exists
    db_scenario = db.query(DBScenario).filter(DBScenario.id == scenario.id).first()
    if not db_scenario:
        return None
    
    # Update scenario
    updated_scenario = pydantic_to_db_scenario(scenario, db, db_scenario)
    
    # Commit changes
    db.commit()
    db.refresh(updated_scenario)
    
    return db_scenario_to_pydantic(updated_scenario)

async def delete_scenario(db, scenario_id: str):
    """
    Delete a scenario by ID
    """
    db_scenario = db.query(DBScenario).filter(DBScenario.id == scenario_id).first()
    if db_scenario:
        db.delete(db_scenario)
        db.commit()
        return True
    return False

# Initialize database
def init_db():
    create_tables()

