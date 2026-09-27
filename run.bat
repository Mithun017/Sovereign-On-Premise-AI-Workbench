@echo off
TITLE SOVRIX - Sovereign On-Premise AI Workbench Launcher
COLOR 0B

echo ===============================================================================
echo                SOVRIX - SOVEREIGN ON-PREMISE AI WORKBENCH
echo        "Private intelligence. Local execution. Zero external dependency."
echo ===============================================================================
echo.
echo [1/3] Initializing Sovereign Backend (FastAPI Air-Gapped Engine)...
start "SOVRIX Backend Engine (Port 8000)" cmd /k "cd /d %~dp0Code\sovrix\backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Initializing Web Console (React + TypeScript + Vite)...
start "SOVRIX Web Console (Port 5173)" cmd /k "cd /d %~dp0Code\sovrix\frontend && npm run dev"

echo [3/3] Waiting for services to initialize...
timeout /t 3 /nobreak >nul

echo.
echo ===============================================================================
echo  SOVRIX is running!
echo  - Web Application Console: http://localhost:5173
echo  - Backend API & Swagger:   http://localhost:8000/docs
echo  - Network Boundary:        AIR-GAPPED (Zero External Telemetry)
echo ===============================================================================
echo.
echo Launching your browser at http://localhost:5173...
start http://localhost:5173

echo.
echo Press any key to close this launcher window (services will continue running in background windows).
pause >nul
