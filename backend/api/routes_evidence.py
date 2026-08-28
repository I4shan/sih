from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.models.evidence_models import EvidenceRecord, EvidenceVerificationResult
from backend.data.seed_data import evidence_store
from backend.security.provenance import generate_evidence_hash
from backend.security.audit_ledger import audit_ledger

router = APIRouter(prefix="/evidence", tags=["Evidence & Provenance"])

@router.get("", response_model=List[EvidenceRecord])
def list_evidence():
    return list(evidence_store.values())

@router.get("/ledger")
def get_audit_ledger():
    """Retrieve the tamper-evident cryptographic blockchain/audit ledger."""
    return {
        "integrity": audit_ledger.verify_chain_integrity(),
        "recent_blocks": audit_ledger.get_latest_blocks(50)
    }

@router.get("/{evidence_id}", response_model=EvidenceRecord)
def get_evidence(evidence_id: str):
    ev = evidence_store.get(evidence_id)
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence artifact not found")
    return ev

@router.post("/verify/{evidence_id}", response_model=EvidenceVerificationResult)
def verify_evidence_hash(evidence_id: str):
    """
    Verify cryptographic tamper-status of an evidence artifact
    by recomputing its SHA-256 digest from source content.
    """
    ev = evidence_store.get(evidence_id)
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found")
        
    recomputed = generate_evidence_hash(
        ev.id, ev.title, ev.source_type, ev.content_snippet, ev.timestamp.isoformat()
    )
    
    is_valid = (recomputed == ev.sha256_hash)
    
    # Audit log verification action
    audit_ledger.record_event(
        action="VERIFY_EVIDENCE_HASH",
        details={"evidence_id": evidence_id, "is_valid": is_valid, "computed_hash": recomputed},
        actor="Investigator Verification Client"
    )
    
    return EvidenceVerificationResult(
        evidence_id=evidence_id,
        computed_hash=recomputed,
        stored_hash=ev.sha256_hash,
        is_valid=is_valid,
        tampered=not is_valid
    )
