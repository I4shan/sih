from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class NodeType(str, Enum):
    PERSON = "Person"
    ORGANIZATION = "Organization"
    PHONE = "Phone"
    EMAIL = "Email"
    DEVICE = "Device"
    BANK_ACCOUNT = "BankAccount"
    TRANSACTION = "Transaction"
    VEHICLE = "Vehicle"
    LOCATION = "Location"
    CASE = "Case"
    DOCUMENT = "Document"
    EVIDENCE = "Evidence"
    EVENT = "Event"

class BaseNode(BaseModel):
    id: str = Field(..., description="Unique entity identifier")
    type: NodeType = Field(..., description="Entity category/type")
    label: str = Field(..., description="Primary display label/name")
    properties: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary attributes")
    risk_score: float = Field(default=0.0, ge=0.0, le=100.0, description="Investigation priority score (0-100)")
    risk_factors: List[str] = Field(default_factory=list, description="Transparent explanations for risk score")
    tags: List[str] = Field(default_factory=list, description="Categorical tags/clusters")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class NodeCreate(BaseModel):
    id: Optional[str] = None
    type: NodeType
    label: str
    properties: Dict[str, Any] = Field(default_factory=dict)
    risk_score: Optional[float] = 0.0
    risk_factors: Optional[List[str]] = Field(default_factory=list)
    tags: Optional[List[str]] = Field(default_factory=list)

class NodeUpdate(BaseModel):
    label: Optional[str] = None
    properties: Optional[Dict[str, Any]] = None
    risk_score: Optional[float] = None
    risk_factors: Optional[List[str]] = None
    tags: Optional[List[str]] = None
