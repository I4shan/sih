from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class ReportCitation(BaseModel):
    citation_id: str
    evidence_id: str
    source_title: str
    claim: str
    confidence: float
    hash_signature: str

class InvestigationReport(BaseModel):
    id: str
    investigation_id: str
    case_id: str = "C104"
    title: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    executive_summary: str
    methodology: str = "Evidence-backed Multi-Agent Graph Intelligence Pipeline"
    key_findings: List[str]
    suspect_profiles: List[Dict[str, Any]]
    discovered_paths: List[Dict[str, Any]]
    financial_analysis: Dict[str, Any]
    timeline_summary: List[Dict[str, Any]]
    evidence_citations: List[ReportCitation]
    limitations: List[str] = [
        "Network-risk signals assist investigative prioritization and do not constitute proof of guilt.",
        "All claims are linked to underlying verified sources with cryptographic hash integrity.",
        "Uncorroborated intelligence requires formal judicial verification."
    ]
    report_hash: str
