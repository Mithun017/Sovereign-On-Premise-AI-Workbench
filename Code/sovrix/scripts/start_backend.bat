@echo off
echo ====================================================
echo Starting SOVRIX Sovereign Backend on http://localhost:8000
echo AIR-GAP MODE: ENFORCED (Zero External Telemetry)
echo ====================================================
cd ..\backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
