from typing import List, Dict, Any
from fastapi import APIRouter
from app.schemas.schemas import SystemTelemetry, SovereigntyStats
from app.services.sovereignty.monitor import sovereignty_monitor

router = APIRouter(prefix="/system", tags=["System Telemetry & Sovereignty Monitor"])

@router.get("/status", response_model=SystemTelemetry)
def get_system_status():
    return sovereignty_monitor.get_system_telemetry()

@router.get("/network", response_model=SovereigntyStats)
def get_sovereignty_network_status():
    return sovereignty_monitor.get_sovereignty_stats()

@router.get("/events", response_model=List[Dict[str, Any]])
def get_network_events():
    return sovereignty_monitor.get_network_events()
