import hashlib
import json
from datetime import datetime
from typing import Any, Dict

def compute_sha256(content: str) -> str:
    """Compute standard SHA-256 hexadecimal digest."""
    return hashlib.sha256(content.encode("utf-8")).hexdigest()

def generate_evidence_hash(evidence_id: str, title: str, source_type: str, content: str, timestamp: str) -> str:
    """Generate deterministic tamper-check hash for evidence."""
    payload = f"{evidence_id}|{title}|{source_type}|{content}|{timestamp}"
    return compute_sha256(payload)

def generate_edge_provenance_hash(source_id: str, target_id: str, relation_type: str, evidence_id: str) -> str:
    """Generate provenance verification hash for relationship edges."""
    payload = f"{source_id}->{relation_type}->{target_id}#{evidence_id or 'NO_EVIDENCE'}"
    return compute_sha256(payload)
