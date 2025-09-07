const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:8080', 'http://127.0.0.1:8081'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/health`);
    res.json({
      status: 'healthy',
      node_server: 'running',
      fastapi_server: response.data
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      node_server: 'running',
      fastapi_server: 'unreachable',
      error: error.message
    });
  }
});

// Nova Score prediction endpoint
app.post('/api/predict', async (req, res) => {
  try {
    console.log('Received prediction request:', req.body);
    
    // Validate required fields
    const requiredFields = [
      'monthly_earnings', 'active_days_per_month', 'avg_rating',
      'earnings_avg_6mo', 'earnings_avg_3mo', 'earnings_per_active_day',
      'earnings_m1', 'earnings_m2', 'earnings_m3', 'earnings_m4',
      'earnings_m5', 'earnings_m6', 'trips_m4', 'trips_m5', 'cancellation_rate'
    ];
    
    const missingFields = requiredFields.filter(field => 
      req.body[field] === undefined || req.body[field] === null || req.body[field] === ''
    );
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missing_fields: missingFields
      });
    }
    
    // Transform data to match FastAPI expectations
    const transformedData = {
      monthly_earnings: parseFloat(req.body.monthly_earnings),
      active_days_per_month: parseInt(req.body.active_days_per_month),
      avg_rating: parseFloat(req.body.avg_rating),
      earnings_avg_6mo: parseFloat(req.body.earnings_avg_6mo),
      earnings_avg_3mo: parseFloat(req.body.earnings_avg_3mo),
      earnings_per_active_day: parseFloat(req.body.earnings_per_active_day),
      earnings_m1: parseFloat(req.body.earnings_m1),
      earnings_m2: parseFloat(req.body.earnings_m2),
      earnings_m3: parseFloat(req.body.earnings_m3),
      earnings_m4: parseFloat(req.body.earnings_m4),
      earnings_m5: parseFloat(req.body.earnings_m5),
      earnings_m6: parseFloat(req.body.earnings_m6),
      trips_m4: parseInt(req.body.trips_m4),
      trips_m5: parseInt(req.body.trips_m5),
      cancellation_rate: parseFloat(req.body.cancellation_rate)
    };
    
    console.log('Transformed data:', transformedData);
    
    // Forward request to FastAPI
    const response = await axios.post(`${FASTAPI_URL}/predict`, transformedData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    console.log('FastAPI response:', response.data);
    
    // Transform response to match frontend expectations
    const transformedResponse = {
      score: response.data.score,
      topFeatures: response.data.top_features.map(feature => ({
        name: feature.name,
        value: typeof feature.value === 'number' ? feature.value.toString() : feature.value.toString(),
        impact: feature.impact,
        explanation: feature.explanation
      })),
      recommendation: response.data.recommendation,
      riskLevel: response.data.risk_level,
      modelConfidence: response.data.model_confidence
    };
    
    res.json(transformedResponse);
    
  } catch (error) {
    console.error('Prediction error:', error.message);
    
    if (error.response) {
      // FastAPI returned an error
      res.status(error.response.status).json({
        error: 'Prediction failed',
        details: error.response.data,
        fastapi_error: true
      });
    } else if (error.request) {
      // FastAPI server is unreachable
      res.status(503).json({
        error: 'FastAPI server unreachable',
        details: 'Please ensure the FastAPI server is running on port 8000',
        fastapi_error: true
      });
    } else {
      // Other error
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }
});

// Get model features endpoint
app.get('/api/features', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/features`);
    res.json(response.data);
  } catch (error) {
    console.error('Features error:', error.message);
    res.status(500).json({
      error: 'Failed to get model features',
      details: error.message
    });
  }
});

// Proxy other requests to FastAPI
app.use('/api', createProxyMiddleware({
  target: FASTAPI_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api prefix when forwarding to FastAPI
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({
      error: 'Proxy error',
      details: err.message
    });
  }
}));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Node.js middleware server running on port ${PORT}`);
  console.log(`Proxying requests to FastAPI server at ${FASTAPI_URL}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;