import pytest
from app.db.session import SessionLocal
from app.main import seed_initial_data
from app.services.agent.agent_runtime import agent_runtime

@pytest.mark.asyncio
async def test_agent_execution_scenario_1():
    seed_initial_data()
    db = SessionLocal()
    try:
        prompt = "Analyze inspection report IR-2026-8924 for CDU-101 and generate an approval note."
        result = await agent_runtime.execute_task(db=db, prompt=prompt)
        assert result.status == "SUCCESS"
        assert len(result.steps) >= 5
        assert result.external_calls_prevented > 0
        assert result.results_summary is not None
    finally:
        db.close()
