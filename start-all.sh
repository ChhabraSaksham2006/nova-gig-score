#!/bin/bash

echo "Starting Nova Gig Score Full Stack Application..."
echo

echo "Installing dependencies..."
echo

echo "[1/3] Installing Python dependencies..."
cd Backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error installing Python dependencies"
    exit 1
fi

echo "[2/3] Installing Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing Node.js dependencies"
    exit 1
fi

cd ../Frontend
echo "[3/3] Installing Frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing Frontend dependencies"
    exit 1
fi

cd ..

echo
echo "Dependencies installed successfully!"
echo
echo "Starting all services..."
echo

echo "Opening 3 terminal windows:"
echo "- FastAPI Backend (Port 8000)"
echo "- Node.js Middleware (Port 3001)"
echo "- React Frontend (Port 5173)"
echo

# Start FastAPI Backend
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="FastAPI Backend" -- bash -c "cd Backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000; exec bash"
elif command -v osascript &> /dev/null; then
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/Backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"'
else
    echo "Starting FastAPI in background..."
    cd Backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    cd ..
fi

sleep 3

# Start Node.js Middleware
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="Node.js Middleware" -- bash -c "cd Backend && npm run dev; exec bash"
elif command -v osascript &> /dev/null; then
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/Backend && npm run dev"'
else
    echo "Starting Node.js in background..."
    cd Backend && npm run dev &
    cd ..
fi

sleep 3

# Start React Frontend
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="React Frontend" -- bash -c "cd Frontend && npm run dev; exec bash"
elif command -v osascript &> /dev/null; then
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/Frontend && npm run dev"'
else
    echo "Starting React in background..."
    cd Frontend && npm run dev &
    cd ..
fi

echo
echo "All services are starting..."
echo
echo "Access points:"
echo "- Frontend: http://localhost:5173"
echo "- API Health: http://localhost:3001/health"
echo "- FastAPI Docs: http://localhost:8000/docs"
echo
echo "Press Ctrl+C to stop all services if running in background"

if ! command -v gnome-terminal &> /dev/null && ! command -v osascript &> /dev/null; then
    wait
fi