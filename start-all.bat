@echo off
echo Starting Nova Gig Score Full Stack Application...
echo.

echo Installing dependencies...
echo.

echo [1/3] Installing Python dependencies...
cd Backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing Python dependencies
    pause
    exit /b 1
)

echo [2/3] Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error installing Node.js dependencies
    pause
    exit /b 1
)

cd ..\Frontend
echo [3/3] Installing Frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error installing Frontend dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo Dependencies installed successfully!
echo.
echo Starting all services...
echo.

echo Opening 3 command windows:
echo - FastAPI Backend (Port 8000)
echo - Node.js Middleware (Port 3001)  
echo - React Frontend (Port 5173)
echo.

start "FastAPI Backend" cmd /k "cd Backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul

start "Node.js Middleware" cmd /k "cd Backend && npm run dev"
timeout /t 3 /nobreak >nul

start "React Frontend" cmd /k "cd Frontend && npm run dev"

echo.
echo All services are starting...
echo.
echo Access points:
echo - Frontend: http://localhost:5173
echo - API Health: http://localhost:3001/health
echo - FastAPI Docs: http://localhost:8000/docs
echo.
echo Press any key to exit this window...
pause >nul