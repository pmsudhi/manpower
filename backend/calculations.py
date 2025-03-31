import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import math
import random
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

# Staffing calculation functions
def calculate_staffing_requirements(params: StaffingParams) -> StaffingResult:
    """
    Calculate staffing requirements based on input parameters
    """
    # Extract parameters
    space_params = params.spaceParameters
    service_params = params.serviceParameters
    efficiency_params = params.efficiencyDrivers
    operational_params = params.operationalHours
    
    # Calculate FOH area and capacity
    foh_area = space_params.totalArea * (space_params.fohPercentage / 100)
    foh_capacity = math.floor(foh_area / float(space_params.areaPerCover))
    total_capacity = foh_capacity + space_params.externalSeating
    
    # Calculate staff requirements
    covers_per_waiter = int(service_params.coversPerWaiter)
    runner_ratio = int(service_params.runnerRatio) / 100
    
    # Apply efficiency factors
    efficiency_factor = (
        (efficiency_params.staffUtilization / 100) * 
        (1 - efficiency_params.techImpact / 100) * 
        (1 - efficiency_params.crossTraining / 100) * 
        efficiency_params.seasonalityFactor
    )
    
    # Calculate FOH staff
    waiters_required = math.ceil(total_capacity / covers_per_waiter / efficiency_factor)
    runners_required = math.ceil(waiters_required * runner_ratio)
    hosts_required = 2
    cashiers_required = 2
    managers_required = 2
    
    # Calculate BOH staff based on kitchen stations
    kitchen_stations = service_params.kitchenStations
    service_style_factor = 1.0
    if service_params.serviceStyle == "premium":
        service_style_factor = 2.0
    elif service_params.serviceStyle == "casual":
        service_style_factor = 1.5
    
    chefs_required = 1
    sous_chefs_required = 1
    line_cooks_required = kitchen_stations
    prep_cooks_required = math.ceil(kitchen_stations * 0.75)
    kitchen_helpers_required = 2
    dishwashers_required = 2
    
    # Calculate total staff and labor cost
    foh_staff = {
        "waiters": waiters_required,
        "runners": runners_required,
        "hosts": hosts_required,
        "cashiers": cashiers_required,
        "managers": managers_required
    }
    
    boh_staff = {
        "chefs": chefs_required,
        "sous_chefs": sous_chefs_required,
        "line_cooks": line_cooks_required,
        "prep_cooks": prep_cooks_required,
        "kitchen_helpers": kitchen_helpers_required,
        "dishwashers": dishwashers_required
    }
    
    # Calculate labor cost (using sample salaries)
    salaries = {
        "waiters": 3500,
        "runners": 3000,
        "hosts": 4000,
        "cashiers": 3500,
        "managers": 8000,
        "chefs": 10000,
        "sous_chefs": 7000,
        "line_cooks": 4500,
        "prep_cooks": 3500,
        "kitchen_helpers": 3000,
        "dishwashers": 2800
    }
    
    foh_labor_cost = sum(foh_staff[position] * salaries[position] for position in foh_staff)
    boh_labor_cost = sum(boh_staff[position] * salaries[position] for position in boh_staff)
    total_labor_cost = foh_labor_cost + boh_labor_cost
    
    # Generate staffing structure
    staffing_structure = {
        "foh": [
            {"position": "Restaurant Manager", "count": foh_staff["managers"], "level": 0, "salary": salaries["managers"]},
            {"position": "Host/Hostess", "count": foh_staff["hosts"], "level": 1, "salary": salaries["hosts"]},
            {"position": "Waiter", "count": foh_staff["waiters"], "level": 2, "salary": salaries["waiters"]},
            {"position": "Runner", "count": foh_staff["runners"], "level": 3, "salary": salaries["runners"]},
            {"position": "Cashier", "count": foh_staff["cashiers"], "level": 2, "salary": salaries["cashiers"]}
        ],
        "boh": [
            {"position": "Executive Chef", "count": boh_staff["chefs"], "level": 0, "salary": salaries["chefs"]},
            {"position": "Sous Chef", "count": boh_staff["sous_chefs"], "level": 1, "salary": salaries["sous_chefs"]},
            {"position": "Line Cook", "count": boh_staff["line_cooks"], "level": 2, "salary": salaries["line_cooks"]},
            {"position": "Prep Cook", "count": boh_staff["prep_cooks"], "level": 3, "salary": salaries["prep_cooks"]},
            {"position": "Kitchen Helper", "count": boh_staff["kitchen_helpers"], "level": 3, "salary": salaries["kitchen_helpers"]},
            {"position": "Dishwasher", "count": boh_staff["dishwashers"], "level": 3, "salary": salaries["dishwashers"]}
        ]
    }
    
    # Generate recommendations
    recommendations = []
    
    if efficiency_params.staffUtilization < 85:
        recommendations.append("Increase staff utilization through better scheduling to reduce overall staff requirements")
    
    if efficiency_params.crossTraining < 20:
        recommendations.append("Implement cross-training program to improve staff flexibility and reduce headcount")
    
    if efficiency_params.techImpact < 15:
        recommendations.append("Invest in technology solutions like POS and KDS to improve operational efficiency")
    
    if int(service_params.coversPerWaiter) < 20:
        recommendations.append("Consider increasing covers per waiter through service optimization")
    
    if int(service_params.runnerRatio) > 50:
        recommendations.append("Optimize runner to waiter ratio to reduce FOH labor costs")
    
    return StaffingResult(
        fohStaff=foh_staff,
        bohStaff=boh_staff,
        totalStaff=sum(foh_staff.values()) + sum(boh_staff.values()),
        laborCost=total_labor_cost,
        staffingStructure=staffing_structure,
        recommendations=recommendations
    )

