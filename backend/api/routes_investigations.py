from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from datetime import datetime
from backend.models.investigation_models import Investigation, InvestigationCreate
from backend.agents.orchestrator_mock import investigation_orchestrator

router = APIRouter(prefix="/investigations", tags=["Investigations"])

# In-memory investigation storage
investigations_db: Dict[str, Investigation] = {}

@router.post("", response_model=Investigation)
def create_investigation(payload: InvestigationCreate):
    inv_id = f"inv_{int(datetime.utcnow().timestamp())}"
    inv = investigation_orchestrator.run_investigation(
        investigation_id=inv_id,
        case_id=payload.case_id or "C104",
        query=payload.query
    )
    investigations_db[inv_id] = inv
    return inv

@router.get("", response_model=List[Investigation])
def list_investigations():
    return list(investigations_db.values())

@router.get("/{investigation_id}", response_model=Investigation)
def get_investigation(investigation_id: str):
    if investigation_id not in investigations_db:
        # Generate on the fly if not found
        inv = investigation_orchestrator.run_investigation(
            investigation_id=investigation_id,
            case_id="C104",
            query="Investigate how Case C104 is connected to Network N7"
        )
        investigations_db[investigation_id] = inv
        return inv
    return investigations_db[investigation_id]
