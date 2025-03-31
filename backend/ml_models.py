import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os
from typing import Dict, List, Any, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Directory for saving models
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)

class DemandForecaster:
    """
    Machine learning model for forecasting customer demand
    """
    def __init__(self, model_type="random_forest"):
        self.model_type = model_type
        self.model = None
        self.preprocessor = None
        self.model_path = os.path.join(MODELS_DIR, f"demand_forecaster_{model_type}.joblib")
        self.preprocessor_path = os.path.join(MODELS_DIR, f"demand_forecaster_preprocessor_{model_type}.joblib")
        
        # Try to load existing model
        self._load_model()
    
    def _load_model(self):
        """Load model from disk if it exists"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.preprocessor_path):
                self.model = joblib.load(self.model_path)
                self.preprocessor = joblib.load(self.preprocessor_path)
                logger.info(f"Loaded existing model from {self.model_path}")
                return True
        except Exception as e:
            logger.error(f"Error loading model: {e}")
        return False
    
    def _save_model(self):
        """Save model to disk"""
        try:
            joblib.dump(self.model, self.model_path)
            joblib.dump(self.preprocessor, self.preprocessor_path)
            logger.info(f"Saved model to {self.model_path}")
            return True
        except Exception as e:
            logger.error(f"Error saving model: {e}")
            return False
    
    def train(self, data: pd.DataFrame):
        """
        Train the demand forecasting model
        
        Parameters:
        - data: DataFrame with columns:
            - date: Date of the data point
            - day_of_week: Day of the week (0-6)
            - is_weekend: Boolean indicating if it's a weekend
            - is_holiday: Boolean indicating if it's a holiday
            - is_ramadan: Boolean indicating if it's during Ramadan
            - temperature: Temperature in Celsius
            - precipitation: Precipitation in mm
            - special_event: Type of special event (if any)
            - marketing_campaign: Boolean indicating if there's a marketing campaign
            - menu_change: Boolean indicating if there was a recent menu change
            - competitor_promotion: Boolean indicating if competitors have promotions
            - covers: Number of covers (target variable)
        """
        # Check if data is valid
        required_columns = [
            'date', 'day_of_week', 'is_weekend', 'is_holiday', 'is_ramadan',
            'temperature', 'precipitation', 'special_event', 'marketing_campaign',
            'menu_change', 'competitor_promotion', 'covers'
        ]
        
        for col in required_columns:
            if col not in data.columns:
                raise ValueError(f"Missing required column: {col}")
        
        # Split features and target
        X = data.drop(['covers', 'date'], axis=1)
        y = data['covers']
        
        # Split data into train and test sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Define preprocessing for numeric and categorical features
        numeric_features = ['temperature', 'precipitation', 'day_of_week']
        categorical_features = ['is_weekend', 'is_holiday', 'is_ramadan', 'special_event', 
                               'marketing_campaign', 'menu_change', 'competitor_promotion']
        
        numeric_transformer = Pipeline(steps=[
            ('scaler', StandardScaler())
        ])
        
        categorical_transformer = Pipeline(steps=[
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ])
        
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, numeric_features),
                ('cat', categorical_transformer, categorical_features)
            ])
        
        # Create and train the model
        if self.model_type == "random_forest":
            model = RandomForestRegressor(random_state=42)
            param_grid = {
                'n_estimators': [50, 100, 200],
                'max_depth': [None, 10, 20, 30],
                'min_samples_split': [2, 5, 10]
            }
        elif self.model_type == "gradient_boosting":
            model = GradientBoostingRegressor(random_state=42)
            param_grid = {
                'n_estimators': [50, 100, 200],
                'learning_rate': [0.01, 0.1, 0.2],
                'max_depth': [3, 5, 7]
            }
        else:  # linear_regression
            model = LinearRegression()
            param_grid = {}
        
        # Create pipeline with preprocessing and model
        pipeline = Pipeline(steps=[
            ('preprocessor', self.preprocessor),
            ('model', model)
        ])
        
        # Perform grid search for hyperparameter tuning
        if param_grid:
            grid_search = GridSearchCV(pipeline, param_grid, cv=5, scoring='neg_mean_squared_error')
            grid_search.fit(X_train, y_train)
            self.model = grid_search.best_estimator_
            logger.info(f"Best parameters: {grid_search.best_params_}")
        else:
            pipeline.fit(X_train, y_train)
            self.model = pipeline
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        logger.info(f"Model evaluation - MSE: {mse:.2f}, R²: {r2:.2f}")
        
        # Save model
        self._save_model()
        
        return {
            'mse': mse,
            'r2': r2,
            'model_type': self.model_type
        }
    
    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make a prediction using the trained model
        
        Parameters:
        - features: Dictionary with the same features used for training (except 'covers')
        
        Returns:
        - Dictionary with prediction results
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first or load a pre-trained model.")
        
        # Convert features to DataFrame
        df = pd.DataFrame([features])
        
        # Remove date and target if present
        if 'date' in df.columns:
            df = df.drop('date', axis=1)
        if 'covers' in df.columns:
            df = df.drop('covers', axis=1)
        
        # Make prediction
        prediction = self.model.predict(df)[0]
        
        return {
            'predicted_covers': round(prediction),
            'model_type': self.model_type
        }

class StaffingOptimizer:
    """
    Advanced optimization model for staffing requirements
    """
    def __init__(self, model_type="gradient_boosting"):
        self.model_type = model_type
        self.model = None
        self.preprocessor = None
        self.model_path = os.path.join(MODELS_DIR, f"staffing_optimizer_{model_type}.joblib")
        self.preprocessor_path = os.path.join(MODELS_DIR, f"staffing_optimizer_preprocessor_{model_type}.joblib")
        
        # Try to load existing model
        self._load_model()
    
    def _load_model(self):
        """Load model from disk if it exists"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.preprocessor_path):
                self.model = joblib.load(self.model_path)
                self.preprocessor = joblib.load(self.preprocessor_path)
                logger.info(f"Loaded existing model from {self.model_path}")
                return True
        except Exception as e:
            logger.error(f"Error loading model: {e}")
        return False
    
    def _save_model(self):
        """Save model to disk"""
        try:
            joblib.dump(self.model, self.model_path)
            joblib.dump(self.preprocessor, self.preprocessor_path)
            logger.info(f"Saved model to {self.model_path}")
            return True
        except Exception as e:
            logger.error(f"Error saving model: {e}")
            return False
    
    def train(self, data: pd.DataFrame):
        """
        Train the staffing optimization model
        
        Parameters:
        - data: DataFrame with columns:
            - covers: Number of covers
            - service_style: Type of service (fast-casual, casual, premium)
            - area_per_cover: Area per cover in sqm
            - avg_check: Average check amount
            - dwelling_time: Average time guests spend at the restaurant
            - peak_factor: Peak hour factor
            - staff_utilization: Staff utilization rate
            - tech_impact: Technology impact on efficiency
            - cross_training: Cross-training impact
            - waiters: Number of waiters (target)
            - runners: Number of runners (target)
            - kitchen_staff: Number of kitchen staff (target)
            - other_staff: Number of other staff (target)
        """
        # Check if data is valid
        required_columns = [
            'covers', 'service_style', 'area_per_cover', 'avg_check', 'dwelling_time',
            'peak_factor', 'staff_utilization', 'tech_impact', 'cross_training',
            'waiters', 'runners', 'kitchen_staff', 'other_staff'
        ]
        
        for col in required_columns:
            if col not in data.columns:
                raise ValueError(f"Missing required column: {col}")
        
        # Split features and targets
        X = data.drop(['waiters', 'runners', 'kitchen_staff', 'other_staff'], axis=1)
        y = data[['waiters', 'runners', 'kitchen_staff', 'other_staff']]
        
        # Split data into train and test sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Define preprocessing for numeric and categorical features
        numeric_features = ['covers', 'area_per_cover', 'avg_check', 'dwelling_time',
                           'peak_factor', 'staff_utilization', 'tech_impact', 'cross_training']
        categorical_features = ['service_style']
        
        numeric_transformer = Pipeline(steps=[
            ('scaler', StandardScaler())
        ])
        
        categorical_transformer = Pipeline(steps=[
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ])
        
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, numeric_features),
                ('cat', categorical_transformer, categorical_features)
            ])
        
        # Create and train the model
        if self.model_type == "random_forest":
            model = RandomForestRegressor(random_state=42)
            param_grid = {
                'n_estimators': [50, 100, 200],
                'max_depth': [None, 10, 20, 30],
                'min_samples_split': [2, 5, 10]
            }
        elif self.model_type == "gradient_boosting":
            model = GradientBoostingRegressor(random_state=42)
            param_grid = {
                'n_estimators': [50, 100, 200],
                'learning_rate': [0.01, 0.1, 0.2],
                'max_depth': [3, 5, 7]
            }
        else:  # linear_regression
            model = LinearRegression()
            param_grid = {}
        
        # Train separate models for each target
        models = {}
        metrics = {}
        
        for target in ['waiters', 'runners', 'kitchen_staff', 'other_staff']:
            logger.info(f"Training model for {target}")
            
            # Create pipeline with preprocessing and model
            pipeline = Pipeline(steps=[
                ('preprocessor', self.preprocessor),
                ('model', model)
            ])
            
            # Perform grid search for hyperparameter tuning
            if param_grid:
                grid_search = GridSearchCV(pipeline, param_grid, cv=5, scoring='neg_mean_squared_error')
                grid_search.fit(X_train, y_train[target])
                models[target] = grid_search.best_estimator_
                logger.info(f"Best parameters for {target}: {grid_search.best_params_}")
            else:
                pipeline.fit(X_train, y_train[target])
                models[target] = pipeline
            
            # Evaluate model
            y_pred = models[target].predict(X_test)
            mse = mean_squared_error(y_test[target], y_pred)
            r2 = r2_score(y_test[target], y_pred)
            
            metrics[target] = {'mse': mse, 'r2': r2}
            logger.info(f"Model evaluation for {target} - MSE: {mse:.2f}, R²: {r2:.2f}")
        
        self.model = models
        
        # Save model
        self._save_model()
        
        return metrics
    
    def optimize(self, features: Dict[str, Any], constraints: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Optimize staffing based on features and constraints
        
        Parameters:
        - features: Dictionary with the same features used for training
        - constraints: Optional constraints for optimization
        
        Returns:
        - Dictionary with optimized staffing
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first or load a pre-trained model.")
        
        # Convert features to DataFrame
        df = pd.DataFrame([features])
        
        # Make predictions for each staff type
        predictions = {}
        for staff_type, model in self.model.items():
            predictions[staff_type] = round(model.predict(df)[0])
        
        # Apply constraints if provided
        if constraints:
            if 'max_total_staff' in constraints:
                max_staff = constraints['max_total_staff']
                current_total = sum(predictions.values())
                
                if current_total > max_staff:
                    # Scale down proportionally
                    scale_factor = max_staff / current_total
                    for staff_type in predictions:
                        predictions[staff_type] = max(1, round(predictions[staff_type] * scale_factor))
            
            if 'min_staff_by_type' in constraints:
                for staff_type, min_value in constraints['min_staff_by_type'].items():
                    if staff_type in predictions and predictions[staff_type] < min_value:
                        predictions[staff_type] = min_value
            
            if 'max_staff_by_type' in constraints:
                for staff_type, max_value in constraints['max_staff_by_type'].items():
                    if staff_type in predictions and predictions[staff_type] > max_value:
                        predictions[staff_type] = max_value
        
        # Calculate total staff and estimated labor cost
        total_staff = sum(predictions.values())
        
        # Estimate labor cost (using sample salaries)
        salaries = {
            'waiters': 3500,
            'runners': 3000,
            'kitchen_staff': 4500,
            'other_staff': 5000
        }
        
        labor_cost = sum(predictions[staff_type] * salaries[staff_type] for staff_type in predictions)
        
        return {
            'optimized_staffing': predictions,
            'total_staff': total_staff,
            'estimated_labor_cost': labor_cost,
            'model_type': self.model_type
        }

# Function to get demand forecaster instance
def get_demand_forecaster(model_type="random_forest"):
    return DemandForecaster(model_type)

# Function to get staffing optimizer instance
def get_staffing_optimizer(model_type="gradient_boosting"):
    return StaffingOptimizer(model_type)

