# Nova Gig Score - Full Stack ML Application

A complete full-stack application that connects an XGBoost machine learning model with a React TypeScript frontend using FastAPI and Node.js.

## Architecture Overview

```
Frontend (React/TSX) → Node.js Middleware → FastAPI Backend → XGBoost Model
     Port 5173            Port 3001           Port 8000        ML Models
```

## Project Structure

```
nova-gig-score/
├── Frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── NovaScoreForm.tsx
│   │   └── ...
│   └── package.json
├── Backend/                  # FastAPI + Node.js backend
│   ├── main.py              # FastAPI server
│   ├── server.js            # Node.js middleware
│   ├── requirements.txt     # Python dependencies
│   └── package.json         # Node.js dependencies
├── ML_Models/               # Machine learning models
│   ├── xgb_tuned.joblib    # Trained XGBoost model
│   ├── feature_columns.joblib # Feature column names
│   └── load.py             # Model loading script
└── README.md
```

## Features

- **Real-time ML Predictions**: XGBoost model serves credit score predictions
- **Modern Frontend**: React with TypeScript and Tailwind CSS
- **Robust Backend**: FastAPI for ML serving + Node.js for middleware
- **Error Handling**: Comprehensive error handling and fallback mechanisms
- **CORS Support**: Proper cross-origin resource sharing configuration
- **Health Checks**: Built-in health monitoring endpoints

## Prerequisites

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** (for cloning)

## Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd nova-gig-score
```

### 2. Install Dependencies

#### Python Dependencies (FastAPI Backend)
```bash
cd Backend
pip install -r requirements.txt
cd ..
```

#### Node.js Dependencies (Middleware)
```bash
cd Backend
npm install
cd ..
```

#### Frontend Dependencies
```bash
cd Frontend
npm install
cd ..
```

### 3. Start All Services

#### Option A: Manual Start (Recommended for Development)

**Terminal 1 - FastAPI Backend:**
```bash
cd Backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Node.js Middleware:**
```bash
cd Backend
npm run dev
```

**Terminal 3 - React Frontend:**
```bash
cd Frontend
npm run dev
```

#### Option B: Using Concurrently (Backend Only)
```bash
cd Backend
npm run start-all
```

Then start the frontend separately:
```bash
cd Frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Node.js API**: http://localhost:3001
- **FastAPI Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:3001/health

## API Endpoints

### Node.js Middleware (Port 3001)

- `GET /health` - Health check for all services
- `POST /api/predict` - Nova Score prediction
- `GET /api/features` - Get model feature list

### FastAPI Backend (Port 8000)

- `GET /health` - FastAPI health check
- `POST /predict` - Direct model prediction
- `GET /features` - Model features
- `GET /docs` - Interactive API documentation

## Usage Example

### Frontend Form Data
The frontend collects the following data:
- Monthly earnings
- Active days per month
- Average customer rating
- Earnings history (6 months)
- Trip counts
- Cancellation rate

### API Request Example
```javascript
const response = await fetch('http://localhost:3001/api/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    monthly_earnings: 3500,
    active_days_per_month: 22,
    avg_rating: 4.7,
    earnings_avg_6mo: 3400,
    earnings_avg_3mo: 3600,
    earnings_per_active_day: 159,
    earnings_m1: 3800,
    earnings_m2: 3600,
    earnings_m3: 3400,
    earnings_m4: 3200,
    earnings_m5: 3300,
    earnings_m6: 3100,
    trips_m4: 180,
    trips_m5: 190,
    cancellation_rate: 2.3
  })
});
```

### API Response Example
```json
{
  "score": 78.5,
  "riskLevel": "low",
  "recommendation": "Excellent creditworthiness! You qualify for premium financial products.",
  "topFeatures": [
    {
      "name": "Monthly Earnings",
      "value": "3500",
      "impact": "positive",
      "explanation": "Strong earnings indicate good income stability"
    }
  ],
  "modelConfidence": 87.2
}
```

## Development

### Adding New Features

1. **ML Model Changes**: Update `ML_Models/` and modify feature processing in `Backend/main.py`
2. **API Changes**: Modify `Backend/main.py` (FastAPI) and `Backend/server.js` (Node.js)
3. **Frontend Changes**: Update React components in `Frontend/src/components/`

### Environment Variables

Create `.env` files for configuration:

**Backend/.env**
```
FASTAPI_URL=http://localhost:8000
PORT=3001
```

**Frontend/.env**
```
VITE_API_URL=http://localhost:3001
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes on specific ports
   npx kill-port 3000 3001 8000
   ```

2. **Python Dependencies**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r Backend/requirements.txt
   ```

3. **CORS Issues**
   - Ensure all origins are properly configured in both FastAPI and Node.js
   - Check browser console for specific CORS errors

4. **Model Loading Issues**
   - Verify `ML_Models/xgb_tuned.joblib` and `ML_Models/feature_columns.joblib` exist
   - Check file paths in `Backend/main.py`

### Health Checks

```bash
# Check all services
curl http://localhost:3001/health

# Check FastAPI directly
curl http://localhost:8000/health

# Check model features
curl http://localhost:3001/api/features
```

## Production Deployment

### Docker Setup (Optional)

Create `Dockerfile` for each service:

**Backend/Dockerfile**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment-Specific Configuration

- **Development**: Use `npm run dev` and `--reload` flags
- **Production**: Use `npm start` and remove `--reload`
- **Staging**: Configure appropriate CORS origins

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit a pull request

## License

MIT License - see LICENSE file for details.