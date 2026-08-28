#!/bin/bash

echo "=========================================================="
echo "  PS26189: Agentic Graph Intelligence Platform (SIH 2026) "
echo "=========================================================="

# Trap SIGINT to gracefully terminate background processes
trap 'kill $(jobs -p)' EXIT

echo "[1/2] Starting FastAPI Backend on port 8000..."
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "[2/2] Starting React + Vite Frontend on port 5173..."
cd frontend && npm run dev -- --host &
FRONTEND_PID=$!

IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")

echo "----------------------------------------------------------"
echo "  Local Access:      http://localhost:5173"
echo "  LAN Teammates:     http://${IP}:5173"
echo "  Backend API:       http://${IP}:8000"
echo "  API Docs:          http://${IP}:8000/docs"
echo "----------------------------------------------------------"
echo "Press Ctrl+C to terminate both servers."

wait
