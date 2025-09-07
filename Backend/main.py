from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Any
import logging
import os
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Nova Score API",
    description="XGBoost-powered credit scoring API for gig workers",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8080", "http://localhost:8081", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://127.0.0.1:8080", "http://127.0.0.1:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and feature columns
model = None
feature_columns = None

def load_model():
    """Load the XGBoost model and feature columns"""
    global model, feature_columns
    try:
        model_path = Path("../ML_Models/xgb_tuned.joblib")
        features_path = Path("../ML_Models/feature_columns.joblib")
        
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found: {model_path}")
        if not features_path.exists():
            raise FileNotFoundError(f"Feature columns file not found: {features_path}")
            
        model = joblib.load(model_path)
        feature_columns = joblib.load(features_path)
        
        logger.info(f"Model loaded successfully with {len(feature_columns)} features")
        logger.info(f"Feature columns: {feature_columns}")
        
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

# Load model on startup
@app.on_event("startup")
async def startup_event():
    load_model()

class NovaScoreRequest(BaseModel):
    """Request model for Nova Score calculation"""
    monthly_earnings: float = Field(..., description="Monthly earnings from gig work in INR", ge=0)
    active_days_per_month: int = Field(..., description="Number of active working days per month", ge=1, le=31)
    avg_rating: float = Field(..., description="Average customer rating", ge=1.0, le=5.0)
    earnings_avg_6mo: float = Field(..., description="6-month average earnings in INR", ge=0)
    earnings_avg_3mo: float = Field(..., description="3-month average earnings in INR", ge=0)
    earnings_per_active_day: float = Field(..., description="Average earnings per active day in INR", ge=0)
    earnings_m1: float = Field(..., description="Earnings from 1 month ago in INR", ge=0)
    earnings_m2: float = Field(..., description="Earnings from 2 months ago in INR", ge=0)
    earnings_m3: float = Field(..., description="Earnings from 3 months ago in INR", ge=0)
    earnings_m4: float = Field(..., description="Earnings from 4 months ago in INR", ge=0)
    earnings_m5: float = Field(..., description="Earnings from 5 months ago in INR", ge=0)
    earnings_m6: float = Field(..., description="Earnings from 6 months ago in INR", ge=0)
    trips_m4: int = Field(..., description="Number of trips 4 months ago", ge=0)
    trips_m5: int = Field(..., description="Number of trips 5 months ago", ge=0)
    cancellation_rate: float = Field(..., description="Cancellation rate percentage", ge=0, le=100)
    city: str = Field(..., description="Primary working city")
    vehicle_type: str = Field(..., description="Vehicle type used for gig work")

class FeatureImportance(BaseModel):
    """Feature importance for explanation"""
    name: str
    value: float
    impact: str
    explanation: str

class LoanGiverRanges(BaseModel):
    """Loan giver score ranges"""
    excellent: str
    good: str
    fair: str
    poor: str

class NovaScoreResponse(BaseModel):
    """Response model for Nova Score calculation"""
    score: float
    risk_level: str
    recommendation: str
    top_features: List[FeatureImportance]
    model_confidence: float
    suggestions: List[str]
    loan_giver_ranges: LoanGiverRanges

