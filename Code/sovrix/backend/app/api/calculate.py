from fastapi import APIRouter
from app.schemas.schemas import CalculationRequest, CalculationResponse
from app.services.calculation.calc_engine import calc_engine

router = APIRouter(prefix="/calculate", tags=["Deterministic Calculation Engine"])

@router.post("", response_model=CalculationResponse)
def execute_calculation(payload: CalculationRequest):
    return calc_engine.compute(
        expression=payload.expression,
        variables=payload.variables,
        unit=payload.unit
    )
