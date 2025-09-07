import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import NovaScore from '@/components/NovaScore';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Star,
  DollarSign,
  Calendar,
  TrendingUp,
  Info,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Target,
  MapPin,
  Car,
  Lightbulb
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Icon animation hook
const useIconAnimation = () => {
  const [animatingIcons, setAnimatingIcons] = useState<Set<string>>(new Set());

  const triggerIconAnimation = (iconId: string, animationType: 'bounce' | 'spin' | 'pulse' = 'bounce') => {
    setAnimatingIcons(prev => new Set(prev).add(`${iconId}-${animationType}`));
    setTimeout(() => {
      setAnimatingIcons(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${iconId}-${animationType}`);
        return newSet;
      });
    }, 600);
  };

  const getIconClasses = (iconId: string, animationType: 'bounce' | 'spin' | 'pulse' = 'bounce') => {
    const key = `${iconId}-${animationType}`;
    return animatingIcons.has(key) ? `icon-${animationType}` : '';
  };

  return { triggerIconAnimation, getIconClasses };
};

interface FormData {
  monthly_earnings: string;
  active_days_per_month: string;
  avg_rating: number;
  earnings_avg_6mo: string;
  earnings_avg_3mo: string;
  earnings_per_active_day: string;
  earnings_m1: string;
  earnings_m2: string;
  earnings_m3: string;
  earnings_m4: string;
  earnings_m5: string;
  earnings_m6: string;
  trips_m4: string;
  trips_m5: string;
  cancellation_rate: string;
  city: string;
  vehicle_type: string;
}

interface ScoreResult {
  score: number;
  topFeatures: Array<{
    name: string;
    value: string;
    impact: 'positive' | 'negative' | 'neutral';
    explanation: string;
  }>;
  recommendation: string;
  riskLevel: 'low' | 'medium' | 'high';
  suggestions: string[];
  loanGiverRanges: {
    excellent: string;
    good: string;
    fair: string;
    poor: string;
  };
}

const NovaScoreForm: React.FC = () => {
  const { toast } = useToast();
  const { triggerIconAnimation, getIconClasses } = useIconAnimation();
  const [formData, setFormData] = useState<FormData>({
    monthly_earnings: '',
    active_days_per_month: '',
    avg_rating: 4.5,
    earnings_avg_6mo: '',
    earnings_avg_3mo: '',
    earnings_per_active_day: '',
    earnings_m1: '',
    earnings_m2: '',
    earnings_m3: '',
    earnings_m4: '',
    earnings_m5: '',
    earnings_m6: '',
    trips_m4: '',
    trips_m5: '',
    cancellation_rate: '',
    city: '',
    vehicle_type: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Set<string>>(new Set());

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Remove field from errors if it now has a value
    if (value && fieldErrors.has(field)) {
      setFieldErrors(prev => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
    }
  };

  const loadDemoData = () => {
    triggerIconAnimation('sparkles', 'spin');
    
    // Demo data optimized for ~75 Nova Score (Indian context)
    setFormData({
      monthly_earnings: '28500', // ₹28,500 (~$340)
      active_days_per_month: '24',
      avg_rating: 4.6,
      earnings_avg_6mo: '27800', // ₹27,800
      earnings_avg_3mo: '29200', // ₹29,200
      earnings_per_active_day: '1187', // ₹1,187 per day
      earnings_m1: '30500', // ₹30,500
      earnings_m2: '29800', // ₹29,800
      earnings_m3: '28200', // ₹28,200
      earnings_m4: '27500', // ₹27,500
      earnings_m5: '26800', // ₹26,800
      earnings_m6: '25900', // ₹25,900
      trips_m4: '165',
      trips_m5: '172',
      cancellation_rate: '3.2',
      city: 'Mumbai',
      vehicle_type: 'Bike'
    });
    
    toast({
      title: "Demo data loaded! 🎯",
      description: "Sample Indian gig worker profile ready for scoring.",
    });
  };

  const calculateNovaScore = (data: FormData): ScoreResult => {
    // Enhanced scoring algorithm for Indian context (INR values)
    let score = 60; // Base score
    
    const monthlyEarnings = parseFloat(data.monthly_earnings) || 0;
    const activeDays = parseFloat(data.active_days_per_month) || 0;
    const rating = data.avg_rating;
    const earningsPerDay = parseFloat(data.earnings_per_active_day) || 0;
    const cancellationRate = parseFloat(data.cancellation_rate) || 0;
    
    // Earnings stability (adjusted for Indian market - INR values)
    if (monthlyEarnings > 25000) score += 15; // ₹25,000+
    else if (monthlyEarnings > 18000) score += 12; // ₹18,000+
    else if (monthlyEarnings > 12000) score += 8; // ₹12,000+
    else if (monthlyEarnings > 8000) score += 4; // ₹8,000+
    
    // Active days (consistency)
    if (activeDays >= 25) score += 12;
    else if (activeDays >= 20) score += 10;
    else if (activeDays >= 15) score += 7;
    else if (activeDays >= 10) score += 4;
    
    // Customer rating
    if (rating >= 4.8) score += 12;
    else if (rating >= 4.5) score += 8;
    else if (rating >= 4.0) score += 4;
    else score -= 5;
    
    // Earnings per day efficiency (INR)
    if (earningsPerDay > 1200) score += 8; // ₹1,200+/day
    else if (earningsPerDay > 800) score += 5; // ₹800+/day
    else if (earningsPerDay > 500) score += 2; // ₹500+/day
    
    // Cancellation rate (penalty)
    if (cancellationRate < 2) score += 5;
    else if (cancellationRate > 8) score -= 10;
    else if (cancellationRate > 5) score -= 5;
    
    // City bonus (metro cities have higher earning potential)
    const metroCities = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai'];
    if (metroCities.includes(data.city)) score += 3;
    
    // Vehicle type bonus
    if (data.vehicle_type === 'Car') score += 2;
    else if (data.vehicle_type === 'Bike') score += 1;
    
    // Monthly trend analysis
    const recentEarnings = [
      parseFloat(data.earnings_m1) || 0,
      parseFloat(data.earnings_m2) || 0,
      parseFloat(data.earnings_m3) || 0
    ];
    const avgRecent = recentEarnings.reduce((a, b) => a + b, 0) / 3;
    if (avgRecent > monthlyEarnings) score += 5; // Growing trend
    
    // Cap the score
    score = Math.max(10, Math.min(100, score));
    
    // Determine top features and explanations
    const topFeatures = [];
    
    if (monthlyEarnings > 20000) {
      topFeatures.push({
        name: 'Strong Monthly Earnings',
        value: `₹${monthlyEarnings.toLocaleString('en-IN')}`,
        impact: 'positive' as const,
        explanation: 'Your consistent monthly income shows financial stability and strong earning potential in the Indian gig economy.'
      });
    }
    
    if (rating >= 4.5) {
      topFeatures.push({
        name: 'Excellent Customer Rating',
        value: `${rating}/5.0 ⭐`,
        impact: 'positive' as const,
        explanation: 'High ratings demonstrate reliability and quality service delivery.'
      });
    }
    
    if (cancellationRate > 5) {
      topFeatures.push({
        name: 'Cancellation Rate',
        value: `${cancellationRate}%`,
        impact: 'negative' as const,
        explanation: 'Reducing cancellations will improve your reliability score and boost Nova Score.'
      });
    } else {
      topFeatures.push({
        name: 'Low Cancellation Rate',
        value: `${cancellationRate}%`,
        impact: 'positive' as const,
        explanation: 'Your commitment to completing jobs shows excellent reliability.'
      });
    }
    
    if (activeDays >= 20) {
      topFeatures.push({
        name: 'High Activity Level',
        value: `${activeDays} days/month`,
        impact: 'positive' as const,
        explanation: 'Regular activity demonstrates commitment and consistent income generation.'
      });
    }
    
    // Generate suggestions for improvement
    const suggestions = [];
    if (monthlyEarnings < 20000) {
      suggestions.push("Increase your monthly earnings by working more active days or optimizing your routes for higher efficiency.");
    }
    if (cancellationRate > 3) {
      suggestions.push("Reduce your cancellation rate by better planning and accepting only orders you can complete.");
    }
    if (rating < 4.5) {
      suggestions.push("Improve customer service to boost your ratings - be punctual, polite, and maintain vehicle cleanliness.");
    }
    if (activeDays < 20) {
      suggestions.push("Increase your active working days to show more consistency and reliability to lenders.");
    }
    if (earningsPerDay < 1000) {
      suggestions.push("Focus on peak hours and high-demand areas to increase your daily earnings efficiency.");
    }
    
    // Generate recommendation
    let recommendation = '';
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    
    if (score >= 80) {
      recommendation = "Excellent! You're highly creditworthy with strong earning patterns and reliability. You qualify for premium financial products and the best rates.";
      riskLevel = 'low';
    } else if (score >= 65) {
      recommendation = "Good score! You show solid earning potential. Consider increasing your active days or maintaining your current rating to reach the next tier.";
      riskLevel = 'low';
    } else if (score >= 50) {
      recommendation = "Fair score with room for improvement. Focus on earnings consistency and reducing cancellations to boost your Nova Score.";
      riskLevel = 'medium';
    } else {
      recommendation = "Your score shows potential but needs improvement. Increase your monthly earnings and reduce cancellation rates to access better financial opportunities.";
      riskLevel = 'high';
    }
    
    // Loan giver ranges
    const loanGiverRanges = {
      excellent: "80-100: Premium borrower - minimal documentation",
      good: "65-79: Good borrower - regular documentation",
      fair: "50-64: Fair borrower - additional verification required",
      poor: "Below 50: High-risk borrower - extensive documentation needed"
    };
    
    return {
      score,
      topFeatures: topFeatures.slice(0, 3),
      recommendation,
      riskLevel,
      suggestions: suggestions.slice(0, 3),
      loanGiverRanges
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields: (keyof FormData)[] = [
      'monthly_earnings', 'active_days_per_month', 'earnings_per_active_day',
      'cancellation_rate', 'earnings_avg_6mo', 'earnings_avg_3mo',
      'earnings_m1', 'earnings_m2', 'earnings_m3', 'earnings_m4', 'earnings_m5', 'earnings_m6',
      'trips_m4', 'trips_m5', 'city', 'vehicle_type'
    ];
    
    const errors = new Set<string>();
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field] === '') {
        errors.add(field);
      }
    });
    
    if (errors.size > 0) {
      setFieldErrors(errors);
      triggerIconAnimation('alert', 'bounce');
      toast({
        title: "Please fill in all required fields",
        description: "All fields marked with * are required for accurate scoring.",
        variant: "destructive"
      });
      return;
    }
    
    triggerIconAnimation('calculate', 'spin');
    setIsLoading(true);
    
    try {
      // Call the real API
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const apiResult = await response.json();
      
      // Transform API response to match our interface
      const calculatedResult: ScoreResult = {
        score: apiResult.score,
        topFeatures: apiResult.top_features || [],
        recommendation: apiResult.recommendation,
        riskLevel: apiResult.risk_level,
        suggestions: apiResult.suggestions || [],
        loanGiverRanges: apiResult.loan_giver_ranges || {
          excellent: "80-100: Premium borrower - minimal documentation",
          good: "65-79: Good borrower - regular documentation",
          fair: "50-64: Fair borrower - additional verification required",
          poor: "Below 50: High-risk borrower - extensive documentation needed"
        }
      };
      
      setResult(calculatedResult);
      setIsLoading(false);
      setShowForm(false);
      
      toast({
        title: "Nova Score calculated! 🎉",
        description: `Your score: ${calculatedResult.score}/100`,
      });
      
    } catch (error) {
      console.error('API Error:', error);
      setIsLoading(false);
      
      // Fallback to mock calculation if API fails
      toast({
        title: "API temporarily unavailable",
        description: "Using fallback calculation. Please ensure backend servers are running.",
        variant: "destructive"
      });
      
      const calculatedResult = calculateNovaScore(formData);
      setResult(calculatedResult);
      setShowForm(false);
    }
  };

  const resetForm = () => {
    setShowForm(true);
    setResult(null);
    setFormData({
      monthly_earnings: '',
      active_days_per_month: '',
      avg_rating: 4.5,
      earnings_avg_6mo: '',
      earnings_avg_3mo: '',
      earnings_per_active_day: '',
      earnings_m1: '',
      earnings_m2: '',
      earnings_m3: '',
      earnings_m4: '',
      earnings_m5: '',
      earnings_m6: '',
      trips_m4: '',
      trips_m5: '',
      cancellation_rate: '',
      city: '',
      vehicle_type: ''
    });
  };

  if (!showForm && result) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 page-transition-enter page-transition-enter-active">
        {/* Score Display */}
        <Card className="nova-card card-interactive p-8 text-center stagger-item">
          <div className="space-y-6">
            <div className="flex justify-center">
              <NovaScore score={result.score} size="lg" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gradient-primary">
                Your Nova Score Results
              </h3>
              <p className="text-lg text-muted-enhanced max-w-2xl mx-auto font-medium">
                {result.recommendation}
              </p>
            </div>
          </div>
        </Card>

        {/* Top Features Analysis
        <Card className="nova-card p-6 stagger-item">
          <h4 className="text-xl font-semibold mb-6 flex items-center">
            <Target className={`w-6 h-6 mr-2 text-primary icon-hover ${getIconClasses('target', 'pulse')}`} />
            Key Factors Influencing Your Score
          </h4>
          
          <div className="grid md:grid-cols-3 gap-4">
            {result.topFeatures.map((feature, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 transition-all duration-300 hover:scale-105 hover:shadow-md stagger-item ${
                  feature.impact === 'positive'
                    ? 'border-success bg-success/5 hover:bg-success/10'
                    : feature.impact === 'negative'
                    ? 'border-error bg-error/5 hover:bg-error/10'
                    : 'border-warning bg-warning/5 hover:bg-warning/10'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-sm">{feature.name}</h5>
                  {feature.impact === 'positive' ? (
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 icon-hover" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-error flex-shrink-0 icon-hover" />
                  )}
                </div>
                <p className="text-xl font-bold mb-2">{feature.value}</p>
                <p className="text-sm text-muted-foreground">{feature.explanation}</p>
              </div>
            ))}
          </div>
        </Card> */}

        {/* Improvement Suggestions */}
        {result.suggestions && result.suggestions.length > 0 && (
          <Card className="nova-card p-6 stagger-item">
            <h4 className="text-xl font-semibold mb-6 flex items-center">
              <Lightbulb className={`w-6 h-6 mr-2 text-primary icon-hover ${getIconClasses('lightbulb', 'pulse')}`} />
              Suggestions to Improve Your Nova Score
            </h4>
            
            <div className="space-y-4">
              {result.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400 transition-all duration-300 hover:bg-blue-100 stagger-item"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-400 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-blue-800 font-medium">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Loan Giver Score Ranges */}
        {result.loanGiverRanges && (
          <Card className="nova-card p-6 stagger-item">
            <h4 className="text-xl font-semibold mb-6 flex items-center">
              <TrendingUp className={`w-6 h-6 mr-2 text-primary icon-hover ${getIconClasses('ranges', 'bounce')}`} />
              Nova Score Ranges for Lenders
            </h4>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-500">
                <h5 className="font-semibold text-green-800 mb-2">Excellent (80-100)</h5>
                <p className="text-sm text-green-700">{result.loanGiverRanges.excellent}</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                <h5 className="font-semibold text-blue-800 mb-2">Good (65-79)</h5>
                <p className="text-sm text-blue-700">{result.loanGiverRanges.good}</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-500">
                <h5 className="font-semibold text-yellow-800 mb-2">Fair (50-64)</h5>
                <p className="text-sm text-yellow-700">{result.loanGiverRanges.fair}</p>
              </div>
              <div className="p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
                <h5 className="font-semibold text-red-800 mb-2">Poor (Below 50)</h5>
                <p className="text-sm text-red-700">{result.loanGiverRanges.poor}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center stagger-item">
          <Button
            variant="nova"
            size="lg"
            onClick={() => {
              triggerIconAnimation('reset', 'spin');
              resetForm();
            }}
            className="group"
          >
            Calculate Another Score
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => triggerIconAnimation('arrow', 'bounce')}
            className="group"
          >
            Apply for Financial Products
            <ArrowRight className={`w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 ${getIconClasses('arrow', 'bounce')}`} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto page-transition-enter page-transition-enter-active">
      <div className="text-center mb-8 fade-in-up">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-enhanced">
          Get Your <span className="text-gradient-primary">Nova Score</span>
        </h3>
        <p className="text-lg text-muted-enhanced max-w-2xl mx-auto mb-6 font-medium">
          Enter your gig work details to receive your personalized Nova Score.
          All calculations are done securely and transparently. Values in Indian Rupees (₹).
        </p>
        
        <Button
          variant="accent"
          onClick={loadDemoData}
          className="mb-6 group"
        >
          <Sparkles className={`w-4 h-4 mr-2 transition-transform group-hover:rotate-12 ${getIconClasses('sparkles', 'spin')}`} />
          Use Demo Data
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Location and Vehicle Information */}
        <Card className="nova-card card-interactive p-6 slide-up stagger-item">
          <h4 className="text-xl font-bold mb-6 flex items-center text-enhanced">
            <MapPin className={`w-6 h-6 mr-2 text-primary icon-hover ${getIconClasses('location', 'bounce')}`} />
            Location & Vehicle Details
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`space-y-2 field-focus ${fieldErrors.has('city') ? 'field-error' : ''}`}>
              <Label htmlFor="city" className="flex items-center">
                City *
                <Info className="w-4 h-4 ml-1 text-muted-foreground icon-hover" />
              </Label>
              <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                <SelectTrigger className={`text-lg transition-all duration-200 ${fieldErrors.has('city') ? 'border-error ring-error/20' : ''}`}>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                  {/* <SelectItem value="Pune">Pune</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Ahmedabad">Ahmedabad</SelectItem> */}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-enhanced font-medium">Your primary working city</p>
            </div>

            <div className={`space-y-2 field-focus ${fieldErrors.has('vehicle_type') ? 'field-error' : ''}`}>
              <Label htmlFor="vehicle_type" className="flex items-center">
                Vehicle Type *
                <Car className="w-4 h-4 ml-1 text-muted-foreground icon-hover" />
              </Label>
              <Select value={formData.vehicle_type} onValueChange={(value) => handleInputChange('vehicle_type', value)}>
                <SelectTrigger className={`text-lg transition-all duration-200 ${fieldErrors.has('vehicle_type') ? 'border-error ring-error/20' : ''}`}>
                  <SelectValue placeholder="Select your vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bike">🏍️ Bike/Motorcycle</SelectItem>
                  <SelectItem value="Car">🚗 Car</SelectItem>
                  <SelectItem value="Auto">🛺 Auto Rickshaw</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-enhanced font-medium">Primary vehicle used for gig work</p>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="nova-card card-interactive p-6 slide-up stagger-item">
          <h4 className="text-xl font-bold mb-6 flex items-center text-enhanced">
            <DollarSign className={`w-6 h-6 mr-2 text-primary icon-hover ${getIconClasses('dollar', 'bounce')}`} />
            Basic Earnings Information (₹ INR)
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`space-y-2 field-focus ${fieldErrors.has('monthly_earnings') ? 'field-error' : ''}`}>
              <Label htmlFor="monthly_earnings" className="flex items-center">
                Monthly Earnings (₹) *
                <Info className="w-4 h-4 ml-1 text-muted-foreground icon-hover" />
              </Label>
              <Input
                id="monthly_earnings"
                type="number"
                placeholder="28500"
                value={formData.monthly_earnings}
                onChange={(e) => handleInputChange('monthly_earnings', e.target.value)}
                className={`text-lg transition-all duration-200 ${fieldErrors.has('monthly_earnings') ? 'border-error ring-error/20' : ''}`}
                required
              />
              <p className="text-sm text-muted-enhanced font-medium">Your typical monthly income from gig work in Indian Rupees</p>
            </div>

            <div className={`space-y-2 field-focus ${fieldErrors.has('active_days_per_month') ? 'field-error' : ''}`}>
              <Label htmlFor="active_days">Active Days per Month *</Label>
              <Input
                id="active_days"
                type="number"
                placeholder="24"
                value={formData.active_days_per_month}
                onChange={(e) => handleInputChange('active_days_per_month', e.target.value)}
                className={`text-lg transition-all duration-200 ${fieldErrors.has('active_days_per_month') ? 'border-error ring-error/20' : ''}`}
                required
              />
              <p className="text-sm text-muted-enhanced font-medium">How many days you work in an average month</p>
            </div>

            <div className={`space-y-2 field-focus ${fieldErrors.has('earnings_per_active_day') ? 'field-error' : ''}`}>
              <Label htmlFor="earnings_per_day">Earnings per Active Day (₹) *</Label>
              <Input
                id="earnings_per_day"
                type="number"
                placeholder="1187"
                value={formData.earnings_per_active_day}
                onChange={(e) => handleInputChange('earnings_per_active_day', e.target.value)}
                className={`text-lg transition-all duration-200 ${fieldErrors.has('earnings_per_active_day') ? 'border-error ring-error/20' : ''}`}
                required
              />
              <p className="text-sm text-muted-enhanced font-medium">Average daily earnings when you work (in ₹)</p>
            </div>

            <div className={`space-y-2 field-focus ${fieldErrors.has('cancellation_rate') ? 'field-error' : ''}`}>
              <Label htmlFor="cancellation_rate">Cancellation Rate (%) *</Label>
              <Input
                id="cancellation_rate"
                type="number"
                step="0.1"
                placeholder="3.2"
                value={formData.cancellation_rate}
                onChange={(e) => handleInputChange('cancellation_rate', e.target.value)}
                className={`text-lg transition-all duration-200 ${fieldErrors.has('cancellation_rate') ? 'border-error ring-error/20' : ''}`}
                required
              />
              <p className="text-sm text-muted-enhanced font-medium">Percentage of jobs you've cancelled</p>
            </div>
          </div>
        </Card>

        {/* Service Quality */}
        <Card className="nova-card card-interactive p-6 slide-up stagger-item">
          <h4 className="text-xl font-semibold mb-6 flex items-center">
            <Star className={`w-6 h-6 mr-2 text-primary icon-hover ${getIconClasses('star', 'pulse')}`} />
            Service Quality
          </h4>
          
          <div className="space-y-4">
            <Label>Average Customer Rating: {formData.avg_rating}/5.0</Label>
            <div className="px-4">
              <Slider
                value={[formData.avg_rating]}
                onValueChange={(value) => handleInputChange('avg_rating', value[0])}
                max={5}
                min={1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>1.0 ⭐</span>
                <span>3.0 ⭐⭐⭐</span>
                <span>5.0 ⭐⭐⭐⭐⭐</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Monthly Trends */}
        <Card className="nova-card card-interactive p-6 slide-up stagger-item">
          <h4 className="text-xl font-semibold mb-6 flex items-center">
            <TrendingUp className={`w-6 h-6 mr-2 text-primary icon-hover ${getIconClasses('trending', 'bounce')}`} />
            Monthly Earnings Trends (₹ INR)
          </h4>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className={`space-y-2 field-focus ${fieldErrors.has('earnings_avg_6mo') ? 'field-error' : ''}`}>
              <Label htmlFor="earnings_avg_6mo">6-Month Average (₹) *</Label>
              <Input
                id="earnings_avg_6mo"
                type="number"
                placeholder="27800"
                value={formData.earnings_avg_6mo}
                onChange={(e) => handleInputChange('earnings_avg_6mo', e.target.value)}
                className={`transition-all duration-200 ${fieldErrors.has('earnings_avg_6mo') ? 'border-error ring-error/20' : ''}`}
                required
              />
            </div>

            <div className={`space-y-2 field-focus ${fieldErrors.has('earnings_avg_3mo') ? 'field-error' : ''}`}>
              <Label htmlFor="earnings_avg_3mo">3-Month Average (₹) *</Label>
              <Input
                id="earnings_avg_3mo"
                type="number"
                placeholder="29200"
                value={formData.earnings_avg_3mo}
                onChange={(e) => handleInputChange('earnings_avg_3mo', e.target.value)}
                className={`transition-all duration-200 ${fieldErrors.has('earnings_avg_3mo') ? 'border-error ring-error/20' : ''}`}
                required
              />
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <h5 className="font-medium md:col-span-3 mb-2">Individual Month Earnings (₹) *</h5>
            {[1, 2, 3, 4, 5, 6].map((month) => (
              <div key={month} className={`space-y-1 field-focus ${fieldErrors.has(`earnings_m${month}` as keyof FormData) ? 'field-error' : ''}`}>
                <Label htmlFor={`earnings_m${month}`} className="text-sm">
                  Month {month} Ago (₹) *
                </Label>
                <Input
                  id={`earnings_m${month}`}
                  type="number"
                  placeholder={month <= 3 ? "29000" : "26000"}
                  value={formData[`earnings_m${month}` as keyof FormData]}
                  onChange={(e) => handleInputChange(`earnings_m${month}` as keyof FormData, e.target.value)}
                  className={`text-sm transition-all duration-200 ${fieldErrors.has(`earnings_m${month}` as keyof FormData) ? 'border-error ring-error/20' : ''}`}
                  required
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Metrics */}
        <Card className="nova-card card-interactive p-6 slide-up stagger-item">
          <h4 className="text-xl font-semibold mb-6 flex items-center">
            <Calendar className={`w-6 h-6 mr-2 text-primary icon-hover ${getIconClasses('calendar', 'spin')}`} />
            Activity Metrics
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`space-y-2 field-focus ${fieldErrors.has('trips_m4') ? 'field-error' : ''}`}>
              <Label htmlFor="trips_m4">Trips/Orders (4 Months Ago) *</Label>
              <Input
                id="trips_m4"
                type="number"
                placeholder="180"
                value={formData.trips_m4}
                onChange={(e) => handleInputChange('trips_m4', e.target.value)}
                className={`transition-all duration-200 ${fieldErrors.has('trips_m4') ? 'border-error ring-error/20' : ''}`}
                required
              />
              <p className="text-sm text-muted-enhanced font-medium">Number of completed trips/orders</p>
            </div>

            <div className={`space-y-2 field-focus ${fieldErrors.has('trips_m5') ? 'field-error' : ''}`}>
              <Label htmlFor="trips_m5">Trips/Orders (5 Months Ago) *</Label>
              <Input
                id="trips_m5"
                type="number"
                placeholder="190"
                value={formData.trips_m5}
                onChange={(e) => handleInputChange('trips_m5', e.target.value)}
                className={`transition-all duration-200 ${fieldErrors.has('trips_m5') ? 'border-error ring-error/20' : ''}`}
                required
              />
              <p className="text-sm text-muted-enhanced font-medium">Number of completed trips/orders</p>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="text-center stagger-item">
          <Button
            type="submit"
            variant="hero"
            size="xl"
            disabled={isLoading}
            className="min-w-64 group"
            onClick={() => !isLoading && triggerIconAnimation('calculate', 'spin')}
          >
            {isLoading ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2 text-white" />
                <span className="loading-dots mr-2">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                Calculating Your Nova Score...
              </div>
            ) : (
              <>
                Calculate My Nova Score
                <ArrowRight className={`w-6 h-6 ml-2 transition-transform group-hover:translate-x-1 ${getIconClasses('calculate', 'spin')}`} />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NovaScoreForm;