def calculate_derived_features(data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate derived features that the model expects"""
    
    # Calculate trips per week (assuming 4.33 weeks per month)
    avg_trips_recent = (data.get('trips_m4', 0) + data.get('trips_m5', 0)) / 2
    data['trips_per_week'] = avg_trips_recent / 4.33 if avg_trips_recent > 0 else 0
    
    # Calculate earnings trend slope (simple linear trend over 6 months)
    earnings_history = [
        data['earnings_m6'], data['earnings_m5'], data['earnings_m4'],
        data['earnings_m3'], data['earnings_m2'], data['earnings_m1']
    ]
    
    # Simple slope calculation
    x = np.arange(len(earnings_history))
    y = np.array(earnings_history)
    if len(y) > 1 and np.std(y) > 0:
        slope = np.polyfit(x, y, 1)[0]
        data['earnings_trend_slope'] = slope
        data['earnings_trend_up'] = 1 if slope > 0 else 0
    else:
        data['earnings_trend_slope'] = 0
        data['earnings_trend_up'] = 0
    
    # Calculate trips per active day
    data['trips_per_active_day'] = avg_trips_recent / data['active_days_per_month'] if data['active_days_per_month'] > 0 else 0
    
    # Calculate estimated cancellations per month
    data['estimated_cancellations_per_month'] = (avg_trips_recent * data['cancellation_rate'] / 100)
    
    # High activity flag
    data['high_activity_flag'] = 1 if data['active_days_per_month'] >= 20 else 0
    
    # Calculate trip averages (using available data)
    data['trips_avg_3mo'] = avg_trips_recent  # Simplified
    data['trips_avg_6mo'] = avg_trips_recent  # Simplified
    
    # Add missing trip months with reasonable estimates
    for month in ['trips_m1', 'trips_m2', 'trips_m3', 'trips_m6']:
        if month not in data:
            data[month] = avg_trips_recent
    
    # Handle categorical features (city and vehicle_type)
    # One-hot encode city
    cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata']
    for city in cities:
        data[f'city_{city}'] = 1 if data.get('city') == city else 0
    
    # One-hot encode vehicle_type
    vehicles = ['Auto', 'Bike', 'Car']
    for vehicle in vehicles:
        data[f'vehicle_type_{vehicle}'] = 1 if data.get('vehicle_type') == vehicle else 0
    
    return data

def prepare_features(request_data: Dict[str, Any]) -> np.ndarray:
    """Prepare features for model prediction"""
    
    # Calculate derived features
    enhanced_data = calculate_derived_features(request_data.copy())
    
    # Create feature vector in the correct order
    feature_vector = []
    
    for feature in feature_columns:
        if feature in enhanced_data:
            feature_vector.append(enhanced_data[feature])
        else:
            # Handle missing features with reasonable defaults
            if 'earnings' in feature:
                feature_vector.append(enhanced_data.get('monthly_earnings', 0))
            elif 'trips' in feature:
                feature_vector.append(enhanced_data.get('trips_m4', 0))
            elif 'rating' in feature:
                feature_vector.append(enhanced_data.get('avg_rating', 4.0))
            else:
                feature_vector.append(0)
    
    return np.array(feature_vector).reshape(1, -1)

def get_risk_level(score: float) -> str:
    """Determine risk level based on score"""
    if score >= 80:
        return "low"
    elif score >= 60:
        return "medium"
    else:
        return "high"

def generate_recommendation(score: float, risk_level: str) -> str:
    """Generate recommendation based on score and risk level"""
    if risk_level == "low":
        return "Excellent creditworthiness! You qualify for premium financial products with the best rates and terms in the Indian market."
    elif risk_level == "medium":
        return "Good credit profile with solid earning potential. Consider increasing consistency to access better rates from Indian lenders."
    else:
        return "Credit profile shows potential but needs improvement. Focus on earnings stability and reducing cancellations to access better financial opportunities."

def generate_suggestions(data: Dict[str, Any], score: float) -> List[str]:
    """Generate personalized suggestions for improvement"""
    suggestions = []
    
    monthly_earnings = data.get('monthly_earnings', 0)
    cancellation_rate = data.get('cancellation_rate', 0)
    avg_rating = data.get('avg_rating', 0)
    active_days = data.get('active_days_per_month', 0)
    earnings_per_day = data.get('earnings_per_active_day', 0)
    
    if monthly_earnings < 20000:
        suggestions.append("Increase your monthly earnings by working more active days or optimizing your routes for higher efficiency. Target ₹20,000+ monthly.")
    
    if cancellation_rate > 3:
        suggestions.append("Reduce your cancellation rate by better planning and accepting only orders you can complete. Aim for under 3%.")
    
    if avg_rating < 4.5:
        suggestions.append("Improve customer service to boost your ratings - be punctual, polite, and maintain vehicle cleanliness. Target 4.5+ rating.")
    
    if active_days < 20:
        suggestions.append("Increase your active working days to show more consistency and reliability to lenders. Aim for 20+ days per month.")
    
    if earnings_per_day < 1000:
        suggestions.append("Focus on peak hours and high-demand areas to increase your daily earnings efficiency. Target ₹1,000+ per day.")
    
    # City-specific suggestions
    city = data.get('city', '')
    if city in ['Mumbai', 'Delhi', 'Bengaluru']:
        suggestions.append(f"Leverage {city}'s high-demand areas during peak hours to maximize earnings potential.")
    
    # Vehicle-specific suggestions
    vehicle = data.get('vehicle_type', '')
    if vehicle == 'Bike':
        suggestions.append("Consider food delivery during peak meal times to maximize bike efficiency and earnings.")
    elif vehicle == 'Car':
        suggestions.append("Focus on longer rides and premium services to maximize car utilization and earnings.")
    
    return suggestions[:5]  # Return top 5 suggestions

def get_loan_giver_ranges() -> LoanGiverRanges:
    """Get loan giver score ranges for Indian market"""
    return LoanGiverRanges(
        excellent="80-100: Premium borrower - Lowest interest rates (8-12% APR), highest loan amounts (₹5L+), minimal documentation required",
        good="65-79: Good borrower - Competitive rates (12-18% APR), standard loan amounts (₹2-5L), regular documentation needed",
        fair="50-64: Fair borrower - Higher rates (18-24% APR), moderate loan amounts (₹50K-2L), additional verification required",
        poor="Below 50: High-risk borrower - Highest rates (24%+ APR), limited loan amounts (₹10-50K), extensive documentation and collateral needed"
    )

def get_feature_explanations(features: np.ndarray, feature_names: List[str]) -> List[FeatureImportance]:
    """Generate feature importance explanations"""
    
    # Create feature importance based on typical XGBoost patterns
    feature_impacts = []
    
    for i, (feature_name, value) in enumerate(zip(feature_names, features[0])):
        impact = "neutral"
        explanation = f"Current value: {value:.2f}"
        
        if "earnings" in feature_name.lower():
            if value > 25000:
                impact = "positive"
                explanation = f"Strong earnings of ₹{value:.0f} indicate good income stability"
            elif value < 10000:
                impact = "negative"
                explanation = f"Lower earnings of ₹{value:.0f} may indicate income instability"
                
        elif "rating" in feature_name.lower():
            if value >= 4.5:
                impact = "positive"
                explanation = f"Excellent rating of {value:.1f}/5.0 shows high service quality"
            elif value < 4.0:
                impact = "negative"
                explanation = f"Rating of {value:.1f}/5.0 could be improved for better scoring"
                
        elif "cancellation" in feature_name.lower():
            if value < 3:
                impact = "positive"
                explanation = f"Low cancellation rate of {value:.1f}% shows reliability"
            elif value > 8:
                impact = "negative"
                explanation = f"High cancellation rate of {value:.1f}% negatively impacts score"
                
        elif "active_days" in feature_name.lower():
            if value >= 20:
                impact = "positive"
                explanation = f"High activity of {value:.0f} days/month shows commitment"
            elif value < 10:
                impact = "negative"
                explanation = f"Low activity of {value:.0f} days/month may indicate inconsistency"
        
        feature_impacts.append(FeatureImportance(
            name=feature_name.replace('_', ' ').title(),
            value=value,
            impact=impact,
            explanation=explanation
        ))
    
    # Return top 5 most relevant features
    return sorted(feature_impacts, key=lambda x: abs(x.value), reverse=True)[:5]

@app.post("/predict", response_model=NovaScoreResponse)
async def predict_nova_score(request: NovaScoreRequest):
    """Predict Nova Score using the XGBoost model"""
    
    if model is None or feature_columns is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Convert request to dictionary
        request_data = request.dict()
        
        # Prepare features for prediction
        features = prepare_features(request_data)
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Convert to 0-100 scale (assuming model outputs probability or similar)
        if prediction <= 1.0:
            score = prediction * 100
        else:
            score = min(prediction, 100)
        
        # Ensure score is within bounds
        score = max(0, min(100, score))
        
        # Get prediction probability for confidence
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(features)[0]
            confidence = max(proba) * 100
        else:
            confidence = 85.0  # Default confidence
        
        # Determine risk level and recommendation
        risk_level = get_risk_level(score)
        recommendation = generate_recommendation(score, risk_level)
        
        # Get feature explanations
        top_features = get_feature_explanations(features, feature_columns)
        
        # Generate suggestions and loan giver ranges
        suggestions = generate_suggestions(request_data, score)
        loan_ranges = get_loan_giver_ranges()
        
        return NovaScoreResponse(
            score=round(score, 1),
            risk_level=risk_level,
            recommendation=recommendation,
            top_features=top_features,
            model_confidence=round(confidence, 1),
            suggestions=suggestions,
            loan_giver_ranges=loan_ranges
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "features_loaded": feature_columns is not None,
        "feature_count": len(feature_columns) if feature_columns else 0
    }

@app.get("/features")
async def get_features():
    """Get the list of features expected by the model"""
    if feature_columns is None:
        raise HTTPException(status_code=500, detail="Feature columns not loaded")
    
    return {
        "features": feature_columns,
        "count": len(feature_columns)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)