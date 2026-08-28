from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class EvidenceRecord(BaseModel):
    id: str
    title: str
    source_type: str = Field(..., description="FIR, CDR_LOG, BANK_STATEMENT, SEIZURE_MEMO, PUBLIC_REGISTRY, WITNESS_STATEMENT")
    file_name: Optional[str] = None
    content_snippet: str
    source_uri: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    extraction_method: str = "Automated Document NLP"
    confidence: float = 0.95
    verification_status: str = "Verified"
    sha256_hash: str
    extracted_entities: list[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EvidenceVerificationResult(BaseModel):
    evidence_id: str
    computed_hash: str
    stored_hash: str
    is_valid: bool
    tampered: bool
    verification_timestamp: datetime = Field(default_factory=datetime.utcnow)
