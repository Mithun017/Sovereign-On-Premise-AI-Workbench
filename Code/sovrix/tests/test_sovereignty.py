import pytest
from app.services.sovereignty.monitor import sovereignty_monitor

def test_sovereignty_stats():
    stats = sovereignty_monitor.get_sovereignty_stats()
    assert stats.air_gapped is True
    assert stats.external_connections == 0
    assert stats.internet_requests == 0
    assert stats.cloud_ai_requests == 0
    assert "ZERO_EGRESS" in stats.firewall_status

def test_hardware_telemetry():
    telemetry = sovereignty_monitor.get_system_telemetry()
    assert telemetry.vram_total_gb == 48.0
    assert telemetry.gpu_name is not None
    assert telemetry.sovereignty.external_connections == 0
