from enum import Enum
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class RelationType(str, Enum):
    USES = "USES"
    OWNS = "OWNS"
    COMMUNICATED_WITH = "COMMUNICATED_WITH"
    TRANSFERRED_TO = "TRANSFERRED_TO"
    VISITED = "VISITED"
    LOCATED_AT = "LOCATED_AT"
    OWNS_VEHICLE = "OWNS_VEHICLE"
    INVOLVED_IN = "INVOLVED_IN"
    ASSOCIATED_WITH = "ASSOCIATED_WITH"
    MENTIONED_IN = "MENTIONED_IN"
    RELATED_TO = "RELATED_TO"
    OCCURRED_AT = "OCCURRED_AT"
    EVIDENCE_FOR = "EVIDENCE_FOR"

class VerificationStatus(str, Enum):
    VERIFIED = "Verified"
    PENDING_REVIEW = "Pending Review"
    UNCORROBORATED = "Uncorroborated"
    DISPUTED = "Disputed"

class BaseEdge(BaseModel):
    id: str = Field(..., description="Unique edge identifier")
    source: str = Field(..., description="Source node ID")
    target: str = Field(..., description="Target node ID")
    type: RelationType = Field(..., description="Relationship type")
    label: Optional[str] = Field(None, description="Display label for edge")
    properties: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary edge properties (e.g. amount, duration)")
    
    # Provenance & Metadata
    source_id: Optional[str] = Field(None, description="Originating document/source ID")
    evidence_id: Optional[str] = Field(None, description="Linked evidence record ID")
    timestamp: Optional[datetime] = Field(None, description="When the real-world interaction occurred")
    confidence: float = Field(default=1.0, ge=0.0, le=1.0, description="Extraction confidence (0.0 - 1.0)")
    extraction_method: str = Field(default="Structured Ingestion", description="Method used to establish this link")
    verification_status: VerificationStatus = Field(default=VerificationStatus.VERIFIED, description="Verification state")
    sha256_hash: Optional[str] = Field(None, description="Cryptographic tamper-check hash")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EdgeCreate(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    type: RelationType
    label: Optional[str] = None
    properties: Dict[str, Any] = Field(default_factory=dict)
    source_id: Optional[str] = None
    evidence_id: Optional[str] = None
    timestamp: Optional[datetime] = None
    confidence: Optional[float] = 1.0
    extraction_method: Optional[str] = "Structured Ingestion"
    verification_status: Optional[VerificationStatus] = VerificationStatus.VERIFIED
