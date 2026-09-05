from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from backend.models.investigation_models import Investigation
from backend.agents.orchestrator_mock import investigation_orchestrator

router = APIRouter(prefix="/agent", tags=["Agentic Workflow"])

class AgentInvestigateRequest(BaseModel):
    case_id: str = "C104"
    query: str = "Find the strongest connections to Network N7 and identify key bridge nodes"
    focus_entity_id: Optional[str] = "person_rajiv_malhotra"

@router.post("/investigate", response_model=Investigation)
def run_agentic_investigation(payload: AgentInvestigateRequest):
    """
    Execute full multi-agent investigation pipeline:
    Investigator Agent -> Graph Intelligence Agent -> Data Acquisition Agent
    -> Document Agent -> Timeline Agent -> Report Agent.
    """
    inv_id = f"inv_{int(datetime.utcnow().timestamp())}"
    return investigation_orchestrator.run_investigation(
        investigation_id=inv_id,
        case_id=payload.case_id,
        query=payload.query
    )