# Revenue projection functions
def generate_revenue_projections(params: RevenueParams) -> RevenueResult:
    """
    Generate revenue projections based on input parameters
    """
    # Extract parameters
    projection_period = params.projectionPeriod
    projection_length = params.projectionLength
    avg_check = params.avgCheck
    daily_covers = params.dailyCovers
    food_bev_ratio = params.foodBevRatio / 100
    seasonality_factor = params.seasonalityFactor
    growth_rate = params.growthRate / 100
    apply_ramadan = params.applyRamadan
    
    # Generate time periods
    now = datetime.now()
    periods = []
    
    if projection_period == "monthly":
        for i in range(projection_length):
            month = (now.month + i - 1) % 12 + 1
            year = now.year + (now.month + i - 1) // 12
            periods.append(f"{month}/{year}")
    elif projection_period == "quarterly":
        for i in range(projection_length):
            quarter = (now.month + i * 3 - 1) // 3 % 4 + 1
            year = now.year + (now.month + i * 3 - 1) // 12
            periods.append(f"Q{quarter}/{year}")
    else:  # yearly
        for i in range(projection_length):
            periods.append(str(now.year + i))
    
    # Define seasonality factors by month (1.0 = baseline)
    monthly_seasonality = {
        1: 0.9,   # Jan
        2: 0.95,  # Feb
        3: 1.0,   # Mar
        4: 1.05,  # Apr
        5: 1.1,   # May
        6: 0.9,   # Jun
        7: 0.85,  # Jul
        8: 0.9,   # Aug
        9: 1.0,   # Sep
        10: 1.1,  # Oct
        11: 1.15, # Nov
        12: 1.2,  # Dec
    }
    
    # Ramadan month (for this example, assume it's in month 9 - September)
    ramadan_month = 9
    
    # Calculate base daily revenue
    base_daily_revenue = avg_check * daily_covers
    base_food_revenue = base_daily_revenue * food_bev_ratio
    base_bev_revenue = base_daily_revenue * (1 - food_bev_ratio)
    
    # Calculate projections
    food_projections = []
    bev_projections = []
    total_projections = []
    
    for i, period in enumerate(periods):
        # Apply growth rate
        if projection_period == "monthly":
            growth_factor = (1 + growth_rate) ** (i / 12)
            month = (now.month + i - 1) % 12 + 1
            seasonal_factor = monthly_seasonality[month] * seasonality_factor
            
            # Apply Ramadan adjustment if needed
            if apply_ramadan and month == ramadan_month:
                seasonal_factor *= 0.7
                
            # Days in month
            if month in [4, 6, 9, 11]:
                days = 30
            elif month == 2:
                if (now.year + (now.month + i - 1) // 12) % 4 == 0:
                    days = 29
                else:
                    days = 28
            else:
                days = 31
                
        elif projection_period == "quarterly":
            growth_factor = (1 + growth_rate) ** (i / 4)
            quarter_start_month = (now.month + i * 3 - 1) % 12 + 1
            
            # Average seasonality for the quarter
            seasonal_factor = 0
            for j in range(3):
                month = (quarter_start_month + j - 1) % 12 + 1
                seasonal_factor += monthly_seasonality[month]
            seasonal_factor = (seasonal_factor / 3) * seasonality_factor
            
            # Apply Ramadan adjustment if needed
            if apply_ramadan and ramadan_month in range(quarter_start_month, quarter_start_month + 3):
                seasonal_factor *= 0.9
                
            days = 90  # Approximate days per quarter
            
        else:  # yearly
            growth_factor = (1 + growth_rate) ** i
            seasonal_factor = 1.0 * seasonality_factor  # No seasonality for yearly
            
            # Apply Ramadan adjustment if needed
            if apply_ramadan:
                seasonal_factor *= 0.95  # Less impact on yearly basis
                
            days = 365  # Days per year
        
        # Calculate revenue for this period
        food_revenue = base_food_revenue * days * seasonal_factor * growth_factor
        bev_revenue = base_bev_revenue * days * seasonal_factor * growth_factor
        total_revenue = food_revenue + bev_revenue
        
        food_projections.append(round(food_revenue))
        bev_projections.append(round(bev_revenue))
        total_projections.append(round(total_revenue))
    
    # Calculate summary metrics
    total_revenue = sum(total_projections)
    total_food = sum(food_projections)
    total_bev = sum(bev_projections)
    avg_monthly_revenue = total_revenue / len(periods)
    
    # Calculate year-over-year growth if applicable
    yoy_growth = None
    if projection_period == "monthly" and len(periods) >= 24:
        first_year = sum(total_projections[:12])
        second_year = sum(total_projections[12:24])
        yoy_growth = ((second_year / first_year) - 1) * 100
    
    summary_metrics = {
        "totalRevenue": total_revenue,
        "totalFood": total_food,
        "totalBeverage": total_bev,
        "averageMonthlyRevenue": avg_monthly_revenue,
        "yoyGrowth": yoy_growth,
        "peakRevenue": max(total_projections),
        "peakPeriod": periods[total_projections.index(max(total_projections))],
        "lowestRevenue": min(total_projections),
        "lowestPeriod": periods[total_projections.index(min(total_projections))],
    }
    
    # Generate insights
    insights = [
        f"{'Projected growth' if growth_rate > 0 else 'Projected decline'} of {growth_rate * 100:.1f}% annually will result in total revenue of SAR {total_revenue / 1000000:.2f}M over {projection_length} {projection_period}s",
        f"Food revenue accounts for {(total_food / total_revenue) * 100:.1f}% of total revenue",
        f"Seasonal variations result in peak revenue during {periods[total_projections.index(max(total_projections))]}",
        f"Average daily revenue: SAR {round(avg_check * daily_covers):,}",
        f"Projected annual revenue: SAR {(avg_check * daily_covers * 365) / 1000000:.2f}M (without seasonality)"
    ]
    
    # Generate optimization opportunities
    optimization_opportunities = [
        f"Increase average check by 10% to achieve SAR {(avg_check * 1.1 * daily_covers * 365) / 1000000:.2f}M annual revenue",
        f"Focus on beverage sales to improve overall margins",
        f"Implement seasonal promotions to boost revenue during {periods[total_projections.index(min(total_projections))]}",
        f"Consider special Ramadan offerings to mitigate the 30% reduction in revenue",
        f"Develop strategies to increase daily covers by 15% to achieve SAR {(avg_check * daily_covers * 1.15 * 365) / 1000000:.2f}M annual revenue"
    ]
    
    return RevenueResult(
        periods=periods,
        projections={
            "food": food_projections,
            "beverage": bev_projections,
            "total": total_projections
        },
        summaryMetrics=summary_metrics,
        insights=insights,
        optimizationOpportunities=optimization_opportunities
    )

# P&L calculation functions
def calculate_profit_loss(params: PLParams) -> PLResult:
    """
    Calculate profit and loss statement based on input parameters
    """
    # Extract parameters
    timeframe = params.timeframe
    selected_month = params.selectedMonth
    food_cost_percentage = params.foodCostPercentage
    beverage_cost_percentage = params.beverageCostPercentage
    labor_cost_percentage = params.laborCostPercentage
    rent_percentage = params.rentPercentage
    marketing_percentage = params.marketingPercentage
    utilities_percentage = params.utilitiesPercentage
    other_expenses_percentage = params.otherExpensesPercentage
    monthly_revenue = params.monthlyRevenue
    food_revenue = params.foodRevenue
    
    beverage_revenue = params.beverageRevenue
    
    # Calculate P&L items
    # Revenue
    total_revenue = monthly_revenue
    
    # Cost of Goods Sold (COGS)
    food_cost = food_revenue * (food_cost_percentage / 100)
    beverage_cost = beverage_revenue * (beverage_cost_percentage / 100)
    total_cogs = food_cost + beverage_cost
    
    # Gross Profit
    gross_profit = total_revenue - total_cogs
    gross_profit_margin = (gross_profit / total_revenue) * 100
    
    # Operating Expenses
    labor_cost = total_revenue * (labor_cost_percentage / 100)
    rent = total_revenue * (rent_percentage / 100)
    marketing = total_revenue * (marketing_percentage / 100)
    utilities = total_revenue * (utilities_percentage / 100)
    other_expenses = total_revenue * (other_expenses_percentage / 100)
    total_operating_expenses = labor_cost + rent + marketing + utilities + other_expenses
    
    # Operating Profit (EBITDA)
    operating_profit = gross_profit - total_operating_expenses
    operating_profit_margin = (operating_profit / total_revenue) * 100
    
    # Depreciation & Amortization (assumed 3% of revenue)
    depreciation_amortization = total_revenue * 0.03
    
    # EBIT (Earnings Before Interest and Taxes)
    ebit = operating_profit - depreciation_amortization
    
    # Interest Expense (assumed 1% of revenue)
    interest_expense = total_revenue * 0.01
    
    # EBT (Earnings Before Taxes)
    ebt = ebit - interest_expense
    
    # Taxes (assumed 15% corporate tax rate for Saudi Arabia)
    taxes = max(0, ebt * 0.15)
    
    # Net Profit
    net_profit = ebt - taxes
    net_profit_margin = (net_profit / total_revenue) * 100
    
    # Prepare P&L data
    pl_data = {
        "totalRevenue": total_revenue,
        "foodRevenue": food_revenue,
        "beverageRevenue": beverage_revenue,
        "foodCost": food_cost,
        "beverageCost": beverage_cost,
        "totalCOGS": total_cogs,
        "grossProfit": gross_profit,
        "grossProfitMargin": gross_profit_margin,
        "laborCost": labor_cost,
        "rent": rent,
        "marketing": marketing,
        "utilities": utilities,
        "otherExpenses": other_expenses,
        "totalOperatingExpenses": total_operating_expenses,
        "operatingProfit": operating_profit,
        "operatingProfitMargin": operating_profit_margin,
        "depreciationAmortization": depreciation_amortization,
        "ebit": ebit,
        "interestExpense": interest_expense,
        "ebt": ebt,
        "taxes": taxes,
        "netProfit": net_profit,
        "netProfitMargin": net_profit_margin
    }
    
    # Generate historical data for charts
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    current_month = datetime.now().month - 1  # 0-indexed
    
    # Generate 12 months of data
    historical_data = {
        "labels": [],
        "revenue": [],
        "cogs": [],
        "operatingExpenses": [],
        "operatingProfit": [],
        "netProfit": []
    }
    
    for i in range(12):
        month_index = (current_month - 11 + i) % 12
        historical_data["labels"].append(months[month_index])
        
        # Add some variation to the data
        seasonal_factor = 1 + (math.sin((i / 11) * math.pi * 2) * 0.2)
        random_factor = 0.9 + (random.random() * 0.2)
        monthly_factor = seasonal_factor * random_factor
        
        month_revenue = monthly_revenue * monthly_factor
        month_cogs = month_revenue * (((food_cost_percentage * 0.7) + (beverage_cost_percentage * 0.3)) / 100)
        month_opex = month_revenue * ((labor_cost_percentage + rent_percentage + marketing_percentage + utilities_percentage + other_expenses_percentage) / 100)
        month_op_profit = month_revenue - month_cogs - month_opex
        month_net_profit = month_op_profit * 0.85  # Simplified calculation
        
        historical_data["revenue"].append(round(month_revenue))
        historical_data["cogs"].append(round(month_cogs))
        historical_data["operatingExpenses"].append(round(month_opex))
        historical_data["operatingProfit"].append(round(month_op_profit))
        historical_data["netProfit"].append(round(month_net_profit))
    
    # Generate insights
    insights = [
        f"Gross profit margin of {gross_profit_margin:.1f}% is {'excellent' if gross_profit_margin > 70 else 'good' if gross_profit_margin > 65 else 'average' if gross_profit_margin > 60 else 'below average'} for the F&B industry",
        f"Operating profit (EBITDA) of {operating_profit_margin:.1f}% is {'excellent' if operating_profit_margin > 25 else 'good' if operating_profit_margin > 20 else 'average' if operating_profit_margin > 15 else 'below average'} for the F&B industry",
        f"Net profit margin of {net_profit_margin:.1f}% is {'excellent' if net_profit_margin > 15 else 'good' if net_profit_margin > 10 else 'average' if net_profit_margin > 5 else 'below average'} for the F&B industry",
        f"Labor cost at {labor_cost_percentage}% of revenue is {'excellent' if labor_cost_percentage < 22 else 'good' if labor_cost_percentage < 25 else 'average' if labor_cost_percentage < 30 else 'high'} for the F&B industry",
        f"Combined food and beverage cost of {(total_cogs / total_revenue) * 100:.1f}% is {'excellent' if (total_cogs / total_revenue) < 0.25 else 'good' if (total_cogs / total_revenue) < 0.28 else 'average' if (total_cogs / total_revenue) < 0.32 else 'high'}"
    ]
    
    # Generate optimization opportunities
    optimization_opportunities = [
        f"Reducing food cost by 2% would increase gross profit by SAR {(food_revenue * 0.02):,.0f} monthly",
        f"Reducing labor cost by 2% would increase operating profit by SAR {(total_revenue * 0.02):,.0f} monthly",
        "Increasing beverage sales by 5% would improve overall margins due to higher profitability",
        "Implementing energy efficiency measures could reduce utilities by 1% of revenue",
        "Optimizing staffing during non-peak hours could reduce labor costs by 3-5%"
    ]
    
    return PLResult(
        plData=pl_data,
        historicalData=historical_data,
        insights=insights,
        optimizationOpportunities=optimization_opportunities
    )

# Peak hour analysis functions
def analyze_peak_hours(params: PeakHourParams) -> PeakHourResult:
    """
    Analyze peak hour staffing requirements
    """
    # Extract parameters
    selected_day = params.selectedDay
    selected_staff_type = params.selectedStaffType
    peak_factor = params.peakFactor
    apply_ramadan = params.applyRamadan
    
    # Generate sample data for the heatmap
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    hours = list(range(8, 24))  # 8 AM to 11 PM
    
    heatmap_data = {}
    
    for day in days:
        heatmap_data[day] = {}
        for hour in hours:
            # Generate different patterns for different days
            base_value = 0.0
            
            # Weekday pattern
            if day in ["Monday", "Tuesday", "Wednesday", "Thursday"]:
                if hour >= 12 and hour <= 14:  # Lunch peak
                    base_value = 0.8
                elif hour >= 18 and hour <= 21:  # Dinner peak
                    base_value = 0.9
                else:
                    base_value = 0.4
            # Weekend pattern
            else:
                if hour >= 11 and hour <= 15:  # Extended lunch peak
                    base_value = 0.85
                elif hour >= 18 and hour <= 22:  # Extended dinner peak
                    base_value = 1.0
                else:
                    base_value = 0.5
            
            # Add some randomness
            random_factor = 0.1
            value = min(1, max(0, base_value + (random.random() * random_factor * 2 - random_factor)))
            
            # Apply peak factor and Ramadan adjustment
            adjusted_value = value * peak_factor
            if apply_ramadan:
                # During Ramadan, shift peak hours and reduce overall capacity
                if hour >= 19 and hour <= 23:  # Shifted dinner peak during Ramadan
                    adjusted_value = value * peak_factor * 0.9
                else:
                    adjusted_value = value * peak_factor * 0.6
            
            adjusted_value = min(1, adjusted_value)
            
            heatmap_data[day][hour] = {
                "value": value,
                "adjustedValue": adjusted_value,
                "foh": round(adjusted_value * 15),  # FOH staff needed
                "boh": round(adjusted_value * 10),  # BOH staff needed
            }
    
    # Calculate staffing requirements
    staffing_requirements = {
        "byDay": {},
        "byHour": {},
        "total": {
            "foh": 0,
            "boh": 0,
            "total": 0,
            "peakFoh": 0,
            "peakBoh": 0,
            "peakTotal": 0,
        }
    }
    
    # Initialize
    for day in days:
        staffing_requirements["byDay"][day] = {"foh": 0, "boh": 0, "total": 0, "peak": 0}
    
    for hour in hours:
        staffing_requirements["byHour"][hour] = {"foh": 0, "boh": 0, "total": 0, "peak": 0}
    
    # Calculate
    for day in days:
        for hour in hours:
            cell_data = heatmap_data[day][hour]
            foh_needed = cell_data["foh"]
            boh_needed = cell_data["boh"]
            total_needed = foh_needed + boh_needed
            
            staffing_requirements["byDay"][day]["foh"] += foh_needed
            staffing_requirements["byDay"][day]["boh"] += boh_needed
            staffing_requirements["byDay"][day]["total"] += total_needed
            staffing_requirements["byDay"][day]["peak"] = max(staffing_requirements["byDay"][day]["peak"], total_needed)
            
            staffing_requirements["byHour"][hour]["foh"] += foh_needed
            staffing_requirements["byHour"][hour]["boh"] += boh_needed
            staffing_requirements["byHour"][hour]["total"] += total_needed
            staffing_requirements["byHour"][hour]["peak"] = max(staffing_requirements["byHour"][hour]["peak"], total_needed)
            
            staffing_requirements["total"]["peakFoh"] = max(staffing_requirements["total"]["peakFoh"], foh_needed)
            staffing_requirements["total"]["peakBoh"] = max(staffing_requirements["total"]["peakBoh"], boh_needed)
            staffing_requirements["total"]["peakTotal"] = max(staffing_requirements["total"]["peakTotal"], total_needed)
    
    # Average by number of days
    for hour in hours:
        staffing_requirements["byHour"][hour]["foh"] = round(staffing_requirements["byHour"][hour]["foh"] / len(days))
        staffing_requirements["byHour"][hour]["boh"] = round(staffing_requirements["byHour"][hour]["boh"] / len(days))
        staffing_requirements["byHour"][hour]["total"] = round(staffing_requirements["byHour"][hour]["total"] / len(days))
    
    staffing_requirements["total"]["foh"] = round(sum(staffing_requirements["byHour"][hour]["foh"] for hour in hours) / len(hours))
    staffing_requirements["total"]["boh"] = round(sum(staffing_requirements["byHour"][hour]["boh"] for hour in hours) / len(hours))
    staffing_requirements["total"]["total"] = staffing_requirements["total"]["foh"] + staffing_requirements["total"]["boh"]
    
    # Generate insights
    peak_day = max(days, key=lambda d: staffing_requirements["byDay"][d]["peak"])
    peak_hour = max(hours, key=lambda h: sum(heatmap_data[day][h]["foh"] + heatmap_data[day][h]["boh"] for day in days))
    
    weekend_avg = sum(staffing_requirements["byDay"][day]["total"] for day in ["Friday", "Saturday", "Sunday"]) / 3
    weekday_avg = sum(staffing_requirements["byDay"][day]["total"] for day in ["Monday", "Tuesday", "Wednesday", "Thursday"]) / 4
    
    insights = [
        f"Peak staffing requirements occur on {peak_day} at {peak_hour}:00",
        f"Weekend staffing needs are {((weekend_avg / weekday_avg) * 100 - 100):.0f}% higher than weekdays",
        f"Lunch peak requires {round(sum(staffing_requirements['byHour'][h]['total'] for h in range(12, 15)) / 3)} staff on average",
        f"Dinner peak requires {round(sum(staffing_requirements['byHour'][h]['total'] for h in range(18, 22)) / 4)} staff on average",
        f"The ratio of BOH to FOH staff is {staffing_requirements['total']['boh'] / staffing_requirements['total']['foh']:.2f}"
    ]
    
    # Generate optimization opportunities
    optimization_opportunities = [
        "Consider staggered shifts to cover peak hours more efficiently",
        "Implement split shifts for staff during lunch and dinner peaks",
        "Cross-train staff to flex between positions during peak hours",
        f"Schedule {round(staffing_requirements['total']['total'] * 0.7)} core staff for all shifts and {round(staffing_requirements['total']['peakTotal'] - staffing_requirements['total']['total'] * 0.7)} flex staff for peak hours",
        "Adjust BOH prep schedule to align with peak service hours"
    ]
    
    return PeakHourResult(
        heatmapData=heatmap_data,
        staffingRequirements=staffing_requirements,
        insights=insights,
        optimizationOpportunities=optimization_opportunities
    )

# Staffing optimization functions
def optimize_staffing(params: OptimizationParams) -> OptimizationResult:
    """
    Optimize staffing based on target and constraints
    """
    # This would be a complex optimization algorithm in a real implementation
    # For this example, we'll simulate optimization results
    
    # Extract parameters
    scenario_id = params.scenario_id
    optimization_target = params.optimizationTarget
    constraints = params.constraints
    
    # Placeholder for original scenario (would be fetched from database)
    original_scenario = {
        "id": scenario_id,
        "name": "Original Scenario",
        "fohPositions": [
            {"id": "waiter", "title": "Waiter", "count": 8, "salary": 3500},
            {"id": "runner", "title": "Runner", "count": 4, "salary": 3000},
            {"id": "host", "title": "Host", "count": 2, "salary": 4000},
            {"id": "cashier", "title": "Cashier", "count": 2, "salary": 3500},
            {"id": "manager", "title": "Manager", "count": 2, "salary": 8000}
        ],
        "bohPositions": [
            {"id": "chef", "title": "Chef", "count": 1, "salary": 10000},
            {"id": "sous-chef", "title": "Sous Chef", "count": 1, "salary": 7000},
            {"id": "line-cook", "title": "Line Cook", "count": 4, "salary": 4500},
            {"id": "prep-cook", "title": "Prep Cook", "count": 3, "salary": 3500},
            {"id": "kitchen-helper", "title": "Kitchen Helper", "count": 2, "salary": 3000},
            {"id": "dishwasher", "title": "Dishwasher", "count": 2, "salary": 2800}
        ],
        "laborCost": 97800,
        "totalStaff": 31
    }
    
    # Create optimized scenario based on target
    optimized_scenario = {
        "id": f"{scenario_id}-optimized",
        "name": f"Optimized Scenario ({optimization_target})",
        "fohPositions": [],
        "bohPositions": [],
        "laborCost": 0,
        "totalStaff": 0
    }
    
    if optimization_target == "labor_cost":
        # Optimize for labor cost reduction
        optimized_scenario["fohPositions"] = [
            {"id": "waiter", "title": "Waiter", "count": 6, "salary": 3500},
            {"id": "runner", "title": "Runner", "count": 2, "salary": 3000},
            {"id": "host", "title": "Host", "count": 2, "salary": 4000},
            {"id": "cashier", "title": "Cashier", "count": 1, "salary": 3500},
            {"id": "manager", "title": "Manager", "count": 2, "salary": 8000}
        ]
        optimized_scenario["bohPositions"] = [
            {"id": "chef", "title": "Chef", "count": 1, "salary": 10000},
            {"id": "sous-chef", "title": "Sous Chef", "count": 1, "salary": 7000},
            {"id": "line-cook", "title": "Line Cook", "count": 3, "salary": 4500},
            {"id": "prep-cook", "title": "Prep Cook", "count": 2, "salary": 3500},
            {"id": "kitchen-helper", "title": "Kitchen Helper", "count": 2, "salary": 3000},
            {"id": "dishwasher", "title": "Dishwasher", "count": 1, "salary": 2800}
        ]
        optimized_scenario["laborCost"] = 79800
        optimized_scenario["totalStaff"] = 23
        
    elif optimization_target == "efficiency":
        # Optimize for efficiency
        optimized_scenario["fohPositions"] = [
            {"id": "waiter", "title": "Waiter", "count": 7, "salary": 3500},
            {"id": "runner", "title": "Runner", "count": 2, "salary": 3000},
            {"id": "host", "title": "Host", "count": 2, "salary": 4000},
            {"id": "cashier", "title": "Cashier", "count": 1, "salary": 3500},
            {"id": "manager", "title": "Manager", "count": 2, "salary": 8000}
        ]
        optimized_scenario["bohPositions"] = [
            {"id": "chef", "title": "Chef", "count": 1, "salary": 10000},
            {"id": "sous-chef", "title": "Sous Chef", "count": 1, "salary": 7000},
            {"id": "line-cook", "title": "Line Cook", "count": 4, "salary": 4500},
            {"id": "prep-cook", "title": "Prep Cook", "count": 2, "salary": 3500},
            {"id": "kitchen-helper", "title": "Kitchen Helper", "count": 2, "salary": 3000},
            {"id": "dishwasher", "title": "Dishwasher", "count": 1, "salary": 2800}
        ]
        optimized_scenario["laborCost"] = 86300
        optimized_scenario["totalStaff"] = 25
        
    else:  # revenue
        # Optimize for revenue generation
        optimized_scenario["fohPositions"] = [
            {"id": "waiter", "title": "Waiter", "count": 9, "salary": 3500},
            {"id": "runner", "title": "Runner", "count": 3, "salary": 3000},
            {"id": "host", "title": "Host", "count": 2, "salary": 4000},
            {"id": "cashier", "title": "Cashier", "count": 2, "salary": 3500},
            {"id": "manager", "title": "Manager", "count": 2, "salary": 8000}
        ]
        optimized_scenario["bohPositions"] = [
            {"id": "chef", "title": "Chef", "count": 1, "salary": 10000},
            {"id": "sous-chef", "title": "Sous Chef", "count": 1, "salary": 7000},
            {"id": "line-cook", "title": "Line Cook", "count": 5, "salary": 4500},
            {"id": "prep-cook", "title": "Prep Cook", "count": 3, "salary": 3500},
            {"id": "kitchen-helper", "title": "Kitchen Helper", "count": 2, "salary": 3000},
            {"id": "dishwasher", "title": "Dishwasher", "count": 2, "salary": 2800}
        ]
        optimized_scenario["laborCost"] = 107800
        optimized_scenario["totalStaff"] = 32
    
    # Calculate improvements
    staff_reduction = original_scenario["totalStaff"] - optimized_scenario["totalStaff"]
    cost_savings = original_scenario["laborCost"] - optimized_scenario["laborCost"]
    cost_savings_percentage = (cost_savings / original_scenario["laborCost"]) * 100
    
    improvements = {
        "staffReduction": staff_reduction,
        "staffReductionPercentage": (staff_reduction / original_scenario["totalStaff"]) * 100 if staff_reduction > 0 else 0,
        "costSavings": cost_savings,
        "costSavingsPercentage": cost_savings_percentage if cost_savings > 0 else 0,
        "efficiencyImprovement": 15 if optimization_target == "efficiency" else 5,
        "revenueImprovement": 10 if optimization_target == "revenue" else 0
    }
    
    # Generate recommendations
    recommendations = []
    
    if optimization_target == "labor_cost":
        recommendations = [
            "Reduce runner to waiter ratio from 1:2 to 1:3",
            "Consolidate cashier positions during non-peak hours",
            "Reduce line cook staffing by implementing more efficient kitchen workflows",
            "Cross-train prep cooks to handle multiple stations",
            "Implement a single dishwasher system with improved equipment"
        ]
    elif optimization_target == "efficiency":
        recommendations = [
            "Optimize waiter sections to improve service efficiency",
            "Implement runner zones to reduce travel time",
            "Cross-train staff between FOH and BOH positions",
            "Streamline kitchen processes to reduce preparation time",
            "Implement technology solutions for order taking and processing"
        ]
    else:  # revenue
        recommendations = [
            "Increase waiter staffing to improve service quality and upselling",
            "Add dedicated runners to ensure prompt food delivery",
            "Increase line cook staffing to handle higher volume",
            "Maintain full prep cook staffing to ensure food quality",
            "Focus on staff training for suggestive selling techniques"
        ]
    
    return OptimizationResult(
        originalScenario=original_scenario,
        optimizedScenario=optimized_scenario,
        improvements=improvements,
        recommendations=recommendations
    )

# What-if analysis functions
def run_what_if_analysis(params: WhatIfParams) -> WhatIfResult:
    """
    Run what-if analysis based on scenario changes
    """
    # Extract parameters
    base_scenario_id = params.baseScenarioId
    changes = params.changes
    
    # Placeholder for base scenario (would be fetched from database)
    base_scenario = {
        "id": base_scenario_id,
        "name": "Base Scenario",
        "avgCheck": 120,
        "dailyCovers": 250,
        "foodCostPercentage": 28,
        "beverageCostPercentage": 22,
        "laborCostPercentage": 25,
        "totalRevenue": 900000,
        "totalCost": 675000,
        "profit": 225000,
        "profitMargin": 25
    }
    
    # Apply changes to create modified scenario
    modified_scenario = base_scenario.copy()
    modified_scenario["id"] = f"{base_scenario_id}-modified"
    modified_scenario["name"] = "Modified Scenario"
    
    for key, value in changes.items():
        if key in modified_scenario:
            modified_scenario[key] = value
    
    # Recalculate financial metrics
    if "avgCheck" in changes or "dailyCovers" in changes:
        modified_scenario["totalRevenue"] = modified_scenario["avgCheck"] * modified_scenario["dailyCovers"] * 30  # Monthly
    
    # Recalculate costs
    food_cost = modified_scenario["totalRevenue"] * 0.7 * (modified_scenario["foodCostPercentage"] / 100)
    beverage_cost = modified_scenario["totalRevenue"] * 0.3 * (modified_scenario["beverageCostPercentage"] / 100)
    labor_cost = modified_scenario["totalRevenue"] * (modified_scenario["laborCostPercentage"] / 100)
    other_costs = modified_scenario["totalRevenue"] * 0.25  # Fixed at 25% for this example
    
    modified_scenario["totalCost"] = food_cost + beverage_cost + labor_cost + other_costs
    modified_scenario["profit"] = modified_scenario["totalRevenue"] - modified_scenario["totalCost"]
    modified_scenario["profitMargin"] = (modified_scenario["profit"] / modified_scenario["totalRevenue"]) * 100
    
    # Calculate impact
    revenue_change = modified_scenario["totalRevenue"] - base_scenario["totalRevenue"]
    cost_change = modified_scenario["totalCost"] - base_scenario["totalCost"]
    profit_change = modified_scenario["profit"] - base_scenario["profit"]
    margin_change = modified_scenario["profitMargin"] - base_scenario["profitMargin"]
    
    impact = {
        "revenueChange": revenue_change,
        "revenueChangePercentage": (revenue_change / base_scenario["totalRevenue"]) * 100,
        "costChange": cost_change,
        "costChangePercentage": (cost_change / base_scenario["totalCost"]) * 100,
        "profitChange": profit_change,
        "profitChangePercentage": (profit_change / base_scenario["profit"]) * 100,
        "marginChange": margin_change
    }
    
    # Generate insights
    insights = [
        f"{'Increasing' if revenue_change > 0 else 'Decreasing'} revenue by SAR {abs(revenue_change):,.0f} ({abs(impact['revenueChangePercentage']):.1f}%)",
        f"{'Increasing' if cost_change > 0 else 'Decreasing'} costs by SAR {abs(cost_change):,.0f} ({abs(impact['costChangePercentage']):.1f}%)",
        f"{'Increasing' if profit_change > 0 else 'Decreasing'} profit by SAR {abs(profit_change):,.0f} ({abs(impact['profitChangePercentage']):.1f}%)",
        f"{'Improving' if margin_change > 0 else 'Reducing'} profit margin by {abs(margin_change):.1f} percentage points",
        f"Return on investment: {(profit_change / max(1, cost_change)) * 100:.1f}%" if cost_change > 0 else "Cost reduction with maintained or improved profitability"
    ]
    
    return WhatIfResult(
        baseScenario=base_scenario,
        modifiedScenario=modified_scenario,
        impact=impact,
        insights=insights
    )

# Scenario comparison functions
def compare_scenarios(scenarios: List[Scenario]) -> ComparisonResult:
    """
    Compare multiple scenarios and generate insights
    """
    if len(scenarios) < 2:
        raise ValueError("At least two scenarios are required for comparison")
    
    # Extract scenario data
    scenario_data = []
    for scenario in scenarios:
        # Calculate totals
        foh_staff = sum(position.count for position in scenario.fohPositions)
        boh_staff = sum(position.count for position in scenario.bohPositions)
        total_staff = foh_staff + boh_staff
        
        foh_labor = sum(position.count * position.salary for position in scenario.fohPositions)
        boh_labor = sum(position.count * position.salary for position in scenario.bohPositions)
        total_labor = foh_labor + boh_labor
        
        # Estimate revenue (would be calculated from scenario parameters in a real implementation)
        estimated_revenue = 0
        if scenario.revenueDrivers:
            estimated_revenue = scenario.revenueDrivers.monthlyRevenue or 1200000  # Default if not set
        else:
            estimated_revenue = 1200000  # Default value
        
        labor_percentage = (total_labor / estimated_revenue) * 100
        
        scenario_data.append({
            "id": scenario.id,
            "name": scenario.name,
            "fohStaff": foh_staff,
            "bohStaff": boh_staff,
            "totalStaff": total_staff,
            "fohLabor": foh_labor,
            "bohLabor": boh_labor,
            "totalLabor": total_labor,
            "estimatedRevenue": estimated_revenue,
            "laborPercentage": labor_percentage
        })
    
    # Calculate differences between scenarios
    differences = {}
    base_scenario = scenario_data[0]
    
    for i, scenario in enumerate(scenario_data[1:], 1):
        scenario_diff = {
            "staffDifference": scenario["totalStaff"] - base_scenario["totalStaff"],
            "staffPercentage": ((scenario["totalStaff"] - base_scenario["totalStaff"]) / base_scenario["totalStaff"]) * 100,
            "laborDifference": scenario["totalLabor"] - base_scenario["totalLabor"],
            "laborPercentage":  scenario["totalLabor"] - base_scenario["totalLabor"],
            "laborPercentage": ((scenario["totalLabor"] - base_scenario["totalLabor"]) / base_scenario["totalLabor"]) * 100,
            "revenueDifference": scenario["estimatedRevenue"] - base_scenario["estimatedRevenue"],
            "revenuePercentage": ((scenario["estimatedRevenue"] - base_scenario["estimatedRevenue"]) / base_scenario["estimatedRevenue"]) * 100,
            "laborRatioDifference": scenario["laborPercentage"] - base_scenario["laborPercentage"]
        }
        
        differences[f"{base_scenario['name']}_vs_{scenario['name']}"] = scenario_diff
    
    # Generate insights
    insights = []
    
    for key, diff in differences.items():
        scenario_names = key.split("_vs_")
        
        if diff["staffDifference"] < 0:
            insights.append(f"{scenario_names[1]} requires {abs(diff['staffDifference'])} fewer staff ({abs(diff['staffPercentage']):.1f}% reduction) compared to {scenario_names[0]}")
        elif diff["staffDifference"] > 0:
            insights.append(f"{scenario_names[1]} requires {diff['staffDifference']} more staff ({diff['staffPercentage']:.1f}% increase) compared to {scenario_names[0]}")
        
        if diff["laborDifference"] < 0:
            insights.append(f"{scenario_names[1]} reduces labor cost by SAR {abs(diff['laborDifference']):,.0f} ({abs(diff['laborPercentage']):.1f}% reduction) compared to {scenario_names[0]}")
        elif diff["laborDifference"] > 0:
            insights.append(f"{scenario_names[1]} increases labor cost by SAR {diff['laborDifference']:,.0f} ({diff['laborPercentage']:.1f}% increase) compared to {scenario_names[0]}")
        
        if diff["laborRatioDifference"] < 0:
            insights.append(f"{scenario_names[1]} improves labor cost percentage by {abs(diff['laborRatioDifference']):.1f} percentage points compared to {scenario_names[0]}")
        elif diff["laborRatioDifference"] > 0:
            insights.append(f"{scenario_names[1]} increases labor cost percentage by {diff['laborRatioDifference']:.1f} percentage points compared to {scenario_names[0]}")
    
    # Generate recommendations
    recommendations = [
        "Consider implementing the scenario with the lowest labor cost percentage for optimal profitability",
        "Balance staffing reductions with service quality considerations",
        "Evaluate the impact of each scenario on guest experience and revenue potential",
        "Consider testing the most promising scenario in a single location before full implementation",
        "Regularly review and adjust staffing models based on seasonal demand patterns"
    ]
    
    return ComparisonResult(
        scenarios=scenario_data,
        differences=differences,
        insights=insights,
        recommendations=recommendations
    )

