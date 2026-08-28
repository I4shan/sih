from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class ToolCallLog(BaseModel):
    tool_name: str
    tool_input: Dict[str, Any] = Field(default_factory=dict)
    tool_output: Any = None
    execution_time_ms: float = 0.0

class AgentStep(BaseModel):
    step_index: int
    agent_name: str  # e.g., "Investigator Agent", "Graph Intelligence Agent", "Document Agent"
    thought: str
    action: str
    tool_call: Optional[ToolCallLog] = None
    status: str = "completed"  # pending, running, completed, error
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class InvestigationCreate(BaseModel):
    case_id: Optional[str] = "C104"
    title: str = "Investigation Query"
    query: str
    focus_entity_id: Optional[str] = None
    target_network_id: Optional[str] = None

class Investigation(BaseModel):
    id: str
    case_id: Optional[str] = "C104"
    title: str
    query: str
    status: str = "active"  # active, completed, archived
    steps: List[AgentStep] = Field(default_factory=list)
    key_entities: List[str] = Field(default_factory=list)
    findings_summary: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
